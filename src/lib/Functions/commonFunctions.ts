import imageCompression from "browser-image-compression";
import API from '$lib/services/api';
import * as XLSX from 'xlsx';


export const compressImage = async (
  file: File,
  useQualityCompression: boolean
) => {
  try {
    let options;
    console.log("file", file);

    if (useQualityCompression) {
      // Check if the file is already in WebP format
      if (file.type !== "image/webp") {
        file = await convertToWebP(file); // Convert to WebP only if not already in WebP format
      }

      // Get the original size of the image in MB
      const originalSizeMB = file.size / (1024 * 1024);

      // Dynamically adjust options based on the size of the image
      if (originalSizeMB > 40) {
        options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1000,
          useWebWorker: true,
        };
      } else if (originalSizeMB > 20) {
        options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1500,
          useWebWorker: true,
        };
      } else if (originalSizeMB > 10) {
        options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1500,
          useWebWorker: true,
        };
      } else {
        options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1500,
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
    const compressedFile = new File([compressedBlob], file.name, {
      type: file.type,
    });
    return compressedFile;
  } catch (error) {
    console.error("Image compression error:", error);
  }
};

const convertToWebP = async (file: File): Promise<File> => {
  console.log("heic image got to this function");
  return new Promise(async (resolve, reject) => {
    try {
      if (
        file.type === "image/heic" ||
        file.type === "image/heif" ||
        file.type === ""
      ) {
        console.log("heic image");
        // Convert HEIC to WebP directly using heic2any
        if (typeof window !== "undefined") {
          import("heic2any")
            .then(async (module) => {
              // Use heic2any here
              const heic2any = module.default;
              const webPBlob = await heic2any({
                blob: file,
                toType: "image/webp",
              });
              const webPFile = new File(
                [webPBlob as Blob],
                file.name.replace(/\.\w+$/, ".webp"),
                {
                  type: "image/webp",
                }
              );
              console.log({ webPFile });
              resolve(webPFile);
            })
            .catch((err) => console.error(err));
        }
      } else {
        // Convert other formats (e.g., JPEG, PNG) to WebP using canvas
        console.log("else function executed");
        const reader = new FileReader();
        reader.onload = (event) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;

            const context = canvas.getContext("2d");
            if (context) {
              context.drawImage(img, 0, 0);
              canvas.toBlob(
                (blob) => {
                  if (blob) {
                    const webPFile = new File(
                      [blob],
                      file.name.replace(/\.\w+$/, ".webp"),
                      { type: "image/webp" }
                    );
                    resolve(webPFile);
                  } else {
                    reject(new Error("WebP conversion failed."));
                  }
                },
                "image/webp",
                1.0 // Quality setting
              );
            } else {
              reject(new Error("Canvas context is not available."));
            }
          };
          img.src = event.target?.result as string;
        };
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
      }
    } catch (error) {
      reject(new Error(`Failed to process the file: ${error.message}`));
    }
  });
};

export const exportExcel = async (url: string) => {
  try {
    // Request binary data from the API
    const response = await API.get(url, {
      responseType: "arraybuffer",
    });

    const binaryData = response.data; // Binary response

    // Read the binary data directly as an Excel file using SheetJS
    const workbook = XLSX.read(binaryData, { type: "array" });

    // Process the workbook (e.g., get the first sheet)
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    console.log(jsonData); // Logs the Excel data as JSON (array of arrays)

    // If you want to trigger a download of the file:
    const blob = new Blob([binaryData], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const elexUrl = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = elexUrl;
    // a.download = 'exported_hero_section.xlsx'; // Set any name for the download
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(elexUrl);
  } catch (error) {
    console.error("Error handling the file:", error);
  }
}
