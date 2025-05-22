// File: components/exportExcel.js
import * as XLSX from 'xlsx';
import { marked } from 'marked';
import { CloudDownloadOutlined } from '@ant-design/icons';

// Función para sanear nombres de hojas de Excel
const sanitizeSheetName = (name) => {
  // Nombres de hoja no pueden tener más de 31 caracteres y ciertos caracteres están prohibidos
  return name.replace(/[*?:/\\[\]]/g, '').substring(0, 31);
};

export const exportToExcel = (markdownContent, programData, notification) => {
  if (!markdownContent) {
    notification.warn({
      message: 'Contenido Vacío',
      description: 'No hay plan para exportar a Excel.',
    });
    return;
  }

  try {
    const htmlContent = marked(markdownContent);

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;

    const wb = XLSX.utils.book_new();
    const tables = tempDiv.querySelectorAll('table');
    let sheetCount = 0;

    if (tables.length === 0) {
      const ws = XLSX.utils.aoa_to_sheet([["No se encontraron tablas en el contenido."]]);
      XLSX.utils.book_append_sheet(wb, ws, "Información");
    } else {
      tables.forEach((table, index) => {
        let sheetName = `Tabla ${index + 1}`;
        // Intentar encontrar un H2 o H3 precedente como título de la hoja
        let currentElement = table.previousElementSibling;
        while (currentElement) {
          if (currentElement.tagName === 'H2' || currentElement.tagName === 'H3') {
            sheetName = sanitizeSheetName(currentElement.textContent.trim());
            break;
          }
          // Detener si llegamos a otra tabla o muy lejos sin un título
          if (currentElement.tagName === 'TABLE' || !currentElement.previousElementSibling?.previousElementSibling) {
              break;
          }
          currentElement = currentElement.previousElementSibling;
        }
        
        const ws = XLSX.utils.table_to_sheet(table, { rawNumbers: true });
        XLSX.utils.book_append_sheet(wb, ws, sheetName);
        sheetCount++;
      });
    }

    const fileName = `${programData?.degree?.replace(/\s+/g, '_') || 'plan_curricular'}_${new Date().toISOString().slice(0, 10)}.xlsx`;
    XLSX.writeFile(wb, fileName);

    notification.success({
      message: 'Excel Exportado',
      description: `El plan de estudios se ha guardado como ${fileName}.`,
      placement: 'bottomRight',
      icon: <CloudDownloadOutlined style={{ color: '#52c41a' }} />,
    });

  } catch (error) {
    console.error('Error al generar XLSX:', error);
    notification.error({
      message: 'Error al Exportar Excel',
      description: error.message || 'Ocurrió un problema al generar el archivo XLSX.',
      placement: 'bottomRight',
    });
  }
};