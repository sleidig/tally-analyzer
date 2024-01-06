import { TestBed } from '@angular/core/testing';

import { HelgoAnalyzerService } from './helgo-analyzer.service';

describe('HelgoAnalyzerService', () => {
  let service: HelgoAnalyzerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HelgoAnalyzerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
