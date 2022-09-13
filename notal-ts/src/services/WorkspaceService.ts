import { getAuth } from "firebase/auth";
import {
  getStorage,
  ref as stRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

import { workspaceFetch } from "@utils";
import { WorkspaceTypes } from "@types";
import { Log } from "@utils";

interface WorkspaceServiceTypes {
  workspace: {
    add: () => Promise<void>;
    star: () => Promise<void>;
    delete: () => Promise<void>;
  }
}

export const WorkspaceService = {
  workspace: {
    add: async function ({
      title,
      desc,
      starred,
      workspaceVisible,
      thumbnail,
    }: WorkspaceTypes) {
      const auth = getAuth();
      const token = await auth.currentUser?.getIdToken();

      const data = await workspaceFetch(
        {
          title,
          desc,
          starred,
          workspaceVisible,
          thumbnail: {
            ...thumbnail,
            type: thumbnail.type,
            fileData: null,
          },
          owner: auth?.currentUser?.uid,
          uid: auth?.currentUser?.uid,
        },
        {
          token,
          action: "create",
        }
      );

      if (data?.success) {
        return { success: true };
      }
      return { success: false, error: data?.error };
    },
    star: async function (id: string) {
      // Send a star workspace request to API.
      const auth = getAuth();
      const token = await auth.currentUser?.getIdToken();

      const data = await workspaceFetch(
        {
          id,
          uid: auth?.currentUser?.uid,
        },
        {
          token,
          action: "star",
        }
      );

      if (data?.success) {
        return { success: true };
      }
      return { success: false, error: data?.error };
    },
    delete: async function (id: string) {
      // Send a delete workspace request to API.
      const auth = getAuth();
      const token = await auth.currentUser?.getIdToken();

      const data = await workspaceFetch(
        {
          id,
          uid: auth?.currentUser?.uid,
        },
        {
          token,
          action: "delete",
        }
      );

      if (data?.success) {
        return { success: true };
      }
      return { success: false, error: data?.error };
    },
    uploadThumbnail: async function ({ image }: { image: File }) {
      // temporarily uploads image for later use.
      const auth = getAuth();
      if (!auth?.currentUser)
        return { success: false, error: "User not logged in", url: "" };

      Log.debug("AUTH USER GET AUTH:", auth.currentUser);

      const token = await auth?.currentUser.getIdToken();
      if (!token) return;
      const storage = getStorage();
      const storageRef = stRef(
        storage,
        `cardImages/temp/user_${auth.currentUser.uid}`
      );

      return await uploadBytes(storageRef, image)
        .then((snapshot) => {
          Log.debug(snapshot);

          return getDownloadURL(snapshot.ref).then(async (downloadURL) => {
            return { success: true, url: downloadURL };
          });
        })
        .catch((error) => {
          return { success: false, error, url: "" };
        });
    },
  },
};
