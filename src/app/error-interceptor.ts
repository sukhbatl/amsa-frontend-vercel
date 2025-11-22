import { HttpErrorResponse, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { inject, PLATFORM_ID } from '@angular/core';
import { MessageService } from 'primeng/api';
import { isPlatformBrowser } from '@angular/common';
import { HttpInterceptorFn } from '@angular/common/http';
import { Router } from '@angular/router';

export const ErrorInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const messageService: MessageService = inject(MessageService);
  const platformId = inject(PLATFORM_ID);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An unknown error occurred!';
      if (error.error?.message) {
        errorMessage = error.error.message;
      }
      
      // Handle authentication errors
      if (isPlatformBrowser(platformId) && (error.status === 401 || error.status === 403)) {
        messageService.add({ 
          severity: 'warn', 
          summary: 'Authentication Required', 
          detail: 'Please sign in to view this content',
          life: 3000 
        });
        router.navigate(['/login']);
        return throwError(() => error);
      }
      
      if (error.error?.code !== 'jwt malformed' && isPlatformBrowser(platformId)) {
        messageService.add({ 
          severity: 'error', 
          summary: 'Error', 
          detail: errorMessage,
          life: 5000 
        });
      }
      return throwError(() => error);
    })
  );
};
