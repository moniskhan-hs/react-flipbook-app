import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../../firebase";

export const uploadAudioOnFirebase = async (base64Audio: string, bookName: string) => {
  try {
    const fileName = createUniqueName(); // Generate unique file name

    // Define storage path for audio files
    const storageRef = ref(storage, `flipbook/${bookName}/audio/${fileName}`);

    // Extract Base64 data (remove the "data:audio/mp3;base64," prefix)
    const base64Data = base64Audio.split(",")[1];

    // Convert Base64 to binary data (Blob)
    const blob = base64ToBlob(base64Data, "audio/mpeg"); // Specify MIME type for audio

    // Convert Blob to File
    const file = new File([blob], fileName, { type: "audio/mpeg" });

    // Upload the file to Firebase Storage
    const snapshot = await uploadBytes(storageRef, file);

    // Get the downloadable URL
    const downloadURL = await getDownloadURL(snapshot.ref);

    console.log("Audio uploaded successfully:", downloadURL);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading Base64 audio:", error);
    throw error;
  }
};

// Reuse base64ToBlob and createUniqueName from your existing code
const base64ToBlob = (base64: string, contentType = "") => {
  const byteCharacters = atob(base64);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);
    const byteNumbers = new Array(slice.length)
      .fill("")
      .map((_, i) => slice.charCodeAt(i));
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  return new Blob(byteArrays, { type: contentType });
};

export const createUniqueName = () => {
  const timestamp = Date.now(); // Current time in milliseconds
  const randomString = Math.random().toString(36).substr(2, 9); // Random alphanumeric string
  return `file_${timestamp}_${randomString}`;
};
