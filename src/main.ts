import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatNativeDateModule } from '@angular/material/core';
import { TaskListComponent } from './app/components/task-list/task-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TaskListComponent],
  template: `
    <div class="app-container">
      <app-task-list></app-task-list>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      background-color: #f5f5f5;
    }
  `]
})
export class App {
  name = 'Task Manager';
}

bootstrapApplication(App, {
  providers: [
    importProvidersFrom(BrowserAnimationsModule),
    importProvidersFrom(MatNativeDateModule)
  ]
});