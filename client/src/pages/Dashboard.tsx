import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { 
  Server, 
  Plus, 
  Users, 
  Activity, 
  Clock, 
  Zap,
  TrendingUp,
  Gift,
  Crown
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalServers: 0,
    activeServers: 0,
    totalPlayers: 0,
    uptime: '99.9%'
  });

  useEffect(() => {
    // Simulate fetching dashboard stats
    setStats({
      totalServers: user?.servers?.length || 0,
      activeServers: 0,
      totalPlayers: 0,
      uptime: '99.9%'
    });
  }, [user]);

  const quickActions = [
    {
      title: 'Create Server',
      description: 'Launch a new Minecraft server',
      icon: Plus,
      color: 'from-green-500 to-green-600',
      link: '/servers'
    },
    {
      title: 'View Plans',
      description: 'Upgrade your hosting plan',
      icon: Crown,
      color: 'from-purple-500 to-purple-600',
      link: '/plans'
    },
    {
      title: 'Manage Servers',
      description: 'Control your existing servers',
      icon: Server,
      color: 'from-blue-500 to-blue-600',
      link: '/servers'
    }
  ];

  return (
    <div className="min-h-screen pt-6 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="glass rounded-2xl p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  Welcome back, {user?.username}! 👋
                </h1>
                <p className="text-blue-200 text-lg">
                  Ready to manage your Minecraft empire?
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <div className="flex items-center space-x-2 px-4 py-2 bg-white bg-opacity-20 rounded-full">
                  {user?.subscriptionStatus === 'active' ? (
                    <>
                      <Crown className="w-5 h-5 text-yellow-300" />
                      <span className="text-white font-medium">Premium User</span>
                    </>
                  ) : (
                    <>
                      <Gift className="w-5 h-5 text-green-300" />
                      <span className="text-white font-medium">
                        {user?.hasUsedFreePlan ? 'Free Trial Used' : 'Free Trial Available'}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="glass rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm font-medium">Total Servers</p>
                <p className="text-3xl font-bold text-white">{stats.totalServers}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500 bg-opacity-20 rounded-lg flex items-center justify-center">
                <Server className="w-6 h-6 text-blue-300" />
              </div>
            </div>
          </div>

          <div className="glass rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm font-medium">Active Servers</p>
                <p className="text-3xl font-bold text-white">{stats.activeServers}</p>
              </div>
              <div className="w-12 h-12 bg-green-500 bg-opacity-20 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-green-300" />
              </div>
            </div>
          </div>

          <div className="glass rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm font-medium">Online Players</p>
                <p className="text-3xl font-bold text-white">{stats.totalPlayers}</p>
              </div>
              <div className="w-12 h-12 bg-purple-500 bg-opacity-20 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-300" />
              </div>
            </div>
          </div>

          <div className="glass rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm font-medium">Uptime</p>
                <p className="text-3xl font-bold text-white">{stats.uptime}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-500 bg-opacity-20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-yellow-300" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                to={action.link}
                className="group glass rounded-xl p-6 hover:scale-105 transition-all duration-300"
              >
                <div className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{action.title}</h3>
                <p className="text-blue-200">{action.description}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Free Plan CTA */}
        {!user?.hasUsedFreePlan && user?.subscriptionStatus !== 'active' && (
          <div className="glass rounded-2xl p-8 border-2 border-green-400 border-opacity-30">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-4 md:mb-0">
                <h3 className="text-2xl font-bold text-white mb-2">
                  🎉 Claim Your Free Server!
                </h3>
                <p className="text-blue-200 text-lg">
                  Get started with a free 7-day Minecraft server. No credit card required!
                </p>
              </div>
              <Link
                to="/plans"
                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-200 transform hover:scale-105"
              >
                Claim Free Server
              </Link>
            </div>
          </div>
        )}

        {/* Recent Activity */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-white mb-6">Recent Activity</h2>
          <div className="glass rounded-xl p-6">
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Clock className="w-12 h-12 text-blue-300 mx-auto mb-4" />
                <p className="text-blue-200 text-lg">No recent activity</p>
                <p className="text-blue-300 text-sm">Your server activities will appear here</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;