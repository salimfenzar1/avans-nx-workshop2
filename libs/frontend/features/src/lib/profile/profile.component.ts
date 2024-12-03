import { Component, OnInit } from '@angular/core';
import { AuthService } from '@avans-nx-workshop/features';
import { UserService } from '../users/user.service';
import { IUser } from '@avans-nx-workshop/shared/api';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: [],
})
export class ProfileComponent implements OnInit {
  user: IUser | null = null;
  errorMessage: string | null = null;

  constructor(private userService: UserService, private authService: AuthService) {}

 ngOnInit(): void {
  const userId = this.authService.getLoggedInUserId();
  if (userId) {
    this.userService.getProfile(userId).subscribe({
      next: (data) => {
        console.log('Profile data received:', data); // Debugging
        if (data && data.results) {
          this.user = data.results; // Toewijzen van de daadwerkelijke user-data
        } else {
          console.error('Unexpected response structure:', data);
          this.errorMessage = 'Unexpected response structure.';
        }
      },
      error: (err) => {
        console.error('Error fetching profile:', err);
        this.errorMessage = 'Failed to load profile.';
      },
    });
  }
}

  
  
}
