import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { XlsxParserService } from './xlsx-parser.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  constructor(private xlsxParser: XlsxParserService) {}

  async loadFile($event: Event): Promise<void> {
    const target = $event.target as HTMLInputElement;
    if (!target.files) {
      return;
    }

    const files = [];
    for (let i = 0; i < target.files.length; i++) {
      const f = target.files.item(i);
      if (!f) {
        continue;
      }
      files.push(await this.xlsxParser.parseFile(f));
    }
  }
}
