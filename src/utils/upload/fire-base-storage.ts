import imageCompression from "browser-image-compression";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../../firebase";


export const uploadImageOnFirebase = async (base64Image:string, bookName:string) => {
  try {
    // const storageRef = ref(storage, `user_images/${userId}/${userName}/screenshots/${fileName}`);
    const fileName = createUniqueName()

    const storageRef = ref(storage, `flipbook/${bookName}/images/${fileName}`);

    // Extract Base64 data (remove the "data:image/png;base64," prefix)
    const base64Data = base64Image.split(",")[1];
   
    //-------------    Convert Base64 to binary data
    const blob = base64ToBlob(base64Data, "image/png");

     // Convert Blob to File
    const file = new File([blob], fileName, { type: "image/png" });


    //-------------   Compressed image before uploading
    const compressedFile = await compressImage(file);

    //--------------- Upload the Blob to Firebase Storage
    const snapshot = await uploadBytes(storageRef, compressedFile);

    //----------------Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);

    console.log("Image uploaded successfully:", downloadURL);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading Base64 image:", error);
    throw error;
  }
};



// Function to compress image using browser-image-compression package
const compressImage = async (file:File) => {
    try {
      const options = {
        maxSizeMB: 1, 
        useWebWorker: true, 
      };
  
      // Compress the image blob
      const compressedFile = await imageCompression(file, options);
  
      // Convert compressed File back to Blob
      return compressedFile; // browser-image-compression returns a Blob-compatible File
    } catch (error) {
      console.error("Error compressing image:", error);
      throw error;
    }
  };
  


const base64ToBlob = (base64:string, contentType = "") => {
  const byteCharacters = atob(base64);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);
    const byteNumbers = new Array(slice.length).fill('').map((_, i) => slice.charCodeAt(i));
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
