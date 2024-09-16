import { Injectable } from '@angular/core';
import xlsx from 'node-xlsx';

@Injectable({
  providedIn: 'root',
})
export class XlsxParserService {
  constructor() {}

  async loadFilesFromEvent($event: Event): Promise<Worksheet[][]> {
    const target = $event.target as HTMLInputElement;
    if (!target.files) {
      return [];
    }

    const files = [];
    for (let i = 0; i < target.files.length; i++) {
      const f = target.files.item(i);
      if (!f) {
        continue;
      }
      files.push(await this.parseFile(f));
    }

    return files;
  }

  async parseFile(file: File): Promise<Worksheet[]> {
    const fileContent = await readFile(file);
    return xlsx.parse(fileContent, { cellDates: true });
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
