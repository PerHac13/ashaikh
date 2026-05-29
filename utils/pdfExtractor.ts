const pdf = require("pdf-parse");

export async function extractPdfText(url: string): Promise<string> {
  try {
    console.log(`Fetching PDF for text extraction from: ${url}`);

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to download PDF: ${response.status} ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    console.log("Parsing PDF buffer using pdf-parse...");
    const parsedData = await pdf(buffer);

    // Clean up carriage returns and repetitive spaces/newlines
    const cleanText = (parsedData.text || "")
      .replace(/\r\n/g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim();

    console.log(`Successfully extracted ${cleanText.length} characters of text from PDF.`);
    return cleanText;
  } catch (error) {
    console.error("Failed to extract PDF text:", error);
    throw error;
  }
}
