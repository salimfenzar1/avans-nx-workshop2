import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '@avans-nx-workshop/features';
import { UserService } from '../users/user.service';
import { IUser } from '@avans-nx-workshop/shared/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit_profile.component.html',
  styleUrls: [],
})
export class EditProfileComponent implements OnInit {
  userForm: FormGroup | null = null;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const userId = this.authService.getLoggedInUserId();
    if (userId) {
      this.userService.getProfile(userId).subscribe({
        next: (response) => {
          const user: IUser = response.results;
          this.userForm = this.fb.group({
            name: [user.name],
            emailAddress: [user.emailAddress],
            role: [user.role],
            gender: [user.gender],
            isActive: [user.isActive],
            profileImgUrl: [user.profileImgUrl],
          });
        },
        error: (err) => {
          console.error('Error fetching user profile:', err);
          this.errorMessage = 'Failed to load user profile.';
        },
      });
    } else {
      this.errorMessage = 'User not logged in.';
    }
  }

  saveChanges(): void {
    if (this.userForm?.valid) {
      const userId = this.authService.getLoggedInUserId();
      const updatedUser = { ...this.userForm.value, _id: userId };
  
      this.userService.updateUser(updatedUser).subscribe({
        next: () => {
          this.successMessage = 'Profile updated successfully!';
          this.router.navigate(['/profile']);
        },
        error: (err) => {
          console.error('Error updating profile:', err);
          if (err.error?.errors) {
            // Als backend foutdetails stuurt
            this.errorMessage = err.error.errors
              .map((e: any) => `${e.errors.join(', ')}`)
              .join('\n');
          } else {
            this.errorMessage = 'Failed to update profile.';
          }
        },
      });
    } else {
      this.errorMessage = 'Please fix the errors in the form.';
    }
  }
  

  cancel(): void {
    this.router.navigate(['/profile']);
  }
}
