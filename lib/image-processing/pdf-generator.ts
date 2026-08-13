import { PDFDocument, rgb } from 'pdf-lib';

export const runtime = 'nodejs';

export async function generatePrintPdf(imageBuffer: Buffer, format: 'A' | 'B'): Promise<Buffer> {
  // A6 Dimensions in points (1 mm = 2.83465 pts)
  // A6 = 105mm x 148mm = 297.64 x 419.53 pts
  const pageWidth = 297.64;
  const pageHeight = 419.53;

  const pdfDoc = await PDFDocument.create();
  pdfDoc.setTitle('HH Goa 2026 Graphic');
  pdfDoc.setAuthor('HH Goa FrameLab');

  const page = pdfDoc.addPage([pageWidth, pageHeight]);

  // Embed the image buffer (which is always PNG from Sharp)
  const image = await pdfDoc.embedPng(imageBuffer);

  // Draw dark background just in case
  page.drawRectangle({
    x: 0,
    y: 0,
    width: pageWidth,
    height: pageHeight,
    color: rgb(13 / 255, 5 / 255, 21 / 255), // #0D0515
  });

  if (format === 'A') {
    // Square image (Format A)
    const margin = 28;
    const size = pageWidth - (margin * 2);
    const yOffset = (pageHeight - size) / 2;
    
    // In pdf-lib, coordinate origin is bottom-left
    page.drawImage(image, {
      x: margin,
      y: yOffset,
      width: size,
      height: size
    });
  } else {
    // Format B (4:5)
    const margin = 28;
    const maxWidth = pageWidth - (margin * 2);
    const maxHeight = pageHeight - (margin * 2);

    let drawWidth = maxWidth;
    let drawHeight = maxWidth / 0.8;

    if (drawHeight > maxHeight) {
      drawHeight = maxHeight;
      drawWidth = drawHeight * 0.8;
    }

    const xOffset = (pageWidth - drawWidth) / 2;
    const yOffset = (pageHeight - drawHeight) / 2;

    page.drawImage(image, {
      x: xOffset,
      y: yOffset,
      width: drawWidth,
      height: drawHeight
    });
  }

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}
