// File: components/exportPdf.js
import jsPDF from 'jspdf';
// No importes 'jspdf-autotable' directamente para el side-effect aquí.
// En su lugar, importaremos lo que necesitamos de él.
import autoTable from 'jspdf-autotable'; // Importa la función autoTable
import { marked } from 'marked';
import { CloudDownloadOutlined } from '@ant-design/icons';

const DEFAULT_FONT_SIZE_PT = 10;
const TABLE_FONT_SIZE_PT = 6;
const HEADER_FONT_SIZE_PT = { H1: 16, H2: 14, H3: 12, H4: 10, H5: 9, H6: 8 };
const LINE_HEIGHT_FACTOR = 1.2;
const MARGIN_PT = 30;

function addText(doc, text, x, y, maxWidth, options = {}) {
  // ... (mantener la función addText como antes)
  const {
    fontSize = DEFAULT_FONT_SIZE_PT,
    fontStyle = 'normal',
    isHtml = false
  } = options;

  doc.setFontSize(fontSize);
  doc.setFont(undefined, fontStyle);

  let processedText = text;
  if (isHtml) {
    processedText = text.replace(/<br\s*\/?>/gi, '\n');
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = processedText;
    processedText = tempDiv.textContent || tempDiv.innerText || "";
  }

  const lines = doc.splitTextToSize(processedText, maxWidth);
  const textHeight = lines.length * fontSize * LINE_HEIGHT_FACTOR;

  if (y + textHeight > doc.internal.pageSize.height - MARGIN_PT) {
    doc.addPage();
    y = MARGIN_PT;
  }
  doc.text(lines, x, y, { lineHeightFactor: LINE_HEIGHT_FACTOR });
  return y + textHeight;
}

export const exportToPdf = async (markdownContent, programData, notification) => {
  if (!markdownContent) {
    notification.warn({
      message: 'Contenido Vacío',
      description: 'No hay plan para exportar a PDF.',
    });
    return;
  }

  try {
    const htmlString = marked(markdownContent);
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(htmlString, 'text/html');
    const bodyElements = Array.from(htmlDoc.body.children);

    const doc = new jsPDF({
      orientation: 'p',
      unit: 'pt',
      format: 'a4',
    });

    // No es necesario llamar a applyPlugin(jsPDF) si importas autoTable como función
    // Ahora llamarás a autoTable(doc, { ... }) en lugar de doc.autoTable({ ... })

    let currentY = MARGIN_PT;
    const contentWidth = doc.internal.pageSize.width - 2 * MARGIN_PT;

    for (const element of bodyElements) {
      if (currentY > doc.internal.pageSize.height - MARGIN_PT - 20) {
         doc.addPage();
         currentY = MARGIN_PT;
      }

      const tagName = element.tagName.toUpperCase();

      if (HEADER_FONT_SIZE_PT[tagName]) {
        currentY = addText(doc, element.textContent, MARGIN_PT, currentY, contentWidth, {
          fontSize: HEADER_FONT_SIZE_PT[tagName],
          fontStyle: 'bold',
        });
        currentY += 5;
      } else if (tagName === 'P') {
        currentY = addText(doc, element.innerHTML, MARGIN_PT, currentY, contentWidth, { isHtml: true });
        currentY += 5;
      } else if (tagName === 'UL' || tagName === 'OL') {
        Array.from(element.children).forEach((li, idx) => {
          if (currentY > doc.internal.pageSize.height - MARGIN_PT - 10) {
            doc.addPage(); currentY = MARGIN_PT;
          }
          const prefix = tagName === 'UL' ? '• ' : `${idx + 1}. `;
          currentY = addText(doc, prefix + li.innerHTML, MARGIN_PT + 10, currentY, contentWidth - 10, { isHtml: true });
        });
        currentY += 5;
      } else if (tagName === 'BLOCKQUOTE') {
        doc.setFillColor(240, 240, 240);
        const tempY = currentY;
        const finalY = addText(doc, element.innerHTML, MARGIN_PT + 5, currentY, contentWidth - 10, { fontSize: DEFAULT_FONT_SIZE_PT -1, fontStyle: 'italic', isHtml: true });
        doc.rect(MARGIN_PT, tempY - (DEFAULT_FONT_SIZE_PT -1)/2 , 3, finalY - tempY + (DEFAULT_FONT_SIZE_PT -1)/2, 'F');
        currentY = finalY + 5;
      } else if (tagName === 'PRE' || (tagName === 'CODE' && element.parentElement.tagName !== 'PRE')) {
        doc.setFont('courier', 'normal');
        currentY = addText(doc, element.textContent, MARGIN_PT, currentY, contentWidth, { fontSize: DEFAULT_FONT_SIZE_PT - 2 });
        doc.setFont(undefined, 'normal');
        currentY += 5;
      } else if (tagName === 'TABLE') {
        const headRows = [];
        element.querySelectorAll('thead tr').forEach(trNode => {
            const row = [];
            trNode.querySelectorAll('th').forEach(thNode => row.push(thNode.textContent.trim()));
            headRows.push(row);
        });

        const bodyRows = [];
        element.querySelectorAll('tbody tr').forEach(trNode => {
            const row = [];
            trNode.querySelectorAll('td').forEach(tdNode => {
                const cellHTML = tdNode.innerHTML.replace(/<br\s*\/?>/gi, '\n');
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = cellHTML;
                row.push(tempDiv.textContent || tempDiv.innerText || "");
            });
            bodyRows.push(row);
        });
        
        if (currentY + 20 > doc.internal.pageSize.height - MARGIN_PT) {
            doc.addPage();
            currentY = MARGIN_PT;
        }

        // CAMBIO AQUÍ: Llama a autoTable como una función, pasando 'doc'
        autoTable(doc, { // <--- CAMBIO IMPORTANTE
          head: headRows,
          body: bodyRows,
          startY: currentY,
          theme: 'grid',
          styles: {
            fontSize: TABLE_FONT_SIZE_PT,
            cellPadding: 1.5,
            overflow: 'linebreak',
          },
          headStyles: {
            fillColor: [41, 128, 185],
            textColor: [255, 255, 255],
            fontStyle: 'bold',
            fontSize: TABLE_FONT_SIZE_PT + 1,
          },
          margin: { left: MARGIN_PT, right: MARGIN_PT },
          tableWidth: 'auto',
        });
        currentY = doc.lastAutoTable.finalY + 10;
      } else if (tagName === 'HR') {
        if (currentY + 10 > doc.internal.pageSize.height - MARGIN_PT) {
            doc.addPage(); currentY = MARGIN_PT;
        }
        doc.setDrawColor(180, 180, 180);
        doc.line(MARGIN_PT, currentY, doc.internal.pageSize.width - MARGIN_PT, currentY);
        currentY += 10;
      } else if (element.textContent.trim()) {
        console.warn("Elemento PDF no manejado explícitamente:", tagName, element.textContent.substring(0,30));
        currentY = addText(doc, element.innerHTML, MARGIN_PT, currentY, contentWidth, {isHtml: true});
        currentY += 5;
      }
    }

    const fileName = `${programData?.degree?.replace(/\s+/g, '_') || 'plan_curricular'}_${new Date().toISOString().slice(0, 10)}.pdf`;
    doc.save(fileName);

    notification.success({
      message: 'PDF Exportado',
      description: `El plan de estudios se ha guardado como ${fileName}.`,
      placement: 'bottomRight',
      icon: <CloudDownloadOutlined style={{ color: '#52c41a' }} />,
    });

  } catch (error) {
    console.error('Error al generar PDF:', error);
    notification.error({
      message: 'Error al Exportar PDF',
      description: error.message || 'Ocurrió un problema al generar el archivo PDF.',
      placement: 'bottomRight',
    });
  }
};