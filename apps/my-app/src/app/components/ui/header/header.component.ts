import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@avans-nx-workshop/features';

@Component({
  selector: 'avans-nx-workshop-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  userName: string | null = null;
  userProfileImgUrl: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Abonneer je op wijzigingen in de gebruikersinformatie
    this.authService.getUserObservable().subscribe((user) => {
      if (user) {
        this.userName = user.name || 'Gebruikerr';
        this.userProfileImgUrl = user.profileImgUrl || '../../../../assets/recipelogo.png';
      } else {
        this.userName = null;
        this.userProfileImgUrl = null;
      }
    });
  }

  // Controleer of de gebruiker is ingelogd
  isLoggedIn(): boolean {
    return !!this.authService.getToken(); // Gebruik AuthService om token te checken
  }

  // Uitloggen
  logout(): void {
    this.authService.clearToken(); // Verwijder het token via AuthService
    this.router.navigate(['/login']); // Redirect naar de loginpagina
  }

  // Wijzig profiel
  editProfile(): void {
    this.router.navigate(['/profile']); // Redirect naar de profielpagina
  }
}
