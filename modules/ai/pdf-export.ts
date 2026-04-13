import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const exportMessageToPDF = (content: string) => {
  const doc = new jsPDF();
  const date = new Date().toLocaleDateString('es-PE', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  // 1. Header (Premium Style)
  doc.setFillColor(31, 41, 55); // Dark blue-gray
  doc.rect(0, 0, 220, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('Abarrotes JVB', 15, 20);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('REPORTE DE ASISTENTE INTELIGENTE IA', 15, 30);
  
  doc.setTextColor(200, 200, 200);
  doc.text(`Fecha de emisión: ${date}`, 140, 30);

  // 2. Content Parsing
  // Check for lists (lines starting with - or *)
  const lines = content.split('\n');
  const tableData: string[][] = [];
  let normalText = '';

  lines.forEach(line => {
    const trimmed = line.trim();
    if (trimmed.startsWith('-') || trimmed.startsWith('*')) {
      // It's a list item, extract product and quantity if possible
      const item = trimmed.replace(/^[-*]\s*/, '').replace(/\*\*/g, '');
      tableData.push([item]);
    } else if (trimmed !== '') {
      normalText += trimmed.replace(/\*\*/g, '') + ' ';
    }
  });

  // 3. Add Normal Text
  doc.setTextColor(40, 40, 40);
  doc.setFontSize(12);
  const splitText = doc.splitTextToSize(normalText, 180);
  doc.text(splitText, 15, 55);

  const startY = 55 + (splitText.length * 7);

  // 4. Add Table if data exists
  if (tableData.length > 0) {
    autoTable(doc, {
      startY: startY + 5,
      head: [['Detalle del Reporte / Lista de Productos']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [79, 70, 229], textColor: 255 }, // Indigo
      styles: { fontSize: 10, cellPadding: 5 },
    });
  }

  // 5. Footer
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      'Este es un reporte generado automáticamente por AbarrotesAI - Gestión Inteligente de Inventario.',
      15,
      doc.internal.pageSize.height - 10
    );
    doc.text(`Página ${i} de ${pageCount}`, 180, doc.internal.pageSize.height - 10);
  }

  // 6. Save PDF
  doc.save(`Reporte_JVB_${new Date().getTime()}.pdf`);
};
