import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { Observable, Subject, combineLatest } from 'rxjs';
import { takeUntil, startWith, map } from 'rxjs/operators';
import { TaskService } from '../../services/task.service';
import { Task, Priority, Status, TaskFilter } from '../../models/task.model';
import { TaskFormComponent } from '../task-form/task-form.component';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatChipsModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    TaskFormComponent
  ],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})

export class TaskListComponent implements OnInit, OnDestroy {
  tasks$: Observable<Task[]>;
  filteredTasks$!: Observable<Task[]>;
  filterForm: FormGroup;
  isFormOpen = false;
  selectedTask: Task | null = null;
  
  Priority = Priority;
  Status = Status;
  
  private destroy$ = new Subject<void>();

  constructor(
    private taskService: TaskService,
    private fb: FormBuilder
  ) {
    this.tasks$ = this.taskService.getTasks();
    this.filterForm = this.fb.group({
      priority: [''],
      status: ['']
    });
  }

  ngOnInit(): void {
    this.filteredTasks$ = combineLatest([
      this.tasks$,
      this.filterForm.valueChanges.pipe(startWith(this.filterForm.value))
    ]).pipe(
      map(([tasks, filter]) => this.applyFilters(tasks, filter)),
      takeUntil(this.destroy$)
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private applyFilters(tasks: Task[], filter: TaskFilter): Task[] {
    return tasks.filter(task => {
      const priorityMatch = !filter.priority || task.priority === filter.priority;
      const statusMatch = !filter.status || task.status === filter.status;
      return priorityMatch && statusMatch;
    });
  }

  trackByTaskId(index: number, task: Task): string {
    return task.id;
  }

  openTaskForm(): void {
    this.selectedTask = null;
    this.isFormOpen = true;
  }

  editTask(task: Task): void {
    this.selectedTask = task;
    this.isFormOpen = true;
  }

  closeTaskForm(): void {
    this.isFormOpen = false;
    this.selectedTask = null;
  }

  onTaskSaved(task: Task): void {
    this.closeTaskForm();
  }

  deleteTask(id: string): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(id);
    }
  }

  getPriorityLabel(priority: Priority): string {
    switch (priority) {
      case Priority.LOW: return 'Low';
      case Priority.MEDIUM: return 'Medium';
      case Priority.HIGH: return 'High';
      default: return priority;
    }
  }

  getStatusLabel(status: Status): string {
    switch (status) {
      case Status.PENDING: return 'Pending';
      case Status.IN_PROGRESS: return 'In Progress';
      case Status.COMPLETED: return 'Completed';
      default: return status;
    }
  }

  getPriorityIcon(priority: Priority): string {
    switch (priority) {
      case Priority.LOW: return 'keyboard_arrow_down';
      case Priority.MEDIUM: return 'remove';
      case Priority.HIGH: return 'keyboard_arrow_up';
      default: return 'help';
    }
  }

  getStatusIcon(status: Status): string {
    switch (status) {
      case Status.PENDING: return 'schedule';
      case Status.IN_PROGRESS: return 'hourglass_empty';
      case Status.COMPLETED: return 'check_circle';
      default: return 'help';
    }
  }
}