import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@avans-nx-workshop/features';
import { IUserRegistration, IUserIdentity } from '@avans-nx-workshop/shared/api';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  registrationData: IUserRegistration = {
    name: '',
    emailAddress: '',
    password: ''
  };

  errorMessage: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  register(): void {
    this.authService.register(this.registrationData).subscribe({
        next: (response: any) => {
            console.log('Registration successful:', response);
            this.router.navigate(['/login']);
        },
        error: (err) => {
            console.error('Registration error occurred:', err);

            if (err.error?.errors) {
                this.errorMessage = err.error.errors
                    .map((e: any) => `${e.field}: ${e.message}`)
                    .join(', ');
            } else {
                this.errorMessage = err.error?.message || 'An unexpected error occurred. Please try again.';
            }
        }
    });
}
}
