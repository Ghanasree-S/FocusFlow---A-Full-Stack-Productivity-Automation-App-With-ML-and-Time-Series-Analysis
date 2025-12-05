import React from 'react';
import { Card, Button } from '../components/UI';
import { MOCK_USER } from '../constants';
import { User, Bell, Lock, Cloud, Trash2, Moon } from 'lucide-react';

export const Profile: React.FC = () => {
  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">User Profile</h1>
      <Card className="flex flex-col sm:flex-row items-center gap-6">
         <img src={MOCK_USER.avatar} alt="Avatar" className="w-24 h-24 rounded-full border-4 border-gray-100 dark:border-slate-700" />
         <div className="text-center sm:text-left flex-1">
           <h2 className="text-xl font-bold text-gray-900 dark:text-white">{MOCK_USER.name}</h2>
           <p className="text-gray-500">{MOCK_USER.email}</p>
           <div className="mt-4 flex flex-wrap gap-2 justify-center sm:justify-start">
             <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">{MOCK_USER.style}</span>
             <span className="px-3 py-1 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 rounded-full text-sm font-medium">Goal: {MOCK_USER.dailyGoalHours}h / day</span>
           </div>
         </div>
         <Button variant="outline">Edit Profile</Button>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Current Subscription</h3>
          <p className="text-3xl font-bold text-primary mb-2">Pro Plan</p>
          <p className="text-sm text-gray-500 mb-4">Renews on Nov 1, 2023</p>
          <Button size="sm" variant="secondary">Manage Subscription</Button>
        </Card>
        <Card>
           <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Account Security</h3>
           <div className="space-y-3">
             <Button size="sm" variant="outline" className="w-full justify-start">Change Password</Button>
             <Button size="sm" variant="outline" className="w-full justify-start">Enable 2FA</Button>
           </div>
        </Card>
      </div>
    </div>
  );
};

export const Settings: React.FC = () => {
  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>

      <Card>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
          <Bell className="w-5 h-5 mr-2 text-gray-500"/> Notifications
        </h3>
        <div className="space-y-4">
          {['Daily productivity summary', 'Distraction alerts (Real-time)', 'Weekly report emails'].map((item, i) => (
             <div key={i} className="flex items-center justify-between">
               <span className="text-gray-700 dark:text-gray-300">{item}</span>
               <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                </label>
             </div>
          ))}
        </div>
      </Card>

      <Card>
         <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
          <Cloud className="w-5 h-5 mr-2 text-gray-500"/> Data & Sync
        </h3>
        <div className="flex items-center justify-between mb-4">
           <div>
             <p className="text-gray-900 dark:text-white font-medium">Cloud Backup</p>
             <p className="text-sm text-gray-500">Last synced: Just now</p>
           </div>
           <Button variant="outline" size="sm">Sync Now</Button>
        </div>
        <div className="border-t border-gray-100 dark:border-slate-700 pt-4">
          <p className="text-sm text-gray-500 mb-2">Export your data in CSV/Excel format.</p>
          <Button variant="outline" size="sm">Download Data</Button>
        </div>
      </Card>

      <Card>
         <h3 className="text-lg font-medium text-red-600 mb-4 flex items-center">
          <Trash2 className="w-5 h-5 mr-2"/> Danger Zone
        </h3>
        <p className="text-sm text-gray-500 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
        <Button variant="danger">Delete Account</Button>
      </Card>
    </div>
  );
};