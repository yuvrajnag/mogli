import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CreditsService {
  private creditsSubject = new BehaviorSubject<number>(this.loadCredits());
  credits$ = this.creditsSubject.asObservable();

  get credits(): number {
    return this.creditsSubject.value;
  }

  private loadCredits(): number {
    const stored = localStorage.getItem('mogli_credits');
    return stored ? parseInt(stored, 10) : 150;
  }

  initCredits(): void {
    if (!localStorage.getItem('mogli_credits')) {
      localStorage.setItem('mogli_credits', '150');
    }
    this.creditsSubject.next(this.loadCredits());
  }

  useCredits(amount: number): void {
    const current = this.creditsSubject.value;
    const updated = Math.max(0, current - amount);
    localStorage.setItem('mogli_credits', String(updated));
    this.creditsSubject.next(updated);
  }
}
