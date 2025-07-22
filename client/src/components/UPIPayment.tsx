import React, { useState, useEffect } from 'react';
import { Copy, Check, QrCode, Smartphone, CreditCard } from 'lucide-react';

interface Plan {
  _id: string;
  displayName: string;
  price: number;
  currency: string;
  description: string;
  features: any;
}

interface UPIPaymentProps {
  plan: Plan;
  onPaymentComplete: (paymentData: any) => void;
  onCancel: () => void;
}

const UPIPayment: React.FC<UPIPaymentProps> = ({ plan, onPaymentComplete, onCancel }) => {
  const [copied, setCopied] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'qr'>('upi');
  const [transactionId, setTransactionId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const UPI_ID = 'jaydendpenha@fam';
  const amount = plan.price;
  
  // Generate UPI payment URL
  const upiUrl = `upi://pay?pa=${UPI_ID}&pn=JP Hosting&am=${amount}&cu=INR&tn=Minecraft Server Plan - ${plan.displayName}`;
  
  // Generate QR code URL (using a free QR service)
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiUrl)}`;

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handlePaymentSubmit = async () => {
    if (!transactionId.trim()) {
      alert('Please enter the transaction ID');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate payment verification (in real app, this would verify with your backend)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const paymentData = {
        transactionId: transactionId.trim(),
        amount: amount,
        planId: plan._id,
        paymentMethod: 'UPI',
        upiId: UPI_ID,
        timestamp: new Date().toISOString()
      };
      
      onPaymentComplete(paymentData);
    } catch (error) {
      console.error('Payment processing error:', error);
      alert('Payment processing failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl">
          <h2 className="text-2xl font-bold mb-2">Complete Payment</h2>
          <p className="opacity-90">Pay for {plan.displayName} Plan</p>
          <div className="mt-3 bg-white bg-opacity-20 rounded-lg p-3">
            <div className="flex justify-between items-center">
              <span className="text-lg">Amount:</span>
              <span className="text-2xl font-bold">₹{amount}</span>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Payment Method Selection */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">Choose Payment Method</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setPaymentMethod('upi')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  paymentMethod === 'upi'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Smartphone className="w-6 h-6 mx-auto mb-2" />
                <span className="text-sm font-medium">UPI Apps</span>
              </button>
              <button
                onClick={() => setPaymentMethod('qr')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  paymentMethod === 'qr'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <QrCode className="w-6 h-6 mx-auto mb-2" />
                <span className="text-sm font-medium">QR Code</span>
              </button>
            </div>
          </div>

          {/* UPI Payment Method */}
          {paymentMethod === 'upi' && (
            <div className="mb-6">
              <h4 className="font-semibold mb-3 text-gray-800">Pay using UPI Apps</h4>
              
              {/* UPI ID Display */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  UPI ID:
                </label>
                <div className="flex items-center justify-between bg-white border rounded-lg p-3">
                  <span className="font-mono text-lg">{UPI_ID}</span>
                  <button
                    onClick={() => copyToClipboard(UPI_ID)}
                    className="flex items-center space-x-2 bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition-colors"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span className="text-sm">{copied ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* Payment Instructions */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <h5 className="font-semibold text-blue-800 mb-2">Payment Instructions:</h5>
                <ol className="list-decimal list-inside text-sm text-blue-700 space-y-1">
                  <li>Open your UPI app (PhonePe, GooglePay, Paytm, etc.)</li>
                  <li>Send ₹{amount} to UPI ID: <strong>{UPI_ID}</strong></li>
                  <li>Add note: "Minecraft Server - {plan.displayName}"</li>
                  <li>Complete the payment</li>
                  <li>Copy and paste the transaction ID below</li>
                </ol>
              </div>

              {/* Quick Pay Button */}
              <a
                href={upiUrl}
                className="block w-full bg-gradient-to-r from-green-500 to-green-600 text-white text-center py-3 rounded-lg font-semibold mb-4 hover:from-green-600 hover:to-green-700 transition-colors"
              >
                Pay ₹{amount} via UPI Apps
              </a>
            </div>
          )}

          {/* QR Code Payment Method */}
          {paymentMethod === 'qr' && (
            <div className="mb-6">
              <h4 className="font-semibold mb-3 text-gray-800">Scan QR Code to Pay</h4>
              
              <div className="bg-gray-50 rounded-lg p-6 text-center">
                <img
                  src={qrCodeUrl}
                  alt="UPI QR Code"
                  className="w-48 h-48 mx-auto mb-4 border-2 border-gray-200 rounded-lg"
                />
                <p className="text-sm text-gray-600 mb-2">
                  Scan this QR code with any UPI app to pay ₹{amount}
                </p>
                <p className="text-xs text-gray-500">
                  Amount: ₹{amount} • UPI ID: {UPI_ID}
                </p>
              </div>
            </div>
          )}

          {/* Transaction ID Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Transaction ID / Reference Number
            </label>
            <input
              type="text"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              placeholder="Enter transaction ID from your UPI app"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              You can find this in your UPI app after completing the payment
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={onCancel}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handlePaymentSubmit}
              disabled={!transactionId.trim() || isSubmitting}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Processing...
                </div>
              ) : (
                'Confirm Payment'
              )}
            </button>
          </div>

          {/* Support Info */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              Having issues? Contact support with your transaction ID.
              <br />
              Payments are processed securely through UPI.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UPIPayment;