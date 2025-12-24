import { TestBed } from '@angular/core/testing';

import { Orc } from './orc';

describe('Orc', () => {
  let service: Orc;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Orc);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
