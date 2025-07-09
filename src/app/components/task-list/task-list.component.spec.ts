import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TaskListComponent } from './task-list.component';
import { TaskService } from '../../services/task.service';
import { Priority, Status } from '../../models/task.model';
import { of } from 'rxjs';

describe('TaskListComponent', () => {
  let component: TaskListComponent;
  let fixture: ComponentFixture<TaskListComponent>;
  let taskService: jasmine.SpyObj<TaskService>;

  const mockTasks = [
    {
      id: '1',
      title: 'Test Task 1',
      description: 'Description 1',
      dueDate: new Date(),
      priority: Priority.HIGH,
      status: Status.PENDING,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '2',
      title: 'Test Task 2',
      description: 'Description 2',
      dueDate: new Date(),
      priority: Priority.LOW,
      status: Status.COMPLETED,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  beforeEach(async () => {
    const taskServiceSpy = jasmine.createSpyObj('TaskService', [
      'getTasks',
      'createTask',
      'updateTask',
      'deleteTask'
    ]);

    await TestBed.configureTestingModule({
      imports: [TaskListComponent, BrowserAnimationsModule],
      providers: [
        { provide: TaskService, useValue: taskServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskListComponent);
    component = fixture.componentInstance;
    taskService = TestBed.inject(TaskService) as jasmine.SpyObj<TaskService>;
    
    taskService.getTasks.and.returnValue(of(mockTasks));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display tasks', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('Test Task 1');
    expect(compiled.textContent).toContain('Test Task 2');
  });

  it('should open task form when add button is clicked', () => {
    const addButton = fixture.nativeElement.querySelector('button[color="primary"]');
    addButton.click();
    
    expect(component.isFormOpen).toBe(true);
    expect(component.selectedTask).toBeNull();
  });

  it('should delete task when delete button is clicked', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    
    component.deleteTask('1');
    
    expect(taskService.deleteTask).toHaveBeenCalledWith('1');
  });

  it('should filter tasks by priority', () => {
    component.filterForm.patchValue({ priority: Priority.HIGH });
    
    component.filteredTasks$.subscribe(tasks => {
      expect(tasks.length).toBe(1);
      expect(tasks[0].priority).toBe(Priority.HIGH);
    });
  });

  it('should filter tasks by status', () => {
    component.filterForm.patchValue({ status: Status.COMPLETED });
    
    component.filteredTasks$.subscribe(tasks => {
      expect(tasks.length).toBe(1);
      expect(tasks[0].status).toBe(Status.COMPLETED);
    });
  });

  it('should get correct priority label', () => {
    expect(component.getPriorityLabel(Priority.HIGH)).toBe('High');
    expect(component.getPriorityLabel(Priority.MEDIUM)).toBe('Medium');
    expect(component.getPriorityLabel(Priority.LOW)).toBe('Low');
  });

  it('should get correct status label', () => {
    expect(component.getStatusLabel(Status.PENDING)).toBe('Pending');
    expect(component.getStatusLabel(Status.IN_PROGRESS)).toBe('In Progress');
    expect(component.getStatusLabel(Status.COMPLETED)).toBe('Completed');
  });
});