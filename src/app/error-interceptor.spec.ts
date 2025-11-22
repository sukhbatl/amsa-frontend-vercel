import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { PLATFORM_ID } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ErrorInterceptor } from './error-interceptor';

describe('ErrorInterceptor', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  let messageService: MessageService;

  describe('Browser Platform', () => {
    beforeEach(() => {
      const messageServiceSpy = jasmine.createSpyObj('MessageService', ['add']);

      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [
          provideHttpClient(withInterceptors([ErrorInterceptor])),
          { provide: MessageService, useValue: messageServiceSpy },
          { provide: PLATFORM_ID, useValue: 'browser' }
        ]
      });

      httpMock = TestBed.inject(HttpTestingController);
      httpClient = TestBed.inject(HttpClient);
      messageService = TestBed.inject(MessageService);
    });

    afterEach(() => {
      httpMock.verify();
    });

    it('should handle HTTP error and show message', (done) => {
      const testUrl = '/api/test';
      const errorMessage = 'Test error message';

      httpClient.get(testUrl).subscribe({
        error: (error) => {
          expect(messageService.add).toHaveBeenCalledWith({
            severity: 'error',
            summary: 'Error',
            detail: errorMessage,
            life: 5000
          });
          done();
        }
      });

      const req = httpMock.expectOne(testUrl);
      req.flush({ message: errorMessage }, { status: 500, statusText: 'Server Error' });
    });

    it('should handle error without message', (done) => {
      const testUrl = '/api/test';

      httpClient.get(testUrl).subscribe({
        error: () => {
          expect(messageService.add).toHaveBeenCalledWith(
            jasmine.objectContaining({
              severity: 'error',
              summary: 'Error',
              detail: 'An unknown error occurred!'
            })
          );
          done();
        }
      });

      const req = httpMock.expectOne(testUrl);
      req.flush({}, { status: 500, statusText: 'Server Error' });
    });

    it('should not show message for jwt malformed error', (done) => {
      const testUrl = '/api/test';

      httpClient.get(testUrl).subscribe({
        error: () => {
          expect(messageService.add).not.toHaveBeenCalled();
          done();
        }
      });

      const req = httpMock.expectOne(testUrl);
      req.flush({ code: 'jwt malformed' }, { status: 401, statusText: 'Unauthorized' });
    });
  });

  describe('Server Platform', () => {
    beforeEach(() => {
      const messageServiceSpy = jasmine.createSpyObj('MessageService', ['add']);

      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [
          provideHttpClient(withInterceptors([ErrorInterceptor])),
          { provide: MessageService, useValue: messageServiceSpy },
          { provide: PLATFORM_ID, useValue: 'server' }
        ]
      });

      httpMock = TestBed.inject(HttpTestingController);
      httpClient = TestBed.inject(HttpClient);
      messageService = TestBed.inject(MessageService);
    });

    afterEach(() => {
      httpMock.verify();
    });

    it('should not show message on server platform', (done) => {
      const testUrl = '/api/test';

      httpClient.get(testUrl).subscribe({
        error: () => {
          expect(messageService.add).not.toHaveBeenCalled();
          done();
        }
      });

      const req = httpMock.expectOne(testUrl);
      req.flush({ message: 'Error' }, { status: 500, statusText: 'Server Error' });
    });
  });
});

