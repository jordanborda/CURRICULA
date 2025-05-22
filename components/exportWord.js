// File: components/exportWord.js
import {
    Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell,
    WidthType, BorderStyle, AlignmentType, convertInchesToTwip, ShadingType, VerticalAlign,
    Numbering, Indent, LevelSuffix, StyleLevel, AbstractNumbering // AbstractNumbering se usa en la config de Numbering
} from 'docx';
import { saveAs } from 'file-saver';
import { marked } from 'marked';
import { CloudDownloadOutlined } from '@ant-design/icons';


// --- Funciones Helper para construir el documento DOCX ---
// (parseHtmlForDocxRuns, createParagraphFromHtmlNode, createTableFromHtmlTable SIN CAMBIOS desde la versión anterior)
function parseHtmlForDocxRuns(htmlString) {
    const runs = [];
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlString.trim(); 

    function processNode(currentNode, currentOptions = {}) {
        if (currentNode.nodeType === Node.TEXT_NODE) {
            if (currentNode.textContent.trim() !== "" || runs.length === 0 || (runs[runs.length -1] && runs[runs.length-1].break)) {
                 runs.push(new TextRun({ text: currentNode.textContent, ...currentOptions }));
            }
        } else if (currentNode.nodeType === Node.ELEMENT_NODE) {
            const tagName = currentNode.tagName.toLowerCase();
            let newOptions = { ...currentOptions };

            if (tagName === 'strong' || tagName === 'b') newOptions.bold = true;
            else if (tagName === 'em' || tagName === 'i') newOptions.italics = true;
            else if (tagName === 'u') newOptions.underline = {};
            else if (tagName === 'code') newOptions.font = { name: "Courier New" };
            else if (tagName === 'br') {
                runs.push(new TextRun({ break: 1, ...newOptions }));
                return;
            }
            Array.from(currentNode.childNodes).forEach(child => processNode(child, newOptions));
        }
    }
    Array.from(tempDiv.childNodes).forEach(child => processNode(child));
    return runs;
}

function createParagraphFromHtmlNode(htmlNode, numberingConfig = null, level = 0) {
    const runs = parseHtmlForDocxRuns(htmlNode.innerHTML);
    const paragraphOptions = {
        children: runs.length > 0 ? runs : [new TextRun("")],
    };

    if (numberingConfig) {
        paragraphOptions.numbering = {
            reference: numberingConfig.reference,
            level: level,
        };
    }
    return new Paragraph(paragraphOptions);
}

function createTableFromHtmlTable(htmlTableNode) {
    const rows = [];
    let columnCount = 0;

    htmlTableNode.querySelectorAll('thead tr').forEach(trNode => {
        const cells = [];
        let currentColumnCountInRow = 0;
        trNode.querySelectorAll('th').forEach(thNode => {
            cells.push(
                new TableCell({
                    children: [new Paragraph({ children: parseHtmlForDocxRuns(thNode.innerHTML), alignment: AlignmentType.CENTER })],
                    shading: { fill: "D9D9D9", type: ShadingType.CLEAR, color: "auto" },
                    verticalAlign: VerticalAlign.CENTER,
                })
            );
            currentColumnCountInRow++;
        });
        if (currentColumnCountInRow > columnCount) columnCount = currentColumnCountInRow;
        if (cells.length > 0) rows.push(new TableRow({ children: cells, tableHeader: true }));
    });

    htmlTableNode.querySelectorAll('tbody tr').forEach(trNode => {
        const cells = [];
        let currentColumnCountInRow = 0;
        trNode.querySelectorAll('td').forEach(tdNode => {
            const cellParagraphs = [];
            const cellHtmlParts = tdNode.innerHTML.split(/<br\s*\/?>/gi);
            cellHtmlParts.forEach(part => {
                if (part.trim() !== "" || cellParagraphs.length === 0) {
                    cellParagraphs.push(new Paragraph({ children: parseHtmlForDocxRuns(part) }));
                }
            });
            cells.push( new TableCell({ children: cellParagraphs.length > 0 ? cellParagraphs : [new Paragraph("")], verticalAlign: VerticalAlign.TOP }) );
            currentColumnCountInRow++;
        });
        if (currentColumnCountInRow > columnCount) columnCount = currentColumnCountInRow;
        if (cells.length > 0) rows.push(new TableRow({ children: cells }));
    });

    if (rows.length === 0) return null;
    const columnWidths = columnCount > 0 ? Array(columnCount).fill(Math.floor(9024 / columnCount)) : []; // 9024 DXA es aprox 100% width

    return new Table({
        rows: rows,
        width: { size: 100, type: WidthType.PERCENTAGE },
        columnWidths: columnWidths,
        borders: {
            top: { style: BorderStyle.SINGLE, size: 1, color: "000000" }, bottom: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
            left: { style: BorderStyle.SINGLE, size: 1, color: "000000" }, right: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
            insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "000000" }, insideVertical: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
        },
    });
}

// --- Función Principal de Exportación ---
export const exportToWord = async (markdownContent, programData, notification) => {
    console.log('[WORD DOCXJS EXPORT] Iniciando exportación...');
    if (!markdownContent || markdownContent.trim() === "") {
        notification.warn({ message: 'Contenido Vacío', description: 'No hay plan para exportar a Word.' });
        return;
    }
    // ... (resto de los console.log iniciales) ...
    console.log('[WORD DOCXJS EXPORT] Contenido Markdown (100 chars):', markdownContent.substring(0, 100));


    try {
        const htmlString = marked(markdownContent, { breaks: true });
        const parser = new DOMParser();
        const htmlDoc = parser.parseFromString(htmlString, 'text/html');
        const bodyElements = Array.from(htmlDoc.body.children);

        const docChildren = [];

        // *** INICIO DE LA CORRECCIÓN PARA NUMBERING ***
        const abstractNumberingForBullets = { // Este es el OBJETO de configuración
            abstractNumId: 1, // Un ID único para esta definición abstracta
            levels: [
                { level: 0, format: "bullet", text: "\u2022", style: { paragraph: { indent: { left: convertInchesToTwip(0.25), hanging: convertInchesToTwip(0.125) } } } },
                { level: 1, format: "bullet", text: "\u25E6", style: { paragraph: { indent: { left: convertInchesToTwip(0.5), hanging: convertInchesToTwip(0.125) } } } },
            ],
        };

        const abstractNumberingForDecimals = { // OBJETO de configuración
            abstractNumId: 2, // Un ID único diferente
            levels: [
                { level: 0, format: "decimal", text: "%1.", style: { paragraph: { indent: { left: convertInchesToTwip(0.25), hanging: convertInchesToTwip(0.18) } } }, suffix: LevelSuffix.TAB },
                { level: 1, format: "lowerLetter", text: "%2)", style: { paragraph: { indent: { left: convertInchesToTwip(0.5), hanging: convertInchesToTwip(0.18) } } }, suffix: LevelSuffix.TAB },
            ],
        };
        
        const numbering = { // La propiedad 'numbering' del Document espera esto
            config: [ // Un array de configuraciones, donde cada una puede ser una instancia de AbstractNumbering o un objeto de config
                abstractNumberingForBullets, // Pasar los objetos de configuración directamente
                abstractNumberingForDecimals,
            ],
            // Aquí puedes añadir instancias de Numbering si necesitas referenciar un abstractNumId con un concreteNumId específico
            // Por ahora, referenciar el abstractNumId en el Paragraph debería ser suficiente para casos simples.
            // Para que la referencia por 'reference' string funcione como antes, se hace así:
            // concrete: [ // Opcional, para mapear un 'reference' string a un abstractNumId
            //    { concreteNumId: 1, abstractNumId: 1, reference: "bullet-numbering" },
            //    { concreteNumId: 2, abstractNumId: 2, reference: "decimal-numbering" }
            // ]
        };
        // Simplificación: Al usar paragraph.numbering, el 'reference' ahora será el abstractNumId (número)
        // O si usamos el mapeo 'concrete', podemos seguir usando el string. Vamos a intentar con el mapeo para mantener la lógica.

        // Re-haciendo la parte 'concrete' para que el 'reference' string funcione
        numbering.concrete = [
            { concreteNumId: 1, abstractNumId: 1, reference: "bullet-numbering" }, // Mapea "bullet-numbering" a abstractNumId 1
            { concreteNumId: 2, abstractNumId: 2, reference: "decimal-numbering" }  // Mapea "decimal-numbering" a abstractNumId 2
        ];
        // Y necesitamos asegurarnos que los abstractNumId en 'config' coincidan con los de 'concrete'
        // Ya lo hacen (1 y 2).

        // *** FIN DE LA CORRECCIÓN PARA NUMBERING ***


        bodyElements.forEach(element => {
            const tagName = element.tagName.toLowerCase();
            // ... (el switch case se mantiene igual, usando "bullet-numbering" y "decimal-numbering" como reference)
            switch (tagName) {
                case 'h1': docChildren.push(new Paragraph({ children: parseHtmlForDocxRuns(element.innerHTML), heading: HeadingLevel.HEADING_1 })); break;
                case 'h2': docChildren.push(new Paragraph({ children: parseHtmlForDocxRuns(element.innerHTML), heading: HeadingLevel.HEADING_2 })); break;
                case 'h3': docChildren.push(new Paragraph({ children: parseHtmlForDocxRuns(element.innerHTML), heading: HeadingLevel.HEADING_3 })); break;
                case 'h4': docChildren.push(new Paragraph({ children: parseHtmlForDocxRuns(element.innerHTML), heading: HeadingLevel.HEADING_4 })); break;
                case 'h5': docChildren.push(new Paragraph({ children: parseHtmlForDocxRuns(element.innerHTML), heading: HeadingLevel.HEADING_5 })); break;
                case 'h6': docChildren.push(new Paragraph({ children: parseHtmlForDocxRuns(element.innerHTML), heading: HeadingLevel.HEADING_6 })); break;
                case 'p':  docChildren.push(createParagraphFromHtmlNode(element)); break;
                case 'ul':
                    Array.from(element.children).forEach(li => {
                        if (li.tagName.toLowerCase() === 'li') {
                            // El level 0 se refiere al primer nivel definido en abstractNumberingForBullets
                            docChildren.push(createParagraphFromHtmlNode(li, { reference: "bullet-numbering" }, 0));
                        }
                    });
                    break;
                case 'ol':
                     Array.from(element.children).forEach(li => {
                        if (li.tagName.toLowerCase() === 'li') {
                            docChildren.push(createParagraphFromHtmlNode(li, { reference: "decimal-numbering" }, 0));
                        }
                    });
                    break;
                case 'table':
                    const docxTable = createTableFromHtmlTable(element);
                    if (docxTable) docChildren.push(docxTable);
                    else console.warn("[WORD DOCXJS EXPORT] Se omitió una tabla vacía o malformada.");
                    break;
                case 'blockquote':
                    const bqPara = createParagraphFromHtmlNode(element);
                    // Asegúrate de que 'options' existe o crea el párrafo con las opciones directamente
                    docChildren.push(new Paragraph({
                        children: bqPara.options.children, // Tomar los children del párrafo creado
                        indent : { left: convertInchesToTwip(0.5) }
                    }));
                    break;
                case 'pre':
                    const codeText = element.querySelector('code') ? element.querySelector('code').textContent : element.textContent;
                    docChildren.push(new Paragraph({
                        children: [new TextRun({ text: codeText || "", font: { name: "Courier New", size: "9pt" } })],
                        shading: { fill: "F1F1F1", type: ShadingType.CLEAR, color: "auto" },
                    }));
                    break;
                case 'hr':
                    docChildren.push(new Paragraph({ border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: "BFBFBF" } } }));
                    docChildren.push(new Paragraph(""));
                    break;
                default:
                    console.warn(`[WORD DOCXJS EXPORT] Etiqueta no manejada: ${tagName}. Intentando como párrafo.`);
                    if (element.textContent && element.textContent.trim() !== "") {
                        docChildren.push(createParagraphFromHtmlNode(element));
                    }
            }
        });

        // ... (verificación de docChildren.length === 0)

        console.log("[WORD DOCXJS EXPORT] Creando Document object con docx...");
        const doc = new Document({
            numbering: numbering, // Pasar el objeto 'numbering' corregido
            sections: [{
                properties: {
                     page: {
                         margin: {
                             top: convertInchesToTwip(0.75), right: convertInchesToTwip(0.75),
                             bottom: convertInchesToTwip(0.75), left: convertInchesToTwip(0.75),
                         },
                     },
                },
                children: docChildren,
            }],
        });

        // ... (Packer.toBlob y el resto)
        console.log("[WORD DOCXJS EXPORT] Empaquetando documento con Packer...");
        Packer.toBlob(doc).then(blob => {
            console.log(`[WORD DOCXJS EXPORT] Blob DOCX generado, tamaño: ${blob.size} bytes`);
            if (blob.size < 500) {
                console.warn("[WORD DOCXJS EXPORT] El blob generado es muy pequeño.");
            }
            const fileName = `${programData?.degree?.replace(/\s+/g, '_') || 'plan_curricular'}_${new Date().toISOString().slice(0, 10)}.docx`;
            saveAs(blob, fileName);
            console.log("[WORD DOCXJS EXPORT] saveAs llamado.");
            notification.success({ /* ... */ });
        }).catch(packError => {
            console.error('[WORD DOCXJS EXPORT] Error en Packer.toBlob:', packError);
            notification.error({ /* ... */ });
        });

    } catch (error) {
        console.error('[WORD DOCXJS EXPORT] Error GENERAL:', error);
        notification.error({ /* ... */ });
    }
};