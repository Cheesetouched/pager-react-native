import { useCallback } from "react";

import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

import useFirebase from "@hooks/useFirebase";
import { getBlobFromUri } from "@utils/helpers";

export default function useStorage() {
  const { user, storage } = useFirebase();

  const deleteDp = useCallback(async () => {
    const imageRef = ref(storage, `${user?.uid}/dp.jpg`);
    return await deleteObject(imageRef);
  }, [storage, user?.uid]);

  const uploadDp = useCallback(
    async (uri) => {
      const blob = await getBlobFromUri(uri);
      const metadata = { contentType: "image/jpeg" };
      const imageRef = ref(storage, `${user?.uid}/dp.jpg`);

      await uploadBytesResumable(imageRef, blob, metadata);
      blob.close();

      return await getDownloadURL(imageRef);
    },
    [storage, user?.uid],
  );

  return { deleteDp, uploadDp };
}
