import { connectToDatabase } from "@lib/mongodb";
import { getTokenFromHeader } from "@utils/api/getTokenFromHeader";
import { NextApiRequest, NextApiResponse } from "next";
import { ObjectId } from "mongodb";
import { customAlphabet } from "nanoid";

const admin = require("firebase-admin");

import { LIMITS } from "@constants/limits";
import { CONSTANTS } from "@constants";
import { WorkspaceTypes } from "@types";
const { ValidateUser } = require("@utils/api/validateUser");
const { accept, reject } = require("@api/utils");
const { Log } = require("@utils");

export async function create(req: NextApiRequest, res: NextApiResponse) {
  const { db } = await connectToDatabase();
  const workspacesCollection = await db.collection("workspaces");

  const { body } = req;
  if (!body.uid) return reject({ reason: "no-uid", res });
  // we have uid of user request in body.uid now
  if (!body.title) return reject({ reason: "no-title", res });
  if (!body.thumbnail) return reject({ reason: "no-thumbnail", res });
  if (!body.owner) return reject({ reason: "no-owner", res });

  const { title, desc, starred, workspaceVisible, thumbnail, owner, uid } =
    body;

  if (title?.length > 32) return reject("title-maxlength");
  if (desc?.length > 96) return reject("desc-maxlength");
  if (title?.length < 3) return reject("title-minlength");
  if (
    thumbnail?.type == "singleColor" &&
    thumbnail?.color.length > LIMITS.MAX.WORKSPACE_SINGLECOLOR_COLOR_LENGTH
  )
    return reject("invalid-color");
  else if (
    thumbnail?.type == "gradient" &&
    (thumbnail?.colors?.start?.length >
      LIMITS.MAX.WORKSPACE_GRADIENT_COLOR_LENGTH ||
      thumbnail?.colors?.end?.length >
        LIMITS.MAX.WORKSPACE_GRADIENT_COLOR_LENGTH)
  )
    return reject("invalid-color");

  const bearer = getTokenFromHeader(req);
  const validateUser = await ValidateUser({ token: bearer });

  if (validateUser && !validateUser.decodedToken.success)
    return reject({ reason: validateUser.decodedToken.errorCode, res });

  const workspacesCount = await workspacesCollection
    .find({ owner: uid, _deleted: { $in: [null, false] } })
    .count();

  if (workspacesCount >= 20) return reject({ reason: "max-workspaces", res });

  let givenId: string | boolean = false;
  let length: number = CONSTANTS.DEFAULT_WORKSPACE_ID_LENGTH; // default id length

  /**
   * Dynamic ID generator
   */
  while (givenId == false) {
    // create workspace UID
    const nanoid = customAlphabet(
      "1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
      length
    );
    const id = await nanoid();

    const checkIdExist = await workspacesCollection.findOne({ id: id });
    if (checkIdExist) {
      length++;
      return;
    }
    givenId = id;
  }

  Log.debug("generated ID for workspace: ", givenId, " owner: ", uid);

  const thumbnailTypes: {
    [key: string]: WorkspaceTypes["thumbnail"];
  } = {
    image: {
      type: "image",
      file: thumbnail.file,
    },
    gradient: {
      type: "gradient",
      colors: {
        start: thumbnail.colors.start,
        end: thumbnail.colors.end,
      },
    },
    singleColor: {
      type: "singleColor",
      color: thumbnail.color,
    },
  };

  return await workspacesCollection
    .insertOne({
      title,
      desc,
      starred,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      owner: uid,
      workspaceVisible,
      thumbnail: thumbnailTypes[thumbnail.type],
      users: [uid], // Add owner as default user
      id: givenId,
    })
    .then(async (result) => {
      const resId = result.insertedId;
      Log.debug("updating id: ", resId);
      Log.debug("thumbnail: ", thumbnail);

      if (thumbnail?.type != "image")
        return accept({ res, action: "createWorkspace" });

      // move from temp to real location
      const storageRef = admin
        .storage()
        .bucket(process.env.FIREBASE_STORAGE_BUCKET);
      const file = storageRef.file(`thumbnails/temp/workspace_${uid}`);
      const fileExist = await file.exists();
      if (fileExist[0]) {
        await file.move(`thumbnails/workspace_${resId}`);
        const newFile = storageRef.file(`thumbnails/workspace_${resId}`);
        //const meta = await newFile.getMetadata();
        const url = await newFile.getSignedUrl({
          action: "read",
          expires: "03-09-2491",
        });
        return await workspacesCollection
          .updateOne(
            { _id: new ObjectId(resId) },
            { $set: { thumbnail: { type: "image", file: url[0] } } }
          )
          .then(() => accept({ res, action: "createWorkspace" }))
          .catch((error) => reject({ res, reason: error }));
      } else {
        // file doesnt exist
        return accept({ res, action: "createWorkspace" });
      }
    });
}
