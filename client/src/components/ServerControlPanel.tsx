import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Square, 
  RotateCcw, 
  Terminal, 
  FolderOpen, 
  File, 
  Download, 
  Upload, 
  Edit3, 
  Trash2, 
  Plus,
  Save,
  X,
  Settings,
  Users,
  Activity,
  HardDrive,
  Cpu,
  MemoryStick,
  Network,
  Clock,
  Eye,
  EyeOff
} from 'lucide-react';

interface ServerControlPanelProps {
  serverId: string;
  serverName: string;
  onClose: () => void;
}

interface FileItem {
  name: string;
  type: 'file' | 'folder';
  size?: number;
  modified: string;
  path: string;
}

interface ServerStats {
  status: 'running' | 'stopped' | 'starting' | 'stopping';
  players: number;
  maxPlayers: number;
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  uptime: string;
}

const ServerControlPanel: React.FC<ServerControlPanelProps> = ({ serverId, serverName, onClose }) => {
  const [activeTab, setActiveTab] = useState<'console' | 'files' | 'settings' | 'stats'>('console');
  const [serverStats, setServerStats] = useState<ServerStats>({
    status: 'running',
    players: 3,
    maxPlayers: 20,
    cpuUsage: 45,
    memoryUsage: 68,
    diskUsage: 23,
    uptime: '2h 34m'
  });
  
  // Console state
  const [consoleOutput, setConsoleOutput] = useState<string[]>([
    '[INFO] Server started successfully',
    '[INFO] 3 players online',
    '[INFO] World saved',
    '[WARN] Player disconnected: timeout'
  ]);
  const [command, setCommand] = useState('');
  const [isConsoleVisible, setIsConsoleVisible] = useState(true);
  const consoleRef = useRef<HTMLDivElement>(null);
  
  // File manager state
  const [currentPath, setCurrentPath] = useState('/');
  const [files, setFiles] = useState<FileItem[]>([
    { name: 'world', type: 'folder', modified: '2024-01-15 10:30', path: '/world' },
    { name: 'plugins', type: 'folder', modified: '2024-01-15 09:15', path: '/plugins' },
    { name: 'server.properties', type: 'file', size: 1024, modified: '2024-01-15 08:45', path: '/server.properties' },
    { name: 'whitelist.json', type: 'file', size: 256, modified: '2024-01-14 16:20', path: '/whitelist.json' },
    { name: 'ops.json', type: 'file', size: 128, modified: '2024-01-14 16:20', path: '/ops.json' },
    { name: 'banned-players.json', type: 'file', size: 64, modified: '2024-01-10 12:00', path: '/banned-players.json' }
  ]);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [fileContent, setFileContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // Server settings state
  const [serverSettings, setServerSettings] = useState({
    maxPlayers: 20,
    difficulty: 'normal',
    gameMode: 'survival',
    pvp: true,
    whitelist: false,
    motd: 'A Minecraft Server powered by JP Hosting'
  });

  useEffect(() => {
    // Auto-scroll console to bottom
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [consoleOutput]);

  const handleServerAction = async (action: 'start' | 'stop' | 'restart') => {
    const actionMessages = {
      start: '[INFO] Starting server...',
      stop: '[INFO] Stopping server...',
      restart: '[INFO] Restarting server...'
    };
    
    setConsoleOutput(prev => [...prev, actionMessages[action]]);
    
    // Simulate server action
    setTimeout(() => {
      const successMessages = {
        start: '[INFO] Server started successfully',
        stop: '[INFO] Server stopped',
        restart: '[INFO] Server restarted successfully'
      };
      setConsoleOutput(prev => [...prev, successMessages[action]]);
      
      if (action === 'start' || action === 'restart') {
        setServerStats(prev => ({ ...prev, status: 'running' }));
      } else {
        setServerStats(prev => ({ ...prev, status: 'stopped' }));
      }
    }, 2000);
  };

  const sendCommand = () => {
    if (command.trim()) {
      setConsoleOutput(prev => [...prev, `> ${command}`, '[INFO] Command executed']);
      setCommand('');
    }
  };

  const openFile = async (file: FileItem) => {
    if (file.type === 'file') {
      setSelectedFile(file);
      // Simulate file content loading
      const sampleContent = {
        'server.properties': 'gamemode=survival\ndifficulty=normal\nmotd=A Minecraft Server\nmax-players=20\npvp=true\nwhite-list=false',
        'whitelist.json': '[]',
        'ops.json': '[]',
        'banned-players.json': '[]'
      };
      setFileContent(sampleContent[file.name as keyof typeof sampleContent] || `# Content of ${file.name}\n# This is a sample file`);
      setIsEditing(false);
    } else {
      // Navigate to folder
      setCurrentPath(file.path);
      // In real app, fetch folder contents
    }
  };

  const saveFile = () => {
    setConsoleOutput(prev => [...prev, `[INFO] File ${selectedFile?.name} saved successfully`]);
    setIsEditing(false);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'text-green-400';
      case 'stopped': return 'text-red-400';
      case 'starting': case 'stopping': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const tabs = [
    { id: 'console', label: 'Console', icon: Terminal },
    { id: 'files', label: 'File Manager', icon: FolderOpen },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'stats', label: 'Statistics', icon: Activity }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl shadow-2xl w-full max-w-7xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">{serverName} Control Panel</h2>
              <p className="opacity-90">Advanced server management and monitoring</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className={`flex items-center space-x-2 px-3 py-1 rounded-full bg-black bg-opacity-20`}>
                <div className={`w-3 h-3 rounded-full ${serverStats.status === 'running' ? 'bg-green-400' : 'bg-red-400'}`}></div>
                <span className={`font-medium ${getStatusColor(serverStats.status)}`}>
                  {serverStats.status.toUpperCase()}
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Server Controls */}
          <div className="flex items-center space-x-3 mt-4">
            <button
              onClick={() => handleServerAction('start')}
              disabled={serverStats.status === 'running'}
              className="flex items-center space-x-2 px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-500 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
            >
              <Play className="w-4 h-4" />
              <span>Start</span>
            </button>
            <button
              onClick={() => handleServerAction('stop')}
              disabled={serverStats.status === 'stopped'}
              className="flex items-center space-x-2 px-4 py-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-500 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
            >
              <Square className="w-4 h-4" />
              <span>Stop</span>
            </button>
            <button
              onClick={() => handleServerAction('restart')}
              className="flex items-center space-x-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Restart</span>
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-gray-800 px-6 py-4 border-b border-gray-700">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-blue-400" />
              <span className="text-white text-sm">{serverStats.players}/{serverStats.maxPlayers} Players</span>
            </div>
            <div className="flex items-center space-x-2">
              <Cpu className="w-4 h-4 text-green-400" />
              <span className="text-white text-sm">{serverStats.cpuUsage}% CPU</span>
            </div>
            <div className="flex items-center space-x-2">
              <MemoryStick className="w-4 h-4 text-purple-400" />
              <span className="text-white text-sm">{serverStats.memoryUsage}% RAM</span>
            </div>
            <div className="flex items-center space-x-2">
              <HardDrive className="w-4 h-4 text-yellow-400" />
              <span className="text-white text-sm">{serverStats.diskUsage}% Disk</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-indigo-400" />
              <span className="text-white text-sm">{serverStats.uptime}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Network className="w-4 h-4 text-cyan-400" />
              <span className="text-white text-sm">Online</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-gray-800 px-6 border-b border-gray-700">
          <div className="flex space-x-1">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-t-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-gray-900 text-white border-b-2 border-blue-500'
                      : 'text-gray-400 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-hidden">
          {/* Console Tab */}
          {activeTab === 'console' && (
            <div className="h-full flex flex-col">
              <div className="flex-1 bg-black p-4 overflow-y-auto font-mono text-sm">
                <div ref={consoleRef} className="space-y-1">
                  {consoleOutput.map((line, index) => (
                    <div key={index} className={`${
                      line.includes('[ERROR]') ? 'text-red-400' :
                      line.includes('[WARN]') ? 'text-yellow-400' :
                      line.includes('[INFO]') ? 'text-green-400' :
                      line.startsWith('>') ? 'text-blue-400' :
                      'text-gray-300'
                    }`}>
                      {line}
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-gray-800 p-4 border-t border-gray-700">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={command}
                    onChange={(e) => setCommand(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendCommand()}
                    placeholder="Enter server command..."
                    className="flex-1 bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={sendCommand}
                    className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* File Manager Tab */}
          {activeTab === 'files' && (
            <div className="h-full flex">
              {/* File List */}
              <div className="w-1/2 bg-gray-800 border-r border-gray-700">
                <div className="p-4 border-b border-gray-700">
                  <div className="flex items-center justify-between">
                    <h3 className="text-white font-semibold">Files: {currentPath}</h3>
                    <div className="flex space-x-2">
                      <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded">
                        <Plus className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded">
                        <Upload className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="overflow-y-auto h-full">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      onClick={() => openFile(file)}
                      className={`flex items-center space-x-3 p-3 hover:bg-gray-700 cursor-pointer border-b border-gray-700 ${
                        selectedFile?.name === file.name ? 'bg-gray-700' : ''
                      }`}
                    >
                      {file.type === 'folder' ? (
                        <FolderOpen className="w-5 h-5 text-blue-400" />
                      ) : (
                        <File className="w-5 h-5 text-gray-400" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-white truncate">{file.name}</p>
                        <p className="text-xs text-gray-400">
                          {file.size && formatFileSize(file.size)} • {file.modified}
                        </p>
                      </div>
                      <div className="flex space-x-1">
                        <button className="p-1 text-gray-400 hover:text-white">
                          <Download className="w-3 h-3" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-white">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* File Editor */}
              <div className="w-1/2 bg-gray-900">
                {selectedFile ? (
                  <div className="h-full flex flex-col">
                    <div className="p-4 border-b border-gray-700">
                      <div className="flex items-center justify-between">
                        <h3 className="text-white font-semibold">{selectedFile.name}</h3>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setIsEditing(!isEditing)}
                            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          {isEditing && (
                            <button
                              onClick={saveFile}
                              className="p-2 text-green-400 hover:text-green-300 hover:bg-gray-700 rounded"
                            >
                              <Save className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 p-4">
                      <textarea
                        value={fileContent}
                        onChange={(e) => setFileContent(e.target.value)}
                        readOnly={!isEditing}
                        className={`w-full h-full bg-black text-green-400 font-mono text-sm p-4 rounded border-2 resize-none focus:outline-none ${
                          isEditing ? 'border-blue-500' : 'border-gray-700'
                        }`}
                        placeholder="Select a file to view its content..."
                      />
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center text-gray-400">
                      <File className="w-12 h-12 mx-auto mb-4" />
                      <p>Select a file to view its content</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="h-full overflow-y-auto bg-gray-800 p-6">
              <div className="max-w-2xl">
                <h3 className="text-xl font-bold text-white mb-6">Server Settings</h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Max Players
                    </label>
                    <input
                      type="number"
                      value={serverSettings.maxPlayers}
                      onChange={(e) => setServerSettings(prev => ({ ...prev, maxPlayers: parseInt(e.target.value) }))}
                      className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Difficulty
                    </label>
                    <select
                      value={serverSettings.difficulty}
                      onChange={(e) => setServerSettings(prev => ({ ...prev, difficulty: e.target.value }))}
                      className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="peaceful">Peaceful</option>
                      <option value="easy">Easy</option>
                      <option value="normal">Normal</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Game Mode
                    </label>
                    <select
                      value={serverSettings.gameMode}
                      onChange={(e) => setServerSettings(prev => ({ ...prev, gameMode: e.target.value }))}
                      className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="survival">Survival</option>
                      <option value="creative">Creative</option>
                      <option value="adventure">Adventure</option>
                      <option value="spectator">Spectator</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Server MOTD
                    </label>
                    <input
                      type="text"
                      value={serverSettings.motd}
                      onChange={(e) => setServerSettings(prev => ({ ...prev, motd: e.target.value }))}
                      className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Enable PVP</span>
                    <button
                      onClick={() => setServerSettings(prev => ({ ...prev, pvp: !prev.pvp }))}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        serverSettings.pvp ? 'bg-blue-500' : 'bg-gray-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          serverSettings.pvp ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Enable Whitelist</span>
                    <button
                      onClick={() => setServerSettings(prev => ({ ...prev, whitelist: !prev.whitelist }))}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        serverSettings.whitelist ? 'bg-blue-500' : 'bg-gray-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          serverSettings.whitelist ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-semibold transition-colors">
                    Save Settings
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Statistics Tab */}
          {activeTab === 'stats' && (
            <div className="h-full overflow-y-auto bg-gray-800 p-6">
              <h3 className="text-xl font-bold text-white mb-6">Server Statistics</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-gray-700 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">CPU Usage</p>
                      <p className="text-2xl font-bold text-white">{serverStats.cpuUsage}%</p>
                    </div>
                    <Cpu className="w-8 h-8 text-green-400" />
                  </div>
                  <div className="mt-2 bg-gray-600 rounded-full h-2">
                    <div 
                      className="bg-green-400 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${serverStats.cpuUsage}%` }}
                    ></div>
                  </div>
                </div>

                <div className="bg-gray-700 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Memory Usage</p>
                      <p className="text-2xl font-bold text-white">{serverStats.memoryUsage}%</p>
                    </div>
                    <MemoryStick className="w-8 h-8 text-purple-400" />
                  </div>
                  <div className="mt-2 bg-gray-600 rounded-full h-2">
                    <div 
                      className="bg-purple-400 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${serverStats.memoryUsage}%` }}
                    ></div>
                  </div>
                </div>

                <div className="bg-gray-700 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Disk Usage</p>
                      <p className="text-2xl font-bold text-white">{serverStats.diskUsage}%</p>
                    </div>
                    <HardDrive className="w-8 h-8 text-yellow-400" />
                  </div>
                  <div className="mt-2 bg-gray-600 rounded-full h-2">
                    <div 
                      className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${serverStats.diskUsage}%` }}
                    ></div>
                  </div>
                </div>

                <div className="bg-gray-700 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Players Online</p>
                      <p className="text-2xl font-bold text-white">{serverStats.players}/{serverStats.maxPlayers}</p>
                    </div>
                    <Users className="w-8 h-8 text-blue-400" />
                  </div>
                </div>

                <div className="bg-gray-700 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Uptime</p>
                      <p className="text-2xl font-bold text-white">{serverStats.uptime}</p>
                    </div>
                    <Clock className="w-8 h-8 text-indigo-400" />
                  </div>
                </div>

                <div className="bg-gray-700 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Network Status</p>
                      <p className="text-2xl font-bold text-green-400">Online</p>
                    </div>
                    <Network className="w-8 h-8 text-cyan-400" />
                  </div>
                </div>
              </div>

              {/* Performance Chart Placeholder */}
              <div className="mt-8 bg-gray-700 p-6 rounded-lg">
                <h4 className="text-lg font-semibold text-white mb-4">Performance History</h4>
                <div className="h-64 bg-gray-800 rounded-lg flex items-center justify-center">
                  <p className="text-gray-400">Performance charts will be displayed here</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServerControlPanel;