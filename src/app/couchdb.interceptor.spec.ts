import { TestBed } from '@angular/core/testing';

import { CouchdbInterceptor } from './couchdb.interceptor';

describe('CouchdbInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      CouchdbInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: CouchdbInterceptor = TestBed.inject(CouchdbInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
