import { TestBed } from '@angular/core/testing';
import { TaskService } from './task.service';
import { Task, Priority, Status } from '../models/task.model';

describe('TaskService', () => {
  let service: TaskService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskService);
    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('createTask', () => {
    it('should create a new task', () => {
      const taskData = {
        title: 'Test Task',
        description: 'Test Description',
        dueDate: new Date(),
        priority: Priority.HIGH,
        status: Status.PENDING
      };

      const createdTask = service.createTask(taskData);

      expect(createdTask).toBeTruthy();
      expect(createdTask.id).toBeTruthy();
      expect(createdTask.title).toBe(taskData.title);
      expect(createdTask.description).toBe(taskData.description);
      expect(createdTask.priority).toBe(taskData.priority);
      expect(createdTask.status).toBe(taskData.status);
      expect(createdTask.createdAt).toBeTruthy();
      expect(createdTask.updatedAt).toBeTruthy();
    });

    it('should persist task to localStorage', () => {
      const taskData = {
        title: 'Test Task',
        description: 'Test Description',
        dueDate: new Date(),
        priority: Priority.MEDIUM,
        status: Status.PENDING
      };

      service.createTask(taskData);

      const storedTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
      expect(storedTasks.length).toBe(1);
      expect(storedTasks[0].title).toBe(taskData.title);
    });
  });

  describe('updateTask', () => {
    it('should update an existing task', () => {
      const taskData = {
        title: 'Original Title',
        description: 'Original Description',
        dueDate: new Date(),
        priority: Priority.LOW,
        status: Status.PENDING
      };

      const createdTask = service.createTask(taskData);
      const updates = {
        title: 'Updated Title',
        status: Status.COMPLETED
      };

      const updatedTask = service.updateTask(createdTask.id, updates);

      expect(updatedTask).toBeTruthy();
      expect(updatedTask!.title).toBe(updates.title);
      expect(updatedTask!.status).toBe(updates.status);
      expect(updatedTask!.description).toBe(taskData.description);
    });

    it('should return null for non-existent task', () => {
      const result = service.updateTask('non-existent-id', { title: 'New Title' });
      expect(result).toBeNull();
    });
  });

  describe('deleteTask', () => {
    it('should delete an existing task', () => {
      const taskData = {
        title: 'Task to Delete',
        description: 'Description',
        dueDate: new Date(),
        priority: Priority.HIGH,
        status: Status.PENDING
      };

      const createdTask = service.createTask(taskData);
      const result = service.deleteTask(createdTask.id);

      expect(result).toBe(true);
      expect(service.getTask(createdTask.id)).toBeUndefined();
    });

    it('should return false for non-existent task', () => {
      const result = service.deleteTask('non-existent-id');
      expect(result).toBe(false);
    });
  });

  describe('getTask', () => {
    it('should retrieve a task by id', () => {
      const taskData = {
        title: 'Test Task',
        description: 'Test Description',
        dueDate: new Date(),
        priority: Priority.MEDIUM,
        status: Status.IN_PROGRESS
      };

      const createdTask = service.createTask(taskData);
      const retrievedTask = service.getTask(createdTask.id);

      expect(retrievedTask).toBeTruthy();
      expect(retrievedTask!.id).toBe(createdTask.id);
      expect(retrievedTask!.title).toBe(taskData.title);
    });

    it('should return undefined for non-existent task', () => {
      const result = service.getTask('non-existent-id');
      expect(result).toBeUndefined();
    });
  });

  describe('filterTasks', () => {
    beforeEach(() => {
      // Create test tasks
      service.createTask({
        title: 'High Priority Task',
        description: 'Description',
        dueDate: new Date(),
        priority: Priority.HIGH,
        status: Status.PENDING
      });

      service.createTask({
        title: 'Medium Priority Task',
        description: 'Description',
        dueDate: new Date(),
        priority: Priority.MEDIUM,
        status: Status.COMPLETED
      });

      service.createTask({
        title: 'Low Priority Task',
        description: 'Description',
        dueDate: new Date(),
        priority: Priority.LOW,
        status: Status.IN_PROGRESS
      });
    });

    it('should filter tasks by priority', (done) => {
      service.filterTasks({ priority: Priority.HIGH }).subscribe(tasks => {
        expect(tasks.length).toBe(1);
        expect(tasks[0].priority).toBe(Priority.HIGH);
        done();
      });
    });

    it('should filter tasks by status', (done) => {
      service.filterTasks({ status: Status.COMPLETED }).subscribe(tasks => {
        expect(tasks.length).toBe(1);
        expect(tasks[0].status).toBe(Status.COMPLETED);
        done();
      });
    });

    it('should filter tasks by both priority and status', (done) => {
      service.filterTasks({ 
        priority: Priority.MEDIUM, 
        status: Status.COMPLETED 
      }).subscribe(tasks => {
        expect(tasks.length).toBe(1);
        expect(tasks[0].priority).toBe(Priority.MEDIUM);
        expect(tasks[0].status).toBe(Status.COMPLETED);
        done();
      });
    });

    it('should return all tasks when no filter is applied', (done) => {
      service.filterTasks({}).subscribe(tasks => {
        expect(tasks.length).toBe(3);
        done();
      });
    });
  });
});