import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Injectable({ providedIn: 'root' })
export class ExportService {
  toExcel(rows: Record<string, unknown>[], fileName: string, sheetName = 'Data'): void {
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  }

  toPdf(title: string, head: string[], body: (string | number)[][], fileName: string): void {
    const doc = new jsPDF();
    doc.setFontSize(15);
    doc.setTextColor(30, 27, 75);
    doc.text(title, 14, 18);
    autoTable(doc, {
      head: [head],
      body,
      startY: 24,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [79, 70, 229], textColor: 255 },
      alternateRowStyles: { fillColor: [241, 245, 249] },
    });
    doc.save(`${fileName}.pdf`);
  }
}
