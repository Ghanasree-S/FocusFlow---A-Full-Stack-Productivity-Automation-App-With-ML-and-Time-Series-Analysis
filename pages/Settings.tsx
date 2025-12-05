import React, { useEffect, useState } from 'react';
import { Card, Button } from '../components/UI';
import { Bell, Cloud, Trash2 } from 'lucide-react';
import { getUserSettings, updateUserSettings, deleteAccount } from "../api/user";

export const Settings: React.FC = () => {
  const [settings, setSettings] = useState<any | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const data = await getUserSettings(); // 🔥 GET /user/settings
    setSettings(data);
  };

  const toggleSetting = (key: string) => {
    setSettings({ ...settings, [key]: !settings[key] });
  };

  const saveSettings = async () => {
    await updateUserSettings(settings); // 🔥 PUT /user/settings
    alert("Settings updated!");
  };

  const handleDelete = async () => {
    const confirmed = window.confirm("Are you sure you want to delete your account?");
    if (!confirmed) return;

    await deleteAccount(); // 🔥 DELETE /user/delete
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

          {/* Toggle 1 */}
          <SettingToggle
            label="Daily productivity summary"
            checked={settings.notifications_daily_summary}
            onChange={() => toggleSetting("notifications_daily_summary")}
          />

          {/* Toggle 2 */}
          <SettingToggle
            label="Distraction alerts (Real-time)"
            checked={settings.notifications_distraction_alerts}
            onChange={() => toggleSetting("notifications_distraction_alerts")}
          />

          {/* Toggle 3 */}
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
        <p className="text-gray-500 mb-4">Once you delete your account, it cannot be recovered.</p>
        <Button variant="danger" onClick={handleDelete}>Delete Account</Button>
      </Card>
    </div>
  );
};


// ------------------------------------------------------------
// Reusable Toggle Component
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
        <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 rounded-full peer-checked:bg-primary transition-all" />
        <div
          className={`absolute top-1 left-1 h-4 w-4 bg-white rounded-full transition-transform ${
            checked ? "translate-x-5" : ""
          }`}
        />
      </label>
    </div>
  );
};
