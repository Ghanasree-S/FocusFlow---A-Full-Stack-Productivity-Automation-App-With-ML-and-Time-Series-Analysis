import { Task, TaskStatus, Priority, TimeSeriesPoint, DailyStat, Insight, ProductivityStyle } from './types';

export const MOCK_USER = {
  name: "Alex Johnson",
  email: "alex.j@example.com",
  avatar: "https://picsum.photos/200",
  style: ProductivityStyle.BALANCED,
  dailyGoalHours: 6
};

export const MOCK_TASKS: Task[] = [
  { id: '1', title: 'Complete ML Model Report', category: 'Work', dueDate: '2023-10-25', priority: Priority.HIGH, status: TaskStatus.IN_PROGRESS, progress: 65 },
  { id: '2', title: 'Review Team PRs', category: 'Development', dueDate: '2023-10-25', priority: Priority.MEDIUM, status: TaskStatus.TODO, progress: 0 },
  { id: '3', title: 'Update Client Documentation', category: 'Admin', dueDate: '2023-10-26', priority: Priority.LOW, status: TaskStatus.TODO, progress: 0 },
  { id: '4', title: 'Weekly Sync Meeting', category: 'Work', dueDate: '2023-10-24', priority: Priority.MEDIUM, status: TaskStatus.COMPLETED, progress: 100 },
];

export const HOURLY_DATA: TimeSeriesPoint[] = [
  { time: '08:00', focusScore: 40, distractionLevel: 10, predicted: 45 },
  { time: '09:00', focusScore: 85, distractionLevel: 5, predicted: 80 },
  { time: '10:00', focusScore: 90, distractionLevel: 2, predicted: 85 },
  { time: '11:00', focusScore: 60, distractionLevel: 20, predicted: 65 },
  { time: '12:00', focusScore: 30, distractionLevel: 10, predicted: 40 },
  { time: '13:00', focusScore: 75, distractionLevel: 15, predicted: 70 },
  { time: '14:00', focusScore: 88, distractionLevel: 5, predicted: 85 },
  { time: '15:00', focusScore: 80, distractionLevel: 10, predicted: 75 },
  { time: '16:00', focusScore: 50, distractionLevel: 30, predicted: 55 },
];

export const WEEKLY_STATS: DailyStat[] = [
  { day: 'Mon', focusHours: 5.5, tasksCompleted: 4, efficiency: 85 },
  { day: 'Tue', focusHours: 6.2, tasksCompleted: 6, efficiency: 92 },
  { day: 'Wed', focusHours: 4.8, tasksCompleted: 3, efficiency: 78 },
  { day: 'Thu', focusHours: 7.0, tasksCompleted: 8, efficiency: 95 },
  { day: 'Fri', focusHours: 5.0, tasksCompleted: 5, efficiency: 88 },
  { day: 'Sat', focusHours: 2.5, tasksCompleted: 1, efficiency: 60 },
  { day: 'Sun', focusHours: 1.0, tasksCompleted: 0, efficiency: 50 },
];

export const FORECAST_DATA = [
  { day: 'Tomorrow', expectedWorkload: 'High', completionProb: 88 },
  { day: 'Day 2', expectedWorkload: 'Medium', completionProb: 92 },
  { day: 'Day 3', expectedWorkload: 'High', completionProb: 75 },
  { day: 'Day 4', expectedWorkload: 'Low', completionProb: 95 },
];

export const MOCK_INSIGHTS: Insight[] = [
  { id: '1', type: 'positive', message: 'You are most productive between 9 AM and 11 AM.', timestamp: '2h ago' },
  { id: '2', type: 'warning', message: 'High distraction detected: Social Media usage spiked at 4 PM.', timestamp: '5h ago' },
  { id: '3', type: 'info', message: 'Predicted workload for tomorrow is unusually high. Plan accordingly.', timestamp: '1d ago' },
];