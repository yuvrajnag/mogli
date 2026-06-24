import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  isMuted = true;

  constructor(private router: Router) {}

  toggleMute(video: HTMLVideoElement): void {
    video.muted = !video.muted;
    this.isMuted = video.muted;
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
