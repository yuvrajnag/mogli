import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreditsService } from '../../services/credits.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  credits$!: Observable<number>;

  constructor(private creditsService: CreditsService) {}

  ngOnInit() {
    this.credits$ = this.creditsService.credits$;
  }
}
