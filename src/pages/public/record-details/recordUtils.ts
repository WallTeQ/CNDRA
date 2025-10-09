export const formatFileSize = (sizeInBytes: string) => {
  const bytes = parseInt(sizeInBytes);
  const sizes = ["Bytes", "KB", "MB", "GB"];
  if (bytes === 0) return "0 Bytes";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
};

export const getAccessLevelInfo = (level: string) => {
  switch (level?.toLowerCase()) {
    case "public":
      return {
        color: "success",
        description: "Freely accessible to all users",
      };
    case "internal":
      return {
        color: "warning",
        description: "Restricted to registered users",
      };
    case "confidential":
      return {
        color: "danger",
        description: "Limited access - special permission required",
      };
    default:
      return { color: "default", description: "Access level not specified" };
  }
};

export const copyToClipboard = (text: string) => {
  navigator?.clipboard?.writeText(text);
  // You could add a toast notification here
};

export const handleDownloadFile = async (fileAsset: any) => {
  try {
    // Fetch the file as a blob
    const response = await fetch(fileAsset.storagePath);
    const blob = await response.blob();

    // Create a blob URL
    const blobUrl = window.URL.createObjectURL(blob);

    // Create a temporary anchor element to trigger download
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = fileAsset.filename || "download";
    document.body.appendChild(link);
    link.click();

    // Clean up
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error("Download failed:", error);
    // Fallback to opening in new tab if download fails
    window.open(fileAsset.storagePath, "_blank");
  }
};
