import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Server, 
  Plus, 
  Play, 
  Square, 
  Settings, 
  Trash2, 
  Users, 
  Activity,
  Clock,
  MapPin
} from 'lucide-react';

interface ServerData {
  _id: string;
  name: string;
  status: 'running' | 'stopped' | 'creating' | 'error';
  port: number;
  ipAddress: string;
  plan: {
    displayName: string;
    features: any;
  };
  configuration: {
    maxPlayers: number;
    difficulty: string;
    gameMode: string;
  };
  stats: {
    playersOnline: number;
    uptime: number;
  };
  createdAt: string;
}

const ServersPage: React.FC = () => {
  const { user } = useAuth();
  const [servers, setServers] = useState<ServerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchServers();
  }, []);

  const fetchServers = async () => {
    try {
      // Simulate API call
      setServers([]);
    } catch (error) {
      console.error('Error fetching servers:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'text-green-400 bg-green-400';
      case 'stopped': return 'text-red-400 bg-red-400';
      case 'creating': return 'text-yellow-400 bg-yellow-400';
      case 'error': return 'text-red-500 bg-red-500';
      default: return 'text-gray-400 bg-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'running': return 'Online';
      case 'stopped': return 'Offline';
      case 'creating': return 'Creating...';
      case 'error': return 'Error';
      default: return 'Unknown';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-6 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">My Servers</h1>
            <p className="text-blue-200">Manage and monitor your Minecraft servers</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="mt-4 md:mt-0 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-200 transform hover:scale-105 flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Create Server</span>
          </button>
        </div>

        {/* Servers List */}
        {servers.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Server className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">No Servers Yet</h3>
            <p className="text-blue-200 text-lg mb-8 max-w-md mx-auto">
              Create your first Minecraft server and start building your community today!
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-200 transform hover:scale-105"
            >
              Create Your First Server
            </button>
            
            {/* Free Plan Reminder */}
            {!user?.hasUsedFreePlan && (
              <div className="mt-8 p-6 bg-green-500 bg-opacity-20 border border-green-400 border-opacity-30 rounded-xl">
                <div className="flex items-center justify-center mb-2">
                  <div className="w-8 h-8 bg-green-400 rounded-full flex items-center justify-center mr-3">
                    <Server className="w-4 h-4 text-white" />
                  </div>
                  <h4 className="text-lg font-semibold text-green-400">Free Server Available!</h4>
                </div>
                <p className="text-green-200 text-sm">
                  You can create a free Minecraft server for 7 days. No payment required!
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {servers.map((server) => (
              <div key={server._id} className="glass rounded-xl p-6">
                {/* Server Header */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white truncate">{server.name}</h3>
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(server.status).split(' ')[1]} opacity-20`}></div>
                    <span className={`text-sm font-medium ${getStatusColor(server.status).split(' ')[0]}`}>
                      {getStatusText(server.status)}
                    </span>
                  </div>
                </div>

                {/* Server Info */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-blue-200 text-sm">Plan:</span>
                    <span className="text-white text-sm font-medium">{server.plan.displayName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-blue-200 text-sm">Players:</span>
                    <span className="text-white text-sm">
                      {server.stats.playersOnline}/{server.configuration.maxPlayers}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-blue-200 text-sm">Address:</span>
                    <span className="text-white text-sm font-mono">
                      {server.ipAddress}:{server.port}
                    </span>
                  </div>
                </div>

                {/* Server Actions */}
                <div className="flex space-x-2">
                  <button
                    className={`flex-1 py-2 px-3 rounded-lg font-medium transition-colors ${
                      server.status === 'running'
                        ? 'bg-red-500 hover:bg-red-600 text-white'
                        : 'bg-green-500 hover:bg-green-600 text-white'
                    }`}
                  >
                    {server.status === 'running' ? (
                      <>
                        <Square className="w-4 h-4 inline mr-1" />
                        Stop
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 inline mr-1" />
                        Start
                      </>
                    )}
                  </button>
                  <button className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
                    <Settings className="w-4 h-4" />
                  </button>
                  <button className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create Server Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Create New Server</h2>
              <p className="text-gray-600 mb-6">
                To create a server, you need to select a plan first.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    window.location.href = '/plans';
                  }}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 font-medium"
                >
                  View Plans
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServersPage;