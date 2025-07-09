import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Task, Priority, Status, TaskFilter } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly STORAGE_KEY = 'tasks';
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  public tasks$ = this.tasksSubject.asObservable();

  constructor() {
    this.loadTasks();
  }

  private loadTasks(): void {
    const tasksData = localStorage.getItem(this.STORAGE_KEY);
    if (tasksData) {
      try {
        const tasks = JSON.parse(tasksData).map((task: any) => ({
          ...task,
          dueDate: new Date(task.dueDate),
          createdAt: new Date(task.createdAt),
          updatedAt: new Date(task.updatedAt)
        }));
        this.tasksSubject.next(tasks);
      } catch (error) {
        console.error('Error loading tasks from localStorage:', error);
        this.tasksSubject.next([]);
      }
    }
  }

  private saveTasks(tasks: Task[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(tasks));
      this.tasksSubject.next(tasks);
    } catch (error) {
      console.error('Error saving tasks to localStorage:', error);
    }
  }

  getTasks(): Observable<Task[]> {
    return this.tasks$;
  }

  getTask(id: string): Task | undefined {
    return this.tasksSubject.value.find(task => task.id === id);
  }

  createTask(taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Task {
    const newTask: Task = {
      ...taskData,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const tasks = [...this.tasksSubject.value, newTask];
    this.saveTasks(tasks);
    return newTask;
  }

  updateTask(id: string, updates: Partial<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>): Task | null {
    const tasks = this.tasksSubject.value;
    const taskIndex = tasks.findIndex(task => task.id === id);
    
    if (taskIndex === -1) {
      return null;
    }

    const updatedTask = {
      ...tasks[taskIndex],
      ...updates,
      updatedAt: new Date()
    };

    tasks[taskIndex] = updatedTask;
    this.saveTasks(tasks);
    return updatedTask;
  }

  deleteTask(id: string): boolean {
    const tasks = this.tasksSubject.value;
    const filteredTasks = tasks.filter(task => task.id !== id);
    
    if (filteredTasks.length < tasks.length) {
      this.saveTasks(filteredTasks);
      return true;
    }
    return false;
  }

  filterTasks(filter: TaskFilter): Observable<Task[]> {
    return new Observable(observer => {
      this.tasks$.subscribe(tasks => {
        let filteredTasks = tasks;

        if (filter.priority) {
          filteredTasks = filteredTasks.filter(task => task.priority === filter.priority);
        }

        if (filter.status) {
          filteredTasks = filteredTasks.filter(task => task.status === filter.status);
        }

        observer.next(filteredTasks);
      });
    });
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}