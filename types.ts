export enum TaskStatus {
  TODO = 'Todo',
  IN_PROGRESS = 'In Progress',
  COMPLETED = 'Completed'
}

export enum Priority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High'
}

export enum ProductivityStyle {
  BALANCED = 'Balanced',
  HIGH_FOCUS = 'High-Focus',
  FLEXIBLE = 'Flexible'
}

export interface Task {
  id: string;
  title: string;
  category: string;
  dueDate: string;
  priority: Priority;
  status: TaskStatus;
  progress: number; // 0-100
}

export interface User {
  name: string;
  email: string;
  avatar: string;
  style: ProductivityStyle;
  dailyGoalHours: number;
}

export interface TimeSeriesPoint {
  time: string;
  focusScore: number;
  distractionLevel: number;
  predicted?: number;
}

export interface DailyStat {
  day: string;
  focusHours: number;
  tasksCompleted: number;
  efficiency: number;
}

export interface Insight {
  id: string;
  type: 'positive' | 'warning' | 'info';
  message: string;
  timestamp: string;
}