import React from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, Badge, Button } from '../components/UI';
import { WEEKLY_STATS, FORECAST_DATA, MOCK_INSIGHTS } from '../constants';
import { Download, Brain, AlertTriangle, Lightbulb } from 'lucide-react';

// --- ANALYTICS PAGE ---
export const Analytics: React.FC = () => {
  return (
    <div className="space-y-6">
       <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h1>
       
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         {/* Weekly Productivity */}
         <Card>
           <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Weekly Productivity Hours</h3>
           <div className="h-[300px]">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={WEEKLY_STATS}>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                 <XAxis dataKey="day" stroke="#94a3b8" />
                 <YAxis stroke="#94a3b8" />
                 <Tooltip 
                   cursor={{fill: 'transparent'}}
                   contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                 />
                 <Bar dataKey="focusHours" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
               </BarChart>
             </ResponsiveContainer>
           </div>
         </Card>

         {/* Efficiency Trend */}
         <Card>
           <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Efficiency Score Trend</h3>
           <div className="h-[300px]">
             <ResponsiveContainer width="100%" height="100%">
               <LineChart data={WEEKLY_STATS}>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                 <XAxis dataKey="day" stroke="#94a3b8" />
                 <YAxis stroke="#94a3b8" domain={[0, 100]} />
                 <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}/>
                 <Line type="monotone" dataKey="efficiency" stroke="#10b981" strokeWidth={3} dot={{r: 4}} />
               </LineChart>
             </ResponsiveContainer>
           </div>
         </Card>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <div className="text-center py-4">
              <h4 className="text-gray-500 mb-2">Most Productive Time</h4>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">10:00 AM</p>
              <span className="text-xs text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full mt-2 inline-block">Peak Focus</span>
            </div>
          </Card>
          <Card>
             <div className="text-center py-4">
              <h4 className="text-gray-500 mb-2">Consistency Score</h4>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">88%</p>
              <span className="text-xs text-blue-600 bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded-full mt-2 inline-block">Top 10%</span>
            </div>
          </Card>
          <Card>
             <div className="text-center py-4">
              <h4 className="text-gray-500 mb-2">Top Distraction</h4>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">Email</p>
              <span className="text-xs text-red-600 bg-red-100 dark:bg-red-900/30 px-2 py-1 rounded-full mt-2 inline-block">-45 mins/day</span>
            </div>
          </Card>
       </div>
    </div>
  );
};

// --- INSIGHTS PAGE (ML) ---
export const Insights: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-2">
        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
          <Brain className="w-6 h-6 text-purple-600 dark:text-purple-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">ML Forecast & Insights</h1>
          <p className="text-sm text-gray-500">Powered by Time-Series Analysis</p>
        </div>
      </div>

      {/* Prediction Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-l-4 border-l-primary">
           <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-4">Tomorrow's Prediction</h3>
           <div className="flex justify-between items-end">
             <div>
               <p className="text-sm text-gray-500">Expected Workload</p>
               <p className="text-2xl font-bold text-gray-900 dark:text-white">High Intensity</p>
             </div>
             <div className="text-right">
               <p className="text-sm text-gray-500">Completion Probability</p>
               <p className="text-2xl font-bold text-green-500">88%</p>
             </div>
           </div>
        </Card>
        
        <Card className="border-l-4 border-l-accent">
           <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-4">Focus Recommendation</h3>
           <p className="text-gray-600 dark:text-gray-300 mb-4">
             Based on your historical patterns, we recommend scheduling deep work blocks between <span className="font-bold">9:00 AM</span> and <span className="font-bold">11:30 AM</span> tomorrow.
           </p>
           <Button size="sm" variant="outline">Schedule Now</Button>
        </Card>
      </div>

      {/* Forecast Chart */}
      <Card>
        <h3 className="text-lg font-semibold mb-6 text-gray-900 dark:text-white">7-Day Completion Probability Forecast</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={FORECAST_DATA}>
               <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
               <XAxis dataKey="day" stroke="#94a3b8" />
               <YAxis stroke="#94a3b8" domain={[0, 100]} />
               <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '8px' }}/>
               <Legend />
               <Line type="monotone" name="Completion Probability (%)" dataKey="completionProb" stroke="#8b5cf6" strokeWidth={3} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Insights List */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Smart Insights</h3>
        {MOCK_INSIGHTS.map(insight => (
          <div key={insight.id} className="flex items-start p-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700">
             <div className={`mt-1 p-2 rounded-full mr-4 flex-shrink-0 ${
               insight.type === 'positive' ? 'bg-green-100 text-green-600' :
               insight.type === 'warning' ? 'bg-red-100 text-red-600' :
               'bg-blue-100 text-blue-600'
             }`}>
               {insight.type === 'positive' ? <Lightbulb size={18}/> : insight.type === 'warning' ? <AlertTriangle size={18}/> : <Brain size={18}/>}
             </div>
             <div>
               <p className="text-gray-900 dark:text-gray-200 font-medium">{insight.message}</p>
               <p className="text-xs text-gray-500 mt-1">{insight.timestamp}</p>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- REPORTS PAGE ---
export const Reports: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Performance Reports</h1>
        <Button variant="outline">
          <Download size={16} className="mr-2"/> Export to Sheets
        </Button>
      </div>

      <div className="grid gap-6">
        <Card>
          <div className="flex justify-between items-center border-b border-gray-100 dark:border-slate-700 pb-4 mb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Weekly Summary</h3>
              <p className="text-sm text-gray-500">Oct 15 - Oct 22</p>
            </div>
            <Badge color="green">Excellent</Badge>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
              <p className="text-xs text-gray-500 uppercase">Total Focus</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">32h 15m</p>
            </div>
             <div className="p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
              <p className="text-xs text-gray-500 uppercase">Tasks Done</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">24</p>
            </div>
             <div className="p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
              <p className="text-xs text-gray-500 uppercase">Distractions</p>
              <p className="text-xl font-bold text-red-500">4h 20m</p>
            </div>
             <div className="p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
              <p className="text-xs text-gray-500 uppercase">Growth</p>
              <p className="text-xl font-bold text-green-500">+12%</p>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Monthly Comparison</h3>
          <div className="h-[250px]">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={[{name: 'Sep', val: 75}, {name: 'Oct', val: 88}]}>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                 <XAxis dataKey="name" stroke="#94a3b8" />
                 <YAxis stroke="#94a3b8" />
                 <Bar dataKey="val" fill="#0ea5e9" barSize={60} radius={[4, 4, 0, 0]} />
               </BarChart>
             </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};