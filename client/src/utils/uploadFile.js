import { toast } from "sonner";

export const uploadToCloudinary = async (file, setIsLoading) => {
  if (setIsLoading) setIsLoading(true);
  const toastId = toast.loading("Uploading image...");

  try {
    // Create a FormData object to send the file
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "softec");

    // Make the API call to Cloudinary
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/driuxeclu/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Failed to upload image");
    }

    const data = await response.json();
    toast.dismiss(toastId);
    return data.secure_url;
  } catch (err) {
    console.error("Error uploading image:", err);
    toast.error("Failed to upload image. Please try again.", { id: toastId });
    throw err;
  } finally {
    if (setIsLoading) setIsLoading(false);
  }
};
