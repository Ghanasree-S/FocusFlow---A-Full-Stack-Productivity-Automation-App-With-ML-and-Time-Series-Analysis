import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Check, Flag, Calendar, Trash2, Edit2, Volume2, VolumeX, Maximize, List, Filter, X } from 'lucide-react';
import { Card, Button, Badge } from '../components/UI';
import { MOCK_TASKS } from '../constants';
import { Task, TaskStatus, Priority } from '../types';

// --- TASK MANAGER PAGE ---
export const TaskManager: React.FC = () => {
  const [filter, setFilter] = useState<'All' | 'Todo' | 'InProgress' | 'Completed'>('All');
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    category: 'Work',
    dueDate: '',
    priority: Priority.MEDIUM
  });

  const filteredTasks = tasks.filter(t => {
    if (filter === 'All') return true;
    if (filter === 'Todo') return t.status === TaskStatus.TODO;
    if (filter === 'InProgress') return t.status === TaskStatus.IN_PROGRESS;
    if (filter === 'Completed') return t.status === TaskStatus.COMPLETED;
    return true;
  });

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title) return;

    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      category: newTask.category,
      dueDate: newTask.dueDate || new Date().toISOString().split('T')[0],
      priority: newTask.priority,
      status: TaskStatus.TODO,
      progress: 0
    };

    setTasks([task, ...tasks]);
    setIsModalOpen(false);
    setNewTask({ title: '', category: 'Work', dueDate: '', priority: Priority.MEDIUM });
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const toggleTaskStatus = (id: string) => {
    setTasks(tasks.map(t => {
      if (t.id === id) {
        return {
          ...t,
          status: t.status === TaskStatus.COMPLETED ? TaskStatus.TODO : TaskStatus.COMPLETED,
          progress: t.status === TaskStatus.COMPLETED ? 0 : 100
        };
      }
      return t;
    }));
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.COMPLETED: return 'green';
      case TaskStatus.IN_PROGRESS: return 'blue';
      default: return 'gray';
    }
  };

  const getPriorityColor = (p: string) => {
    if (p === 'High') return 'red';
    if (p === 'Medium') return 'yellow';
    return 'green';
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Task Manager</h1>
        <Button onClick={() => setIsModalOpen(true)}>+ Add New Task</Button>
      </div>

      <div className="flex space-x-1 bg-white dark:bg-slate-800 p-1 rounded-lg border border-gray-200 dark:border-slate-700 w-fit">
        {['All', 'Todo', 'InProgress', 'Completed'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f as any)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              filter === f 
              ? 'bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm' 
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            {f.replace(/([A-Z])/g, ' $1').trim()}
          </button>
        ))}
      </div>

      <div className="grid gap-4">
        {filteredTasks.length === 0 && (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <p>No tasks found. Add a new task to get started!</p>
          </div>
        )}
        {filteredTasks.map(task => (
          <Card key={task.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 gap-4 hover:shadow-md transition-shadow">
            <div className="flex items-start space-x-4">
              <button 
                onClick={() => toggleTaskStatus(task.id)}
                className={`mt-1 w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                task.status === TaskStatus.COMPLETED 
                ? 'bg-green-500 border-green-500 text-white' 
                : 'border-gray-300 dark:border-slate-600 hover:border-primary'
              }`}>
                {task.status === TaskStatus.COMPLETED && <Check size={14} />}
              </button>
              <div>
                <h3 className={`font-medium text-gray-900 dark:text-white ${task.status === TaskStatus.COMPLETED ? 'line-through text-gray-400' : ''}`}>
                  {task.title}
                </h3>
                <div className="flex items-center space-x-3 mt-1 text-xs text-gray-500 dark:text-gray-400">
                  <span className="flex items-center"><Calendar size={12} className="mr-1"/> {task.dueDate}</span>
                  <span className="flex items-center"><Flag size={12} className={`mr-1 text-${getPriorityColor(task.priority)}-500`}/> {task.priority}</span>
                  <span className="flex items-center bg-gray-100 dark:bg-slate-700 px-2 py-0.5 rounded-full">{task.category}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 w-full sm:w-auto justify-between sm:justify-end">
              <Badge color={getStatusColor(task.status)}>{task.status}</Badge>
              <div className="flex space-x-2">
                <button className="p-2 text-gray-400 hover:text-primary transition-colors"><Edit2 size={16}/></button>
                <button 
                  onClick={() => handleDeleteTask(task.id)}
                  className="p-2 text-gray-400 hover:text-danger transition-colors"
                >
                  <Trash2 size={16}/>
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Add Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center p-4 border-b border-gray-100 dark:border-slate-700">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">Add New Task</h3>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddTask} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Task Title</label>
                <input 
                  type="text" 
                  required
                  value={newTask.title}
                  onChange={e => setNewTask({...newTask, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-slate-700 dark:text-white placeholder-gray-400"
                  placeholder="e.g. Finish quarterly report"
                  autoFocus
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                  <select 
                    value={newTask.category}
                    onChange={e => setNewTask({...newTask, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-slate-700 dark:text-white"
                  >
                    <option>Work</option>
                    <option>Personal</option>
                    <option>Learning</option>
                    <option>Health</option>
                    <option>Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Due Date</label>
                  <input 
                    type="date" 
                    value={newTask.dueDate}
                    onChange={e => setNewTask({...newTask, dueDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-slate-700 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Priority</label>
                <div className="flex space-x-2">
                  {[Priority.LOW, Priority.MEDIUM, Priority.HIGH].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setNewTask({...newTask, priority: p})}
                      className={`flex-1 py-2 text-sm font-medium rounded-lg border transition-all ${
                        newTask.priority === p 
                          ? 'bg-primary/10 border-primary text-primary' 
                          : 'border-gray-300 dark:border-slate-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex space-x-3">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit" className="flex-1">Create Task</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// --- FOCUS MODE PAGE ---
export const FocusMode: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  
  const totalTime = 25 * 60;
  const progress = ((totalTime - timeLeft) / totalTime) * 100;
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(25 * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-full flex flex-col items-center justify-center max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Deep Focus Session</h1>
        <p className="text-gray-500 dark:text-gray-400">Block out the noise. Focus on what matters.</p>
      </div>

      <div className="relative mb-12">
        {/* SVG Circle Progress */}
        <svg className="transform -rotate-90 w-80 h-80">
          <circle
            cx="160"
            cy="160"
            r={radius}
            stroke="currentColor"
            strokeWidth="12"
            fill="transparent"
            className="text-gray-200 dark:text-slate-700"
          />
          <circle
            cx="160"
            cy="160"
            r={radius}
            stroke="currentColor"
            strokeWidth="12"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="text-primary transition-all duration-1000 ease-linear"
          />
        </svg>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
          <div className="text-5xl font-mono font-bold text-gray-900 dark:text-white mb-2">
            {formatTime(timeLeft)}
          </div>
          <span className="text-sm text-gray-500 uppercase tracking-widest">Minutes Left</span>
        </div>
      </div>

      <div className="flex items-center space-x-6 mb-12">
        <button 
          onClick={toggleTimer}
          className="w-16 h-16 rounded-full bg-primary hover:bg-sky-600 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105"
        >
          {isActive ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
        </button>
        <button 
          onClick={resetTimer}
          className="w-12 h-12 rounded-full bg-gray-200 dark:bg-slate-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-slate-600 flex items-center justify-center transition-colors"
        >
          <RotateCcw size={24} />
        </button>
      </div>

      <Card className="w-full max-w-md">
        <div className="flex items-center justify-between p-2">
          <div className="flex items-center space-x-3">
             <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400">
               {notificationsEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
             </div>
             <div>
               <h3 className="font-medium text-gray-900 dark:text-white">Block Notifications</h3>
               <p className="text-xs text-gray-500">Silence apps during focus</p>
             </div>
          </div>
          <button 
            onClick={() => setNotificationsEnabled(!notificationsEnabled)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
              notificationsEnabled ? 'bg-primary' : 'bg-gray-200 dark:bg-slate-700'
            }`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              notificationsEnabled ? 'translate-x-6' : 'translate-x-1'
            }`} />
          </button>
        </div>
      </Card>
    </div>
  );
};