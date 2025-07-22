import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import UPIPayment from './UPIPayment';
import { 
  Globe, 
  Check, 
  X, 
  Plus, 
  Crown, 
  Gift,
  ExternalLink,
  Copy,
  Settings,
  Trash2
} from 'lucide-react';

interface Domain {
  id: string;
  domain: string;
  extension: string;
  serverId: string;
  serverName: string;
  status: 'active' | 'pending' | 'expired';
  isFree: boolean;
  expiresAt?: string;
  createdAt: string;
}

interface DomainManagerProps {
  serverId?: string;
  serverName?: string;
  onClose?: () => void;
}

const DomainManager: React.FC<DomainManagerProps> = ({ serverId, serverName, onClose }) => {
  const { user } = useAuth();
  const [domains, setDomains] = useState<Domain[]>([
    // Sample domain for demonstration
    {
      id: 'sample-1',
      domain: 'myserver',
      extension: '.hosting.jp',
      serverId: 'server-1',
      serverName: 'My Awesome Server',
      status: 'active',
      isFree: true,
      createdAt: '2024-01-15T10:00:00Z'
    }
  ]);
  
  const [showAddDomain, setShowAddDomain] = useState(false);
  const [selectedExtension, setSelectedExtension] = useState<string>('');
  const [domainName, setDomainName] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  const [loading, setLoading] = useState(false);

  // Domain pricing structure
  const domainPricing = [
    { extension: '.hosting.jp', price: 0, description: 'Free domain for all users', isFree: true, popular: false },
    { extension: '.fun', price: 50, description: 'Perfect for gaming communities', isFree: false, popular: true },
    { extension: '.com', price: 100, description: 'Most popular and professional', isFree: false, popular: false },
    { extension: '.net', price: 150, description: 'Great for network services', isFree: false, popular: false },
    { extension: '.in', price: 200, description: 'Indian domain extension', isFree: false, popular: false }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-400';
      case 'pending': return 'text-yellow-400 bg-yellow-400';
      case 'expired': return 'text-red-400 bg-red-400';
      default: return 'text-gray-400 bg-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Active';
      case 'pending': return 'Pending';
      case 'expired': return 'Expired';
      default: return 'Unknown';
    }
  };

  const handleDomainSelection = (extension: string, price: number) => {
    if (price === 0) {
      // Free domain - check if user already has one
      const hasFreeDomain = domains.some(d => d.extension === '.hosting.jp');
      if (hasFreeDomain && !user?.currentPlan) {
        alert('You already have a free domain. Upgrade to premium for more domains.');
        return;
      }
      setSelectedExtension(extension);
      setShowAddDomain(true);
    } else {
      // Paid domain
      setSelectedExtension(extension);
      setShowPayment(true);
    }
  };

  const createDomain = async () => {
    if (!domainName.trim()) {
      alert('Please enter a domain name');
      return;
    }

    setLoading(true);
    try {
      // Simulate domain creation
      const newDomain: Domain = {
        id: Date.now().toString(),
        domain: domainName,
        extension: selectedExtension,
        serverId: serverId || 'default',
        serverName: serverName || 'Default Server',
        status: 'active',
        isFree: selectedExtension === '.hosting.jp',
        createdAt: new Date().toISOString()
      };

      setDomains(prev => [...prev, newDomain]);
      setDomainName('');
      setSelectedExtension('');
      setShowAddDomain(false);
      alert(`Domain ${domainName}${selectedExtension} created successfully!`);
    } catch (error) {
      console.error('Error creating domain:', error);
      alert('Failed to create domain. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentComplete = async (paymentData: any) => {
    try {
      // Process domain payment
      await createDomain();
      setShowPayment(false);
      alert('Payment successful! Your domain is now active.');
    } catch (error) {
      console.error('Payment processing error:', error);
      alert('Payment verification failed. Please contact support.');
    }
  };

  const copyDomain = (domain: Domain) => {
    const fullDomain = `${domain.domain}${domain.extension}`;
    navigator.clipboard.writeText(fullDomain);
    alert('Domain copied to clipboard!');
  };

  const deleteDomain = (domainId: string) => {
    if (window.confirm('Are you sure you want to delete this domain?')) {
      setDomains(prev => prev.filter(d => d.id !== domainId));
    }
  };

  return (
    <div className={`${onClose ? 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4' : ''}`}>
      <div className={`${onClose ? 'bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto' : 'w-full'}`}>
        {/* Header */}
        {onClose && (
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Domain Management</h2>
                <p className="opacity-90">Manage custom domains for your Minecraft servers</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
        )}

        <div className={`${onClose ? 'p-6' : 'glass rounded-2xl p-6'}`}>
          {!onClose && (
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Custom Domains</h2>
              <p className="text-blue-200">Connect custom domains to your Minecraft servers</p>
            </div>
          )}

          {/* Current Domains */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-xl font-semibold ${onClose ? 'text-gray-900' : 'text-white'}`}>
                Your Domains ({domains.length})
              </h3>
              <button
                onClick={() => setShowAddDomain(true)}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Domain</span>
              </button>
            </div>

            {domains.length === 0 ? (
              <div className={`${onClose ? 'bg-gray-50' : 'bg-white bg-opacity-10'} rounded-xl p-8 text-center`}>
                <Globe className={`w-12 h-12 ${onClose ? 'text-gray-400' : 'text-blue-300'} mx-auto mb-4`} />
                <h4 className={`text-lg font-semibold ${onClose ? 'text-gray-900' : 'text-white'} mb-2`}>
                  No domains yet
                </h4>
                <p className={`${onClose ? 'text-gray-600' : 'text-blue-200'} mb-4`}>
                  Get started with a free .hosting.jp domain or choose a premium option
                </p>
                <button
                  onClick={() => setShowAddDomain(true)}
                  className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg hover:from-green-600 hover:to-green-700 transition-colors"
                >
                  Get Your First Domain
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {domains.map((domain) => (
                  <div key={domain.id} className={`${onClose ? 'bg-gray-50' : 'bg-white bg-opacity-10'} rounded-xl p-4`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 ${onClose ? 'bg-blue-100' : 'bg-blue-500 bg-opacity-20'} rounded-lg flex items-center justify-center`}>
                          <Globe className={`w-6 h-6 ${onClose ? 'text-blue-600' : 'text-blue-400'}`} />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h4 className={`text-lg font-semibold ${onClose ? 'text-gray-900' : 'text-white'}`}>
                              {domain.domain}{domain.extension}
                            </h4>
                            {domain.isFree && (
                              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
                                <Gift className="w-3 h-3 mr-1" />
                                Free
                              </span>
                            )}
                            <div className="flex items-center space-x-1">
                              <div className={`w-2 h-2 rounded-full ${getStatusColor(domain.status).split(' ')[1]}`}></div>
                              <span className={`text-sm ${getStatusColor(domain.status).split(' ')[0]}`}>
                                {getStatusText(domain.status)}
                              </span>
                            </div>
                          </div>
                          <p className={`text-sm ${onClose ? 'text-gray-600' : 'text-blue-200'}`}>
                            Connected to: {domain.serverName}
                          </p>
                          <p className={`text-xs ${onClose ? 'text-gray-500' : 'text-blue-300'}`}>
                            Created: {new Date(domain.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => copyDomain(domain)}
                          className={`p-2 ${onClose ? 'text-gray-600 hover:bg-gray-200' : 'text-blue-300 hover:bg-white hover:bg-opacity-10'} rounded-lg transition-colors`}
                          title="Copy domain"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          className={`p-2 ${onClose ? 'text-gray-600 hover:bg-gray-200' : 'text-blue-300 hover:bg-white hover:bg-opacity-10'} rounded-lg transition-colors`}
                          title="Domain settings"
                        >
                          <Settings className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteDomain(domain.id)}
                          className={`p-2 ${onClose ? 'text-red-600 hover:bg-red-50' : 'text-red-400 hover:bg-red-500 hover:bg-opacity-10'} rounded-lg transition-colors`}
                          title="Delete domain"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add Domain Modal */}
          {showAddDomain && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">Choose Domain Extension</h3>
                  <button
                    onClick={() => {
                      setShowAddDomain(false);
                      setSelectedExtension('');
                      setDomainName('');
                    }}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {!selectedExtension ? (
                  <div className="space-y-4">
                    {domainPricing.map((option) => (
                      <div
                        key={option.extension}
                        onClick={() => handleDomainSelection(option.extension, option.price)}
                        className={`border-2 rounded-xl p-4 cursor-pointer transition-all hover:scale-105 ${
                          option.popular 
                            ? 'border-yellow-400 bg-yellow-50 relative' 
                            : option.isFree 
                              ? 'border-green-400 bg-green-50'
                              : 'border-gray-200 hover:border-blue-400'
                        }`}
                      >
                        {option.popular && (
                          <div className="absolute -top-3 left-4">
                            <span className="bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-bold flex items-center">
                              <Crown className="w-3 h-3 mr-1" />
                              POPULAR
                            </span>
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                              option.isFree ? 'bg-green-100' : 'bg-blue-100'
                            }`}>
                              {option.isFree ? (
                                <Gift className="w-6 h-6 text-green-600" />
                              ) : (
                                <Globe className="w-6 h-6 text-blue-600" />
                              )}
                            </div>
                            <div>
                              <h4 className="text-lg font-bold text-gray-900">
                                yourserver{option.extension}
                              </h4>
                              <p className="text-gray-600 text-sm">{option.description}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-gray-900">
                              {option.price === 0 ? 'FREE' : `₹${option.price}`}
                            </div>
                            {option.price > 0 && (
                              <div className="text-sm text-gray-600">per domain</div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div>
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Enter your domain name
                      </label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={domainName}
                          onChange={(e) => setDomainName(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                          placeholder="myserver"
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <span className="text-lg font-semibold text-gray-900">
                          {selectedExtension}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-2">
                        Only lowercase letters, numbers, and hyphens are allowed
                      </p>
                    </div>

                    <div className="flex space-x-3">
                      <button
                        onClick={() => {
                          setSelectedExtension('');
                          setDomainName('');
                        }}
                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                      >
                        Back
                      </button>
                      <button
                        onClick={createDomain}
                        disabled={!domainName.trim() || loading}
                        className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? 'Creating...' : 'Create Domain'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Domain Benefits */}
          {!onClose && (
            <div className="mt-8">
              <h3 className="text-xl font-bold text-white mb-4">Why Use Custom Domains?</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white bg-opacity-10 rounded-xl p-4">
                  <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mb-3">
                    <Check className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">Professional Look</h4>
                  <p className="text-blue-200 text-sm">
                    Custom domains make your server look more professional and trustworthy
                  </p>
                </div>

                <div className="bg-white bg-opacity-10 rounded-xl p-4">
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mb-3">
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">Easy to Remember</h4>
                  <p className="text-blue-200 text-sm">
                    Players can easily remember and share your server address
                  </p>
                </div>

                <div className="bg-white bg-opacity-10 rounded-xl p-4">
                  <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center mb-3">
                    <Crown className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">Brand Identity</h4>
                  <p className="text-blue-200 text-sm">
                    Build your server's brand with a memorable domain name
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* UPI Payment Modal */}
        {showPayment && selectedExtension && (
          <UPIPayment
            plan={{
              _id: 'domain',
              displayName: `Domain ${selectedExtension}`,
              price: domainPricing.find(p => p.extension === selectedExtension)?.price || 0,
              currency: 'INR',
              description: `Custom domain with ${selectedExtension} extension`,
              features: {}
            }}
            onPaymentComplete={handlePaymentComplete}
            onCancel={() => {
              setShowPayment(false);
              setSelectedExtension('');
            }}
          />
        )}
      </div>
    </div>
  );
};

export default DomainManager;