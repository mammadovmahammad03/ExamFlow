import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const FONT_NAME = 'DejaVuSans';
const FONT_FILE = 'DejaVuSans.ttf';
const FONT_URL = '/fonts/DejaVuSans.ttf';

@Injectable({ providedIn: 'root' })
export class ExportService {
  private fontBase64: string | null = null;

  toExcel(rows: Record<string, unknown>[], fileName: string, sheetName = 'Data'): void {
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  }

  async toPdf(title: string, head: string[], body: (string | number)[][], fileName: string): Promise<void> {
    const doc = new jsPDF();
    await this.applyFont(doc);

    doc.setFont(FONT_NAME, 'normal');
    doc.setFontSize(15);
    doc.setTextColor(30, 27, 75);
    doc.text(title, 14, 18);

    autoTable(doc, {
      head: [head],
      body,
      startY: 24,
      styles: { font: FONT_NAME, fontStyle: 'normal', fontSize: 9 },
      headStyles: { font: FONT_NAME, fontStyle: 'normal', fillColor: [79, 70, 229], textColor: 255 },
      alternateRowStyles: { fillColor: [241, 245, 249] },
    });

    doc.save(`${fileName}.pdf`);
  }

  private async applyFont(doc: jsPDF): Promise<void> {
    if (!this.fontBase64) {
      const response = await fetch(FONT_URL);
      const buffer = await response.arrayBuffer();
      this.fontBase64 = this.arrayBufferToBase64(buffer);
    }
    doc.addFileToVFS(FONT_FILE, this.fontBase64);
    doc.addFont(FONT_FILE, FONT_NAME, 'normal');
    doc.addFont(FONT_FILE, FONT_NAME, 'bold');
  }

  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    const chunkSize = 0x8000;
    for (let i = 0; i < bytes.length; i += chunkSize) {
      binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
    }
    return btoa(binary);
  }
}
