function clickDownloadLink(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function downloadFile(dataString: string, fileName: string, mimeType: string): Promise<void> {
  console.debug("downloading:", fileName);
  try {
    const blob = new Blob([dataString], { type: mimeType });
    clickDownloadLink(blob, fileName);
  } catch (error) {
    console.error(`failed to download ${fileName}:`, error);
    throw error;
  }
}
