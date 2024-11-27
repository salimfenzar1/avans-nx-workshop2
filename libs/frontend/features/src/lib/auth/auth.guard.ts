import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const token = localStorage.getItem('token'); // Haal de JWT-token uit localStorage
    if (token) {
      return true; // Gebruiker is ingelogd
    } else {
      this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
      return false; // Gebruiker is niet ingelogd, doorverwijzen naar login
    }
  }
}
