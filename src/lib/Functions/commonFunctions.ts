import imageCompression from 'browser-image-compression';

export const compressImage = async (file:File) =>{
   
    try {
        const options = {
            maxSizeMB: 45 / 1024, 
            maxWidthOrHeight: 500,
            useWebWorker: true,
        };
        console.log('compression is working')
        const compressedFile = await imageCompression(file, options);
        return compressedFile;
    } catch (error) {
        console.error("Image compression error:", error);
    }
}