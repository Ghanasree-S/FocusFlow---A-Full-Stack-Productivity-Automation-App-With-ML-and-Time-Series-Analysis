import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { PlayCircle, Plus, AlertCircle, TrendingUp, CheckCircle, Clock } from 'lucide-react';
import { Card, StatCard, Button } from '../components/UI';
import { HOURLY_DATA, MOCK_TASKS } from '../constants';
import { Link } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Good Morning, Alex 👋</h1>
          <p className="text-gray-500 dark:text-gray-400">Here's your productivity forecast for today.</p>
        </div>
        <div className="flex space-x-3">
          <Link to="/tasks">
            <Button variant="outline"><Plus size={16} className="mr-2"/> Add Task</Button>
          </Link>
          <Link to="/focus">
            <Button><PlayCircle size={16} className="mr-2"/> Start Focus</Button>
          </Link>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Focus Score" 
          value="78/100" 
          trend="+5% vs yesterday" 
          trendUp={true}
          icon={<TrendingUp size={24}/>} 
        />
        <StatCard 
          title="Tasks Completed" 
          value="4" 
          trend="On track" 
          trendUp={true}
          icon={<CheckCircle size={24}/>} 
        />
        <StatCard 
          title="Distraction Time" 
          value="45m" 
          trend="-12% vs avg" 
          trendUp={true}
          icon={<Clock size={24}/>} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
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
              <AreaChart data={HOURLY_DATA}>
                <defs>
                  <linearGradient id="colorFocus" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                  itemStyle={{ color: '#64748b' }}
                />
                <Area type="monotone" dataKey="focusScore" stroke="#0ea5e9" strokeWidth={2} fillOpacity={1} fill="url(#colorFocus)" />
                <Area type="monotone" dataKey="distractionLevel" stroke="#f87171" strokeWidth={2} fillOpacity={0} fill="#f87171" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Alerts & Tasks */}
        <div className="space-y-6">
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">AI Alerts</h3>
            <div className="space-y-4">
              <div className="flex items-start p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-100 dark:border-yellow-900/30">
                <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-500 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Distraction Spike</h4>
                  <p className="text-xs text-yellow-700 dark:text-yellow-400 mt-1">High social media usage detected between 2 PM - 3 PM.</p>
                </div>
              </div>
              <div className="flex items-start p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-900/30">
                <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-medium text-green-800 dark:text-green-200">Peak Performance</h4>
                  <p className="text-xs text-green-700 dark:text-green-400 mt-1">You entered a flow state at 10:15 AM.</p>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Up Next</h3>
              <Link to="/tasks" className="text-xs text-primary hover:underline">View All</Link>
            </div>
            <div className="space-y-3">
              {MOCK_TASKS.slice(0, 3).map(task => (
                <div key={task.id} className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-slate-700/50 rounded-lg transition-colors cursor-pointer">
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-3 ${
                      task.priority === 'High' ? 'bg-red-500' : task.priority === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'
                    }`} />
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