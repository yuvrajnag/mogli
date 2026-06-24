import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';
import { HeaderComponent } from '../../shared/header/header.component';
import { ApiService } from '../../services/api.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, SidebarComponent, HeaderComponent],
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css'],
})
export class HistoryComponent implements OnInit {
  historyItems: any[] = [];
  isLoading = true;
  apiUrl = environment.apiUrl.replace('/api', ''); // Get base URL for image uploads

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.getHistory().subscribe({
      next: (data) => {
        this.historyItems = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load history', err);
        this.isLoading = false;
      }
    });
  }
}
