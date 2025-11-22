import {
  ref,
  uploadBytes,
  getDownloadURL,
  getMetadata,
} from 'firebase/storage';
import { storage } from './firebase';

export interface UploadResult {
  url: string;
  path: string;
  name: string;
  size: number;
  contentType: string;
}

export const storageService = {
  // Upload profile image
  async uploadProfileImage(userId: string, file: File): Promise<UploadResult> {
    try {
      const fileName = `profile-${Date.now()}.${file.name.split('.').pop()}`;
      const storageRef = ref(storage, `profile-images/${userId}/${fileName}`);

      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      const metadata = await getMetadata(snapshot.ref);

      return {
        url: downloadURL,
        path: snapshot.ref.fullPath,
        name: fileName,
        size: metadata.size,
        contentType: metadata.contentType || file.type,
      };
    } catch (error) {
      throw error;
    }
  },
};
