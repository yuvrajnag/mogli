import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { CreditsService } from '../../services/credits.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  isSignup = false;
  showPassword = false;
  isLoading = false;
  errorMessage = '';

  // Form fields
  name = '';
  email = 'demo@mogli.com';
  password = 'password123';

  constructor(
    private router: Router,
    private apiService: ApiService,
    private creditsService: CreditsService
  ) {}

  toggleMode(): void {
    this.isSignup = !this.isSignup;
    this.errorMessage = '';
    // Reset defaults for easy testing
    if (!this.isSignup) {
      this.email = 'demo@mogli.com';
      this.password = 'password123';
    } else {
      this.name = '';
      this.email = '';
      this.password = '';
    }
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  async handleSubmit(): Promise<void> {
    this.errorMessage = '';
    this.isLoading = true;

    try {
      let data;
      if (this.isSignup) {
        data = await this.apiService.signup(this.name, this.email, this.password).toPromise();
      } else {
        data = await this.apiService.login(this.email, this.password).toPromise();
      }

      if (data && data.token) {
        // In a real app, save the token to localStorage here
        localStorage.setItem('mogli_token', data.token);
        this.creditsService.initCredits();
        this.router.navigate(['/dashboard']);
      }
    } catch (err: any) {
      this.errorMessage = err?.error?.error || 'Authentication failed. Please try again.';
    } finally {
      this.isLoading = false;
    }
  }
}
