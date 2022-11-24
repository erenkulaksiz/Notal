import { NextApiRequest, NextApiResponse } from "next";
import { ObjectId } from "mongodb";

import { connectToDatabase } from "@lib/mongodb";
import { accept, reject } from "@api/utils";
import { SendTelegramMessage, server, formatDate } from "@utils";
import { ValidateUser } from "@utils/api/validateUser";

export async function complete(req: NextApiRequest, res: NextApiResponse) {
  const { db } = await connectToDatabase();
  const usersCollection = await db.collection("users");

  const { body } = req;
  // get id of workspace
  if (!body.uid) return reject({ res });
  const { uid } = body;
  if (!body.token) return reject({ res });
  const { token } = body;

  const user = await usersCollection.findOne({
    uid,
  });

  if (!user) return reject({ res });
  if (user?.onboarding?.completed) return reject({ res });
  const validateUser = await ValidateUser({ token });

  const update = await usersCollection.updateOne(
    { _id: new ObjectId(user._id) },
    {
      $set: {
        onboarding: {
          completed: true,
          date: Date.now(),
        },
      },
    }
  );
  if (!update) return reject({ res });

  SendTelegramMessage({
    message: `ONBOARDING COMPLETE
USERNAME: @${user?.username}
EMAIL: ${validateUser.decodedToken.email}
UID: ${validateUser.decodedToken.user_id}
TIME: ${formatDate(Date.now())}
TS: ${Date.now()}
URL: ${server}
ENV: ${process.env.NODE_ENV}
VER: ${process.env.NEXT_PUBLIC_APP_VERSION}
PROVIDER: ${validateUser.decodedToken.firebase.sign_in_provider}
PLATFORM: web`,
  });

  return accept({ res, action: "onboarding_completed" });
}
