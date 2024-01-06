import { Injectable } from '@angular/core';
import xlsx from 'node-xlsx';

@Injectable({
  providedIn: 'root',
})
export class XlsxParserService {
  constructor() {}

  async parseFile(file: File): Promise<Worksheet[]> {
    const fileContent = await readFile(file);
    const workSheetsFromBuffer = xlsx.parse(fileContent);
    console.log(workSheetsFromBuffer);
    return workSheetsFromBuffer;
  }
}

export interface Worksheet {
  name: string;
  data: any[][];
}

function readFile(file: Blob): Promise<ArrayBuffer> {
  return new Promise((resolve) => {
    const fileReader = new FileReader();
    fileReader.addEventListener('load', () =>
      resolve(fileReader.result as ArrayBuffer),
    );
    fileReader.readAsArrayBuffer(file);
  });
}
