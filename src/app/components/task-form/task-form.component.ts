import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TaskService } from '../../services/task.service';
import { Task, Priority, Status } from '../../models/task.model';


@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css'],
  animations: [
  ]
})
export class TaskFormComponent implements OnChanges {
  @Input() isOpen = false;
  @Input() task: Task | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<Task>();

  taskForm: FormGroup;
  isSubmitting = false;
  Priority = Priority;
  Status = Status;

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService
  ) {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.maxLength(500)]],
      dueDate: ['', [Validators.required]],
      priority: ['', [Validators.required]],
      status: ['', [Validators.required]]
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['task'] && this.task) {
      this.taskForm.patchValue({
        title: this.task.title,
        description: this.task.description,
        dueDate: this.task.dueDate,
        priority: this.task.priority,
        status: this.task.status
      });
    } else if (changes['isOpen'] && this.isOpen && !this.task) {
      this.taskForm.reset();
      this.taskForm.patchValue({
        priority: Priority.MEDIUM,
        status: Status.PENDING
      });
    }
  }

  async onSubmit(): Promise<void> {
    if (this.taskForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const formValue = this.taskForm.value;
        
        if (this.task) {
          const updatedTask = this.taskService.updateTask(this.task.id, formValue);
          if (updatedTask) {
            this.save.emit(updatedTask);
          }
        } else {
          const newTask = this.taskService.createTask(formValue);
          this.save.emit(newTask);
        }
      } catch (error) {
        console.error('Error saving task:', error);
        // Handle error appropriately
      } finally {
        this.isSubmitting = false;
      }
    }
  }

  onClose(): void {
    if (!this.isSubmitting) {
      this.close.emit();
    }
  }

  onOverlayClick(event: Event): void {
    if (event.target === event.currentTarget && !this.isSubmitting) {
      this.onClose();
    }
  }
}