import React, { useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Settings, 
  X, 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  Moon, 
  Sun, 
  Monitor,
  Save,
  Eye,
  EyeOff,
  Smartphone,
  Mail,
  Lock,
  Database,
  Download,
  Trash2,
  AlertTriangle
} from "lucide-react";
import { AdminContext } from "../context/adminContext";
import { DoctorContext } from "../context/doctorContext";
import toast from "react-hot-toast";

const SettingsPanel = ({ isOpen, onClose }) => {
  const { aToken } = useContext(AdminContext);
  const { dToken } = useContext(DoctorContext);
  
  const [activeTab, setActiveTab] = useState("general");
  const [settings, setSettings] = useState({
    // General Settings
    theme: "light",
    language: "en",
    timezone: "UTC",
    
    // Notification Settings
    emailNotifications: true,
    pushNotifications: true,
    appointmentReminders: true,
    systemUpdates: false,
    marketingEmails: false,
    
    // Privacy Settings
    profileVisibility: "public",
    dataSharing: false,
    analyticsTracking: true,
    
    // Security Settings
    twoFactorAuth: false,
    sessionTimeout: "30",
    loginAlerts: true,
    
    // Display Settings
    compactMode: false,
    animations: true,
    soundEffects: false
  });

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const tabs = [
    { id: "general", label: "General", icon: Settings },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "privacy", label: "Privacy", icon: Shield },
    { id: "security", label: "Security", icon: Lock },
    { id: "display", label: "Display", icon: Palette },
    { id: "data", label: "Data", icon: Database }
  ];

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const saveSettings = () => {
    // In a real app, this would make an API call
    toast.success("Settings saved successfully!", {
      style: {
        borderRadius: "12px",
        background: "#10b981",
        color: "#fff",
      },
    });
  };

  const exportData = () => {
    toast.success("Data export initiated. You'll receive an email when ready.", {
      style: {
        borderRadius: "12px",
        background: "#3b82f6",
        color: "#fff",
      },
    });
  };

  const deleteAccount = () => {
    toast.error("Account deletion initiated. This action cannot be undone.", {
      style: {
        borderRadius: "12px",
        background: "#ef4444",
        color: "#fff",
      },
    });
    setShowDeleteConfirm(false);
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">Theme</label>
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: "light", label: "Light", icon: Sun },
            { value: "dark", label: "Dark", icon: Moon },
            { value: "system", label: "System", icon: Monitor }
          ].map(({ value, label, icon: Icon }) => (
            <motion.button
              key={value}
              onClick={() => updateSetting("theme", value)}
              className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                settings.theme === value
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Icon size={20} className="mx-auto mb-1" />
              <span className="text-sm font-medium">{label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Language</label>
        <select
          value={settings.language}
          onChange={(e) => updateSetting("language", e.target.value)}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
          <option value="de">German</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Timezone</label>
        <select
          value={settings.timezone}
          onChange={(e) => updateSetting("timezone", e.target.value)}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="UTC">UTC</option>
          <option value="EST">Eastern Time</option>
          <option value="PST">Pacific Time</option>
          <option value="GMT">Greenwich Mean Time</option>
        </select>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      {[
        { key: "emailNotifications", label: "Email Notifications", desc: "Receive notifications via email", icon: Mail },
        { key: "pushNotifications", label: "Push Notifications", desc: "Receive push notifications on your device", icon: Smartphone },
        { key: "appointmentReminders", label: "Appointment Reminders", desc: "Get reminded about upcoming appointments", icon: Bell },
        { key: "systemUpdates", label: "System Updates", desc: "Notifications about system maintenance and updates", icon: Settings },
        { key: "marketingEmails", label: "Marketing Emails", desc: "Receive promotional emails and newsletters", icon: Mail }
      ].map(({ key, label, desc, icon: Icon }) => (
        <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Icon size={18} className="text-blue-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">{label}</h4>
              <p className="text-sm text-gray-600">{desc}</p>
            </div>
          </div>
          <motion.label 
            className="relative inline-flex items-center cursor-pointer"
            whileHover={{ scale: 1.05 }}
          >
            <input
              type="checkbox"
              checked={settings[key]}
              onChange={(e) => updateSetting(key, e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </motion.label>
        </div>
      ))}
    </div>
  );

  const renderPrivacySettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Profile Visibility</label>
        <select
          value={settings.profileVisibility}
          onChange={(e) => updateSetting("profileVisibility", e.target.value)}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="public">Public</option>
          <option value="private">Private</option>
          <option value="contacts">Contacts Only</option>
        </select>
      </div>

      {[
        { key: "dataSharing", label: "Data Sharing", desc: "Allow sharing of anonymized data for research" },
        { key: "analyticsTracking", label: "Analytics Tracking", desc: "Help improve our service with usage analytics" }
      ].map(({ key, label, desc }) => (
        <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
          <div>
            <h4 className="font-semibold text-gray-900">{label}</h4>
            <p className="text-sm text-gray-600">{desc}</p>
          </div>
          <motion.label 
            className="relative inline-flex items-center cursor-pointer"
            whileHover={{ scale: 1.05 }}
          >
            <input
              type="checkbox"
              checked={settings[key]}
              onChange={(e) => updateSetting(key, e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </motion.label>
        </div>
      ))}
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
        <div>
          <h4 className="font-semibold text-gray-900">Two-Factor Authentication</h4>
          <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
        </div>
        <motion.label 
          className="relative inline-flex items-center cursor-pointer"
          whileHover={{ scale: 1.05 }}
        >
          <input
            type="checkbox"
            checked={settings.twoFactorAuth}
            onChange={(e) => updateSetting("twoFactorAuth", e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </motion.label>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Session Timeout (minutes)</label>
        <select
          value={settings.sessionTimeout}
          onChange={(e) => updateSetting("sessionTimeout", e.target.value)}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="15">15 minutes</option>
          <option value="30">30 minutes</option>
          <option value="60">1 hour</option>
          <option value="120">2 hours</option>
        </select>
      </div>

      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
        <div>
          <h4 className="font-semibold text-gray-900">Login Alerts</h4>
          <p className="text-sm text-gray-600">Get notified of new login attempts</p>
        </div>
        <motion.label 
          className="relative inline-flex items-center cursor-pointer"
          whileHover={{ scale: 1.05 }}
        >
          <input
            type="checkbox"
            checked={settings.loginAlerts}
            onChange={(e) => updateSetting("loginAlerts", e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </motion.label>
      </div>
    </div>
  );

  const renderDisplaySettings = () => (
    <div className="space-y-6">
      {[
        { key: "compactMode", label: "Compact Mode", desc: "Use a more compact layout to fit more content" },
        { key: "animations", label: "Animations", desc: "Enable smooth animations and transitions" },
        { key: "soundEffects", label: "Sound Effects", desc: "Play sounds for notifications and actions" }
      ].map(({ key, label, desc }) => (
        <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
          <div>
            <h4 className="font-semibold text-gray-900">{label}</h4>
            <p className="text-sm text-gray-600">{desc}</p>
          </div>
          <motion.label 
            className="relative inline-flex items-center cursor-pointer"
            whileHover={{ scale: 1.05 }}
          >
            <input
              type="checkbox"
              checked={settings[key]}
              onChange={(e) => updateSetting(key, e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </motion.label>
        </div>
      ))}
    </div>
  );

  const renderDataSettings = () => (
    <div className="space-y-6">
      <motion.button
        onClick={exportData}
        className="w-full flex items-center justify-center gap-3 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl text-blue-700 hover:bg-blue-100 transition-colors duration-200"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Download size={20} />
        <span className="font-semibold">Export My Data</span>
      </motion.button>

      <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
        <div className="flex items-center gap-3 mb-3">
          <AlertTriangle className="text-red-600" size={20} />
          <h4 className="font-semibold text-red-900">Danger Zone</h4>
        </div>
        <p className="text-sm text-red-700 mb-4">
          Once you delete your account, there is no going back. Please be certain.
        </p>
        <motion.button
          onClick={() => setShowDeleteConfirm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Trash2 size={16} />
          Delete Account
        </motion.button>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "general": return renderGeneralSettings();
      case "notifications": return renderNotificationSettings();
      case "privacy": return renderPrivacySettings();
      case "security": return renderSecuritySettings();
      case "display": return renderDisplaySettings();
      case "data": return renderDataSettings();
      default: return renderGeneralSettings();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          
          {/* Settings Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500 rounded-xl">
                    <Settings className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Settings</h3>
                    <p className="text-gray-600">Manage your account preferences</p>
                  </div>
                </div>
                <motion.button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors duration-200"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <X size={24} />
                </motion.button>
              </div>
            </div>

            <div className="flex h-[calc(90vh-120px)]">
              {/* Sidebar */}
              <div className="w-64 bg-gray-50 border-r border-gray-200 p-4">
                <nav className="space-y-2">
                  {tabs.map((tab) => {
                    const IconComponent = tab.icon;
                    return (
                      <motion.button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                          activeTab === tab.id
                            ? "bg-blue-500 text-white shadow-lg"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <IconComponent size={18} />
                        <span className="font-medium">{tab.label}</span>
                      </motion.button>
                    );
                  })}
                </nav>
              </div>

              {/* Content */}
              <div className="flex-1 p-6 overflow-y-auto">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {renderTabContent()}
                </motion.div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
              <motion.button
                onClick={onClose}
                className="px-6 py-2 text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-100 transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Cancel
              </motion.button>
              <motion.button
                onClick={saveSettings}
                className="flex items-center gap-2 px-6 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Save size={16} />
                Save Changes
              </motion.button>
            </div>
          </motion.div>

          {/* Delete Confirmation Modal */}
          <AnimatePresence>
            {showDeleteConfirm && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-60 flex items-center justify-center p-4"
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-white rounded-2xl p-6 max-w-md w-full"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-red-100 rounded-xl">
                      <AlertTriangle className="text-red-600" size={20} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Delete Account</h3>
                  </div>
                  <p className="text-gray-600 mb-6">
                    Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.
                  </p>
                  <div className="flex gap-3">
                    <motion.button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-100 transition-colors duration-200"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      onClick={deleteAccount}
                      className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors duration-200"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Delete
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
};

export default SettingsPanel;