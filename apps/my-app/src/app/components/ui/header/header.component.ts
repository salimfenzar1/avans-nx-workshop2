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
    this.authService.getUserObservable().subscribe((user) => {
      if (user) {
        this.userName = user.name || 'Gebruiker';
        this.userProfileImgUrl = user.profileImgUrl || '../../../../assets/recipelogo.png';
      } else {
        this.userName = null;
        this.userProfileImgUrl = null;
      }
    });
  }

  isLoggedIn(): boolean {
    return !!this.authService.getToken();
  }

  logout(): void {
    this.authService.clearToken(); 
    this.router.navigate(['/login']); 
  }

  editProfile(): void {
    this.router.navigate(['/profile']); 
  }
}
