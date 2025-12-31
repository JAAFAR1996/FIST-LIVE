/**
 * PDF Generator utility for breeding calculator
 * Handles PDF generation with better error handling
 */

// Helper for development-only logging
const debugLog = (...args: unknown[]) => {
  if (import.meta.env.DEV) {
    console.log('[PDF Generator]', ...args);
  }
};

export async function generateBreedingPDF(elementId: string, fileName: string): Promise<void> {
  debugLog("Starting PDF generation...");
  debugLog("Element ID:", elementId);
  debugLog("File name:", fileName);

  try {
    // Import libraries dynamically
    debugLog("Importing jsPDF and html2canvas...");
    const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
      import('jspdf'),
      import('html2canvas')
    ]);
    debugLog("Libraries imported successfully");

    // Find element
    const element = document.getElementById(elementId);
    if (!element) {
      console.error("[PDF Generator] Element not found with ID:", elementId);
      throw new Error(`لم يتم العثور على العنصر: ${elementId}`);
    }

    debugLog("Element found. Dimensions:", {
      width: element.offsetWidth,
      height: element.offsetHeight,
      scrollWidth: element.scrollWidth,
      scrollHeight: element.scrollHeight
    });

    // Check if element is visible
    const rect = element.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) {
      console.warn("[PDF Generator] Element has zero dimensions!");
      throw new Error("العنصر غير مرئي أو فارغ");
    }

    // Capture element as canvas
    debugLog("Capturing element as canvas...");
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: import.meta.env.DEV, // Only log in dev mode
      backgroundColor: '#ffffff',
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
      onclone: (clonedDoc) => {
        debugLog("onclone called");
        const clonedElement = clonedDoc.getElementById(elementId);
        if (clonedElement) {
          clonedElement.style.backgroundColor = '#ffffff';
          clonedElement.style.padding = '20px';
          debugLog("Cloned element styled");
        }
      }
    });

    debugLog("Canvas created successfully");
    debugLog("Canvas dimensions:", {
      width: canvas.width,
      height: canvas.height
    });

    if (canvas.width === 0 || canvas.height === 0) {
      throw new Error("فشل في التقاط المحتوى - Canvas فارغ");
    }

    // Convert canvas to image
    debugLog("Converting canvas to image...");
    const imgData = canvas.toDataURL('image/png', 1.0);
    debugLog("Image data length:", imgData.length);

    if (!imgData || imgData.length < 100) {
      throw new Error("فشل في تحويل الصورة");
    }

    // Create PDF
    debugLog("Creating PDF document...");
    const pdf = new jsPDF({
      orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    debugLog("PDF page size:", {
      width: pdfWidth,
      height: pdfHeight
    });

    // Calculate dimensions to fit page (with margins)
    const margin = 10;
    const availableWidth = pdfWidth - (margin * 2);
    const availableHeight = pdfHeight - (margin * 2);
    const ratio = Math.min(
      availableWidth / (canvas.width / 2),  // Divide by 2 because of scale: 2
      availableHeight / (canvas.height / 2)
    );

    const imgWidth = (canvas.width / 2) * ratio;
    const imgHeight = (canvas.height / 2) * ratio;
    const imgX = (pdfWidth - imgWidth) / 2;
    const imgY = (pdfHeight - imgHeight) / 2;

    debugLog("Image placement:", {
      x: imgX,
      y: imgY,
      width: imgWidth,
      height: imgHeight,
      ratio: ratio
    });

    // Add image to PDF
    pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth, imgHeight, undefined, 'FAST');

    // Save PDF
    debugLog("Saving PDF as:", fileName);
    pdf.save(fileName);

    debugLog("PDF saved successfully!");

  } catch (error) {
    console.error("[PDF Generator] Error:", error);
    if (import.meta.env.DEV && error instanceof Error) {
      console.error("[PDF Generator] Error details:", {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
    }
    throw error;
  }
}

