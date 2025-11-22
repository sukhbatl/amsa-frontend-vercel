import {Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {AuthGuestRegisterModel,AuthLoginModel,AuthRegisterModel, AuthTokenModel} from './auth-data.model';
import {catchError, Subject, tap, throwError} from 'rxjs';
import {Router} from '@angular/router';
import {environment} from '../../environments/environment';
import {firstValueFrom} from 'rxjs';
import {LocalStorageService} from './local-storage.service';

const BACKEND_URL = environment.apiUrl + '/user';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private isAuthenticated = false;
  private token = '';
  private authStatusListener = new Subject<boolean>();
  private authLevelListener = new Subject<number>();
  private tokenTimer: ReturnType<typeof setTimeout> | null = null;
  private userId = -1;
  private level = 0;

  constructor(
    private http: HttpClient,
    private router: Router,
    private localStorage: LocalStorageService,
  ) { }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getToken() {
    return this.token;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  getAuthLevelListener() {
    return this.authLevelListener.asObservable();
  }

  getUserId() {
    return this.userId;
  }

  getLevel() {
    return this.level;
  }

  setAuthListener(bool: boolean) {
    this.authStatusListener.next(bool);
  }

  setLevelListener(level: number) {
    this.authLevelListener.next(level);
  }

  createUser(authData: AuthRegisterModel) {
    return firstValueFrom(this.http.post<{message: string}>(BACKEND_URL + '/signup', authData));
  }

  createGuestUser(authData: AuthGuestRegisterModel) {
    return firstValueFrom(this.http.post<{message: string}>(BACKEND_URL + '/guestSignup', authData));
  }

  loginWithToken(res: any) {
    this.token = res.token;
    if (this.token) {
      const expiresInDuration = res.expiresIn;
      this.setAuthTimer(expiresInDuration);
      this.isAuthenticated = true;
      this.userId = res.userId;
      this.level = res.level;
      this.authStatusListener.next(true);
      this.authLevelListener.next(this.level);
      const now = new Date();
      const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
      this.saveAuthData(this.token, expirationDate, this.userId, this.level);
    }
  }

  login(email: string, password: string) {
    const authData: AuthLoginModel = { email, password };

  return this.http.post<AuthTokenModel>(`${BACKEND_URL}/login`, authData).pipe(
    tap((res) => {
      this.loginWithToken(res);
      this.authStatusListener.next(true);
    }),
    catchError((err) => {
      this.authStatusListener.next(false);
      this.authLevelListener.next(0);
      return throwError(() => err);
    })
  );
  }

  forgotPassword(email: string) {
    return this.http.post<{ message: string }>(BACKEND_URL + '/forgot', { email });
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.level = authInformation.level;
      this.userId = parseInt(authInformation.userId, 10);
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
      this.authLevelListener.next(this.level);
    }
  }

  logout() {
    this.token = '';
    this.isAuthenticated = false;
    this.userId = -1;
    this.authStatusListener.next(false);
    this.authLevelListener.next(0);
    if (this.tokenTimer) {
      clearTimeout(this.tokenTimer);
    }
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date, userId: number, level: number) {
    this.localStorage.setItem('token', token);
    this.localStorage.setItem('userId', userId.toString());
    this.localStorage.setItem('expiration', expirationDate.toISOString());
    this.localStorage.setItem('level', level.toString());
  }

  private clearAuthData() {
    this.localStorage.removeItem('token');
    this.localStorage.removeItem('userId');
    this.localStorage.removeItem('expiration');
    this.localStorage.removeItem('level');
  }

  private getAuthData() {
    const token = this.localStorage.getItem('token');
    const expirationDate = this.localStorage.getItem('expiration');
    const userId = this.localStorage.getItem('userId');
    const level = this.localStorage.getItem('level');
    if (!token || !expirationDate || !userId || !level) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId,
      level: parseInt(level, 10)
    };
  }

  verifyEmail(email: string, hash: string) {
    return firstValueFrom(this.http.get<{message: string}>(BACKEND_URL + '/verify/' + email + '/' + hash));
  }

  verifyEmailAgain(email: string) {
    return firstValueFrom(this.http.get<{message: string}>(BACKEND_URL + '/sendVerifyAgain/' + email));
  }

  async resetPassword(email: string, password: string, hash: string) {
        return firstValueFrom(
            this.http.post<{message: string}>(BACKEND_URL + '/reset', {
                email,
                password,
                hash,
            })
        );
    }
}
