import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';
import { HeaderComponent } from '../../shared/header/header.component';
import { ApiService } from '../../services/api.service';
import { CreditsService } from '../../services/credits.service';

@Component({
  selector: 'app-image-gen',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent, HeaderComponent],
  templateUrl: './image-gen.component.html',
  styleUrls: ['./image-gen.component.css'],
})
export class ImageGenComponent implements OnInit {
  currentMode = 'logo';
  currentRatio = '1:1';
  promptText = '';
  chatText = "Hi, I am an expert designer and I am currently in Logo Design mode. If you want to use me for other purposes, please use '/' to change mode.";
  isGenerating = false;
  isEnhancing = false;
  showRatioPopup = false;
  showSlashMenu = false;
  showConfirmModal = false;
  generatedImageUrl: SafeUrl | null = null;
  rawImageUrl: string | null = null;

  ratioOptions = [
    { ratio: '1:1', label: '1:1 Square' },
    { ratio: '16:9', label: '16:9 Widescreen' },
    { ratio: '9:16', label: '9:16 Story' },
    { ratio: '4:5', label: '4:5 Social Post' },
  ];

  logoKeywords = ['logo', 'icon', 'symbol', 'emblem', 'badge', 'mark', 'brand', 'identity', 'logotype', 'monogram'];

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private creditsService: CreditsService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['mode'] === 'poster') {
        this.currentMode = 'poster';
        this.currentRatio = '4:5';
        this.chatText = "Hi, I am an expert designer and I am currently in Poster Design mode. If you want to use me for other purposes, please use '/' to change mode.";
      }
    });
  }

  get breadcrumb(): string {
    return `Personal Project / ${this.currentMode === 'logo' ? 'Logo' : 'Poster'} Generator`;
  }

  onPromptInput(): void {
    this.showSlashMenu = this.promptText.trim() === '/';
  }

  selectMode(mode: string): void {
    this.currentMode = mode;
    this.showSlashMenu = false;
    this.promptText = '';
    if (mode === 'poster') {
      this.currentRatio = '4:5';
      this.chatText = "Hi, I am an expert designer and I am currently in Poster Design mode. If you want to use me for other purposes, please use '/' to change mode.";
    } else {
      this.currentRatio = '1:1';
      this.chatText = "Hi, I am an expert designer and I am currently in Logo Design mode. If you want to use me for other purposes, please use '/' to change mode.";
    }
  }

  selectRatio(ratio: string): void {
    this.currentRatio = ratio;
    this.showRatioPopup = false;
  }

  openConfirm(): void {
    const prompt = this.promptText.trim().toLowerCase();
    if (!prompt) return;
    const hasLogoKeyword = this.logoKeywords.some((kw) => prompt.includes(kw));

    if (this.currentMode === 'poster' && hasLogoKeyword) {
      this.chatText = 'Please change the mode for better results and accuracy.';
      return;
    }
    if (this.currentMode === 'logo' && !hasLogoKeyword) {
      this.chatText = "To create a great logo, try adding keywords like 'logo', 'icon', or 'symbol' to your prompt!";
      return;
    }
    this.showConfirmModal = true;
  }

  async confirmGenerate(): Promise<void> {
    this.showConfirmModal = false;
    this.creditsService.useCredits(10);
    this.isGenerating = true;
    this.generatedImageUrl = null;
    this.rawImageUrl = null;

    try {
      const observable = this.currentMode === 'logo'
        ? this.apiService.generateLogo(this.promptText, this.currentRatio)
        : this.apiService.generatePost(this.promptText, this.currentRatio);

      const blob = await observable.toPromise();
      if (blob) {
        const objectUrl = URL.createObjectURL(blob);
        this.rawImageUrl = objectUrl;
        this.generatedImageUrl = this.sanitizer.bypassSecurityTrustUrl(objectUrl);
        this.chatText = 'Here is your masterpiece! Hope you love it.';
      }
    } catch (err: any) {
      this.chatText = 'Mogli encountered a snag: ' + (err?.error?.error || err?.message || 'Unknown error');
    } finally {
      this.isGenerating = false;
    }
  }

  async enhancePrompt(): Promise<void> {
    if (!this.promptText.trim() || this.isEnhancing) return;
    this.isEnhancing = true;
    try {
      const data = await this.apiService.enhancePrompt(this.promptText).toPromise();
      if (data?.enhanced_prompt) {
        this.promptText = data.enhanced_prompt;
      }
    } catch (err) {
      console.error('Enhance error:', err);
    } finally {
      this.isEnhancing = false;
    }
  }

  downloadImage(): void {
    if (!this.rawImageUrl) return;
    const a = document.createElement('a');
    a.href = this.rawImageUrl;
    a.download = `mogli-art-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}
