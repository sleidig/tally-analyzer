import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Worksheet, XlsxParserService } from './xlsx-parser.service';
import { TallyParserService } from './tally-parser.service';
import Papa from 'papaparse';
import { HelgoAnalyzerService } from './helgo-analyzer.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  constructor(
    private xlsxParser: XlsxParserService,
    private tallyParser: TallyParserService,
    private helgoAnalyzer: HelgoAnalyzerService,
  ) {}

  async loadFile($event: Event): Promise<void> {
    const files: Worksheet[][] =
      await this.xlsxParser.loadFilesFromEvent($event);

    const accountRecords = files
      .map((f) => this.tallyParser.parseDayBook(f))
      .flat();

    const helgoRecords = accountRecords.map((r) =>
      this.helgoAnalyzer.analyze(r),
    );

    console.log(helgoRecords);
    const csvData = Papa.unparse(helgoRecords);
    this.download('expense-records.csv', csvData);
  }

  runAI() {
    this.tallyParser.tensorflow();
  }

  download(filename: string, text: string) {
    var element = document.createElement('a');
    element.setAttribute(
      'href',
      'data:text/plain;charset=utf-8,' + encodeURIComponent(text),
    );
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }
}
