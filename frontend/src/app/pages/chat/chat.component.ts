import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';
import { HeaderComponent } from '../../shared/header/header.component';
import { MarkdownPipe } from '../../shared/pipes/markdown.pipe';
import { ApiService } from '../../services/api.service';
import { CreditsService } from '../../services/credits.service';

interface ChatMessage {
  role: 'user' | 'ai';
  text: string;
}

interface ModeConfig {
  name: string;
  description: string;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent, HeaderComponent, MarkdownPipe],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit {
  @ViewChild('chatContainer') chatContainer!: ElementRef;

  currentMode = 'name';
  inputText = '';
  messages: ChatMessage[] = [];
  isLoading = false;
  showSlashMenu = false;

  modeConfigs: Record<string, ModeConfig> = {
    name: { name: 'Name & Slogan Generator', description: "Hi, I am an expert writer and I am currently in Name & Slogan mode. If you want to use me for other purposes, please use '/' to change mode." },
    general: { name: 'General AI Chat', description: "Hi, I am an expert writer and I am currently in General Chat mode. If you want to use me for other purposes, please use '/' to change mode." },
    summarize: { name: 'Text Summarizer', description: "Hi, I am an expert writer and I am currently in Summarization mode. If you want to use me for other purposes, please use '/' to change mode." },
    email: { name: 'Email Writer', description: "Hi, I am an expert writer and I am currently in Email Writing mode. If you want to use me for other purposes, please use '/' to change mode." },
    product: { name: 'Product Creative Writer', description: "Hi, I am an expert writer and I am currently in Product Descriptions mode. If you want to use me for other purposes, please use '/' to change mode." },
  };

  slashOptions = [
    { mode: 'name', label: '/name', desc: 'Name & Slogan Generation' },
    { mode: 'general', label: '/general', desc: 'General AI Chat' },
    { mode: 'summarize', label: '/summarize', desc: 'Text Summarization' },
    { mode: 'email', label: '/email', desc: 'Email Writing' },
    { mode: 'product', label: '/product', desc: 'Product Descriptions & Reviews' },
  ];

  get currentConfig(): ModeConfig {
    return this.modeConfigs[this.currentMode] || this.modeConfigs['name'];
  }

  get breadcrumb(): string {
    return `Text Generator / ${this.currentConfig.name}`;
  }

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private creditsService: CreditsService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['mode'] && this.modeConfigs[params['mode']]) {
        this.currentMode = params['mode'];
      }
    });
  }

  onInputChange(): void {
    this.showSlashMenu = this.inputText.trim() === '/';
  }

  selectMode(mode: string): void {
    this.currentMode = mode;
    this.showSlashMenu = false;
    this.inputText = '';
  }

  async sendMessage(): Promise<void> {
    const text = this.inputText.trim();
    if (!text || this.isLoading) return;

    if (this.currentMode === 'name' && text.length > 300) {
      this.messages.push({
        role: 'ai',
        text: 'This message is too long for Name Generation mode. Please switch to **/summarize** to handle large texts!',
      });
      this.inputText = '';
      return;
    }

    this.inputText = '';
    this.creditsService.useCredits(1);
    this.messages.push({ role: 'user', text });
    this.isLoading = true;
    this.scrollToBottom();

    try {
      const data = await this.apiService.generateNames(text, this.currentMode).toPromise();
      const aiText = data?.choices?.[0]?.message?.content || 'Error: Unexpected response from assistant.';
      this.messages.push({ role: 'ai', text: aiText });
    } catch (err: any) {
      this.messages.push({
        role: 'ai',
        text: 'Error: Could not connect to server. ' + (err?.error?.error || ''),
      });
    } finally {
      this.isLoading = false;
      this.scrollToBottom();
    }
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  hideSlashMenu(): void {
    setTimeout(() => (this.showSlashMenu = false), 200);
  }

  copyCardContent(event: MouseEvent): void {
    const btn = event.currentTarget as HTMLElement;
    const card = btn.closest('.response-card');
    if (card) {
      const body = card.querySelector('.card-body');
      if (body) {
        navigator.clipboard.writeText(body.textContent || '');
      }
    }
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      if (this.chatContainer) {
        this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
      }
    }, 50);
  }
}
