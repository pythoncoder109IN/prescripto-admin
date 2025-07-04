import React, { useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bell, 
  X, 
  Check, 
  Clock, 
  User, 
  Calendar, 
  AlertCircle,
  CheckCircle,
  Info,
  Trash2,
  MarkAsUnread
} from "lucide-react";
import { AdminContext } from "../context/adminContext";
import { DoctorContext } from "../context/doctorContext";

const NotificationPanel = ({ isOpen, onClose }) => {
  const { aToken } = useContext(AdminContext);
  const { dToken } = useContext(DoctorContext);
  
  // Mock notifications data - in real app, this would come from API
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "appointment",
      title: "New Appointment Booked",
      message: "John Doe has booked an appointment for tomorrow at 2:00 PM",
      time: "5 minutes ago",
      read: false,
      icon: Calendar,
      color: "blue"
    },
    {
      id: 2,
      type: "system",
      title: "System Update",
      message: "The system will undergo maintenance tonight from 12:00 AM to 2:00 AM",
      time: "1 hour ago",
      read: false,
      icon: Info,
      color: "purple"
    },
    {
      id: 3,
      type: "success",
      title: "Payment Received",
      message: "Payment of $150 received from Sarah Wilson",
      time: "2 hours ago",
      read: true,
      icon: CheckCircle,
      color: "green"
    },
    {
      id: 4,
      type: "warning",
      title: "Appointment Reminder",
      message: "You have 3 appointments scheduled for today",
      time: "3 hours ago",
      read: true,
      icon: AlertCircle,
      color: "orange"
    },
    {
      id: 5,
      type: "user",
      title: "Profile Updated",
      message: "Your profile information has been successfully updated",
      time: "1 day ago",
      read: true,
      icon: User,
      color: "indigo"
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const getColorClasses = (color, read) => {
    const colors = {
      blue: read ? "bg-blue-50 border-blue-100" : "bg-blue-100 border-blue-200",
      purple: read ? "bg-purple-50 border-purple-100" : "bg-purple-100 border-purple-200",
      green: read ? "bg-green-50 border-green-100" : "bg-green-100 border-green-200",
      orange: read ? "bg-orange-50 border-orange-100" : "bg-orange-100 border-orange-200",
      indigo: read ? "bg-indigo-50 border-indigo-100" : "bg-indigo-100 border-indigo-200"
    };
    return colors[color] || colors.blue;
  };

  const getIconColorClasses = (color) => {
    const colors = {
      blue: "text-blue-600",
      purple: "text-purple-600",
      green: "text-green-600",
      orange: "text-orange-600",
      indigo: "text-indigo-600"
    };
    return colors[color] || colors.blue;
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
          
          {/* Notification Panel */}
          <motion.div
            initial={{ opacity: 0, x: 300, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-20 right-6 w-96 max-h-[80vh] bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500 rounded-xl">
                    <Bell className="text-white" size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Notifications</h3>
                    <p className="text-sm text-gray-600">
                      {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <motion.button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors duration-200"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <X size={20} />
                </motion.button>
              </div>
              
              {unreadCount > 0 && (
                <motion.button
                  onClick={markAllAsRead}
                  className="mt-3 flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Check size={16} />
                  Mark all as read
                </motion.button>
              )}
            </div>

            {/* Notifications List */}
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="mx-auto text-gray-300 mb-3" size={48} />
                  <p className="text-gray-500 font-medium">No notifications</p>
                  <p className="text-sm text-gray-400">You're all caught up!</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {notifications.map((notification, index) => {
                    const IconComponent = notification.icon;
                    return (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`p-4 hover:bg-gray-50 transition-colors duration-200 ${
                          !notification.read ? 'border-l-4 border-blue-500' : ''
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-xl ${getColorClasses(notification.color, notification.read)}`}>
                            <IconComponent 
                              size={18} 
                              className={getIconColorClasses(notification.color)}
                            />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <h4 className={`font-semibold text-sm ${
                                !notification.read ? 'text-gray-900' : 'text-gray-700'
                              }`}>
                                {notification.title}
                              </h4>
                              <div className="flex items-center gap-1">
                                {!notification.read && (
                                  <motion.button
                                    onClick={() => markAsRead(notification.id)}
                                    className="p-1 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    title="Mark as read"
                                  >
                                    <Check size={14} />
                                  </motion.button>
                                )}
                                <motion.button
                                  onClick={() => deleteNotification(notification.id)}
                                  className="p-1 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.95 }}
                                  title="Delete notification"
                                >
                                  <Trash2 size={14} />
                                </motion.button>
                              </div>
                            </div>
                            
                            <p className={`text-sm mt-1 ${
                              !notification.read ? 'text-gray-700' : 'text-gray-500'
                            }`}>
                              {notification.message}
                            </p>
                            
                            <div className="flex items-center gap-1 mt-2">
                              <Clock size={12} className="text-gray-400" />
                              <span className="text-xs text-gray-400">{notification.time}</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-4 bg-gray-50 border-t border-gray-200">
                <motion.button
                  className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium py-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  View all notifications
                </motion.button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NotificationPanel;