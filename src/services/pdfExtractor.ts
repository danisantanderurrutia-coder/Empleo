export interface ExtractedDocument {
  fileName: string;
  text: string;
  pageCount: number;
}

export const cleanExtractedText = (text: string): string => {
  if (!text) return '';
  return text
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F]/g, '') // remove binary control characters
    .replace(/\r\n/g, '\n')
    .replace(/[\u201C\u201D\u2033\u2036]/g, '"') // normalize smart quotes
    .replace(/[\u2018\u2019\u201A\u201B]/g, "'")
    .replace(/[\u2013\u2014\u2015]/g, '-') // normalize en/em dashes
    .replace(/[\u2022\u25CF\u25C6\u25BA]/g, '•') // normalize bullet points
    .replace(/[ \t]+/g, ' ') // collapse multiple spaces
    .replace(/\n\s*\n\s*\n/g, '\n\n') // collapse multiple blank lines
    .trim();
};

export const extractTextFromDocumentFile = async (file: File): Promise<ExtractedDocument> => {
  const fileName = file.name;

  if (file.type === 'application/pdf' || fileName.toLowerCase().endsWith('.pdf')) {
    try {
      const pdfjsLib = await import('pdfjs-dist');
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      const pageCount = pdf.numPages;
      let fullText = '';

      for (let i = 1; i <= pageCount; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        
        // Extract text items with proper line breaks
        let lastY = -1;
        let pageLines: string[] = [];
        let currentLine = '';

        textContent.items.forEach((item: any) => {
          const str = item.str || '';
          if (!str.trim()) return;

          // Check if item is on a new visual line
          const y = item.transform ? Math.round(item.transform[5]) : -1;
          if (lastY !== -1 && Math.abs(y - lastY) > 5) {
            pageLines.push(currentLine.trim());
            currentLine = '';
          }
          currentLine += str + ' ';
          lastY = y;
        });

        if (currentLine.trim()) {
          pageLines.push(currentLine.trim());
        }

        fullText += pageLines.join('\n') + '\n\n';
      }

      const sanitizedText = cleanExtractedText(fullText);
      return {
        fileName,
        text: sanitizedText,
        pageCount
      };
    } catch (err) {
      console.warn('PDF.js primary extraction fallback:', err);
      const rawText = await readAsTextFallback(file);
      return { fileName, text: cleanExtractedText(rawText), pageCount: 1 };
    }
  } else {
    const rawText = await readAsTextFallback(file);
    return {
      fileName,
      text: cleanExtractedText(rawText),
      pageCount: 1
    };
  }
};

const readAsTextFallback = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string) || '');
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
};
