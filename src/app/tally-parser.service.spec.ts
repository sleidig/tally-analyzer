import { TestBed } from '@angular/core/testing';

import { TallyParserService } from './tally-parser.service';

describe('TallyParserService', () => {
  let service: TallyParserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TallyParserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
