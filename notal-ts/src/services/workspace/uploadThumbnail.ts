import { getAuth } from "firebase/auth";
import {
  getStorage,
  ref as stRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

import { Log } from "@utils";

export async function uploadThumbnail({
  image,
}: {
  image: File;
}): Promise<{ success: boolean; error?: string; url?: string }> {
  // temporarily uploads image for later use.
  const auth = getAuth();
  if (!auth?.currentUser)
    return { success: false, error: "User not logged in", url: "" };

  Log.debug("AUTH USER GET AUTH:", auth.currentUser);

  const token = await auth?.currentUser.getIdToken();
  if (!token) return { success: false, error: "no-token" };
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
}
