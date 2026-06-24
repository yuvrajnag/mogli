import { Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ChatComponent } from './pages/chat/chat.component';
import { ImageGenComponent } from './pages/image-gen/image-gen.component';
import { HistoryComponent } from './pages/history/history.component';
import { ProjectsComponent } from './pages/projects/projects.component';
import { PlaceholderComponent } from './pages/placeholder/placeholder.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'chat', component: ChatComponent },
  { path: 'image-gen', component: ImageGenComponent },
  { path: 'history', component: HistoryComponent },
  { path: 'projects', component: ProjectsComponent },
  { path: 'placeholder', component: PlaceholderComponent },
  { path: '**', redirectTo: '' },
];
