import imageCompression from 'browser-image-compression';

export const compressImage = async (file: File, useQualityCompression: boolean) => {
    try {
        let options;
        console.log('file', file)

        if (useQualityCompression) {

            // Check if the file is already in WebP format
            if (file.type !== 'image/webp') {
                file = await convertToWebP(file); // Convert to WebP only if not already in WebP format
            }

            // Get the original size of the image in MB
            const originalSizeMB = file.size / (1024 * 1024);

            // Dynamically adjust options based on the size of the image
            if (originalSizeMB > 40) {
                options = {
                    maxSizeMB: .3,
                    maxWidthOrHeight: 1500,
                    useWebWorker: true,
                };
            } else if (originalSizeMB > 20) {
                options = {
                    maxSizeMB: 0.3,
                    maxWidthOrHeight: 1200,
                    useWebWorker: true,
                };
            } else if (originalSizeMB > 10) {
                options = {
                    maxSizeMB: 0.3,
                    maxWidthOrHeight: 800,
                    useWebWorker: true,
                };
            } else {
                options = {
                    maxSizeMB: 0.3,
                    maxWidthOrHeight: 500,
                    useWebWorker: true,
                };
            }
        } else {
            // Normal compression options
            options = {
                maxSizeMB: 45 / 1024,
                maxWidthOrHeight: 500,
                useWebWorker: true,
            };
        }

        // Compress the image using the selected options
        const compressedBlob = await imageCompression(file, options);
        const compressedFile = new File([compressedBlob], file.name, { type: file.type });
        return compressedFile;
    } catch (error) {
        console.error('Image compression error:', error);
    }
};

const convertToWebP = async (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;

                const context = canvas.getContext('2d');
                if (context) {
                    context.drawImage(img, 0, 0);
                    canvas.toBlob(
                        (blob) => {
                            if (blob) {
                                const webPFile = new File([blob], 'converted.webp', { type: 'image/webp' });
                                resolve(webPFile);
                            } else {
                                reject(new Error('WebP conversion failed.'));
                            }
                        },
                        'image/webp',
                        1.0 // Quality setting (1.0 = highest quality)
                    );
                } else {
                    reject(new Error('Canvas context is not available.'));
                }
            };
            img.src = event.target?.result as string;
        };
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
    });
};

