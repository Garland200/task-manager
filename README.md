# Task Manager Application

A modern, responsive task management application built with Angular 20 and Material Design.

## Features

- **Complete Task Management**: Create, read, update, and delete tasks with ease
- **Smart Filtering**: Filter tasks by priority (Low, Medium, High) and status (Pending, In Progress, Completed)
- **Local Storage**: All tasks are persisted locally in your browser
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Material Design**: Clean, modern interface following Google's Material Design principles
- **Form Validation**: Comprehensive validation for all task fields
- **Unit Testing**: Extensive test coverage for all components and services

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── task-list/          # Main task list component
│   │   └── task-form/          # Task creation/editing form
│   ├── models/
│   │   └── task.model.ts       # Task interfaces and enums
│   ├── services/
│   │   └── task.service.ts     # Task data management service
│   └── *.spec.ts              # Unit test files
├── global_styles.css          # Global application styles
├── index.html                 # Main HTML file
└── main.ts                    # Application bootstrap
```

## Technology Stack

- **Angular 20**: Modern web framework
- **Angular Material**: UI component library
- **RxJS**: Reactive programming library
- **TypeScript**: Type-safe JavaScript
- **Jasmine & Karma**: Testing framework

## Setup Instructions

### Prerequisites

- Node.js (version 18 or higher)
- npm package manager

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd task-manager
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open your browser and navigate to `http://localhost:4200`

## Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run unit tests
- `npm run test:coverage` - Run tests with coverage report

## Usage

### Creating a Task

1. Click the "Add Task" button
2. Fill in the task details:
   - **Title**: Brief description of the task
   - **Description**: Detailed task information
   - **Due Date**: When the task should be completed
   - **Priority**: Low, Medium, or High
   - **Status**: Pending, In Progress, or Completed
3. Click "Create Task" to save

### Editing a Task

1. Click the "Edit" button on any task card
2. Modify the task details in the form
3. Click "Update Task" to save changes

### Deleting a Task

1. Click the "Delete" button on any task card
2. Confirm the deletion in the dialog

### Filtering Tasks

Use the dropdown filters at the top of the page to filter tasks by:
- **Priority**: Show only tasks with specific priority levels
- **Status**: Show only tasks with specific status values

## Data Storage

Tasks are stored in the browser's localStorage, ensuring your data persists between sessions. The data is automatically saved whenever you create, update, or delete tasks.

## Testing

The application includes comprehensive unit tests for all components and services. Run the tests with:

```bash
npm test
```

For coverage reports:

```bash
npm run test:coverage
```

## Responsive Design

The application is fully responsive and optimized for:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Deployment

To deploy the application:

1. Build the production version:
   ```bash
   npm run build
   ```

2. Deploy the `dist/demo` folder to your hosting provider

The application can be deployed to any static hosting service like:
- Netlify
- Vercel
- GitHub Pages
- Firebase Hosting
- AWS S3

## Future Enhancements

- Task categories and tags
- Due date notifications
- Task search functionality
- Drag and drop task reordering
- Export tasks to various formats
- Task sharing and collaboration
- Dark mode support