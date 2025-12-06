import React, { useEffect, useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, Badge, Button } from '../components/UI';
import { Download, Brain, AlertTriangle, Lightbulb } from 'lucide-react';

// API CALLS (ADDED)
import { getWeeklyAnalytics, getAnalyticsSummary } from "../api/analytics";
import { getTomorrowPrediction, getFocusRecommendation, getSevenDayForecast } from "../api/ml";


// --- ANALYTICS PAGE ---
export const Analytics: React.FC = () => {
  
  // STATE (ADDED)
  const [weeklyStats, setWeeklyStats] = useState<any[]>([]);
  const [summary, setSummary] = useState<any | null>(null);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const weekly = await getWeeklyAnalytics();     // 🔥 BACKEND CALL
      const sum = await getAnalyticsSummary();       // 🔥 BACKEND CALL

      setWeeklyStats(weekly);
      setSummary(sum);

    } catch (err) {
      console.error("Analytics load error:", err);
    }
  };

  return (
    <div className="space-y-6">
       <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h1>
       
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

         {/* Weekly Productivity */}
         <Card>
           <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Weekly Productivity Hours</h3>
           <div className="h-[300px]">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={weeklyStats}>
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
               <LineChart data={weeklyStats}>
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


       {/* SUMMARY CARDS */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <div className="text-center py-4">
              <h4 className="text-gray-500 mb-2">Most Productive Time</h4>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {summary?.mostProductiveTime || "—"}
              </p>
              <span className="text-xs text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full mt-2 inline-block">
                Peak Focus
              </span>
            </div>
          </Card>

          <Card>
             <div className="text-center py-4">
              <h4 className="text-gray-500 mb-2">Consistency Score</h4>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {summary?.consistencyScore || "—"}%
              </p>
              <span className="text-xs text-blue-600 bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded-full mt-2 inline-block">
                Top 10%
              </span>
            </div>
          </Card>

          <Card>
             <div className="text-center py-4">
              <h4 className="text-gray-500 mb-2">Top Distraction</h4>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {summary?.topDistraction || "—"}
              </p>
              <span className="text-xs text-red-600 bg-red-100 dark:bg-red-900/30 px-2 py-1 rounded-full mt-2 inline-block">
                {summary?.distractionMinutes || 0} mins/day
              </span>
            </div>
          </Card>
       </div>
    </div>
  );
};




// --- INSIGHTS PAGE (ML) ---
export const Insights: React.FC = () => {

  // STATE (ADDED)
  const [tomorrow, setTomorrow] = useState<any | null>(null);
  const [recommendation, setRecommendation] = useState<any | null>(null);
  const [forecast, setForecast] = useState<any[]>([]);

  useEffect(() => {
    loadML();
  }, []);

  const loadML = async () => {
    try {
      const t = await getTomorrowPrediction();         // 🔥 /ml/tomorrow
      const r = await getFocusRecommendation();        // 🔥 /ml/recommendation
      const f = await getSevenDayForecast();           // 🔥 /ml/forecast

      setTomorrow(t);
      setRecommendation(r);
      setForecast(f);

    } catch (error) {
      console.error("ML Insights error:", error);
    }
  };


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

        {/* Tomorrow's Prediction */}
        <Card className="border-l-4 border-l-primary">
           <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-4">Tomorrow's Prediction</h3>
           <div className="flex justify-between items-end">
             <div>
               <p className="text-sm text-gray-500">Expected Workload</p>
               <p className="text-2xl font-bold text-gray-900 dark:text-white">
                 {tomorrow?.workload || "—"}
               </p>
             </div>
             <div className="text-right">
               <p className="text-sm text-gray-500">Completion Probability</p>
               <p className="text-2xl font-bold text-green-500">
                 {tomorrow ? Math.round(tomorrow.completionProbability * 100) : "--"}%
               </p>
             </div>
           </div>
        </Card>


        {/* Focus Recommendation */}
        <Card className="border-l-4 border-l-accent">
           <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-4">Focus Recommendation</h3>
           <p className="text-gray-600 dark:text-gray-300 mb-4">
             {recommendation 
               ? <>Based on your patterns, schedule deep work between <b>{recommendation.start}</b> and <b>{recommendation.end}</b>.</>
               : "Loading..."
             }
           </p>
           <Button size="sm" variant="outline">Schedule Now</Button>
        </Card>

      </div>


      {/* Forecast Chart */}
      <Card>
        <h3 className="text-lg font-semibold mb-6 text-gray-900 dark:text-white">7-Day Completion Probability Forecast</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={forecast}>
               <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
               <XAxis dataKey="day" stroke="#94a3b8" />
               <YAxis stroke="#94a3b8" domain={[0, 100]} />
               <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '8px' }}/>
               <Legend />
               <Line 
                 type="monotone" 
                 name="Completion Probability (%)" 
                 dataKey="completionProb" 
                 stroke="#8b5cf6" 
                 strokeWidth={3} 
                 activeDot={{ r: 8 }} 
               />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>


      {/* Insights List */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Smart Insights</h3>

        {forecast.map((f, i) => (
          <div key={i} className="flex items-start p-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700">
             <div className="mt-1 p-2 bg-blue-100 text-blue-600 rounded-full mr-4 flex-shrink-0">
               <Brain size={18}/>
             </div>
             <div>
               <p className="text-gray-900 dark:text-gray-200 font-medium">
                 Forecast for {f.day}: {Math.round(f.completionProb)}% completion likelihood
               </p>
               <p className="text-xs text-gray-500 mt-1">Generated via ML prediction</p>
             </div>
          </div>
        ))}

      </div>

    </div>
  );
};
