import { TestBed } from '@angular/core/testing';

import { XlsxParserService } from './xlsx-parser.service';

describe('XlsxParserService', () => {
  let service: XlsxParserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(XlsxParserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
