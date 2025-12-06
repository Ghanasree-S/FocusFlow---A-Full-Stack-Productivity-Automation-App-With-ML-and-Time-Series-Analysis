import React, { useEffect, useState } from 'react';
import { Card, Button } from '../components/UI';
import { Bell, Cloud, Trash2, User as UserIcon } from 'lucide-react';
import { getUserSettings, updateUserSettings, deleteAccount, getUserProfile } from "../api/user";


// ------------------------------------------------------------
// PROFILE PAGE (needed for App.tsx)
// ------------------------------------------------------------
export const Profile: React.FC = () => {
  const [profile, setProfile] = useState<any | null>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await getUserProfile();   // GET /user/profile
      setProfile(data);
    } catch (err) {
      console.error("Profile load error", err);
    }
  };

  if (!profile) return <p className="text-gray-500">Loading...</p>;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold dark:text-white flex items-center gap-2">
        <UserIcon className="w-6 h-6" /> Profile
      </h1>

      <Card className="flex flex-col sm:flex-row items-center gap-6 p-6">

        <img
          src={profile.avatar || "https://ui-avatars.com/api/?name=User"}
          alt="Avatar"
          className="w-24 h-24 rounded-full border-4 border-gray-100 dark:border-slate-700"
        />

        <div className="flex-1 text-center sm:text-left">
          <h2 className="text-xl font-bold dark:text-white">{profile.name}</h2>
          <p className="text-gray-500">{profile.email}</p>

          <div className="mt-4 flex flex-wrap gap-2 justify-center sm:justify-start">
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
              {profile.workStyle || "Balanced"}
            </span>

            <span className="px-3 py-1 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 rounded-full text-sm">
              Goal: {profile.dailyGoalHours || 6}h/day
            </span>
          </div>
        </div>

        <Button variant="outline">Edit Profile</Button>

      </Card>
    </div>
  );
};



// ------------------------------------------------------------
// SETTINGS PAGE (your original code — unchanged UI)
// ------------------------------------------------------------
export const Settings: React.FC = () => {
  const [settings, setSettings] = useState<any | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const data = await getUserSettings(); // GET /user/settings
    setSettings(data);
  };

  const toggleSetting = (key: string) => {
    setSettings({ ...settings, [key]: !settings[key] });
  };

  const saveSettings = async () => {
    await updateUserSettings(settings); // PUT /user/settings
    alert("Settings updated!");
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete your account?");
    if (!confirmDelete) return;

    await deleteAccount(); // DELETE /user/delete
    localStorage.removeItem("ff_token");
    window.location.href = "/signup";
  };

  if (!settings) return <p className="text-gray-500">Loading...</p>;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      
      <h1 className="text-2xl font-bold dark:text-white">Settings</h1>

      
      {/* Notification Settings */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold flex items-center mb-4 dark:text-white">
          <Bell className="w-5 h-5 mr-2" /> Notifications
        </h3>

        <div className="space-y-4">

          <SettingToggle
            label="Daily productivity summary"
            checked={settings.notifications_daily_summary}
            onChange={() => toggleSetting("notifications_daily_summary")}
          />

          <SettingToggle
            label="Distraction alerts (Real-time)"
            checked={settings.notifications_distraction_alerts}
            onChange={() => toggleSetting("notifications_distraction_alerts")}
          />

          <SettingToggle
            label="Weekly report emails"
            checked={settings.notifications_weekly_report}
            onChange={() => toggleSetting("notifications_weekly_report")}
          />

        </div>

        <Button onClick={saveSettings} className="mt-4">Save Settings</Button>
      </Card>

      

      {/* Cloud Sync */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold flex items-center mb-4 dark:text-white">
          <Cloud className="w-5 h-5 mr-2" /> Cloud Sync
        </h3>

        <SettingToggle
          label="Enable Cloud Sync"
          checked={settings.cloud_sync_enabled}
          onChange={() => toggleSetting("cloud_sync_enabled")}
        />

        <Button variant="outline" className="mt-4">Sync Now</Button>
      </Card>



      {/* Danger Zone */}
      <Card className="p-6 border-red-400">
        <h3 className="text-lg font-semibold text-red-600 mb-4 flex items-center">
          <Trash2 className="w-5 h-5 mr-2" /> Danger Zone
        </h3>

        <p className="text-gray-500 mb-4">
          Once you delete your account, it cannot be recovered.
        </p>

        <Button variant="danger" onClick={handleDelete}>Delete Account</Button>

      </Card>

    </div>
  );
};




// ------------------------------------------------------------
// REUSABLE TOGGLE COMPONENT (unchanged UI)
// ------------------------------------------------------------
const SettingToggle = ({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) => {
  return (
    <div className="flex items-center justify-between">

      <span className="text-gray-700 dark:text-gray-300">{label}</span>

      <label className="relative inline-flex items-center cursor-pointer">

        <input 
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="sr-only peer"
        />

        <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 rounded-full peer-checked:bg-primary transition-all"></div>

        <div
          className={`absolute top-1 left-1 h-4 w-4 bg-white rounded-full transition-transform ${
            checked ? "translate-x-5" : ""
          }`}
        />

      </label>

    </div>
  );
};
