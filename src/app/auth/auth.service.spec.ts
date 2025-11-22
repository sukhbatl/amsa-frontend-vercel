import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { LocalStorageService } from './local-storage.service';
import { environment } from '../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let router: Router;
  let localStorageService: LocalStorageService;

  beforeEach(() => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const localStorageSpy = jasmine.createSpyObj('LocalStorageService', ['getItem', 'setItem', 'removeItem']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: Router, useValue: routerSpy },
        { provide: LocalStorageService, useValue: localStorageSpy }
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    localStorageService = TestBed.inject(LocalStorageService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return false for isAuth initially', () => {
    expect(service.getIsAuth()).toBeFalse();
  });

  it('should return empty token initially', () => {
    expect(service.getToken()).toBe('');
  });

  it('should login successfully', (done) => {
    const mockResponse = {
      token: 'fake-jwt-token',
      userId: 1,
      level: 2,
      expiresIn: 3600
    };

    service.login('test@example.com', 'password').subscribe({
      next: () => {
        expect(service.getIsAuth()).toBeTrue();
        expect(service.getToken()).toBe('fake-jwt-token');
        expect(service.getUserId()).toBe(1);
        expect(service.getLevel()).toBe(2);
        done();
      }
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/user/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email: 'test@example.com', password: 'password' });
    req.flush(mockResponse);
  });

  it('should handle login error', (done) => {
    service.login('test@example.com', 'wrong-password').subscribe({
      error: (error) => {
        expect(service.getIsAuth()).toBeFalse();
        expect(error).toBeTruthy();
        done();
      }
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/user/login`);
    req.flush({ message: 'Invalid credentials' }, { status: 401, statusText: 'Unauthorized' });
  });

  it('should logout successfully', () => {
    // Setup authenticated state
    service['isAuthenticated'] = true;
    service['token'] = 'fake-token';
    service['userId'] = 1;

    service.logout();

    expect(service.getIsAuth()).toBeFalse();
    expect(service.getToken()).toBe('');
    expect(service.getUserId()).toBe(-1);
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should create user successfully', async () => {
    const mockAuthData = {
      email: 'new@example.com',
      password: 'password',
      firstName: 'John',
      lastName: 'Doe',
      university: 'MIT',
      major: 'CS',
      classYear: 2024,
      country: 'USA'
    };

    const promise = service.createUser(mockAuthData);
    
    const req = httpMock.expectOne(`${environment.apiUrl}/user/signup`);
    expect(req.request.method).toBe('POST');
    req.flush({ message: 'User created successfully' });

    const result = await promise;
    expect(result.message).toBe('User created successfully');
  });

  it('should verify email successfully', async () => {
    const email = 'test@example.com';
    const hash = 'verification-hash';

    const promise = service.verifyEmail(email, hash);
    
    const req = httpMock.expectOne(`${environment.apiUrl}/user/verify/${email}/${hash}`);
    expect(req.request.method).toBe('GET');
    req.flush({ message: 'Email verified successfully' });

    const result = await promise;
    expect(result.message).toBe('Email verified successfully');
  });

  it('should reset password successfully', async () => {
    const email = 'test@example.com';
    const password = 'newpassword';
    const hash = 'reset-hash';

    const promise = service.resetPassword(email, password, hash);
    
    const req = httpMock.expectOne(`${environment.apiUrl}/user/reset`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email, password, hash });
    req.flush({ message: 'Password reset successfully' });

    const result = await promise;
    expect(result.message).toBe('Password reset successfully');
  });
});

