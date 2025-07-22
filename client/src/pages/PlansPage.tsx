import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import UPIPayment from '../components/UPIPayment';
import { 
  Check, 
  Crown, 
  Zap, 
  Shield, 
  Globe, 
  HardDrive, 
  Users, 
  Cpu,
  Wifi,
  Gift
} from 'lucide-react';
import axios from 'axios';

interface Plan {
  _id: string;
  name: string;
  displayName: string;
  description: string;
  price: number;
  currency: string;
  billingCycle: string;
  features: {
    ram: number;
    storage: number;
    playerSlots: number;
    cpuCores: number;
    bandwidth: number;
    backups: boolean;
    ddosProtection: boolean;
    customDomain: boolean;
    priority_support: boolean;
  };
  isFree: boolean;
  maxServers: number;
}

const PlansPage: React.FC = () => {
  const { user } = useAuth();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [showPayment, setShowPayment] = useState(false);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await axios.get('/plans');
      setPlans(response.data.plans);
    } catch (error) {
      console.error('Error fetching plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPlan = (plan: Plan) => {
    if (plan.isFree) {
      if (user?.hasUsedFreePlan) {
        alert('You have already used the free plan. Please choose a paid plan.');
        return;
      }
      // Handle free plan selection
      handleFreePlanSelection(plan);
    } else {
      setSelectedPlan(plan);
      setShowPayment(true);
    }
  };

  const handleFreePlanSelection = async (plan: Plan) => {
    try {
      // In a real app, this would create a free server
      alert('Free plan selected! You can now create a free server for 7 days.');
    } catch (error) {
      console.error('Error selecting free plan:', error);
    }
  };

  const handlePaymentComplete = async (paymentData: any) => {
    try {
      // In a real app, this would verify payment and activate subscription
      console.log('Payment completed:', paymentData);
      alert('Payment successful! Your subscription has been activated.');
      setShowPayment(false);
      setSelectedPlan(null);
    } catch (error) {
      console.error('Payment processing error:', error);
      alert('Payment verification failed. Please contact support.');
    }
  };

  const getFeatureIcon = (feature: string) => {
    switch (feature) {
      case 'ram': return <Zap className="w-5 h-5" />;
      case 'storage': return <HardDrive className="w-5 h-5" />;
      case 'playerSlots': return <Users className="w-5 h-5" />;
      case 'cpuCores': return <Cpu className="w-5 h-5" />;
      case 'bandwidth': return <Wifi className="w-5 h-5" />;
      default: return <Check className="w-5 h-5" />;
    }
  };

  const formatFeature = (key: string, value: any) => {
    switch (key) {
      case 'ram': return `${value} GB RAM`;
      case 'storage': return `${value} GB Storage`;
      case 'playerSlots': return `${value} Player Slots`;
      case 'cpuCores': return `${value} CPU Cores`;
      case 'bandwidth': return `${value} GB Bandwidth`;
      case 'backups': return value ? 'Daily Backups' : 'No Backups';
      case 'ddosProtection': return value ? 'DDoS Protection' : 'Basic Protection';
      case 'customDomain': return value ? 'Custom Domain' : 'Standard Domain';
      case 'priority_support': return value ? 'Priority Support' : 'Standard Support';
      default: return '';
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
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Choose Your Perfect Plan
          </h1>
          <p className="text-xl text-blue-200 max-w-2xl mx-auto">
            From free trials to enterprise solutions, we have the perfect Minecraft hosting plan for everyone
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {plans.map((plan) => (
            <div
              key={plan._id}
              className={`glass rounded-2xl p-6 relative transition-all duration-300 hover:scale-105 ${
                plan.name === 'premium' ? 'border-2 border-yellow-400 border-opacity-50' : ''
              }`}
            >
              {/* Popular Badge */}
              {plan.name === 'premium' && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-4 py-1 rounded-full text-sm font-bold">
                    MOST POPULAR
                  </div>
                </div>
              )}

              {/* Free Badge */}
              {plan.isFree && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-green-400 to-green-600 text-white px-4 py-1 rounded-full text-sm font-bold flex items-center">
                    <Gift className="w-4 h-4 mr-1" />
                    FREE
                  </div>
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">{plan.displayName}</h3>
                <p className="text-blue-200 text-sm mb-4">{plan.description}</p>
                
                <div className="mb-4">
                  {plan.isFree ? (
                    <div className="text-3xl font-bold text-green-400">FREE</div>
                  ) : (
                    <div>
                      <span className="text-4xl font-bold text-white">₹{plan.price}</span>
                      <span className="text-blue-200 text-sm">/{plan.billingCycle}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Features */}
              <div className="space-y-3 mb-8">
                {Object.entries(plan.features).map(([key, value]) => (
                  <div key={key} className="flex items-center space-x-3">
                    <div className="w-5 h-5 text-green-400 flex-shrink-0">
                      {getFeatureIcon(key)}
                    </div>
                    <span className="text-blue-100 text-sm">
                      {formatFeature(key, value)}
                    </span>
                  </div>
                ))}
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 text-green-400 flex-shrink-0">
                    <Check className="w-5 h-5" />
                  </div>
                  <span className="text-blue-100 text-sm">
                    Up to {plan.maxServers} server{plan.maxServers > 1 ? 's' : ''}
                  </span>
                </div>
              </div>

              {/* CTA Button */}
              <button
                onClick={() => handleSelectPlan(plan)}
                disabled={plan.isFree && user?.hasUsedFreePlan}
                className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 ${
                  plan.isFree
                    ? user?.hasUsedFreePlan
                      ? 'bg-gray-500 cursor-not-allowed text-gray-300'
                      : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white'
                    : plan.name === 'premium'
                    ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-bold'
                    : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white'
                }`}
              >
                {plan.isFree 
                  ? user?.hasUsedFreePlan 
                    ? 'Already Used' 
                    : 'Start Free Trial'
                  : `Choose ${plan.displayName}`
                }
              </button>

              {plan.isFree && !user?.hasUsedFreePlan && (
                <p className="text-xs text-blue-300 text-center mt-2">
                  7 days free • No credit card required
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Features Comparison */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-white text-center mb-8">
            Why Choose JP Hosting?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass rounded-xl p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Lightning Fast</h3>
              <p className="text-blue-200">
                SSD storage and high-performance hardware ensure your server runs smoothly
              </p>
            </div>

            <div className="glass rounded-xl p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Secure & Protected</h3>
              <p className="text-blue-200">
                Enterprise-grade DDoS protection and regular backups keep your data safe
              </p>
            </div>

            <div className="glass rounded-xl p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Global Network</h3>
              <p className="text-blue-200">
                Servers located worldwide provide the best possible gaming experience
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* UPI Payment Modal */}
      {showPayment && selectedPlan && (
        <UPIPayment
          plan={selectedPlan}
          onPaymentComplete={handlePaymentComplete}
          onCancel={() => {
            setShowPayment(false);
            setSelectedPlan(null);
          }}
        />
      )}
    </div>
  );
};

export default PlansPage;