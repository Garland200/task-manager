import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TaskFormComponent } from './task-form.component';
import { TaskService } from '../../services/task.service';
import { Priority, Status } from '../../models/task.model';

describe('TaskFormComponent', () => {
  let component: TaskFormComponent;
  let fixture: ComponentFixture<TaskFormComponent>;
  let taskService: jasmine.SpyObj<TaskService>;

  const mockTask = {
    id: '1',
    title: 'Test Task',
    description: 'Test Description',
    dueDate: new Date('2024-12-31'),
    priority: Priority.HIGH,
    status: Status.PENDING,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  beforeEach(async () => {
    const taskServiceSpy = jasmine.createSpyObj('TaskService', [
      'createTask',
      'updateTask'
    ]);

    await TestBed.configureTestingModule({
      imports: [TaskFormComponent, BrowserAnimationsModule],
      providers: [
        { provide: TaskService, useValue: taskServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskFormComponent);
    component = fixture.componentInstance;
    taskService = TestBed.inject(TaskService) as jasmine.SpyObj<TaskService>;
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values when creating new task', () => {
    component.isOpen = true;
    component.task = null;
    component.ngOnChanges({
      isOpen: { currentValue: true, previousValue: false, firstChange: false, isFirstChange: () => false }
    });

    expect(component.taskForm.value.priority).toBe(Priority.MEDIUM);
    expect(component.taskForm.value.status).toBe(Status.PENDING);
  });

  it('should populate form with task data when editing', () => {
    component.task = mockTask;
    component.ngOnChanges({
      task: { currentValue: mockTask, previousValue: null, firstChange: false, isFirstChange: () => false }
    });

    expect(component.taskForm.value.title).toBe(mockTask.title);
    expect(component.taskForm.value.description).toBe(mockTask.description);
    expect(component.taskForm.value.priority).toBe(mockTask.priority);
    expect(component.taskForm.value.status).toBe(mockTask.status);
  });

  it('should validate required fields', () => {
    component.taskForm.patchValue({
      title: '',
      description: '',
      dueDate: '',
      priority: '',
      status: ''
    });

    expect(component.taskForm.valid).toBe(false);
    expect(component.taskForm.get('title')?.errors?.['required']).toBeTruthy();
    expect(component.taskForm.get('description')?.errors?.['required']).toBeTruthy();
    expect(component.taskForm.get('dueDate')?.errors?.['required']).toBeTruthy();
    expect(component.taskForm.get('priority')?.errors?.['required']).toBeTruthy();
    expect(component.taskForm.get('status')?.errors?.['required']).toBeTruthy();
  });

  it('should create new task when form is valid and no existing task', () => {
    const formData = {
      title: 'New Task',
      description: 'New Description',
      dueDate: new Date(),
      priority: Priority.HIGH,
      status: Status.PENDING
    };

    taskService.createTask.and.returnValue({ ...formData, id: '1', createdAt: new Date(), updatedAt: new Date() });
    
    component.task = null;
    component.taskForm.patchValue(formData);
    component.onSubmit();

    expect(taskService.createTask).toHaveBeenCalledWith(formData);
  });

  it('should update existing task when form is valid and task exists', () => {
    const formData = {
      title: 'Updated Task',
      description: 'Updated Description',
      dueDate: new Date(),
      priority: Priority.LOW,
      status: Status.COMPLETED
    };

    taskService.updateTask.and.returnValue({ ...mockTask, ...formData });
    
    component.task = mockTask;
    component.taskForm.patchValue(formData);
    component.onSubmit();

    expect(taskService.updateTask).toHaveBeenCalledWith(mockTask.id, formData);
  });

  it('should emit close event when close button is clicked', () => {
    spyOn(component.close, 'emit');
    
    component.onClose();
    
    expect(component.close.emit).toHaveBeenCalled();
  });

  it('should emit save event when task is saved', () => {
    spyOn(component.save, 'emit');
    const newTask = { ...mockTask, id: '2' };
    
    taskService.createTask.and.returnValue(newTask);
    
    component.task = null;
    component.taskForm.patchValue({
      title: 'New Task',
      description: 'New Description',
      dueDate: new Date(),
      priority: Priority.HIGH,
      status: Status.PENDING
    });
    component.onSubmit();

    expect(component.save.emit).toHaveBeenCalledWith(newTask);
  });
});