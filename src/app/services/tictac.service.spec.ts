import { TestBed, inject } from '@angular/core/testing';

import { TictacService } from './tictac.service';

describe('WinnercheckerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TictacService]
    });
  });

  it('should be created', inject([TictacService], (service: TictacService) => {
    expect(service).toBeTruthy();
  }));
});
