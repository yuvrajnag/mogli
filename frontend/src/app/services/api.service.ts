import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /** Text generation via Groq (Name, Email, Summarize, Product, General) */
  generateNames(prompt: string, mode: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/generate-names`, { prompt, mode });
  }

  /** Logo generation via HuggingFace — returns Blob */
  generateLogo(prompt: string, aspectRatio: string): Observable<Blob> {
    return this.http.post(`${this.apiUrl}/generate-logo`, {
      prompt,
      aspect_ratio: aspectRatio,
    }, { responseType: 'blob' });
  }

  /** Social media post generation via HuggingFace — returns Blob */
  generatePost(prompt: string, aspectRatio: string): Observable<Blob> {
    return this.http.post(`${this.apiUrl}/generate-post`, {
      prompt,
      aspect_ratio: aspectRatio,
    }, { responseType: 'blob' });
  }

  /** Enhance a prompt for image generation */
  enhancePrompt(prompt: string): Observable<{ enhanced_prompt: string }> {
    return this.http.post<{ enhanced_prompt: string }>(`${this.apiUrl}/enhance-prompt`, { prompt });
  }

  /** Health check */
  healthCheck(): Observable<any> {
    return this.http.get(`${this.apiUrl}/health`);
  }

  /** Authentication */
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, { email, password });
  }

  signup(name: string, email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/signup`, { name, email, password });
  }

  /** History */
  getHistory(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/history`);
  }
}
