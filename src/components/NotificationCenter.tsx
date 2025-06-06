import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

interface Notification {
  _id: string;
  type: "material" | "discussion" | "reply" | "system";
  title: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: string;
}

const NotificationCenter: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/notifications");
      setNotifications(response.data);
    } catch (error) {
      setError("Error fetching notifications");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await axios.put(`http://localhost:5000/api/notifications/${notificationId}/read`);
      fetchNotifications();
    } catch (error) {
      setError("Error updating notification");
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await axios.put("http://localhost:5000/api/notifications/read-all");
      fetchNotifications();
    } catch (error) {
      setError("Error updating notifications");
    }
  };

  if (loading) return <div className="text-center py-8">Loading notifications...</div>;
  if (error) return <div className="text-center text-red-500 py-8">{error}</div>;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Notifications</h2>
            {notifications.some((n) => !n.read) && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                Mark all as read
              </button>
            )}
          </div>
          <div className="mt-6 flow-root">
            <ul className="-my-5 divide-y divide-gray-200">
              {notifications.map((notification) => (
                <li key={notification._id} className="py-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      {notification.type === "material" && (
                        <svg
                          className="h-6 w-6 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                          />
                        </svg>
                      )}
                      {notification.type === "discussion" && (
                        <svg
                          className="h-6 w-6 text-green-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                          />
                        </svg>
                      )}
                      {notification.type === "reply" && (
                        <svg
                          className="h-6 w-6 text-yellow-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                          />
                        </svg>
                      )}
                      {notification.type === "system" && (
                        <svg
                          className="h-6 w-6 text-gray-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${notification.read ? "text-gray-900" : "text-blue-900"}`}>
                        {notification.title}
                      </p>
                      <p className="text-sm text-gray-500">{notification.message}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-500">
                        {new Date(notification.createdAt).toLocaleDateString()}
                      </span>
                      {!notification.read && (
                        <button
                          onClick={() => handleMarkAsRead(notification._id)}
                          className="text-sm font-medium text-blue-600 hover:text-blue-500"
                        >
                          Mark as read
                        </button>
                      )}
                      {notification.link && (
                        <Link
                          to={notification.link}
                          className="text-sm font-medium text-blue-600 hover:text-blue-500"
                        >
                          View →
                        </Link>
                      )}
                    </div>
                  </div>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationCenter;
