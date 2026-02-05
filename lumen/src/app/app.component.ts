import { Component, inject, effect } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './service/auth.service';
import { User } from './models/auth';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class App {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  currentUser: User | null = null;
  userMenuOpen = false;
  mobileMenuOpen = false;

  constructor() {
    effect(() => {
      this.authService.currentUser.subscribe((user: User | null) => {
        this.currentUser = user;
      });
    });
  }

  logout(): void {
    this.authService.logout();
    this.userMenuOpen = false;
    this.mobileMenuOpen = false;
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }

  toggleUserMenu(): void {
    this.userMenuOpen = !this.userMenuOpen;
    if (this.userMenuOpen) {
      this.mobileMenuOpen = false;
    }
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
    if (this.mobileMenuOpen) {
      this.userMenuOpen = false;
    }
  }
}