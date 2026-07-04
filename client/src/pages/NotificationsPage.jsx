import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { Card } from '../components/Card';
import { fetchNotifications, markNotificationRead } from '../redux/slices/notificationSlice';
import { FiBell, FiCheck } from 'react-icons/fi';

export const NotificationsPage = () => {
  const dispatch = useDispatch();
  const { notifications, loading } = useSelector((state) => state.notifications);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const handleRead = (id) => {
    dispatch(markNotificationRead(id));
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-3xl">
        <div>
          <h2 className="text-xl font-bold text-gradient-cyan">System Alerts</h2>
          <p className="text-xs text-slate-400">Review status updates, application reports, and scheduled meetings</p>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-400">Loading alerts...</div>
        ) : notifications.length === 0 ? (
          <div className="glass-panel p-12 text-center text-slate-400 border border-indigo-500/10">
            <FiBell className="mx-auto text-4xl mb-4 text-indigo-500/30" />
            <p>Your inbox is empty.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((n) => (
              <Card 
                key={n._id} 
                hoverEffect={true} 
                className={`p-4 border ${!n.readStatus ? 'border-brandIndigo/40 bg-brandIndigo/5' : 'border-indigo-500/5'} flex justify-between items-center`}
              >
                <div className="flex-grow pr-4">
                  <p className={`text-sm ${!n.readStatus ? 'text-slate-100 font-semibold' : 'text-slate-300'}`}>
                    {n.message}
                  </p>
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    {new Date(n.createdAt).toLocaleDateString()} at {new Date(n.createdAt).toLocaleTimeString()}
                  </span>
                </div>

                {!n.readStatus && (
                  <button
                    onClick={() => handleRead(n._id)}
                    className="p-1.5 rounded-lg bg-brandIndigo/10 text-brandIndigo hover:bg-brandIndigo hover:text-white transition-all text-xs font-semibold"
                    title="Mark as Read"
                  >
                    <FiCheck />
                  </button>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default NotificationsPage;
