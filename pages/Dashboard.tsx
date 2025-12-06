import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { PlayCircle, Plus, AlertCircle, TrendingUp, CheckCircle, Clock } from 'lucide-react';
import { Card, StatCard, Button } from '../components/UI';
import { Link } from 'react-router-dom';

// 🔥 IMPORT BACKEND API CALLS
import { getHourlyTrend, getDashboardSummary, getAIAlerts } from "../api/dashboard";
import { getTodayTasks } from "../api/tasks";

export const Dashboard: React.FC = () => {

  // 🔥 STATE REPLACING MOCK DATA
  const [hourlyData, setHourlyData] = useState<any[]>([]);
  const [summary, setSummary] = useState<any | null>(null);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const hourly = await getHourlyTrend();           // 🔥 /analytics/hourly
      const sum    = await getDashboardSummary();      // 🔥 /analytics/summary
      const alertD = await getAIAlerts();              // 🔥 /analytics/alerts
      const today  = await getTodayTasks();            // 🔥 /tasks/today

      setHourlyData(hourly);
      setSummary(sum);
      setAlerts(alertD);
      setTasks(today);

    } catch (err) {
      console.error("Dashboard error:", err);
    }
  };


  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Good Morning, {summary?.username || "User"} 👋
          </h1>
          <p className="text-gray-500 dark:text-gray-400">Here's your productivity forecast for today.</p>
        </div>

        <div className="flex space-x-3">
          <Link to="/tasks">
            <Button variant="outline">
              <Plus size={16} className="mr-2"/> Add Task
            </Button>
          </Link>
          <Link to="/focus">
            <Button>
              <PlayCircle size={16} className="mr-2"/> Start Focus
            </Button>
          </Link>
        </div>
      </div>




      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Focus Score"
          value={summary ? `${summary.focusScore}/100` : "--"}
          trend={summary ? summary.focusTrend : ""}
          trendUp={summary ? summary.focusTrend.startsWith("+") : true}
          icon={<TrendingUp size={24}/>}
        />

        <StatCard
          title="Tasks Completed"
          value={summary ? summary.tasksCompleted : "--"}
          trend="On track"
          trendUp={true}
          icon={<CheckCircle size={24}/>}
        />

        <StatCard
          title="Distraction Time"
          value={summary ? `${summary.distractionMinutes}m` : "--"}
          trend={summary ? summary.distractionTrend : ""}
          trendUp={summary ? summary.distractionTrend.startsWith("+") : false}
          icon={<Clock size={24}/>}
        />
      </div>




      {/* Main chart + right side */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* FOCUS TREND CHART */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Today's Focus Trend</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span className="flex items-center"><div className="w-3 h-3 bg-primary rounded-full mr-1"></div> Focus</span>
              <span className="flex items-center"><div className="w-3 h-3 bg-red-400 rounded-full mr-1"></div> Distraction</span>
            </div>
          </div>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourlyData}>
                <defs>
                  <linearGradient id="colorFocus" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0"/>
                <XAxis dataKey="time" stroke="#94a3b8" tickLine={false} axisLine={false}/>
                <YAxis stroke="#94a3b8" tickLine={false} axisLine={false}/>
                <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}/>

                <Area type="monotone" dataKey="focusScore" stroke="#0ea5e9" strokeWidth={2} fill="url(#colorFocus)"/>
                <Area type="monotone" dataKey="distractionLevel" stroke="#f87171" strokeWidth={2} fillOpacity={0}/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>




        {/* Alerts + Upcoming tasks */}
        <div className="space-y-6">

          {/* AI Alerts */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">AI Alerts</h3>

            <div className="space-y-4">
              {alerts.length === 0 && (
                <p className="text-gray-500 dark:text-gray-400 text-sm">No alerts right now.</p>
              )}

              {alerts.map(alert => (
                <div
                  key={alert.id}
                  className={`flex items-start p-3 rounded-lg border ${
                    alert.type === "warning"
                      ? "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-100 dark:border-yellow-900/30"
                      : "bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-900/30"
                  }`}
                >
                  {alert.type === "warning" ? (
                    <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-500 mr-3 mt-0.5"/>
                  ) : (
                    <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-500 mr-3 mt-0.5"/>
                  )}

                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-gray-200">
                      {alert.title}
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{alert.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>




          {/* "Up Next" tasks */}
          <Card>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Up Next</h3>
              <Link to="/tasks" className="text-xs text-primary hover:underline">View All</Link>
            </div>

            <div className="space-y-3">
              {tasks.slice(0, 3).map(task => (
                <div 
                  key={task.id}
                  className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-slate-700/50 rounded-lg transition-colors cursor-pointer"
                >
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-3 ${
                      task.priority === "High"
                        ? "bg-red-500"
                        : task.priority === "Medium"
                        ? "bg-yellow-500"
                        : "bg-green-500"
                    }`}/>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate w-40">{task.title}</p>
                      <p className="text-xs text-gray-500">{task.dueDate}</p>
                    </div>
                  </div>

                  <div className="text-xs font-semibold text-gray-400">{task.category}</div>
                </div>
              ))}
            </div>
          </Card>

        </div>

      </div>

    </div>
  );
};
