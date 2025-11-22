import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {AuthService} from './auth.service';

@Injectable()
export class AuthGuard  {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const isAuth = this.authService.getIsAuth();
    // If not authenticated
    if (!isAuth) {
      this.router.navigate(['/login']);
      return false;
    }
    // If not privileged
    if (this.authService.getLevel() < route.data['level']) {
      this.router.navigate(['/']);
      return false;
    }
    return true;
  }
}
