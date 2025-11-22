import {HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest} from '@angular/common/http';
import {inject} from '@angular/core';
import {Observable} from 'rxjs';
import {AuthService} from '../auth/auth.service';

export const AuthInterceptor: HttpInterceptorFn = (
    req: HttpRequest<unknown>,
    next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
    const authService = inject(AuthService);
    const authRequest = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${authService.getToken()}`),
    });

    return next(authRequest);
};
