/**
 * PDF Generator utility for breeding calculator
 * Handles PDF generation with better error handling
 */

export async function generateBreedingPDF(elementId: string, fileName: string): Promise<void> {
  console.log("[PDF Generator] Starting PDF generation...");
  console.log("[PDF Generator] Element ID:", elementId);
  console.log("[PDF Generator] File name:", fileName);

  try {
    // Import libraries dynamically
    console.log("[PDF Generator] Importing jsPDF and html2canvas...");
    const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
      import('jspdf'),
      import('html2canvas')
    ]);
    console.log("[PDF Generator] Libraries imported successfully");

    // Find element
    const element = document.getElementById(elementId);
    if (!element) {
      console.error("[PDF Generator] Element not found with ID:", elementId);
      throw new Error(`لم يتم العثور على العنصر: ${elementId}`);
    }

    console.log("[PDF Generator] Element found. Dimensions:", {
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
    console.log("[PDF Generator] Capturing element as canvas...");
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: true,
      backgroundColor: '#ffffff',
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
      onclone: (clonedDoc) => {
        console.log("[PDF Generator] onclone called");
        const clonedElement = clonedDoc.getElementById(elementId);
        if (clonedElement) {
          clonedElement.style.backgroundColor = '#ffffff';
          clonedElement.style.padding = '20px';
          console.log("[PDF Generator] Cloned element styled");
        }
      }
    });

    console.log("[PDF Generator] Canvas created successfully");
    console.log("[PDF Generator] Canvas dimensions:", {
      width: canvas.width,
      height: canvas.height
    });

    if (canvas.width === 0 || canvas.height === 0) {
      throw new Error("فشل في التقاط المحتوى - Canvas فارغ");
    }

    // Convert canvas to image
    console.log("[PDF Generator] Converting canvas to image...");
    const imgData = canvas.toDataURL('image/png', 1.0);
    console.log("[PDF Generator] Image data length:", imgData.length);

    if (!imgData || imgData.length < 100) {
      throw new Error("فشل في تحويل الصورة");
    }

    // Create PDF
    console.log("[PDF Generator] Creating PDF document...");
    const pdf = new jsPDF({
      orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    console.log("[PDF Generator] PDF page size:", {
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

    console.log("[PDF Generator] Image placement:", {
      x: imgX,
      y: imgY,
      width: imgWidth,
      height: imgHeight,
      ratio: ratio
    });

    // Add image to PDF
    pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth, imgHeight, undefined, 'FAST');

    // Save PDF
    console.log("[PDF Generator] Saving PDF as:", fileName);
    pdf.save(fileName);

    console.log("[PDF Generator] PDF saved successfully!");

  } catch (error) {
    console.error("[PDF Generator] Error:", error);
    if (error instanceof Error) {
      console.error("[PDF Generator] Error details:", {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
    }
    throw error;
  }
}
