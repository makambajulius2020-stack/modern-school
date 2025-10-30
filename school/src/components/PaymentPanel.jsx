import React, { useState, useEffect } from 'react';
import { CreditCard, DollarSign, Clock, CheckCircle, AlertTriangle, Download, Eye, Smartphone, Building, Calendar, Plus, TrendingUp } from 'lucide-react';
import apiService from '../services/api';
import FeePaymentPlanPanel from './FeePaymentPlanPanel';

const PaymentPanel = ({ userRole, currentUser, darkMode = false, setActiveTab: parentSetActiveTab, appActiveTab }) => {
  const user = currentUser;
  const [activeTab, setActiveTab] = useState('overview');
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [paymentSummary, setPaymentSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [studentNumber, setStudentNumber] = useState('');
  const [showCopyNotification, setShowCopyNotification] = useState(false);

  useEffect(() => {
    // If parent provides appActiveTab (app-level navigation), map it to local panel tabs
    if (appActiveTab) {
      // Map app-level tab names to PaymentPanel local tab ids
      if (appActiveTab === 'payment-history') setActiveTab('history');
      else if (appActiveTab === 'payment-plans') setActiveTab('payment-plans');
      else if (appActiveTab === 'payments') setActiveTab('methods');
      // otherwise leave as-is
    }

    const fetchPaymentData = async () => {
      try {
        setLoading(true);
        
        // Test Python backend connection
        const healthCheck = await apiService.healthCheck();
        console.log('Python Backend Status:', healthCheck);
        
        // Get payment history from real backend
        const paymentData = await apiService.getPayments();
        console.log('Payment Data:', paymentData);
        
        if (paymentData.success) {
          setPaymentHistory(paymentData.payments);
          setPaymentSummary(paymentData.summary);
        }

        // Fetch bank accounts
        const bankResponse = await fetch('http://localhost:5000/api/bank-accounts');
        const bankData = await bankResponse.json();
        if (bankData.success) {
          setBankAccounts(bankData.data || []);
        }

        // Fetch student number
        if (currentUser?.id) {
          const studentResponse = await fetch(`http://localhost:5000/api/students/${currentUser.id}`);
          const studentData = await studentResponse.json();
          if (studentData.success && studentData.student) {
            setStudentNumber(studentData.student.admission_number || studentData.student.student_id || '');
          }
        }
        
      } catch (error) {
        console.error('Failed to fetch payment data:', error);
        // Show empty state - no fake data
        setPaymentHistory([]);
        setPaymentSummary({
          total_payments: 0,
          total_paid: 0,
          total_pending: 0,
          payment_success_rate: 0
        });
        setBankAccounts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentData();
  }, [currentUser, appActiveTab]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Dark mode utility classes
  const containerBg = darkMode ? 'bg-gray-900' : 'bg-gray-50';
  const cardBg = darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';
  const textPrimary = darkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = darkMode ? 'text-gray-300' : 'text-gray-600';
  const textMuted = darkMode ? 'text-gray-400' : 'text-gray-500';
  const borderColor = darkMode ? 'border-gray-700' : 'border-gray-200';
  const hoverBg = darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50';

  const renderTabContent = () => {
    switch (activeTab) {
      case 'payment-plans':
        if (userRole === 'parent') {
          return <FeePaymentPlanPanel userRole={userRole} currentUser={currentUser} darkMode={darkMode} />;
        }
        return <div className={`${cardBg} rounded-xl shadow-lg p-6 border`}>
          <h2 className={`text-2xl font-bold ${textPrimary} mb-4`}>Payment Plans</h2>
          <p className={`${textSecondary}`}>Payment plans are only available for parents.</p>
        </div>;

      case 'methods':
        return (
          <div className="space-y-6">
            {/* Payment Methods Tab Content */}
            <div className={`${cardBg} rounded-xl shadow-lg p-6 border`}>
              <div className="mb-6">
                <h2 className={`text-2xl font-bold ${textPrimary} mb-2`}>Payment Methods</h2>
                <p className={`${textSecondary}`}>Choose your preferred payment method for school fees</p>
              </div>

              {/* Available Payment Methods */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* MTN Mobile Money */}
                <div className={`p-6 border-2 border-yellow-200 rounded-xl hover:border-yellow-300 transition-colors ${cardBg}`}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-yellow-100 p-3 rounded-full">
                      <Smartphone className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div>
                      <h3 className={`font-semibold ${textPrimary}`}>MTN Mobile Money</h3>
                      <p className={`text-sm ${textSecondary}`}>Dial *165#</p>
                    </div>
                  </div>
                  <div className="space-y-2 mb-4">
                    <p className={`text-xs ${textMuted}`}>• Instant payment</p>
                    <p className={`text-xs ${textMuted}`}>• Available 24/7</p>
                    <p className={`text-xs ${textMuted}`}>• Low transaction fees</p>
                  </div>
                  <button 
                    onClick={() => {
                      setSelectedPaymentMethod('mtn');
                      setShowPaymentModal(true);
                    }}
                    className="w-full bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600 transition-colors font-medium"
                  >
                    Pay with MTN
                  </button>
                </div>

                {/* Airtel Money */}
                <div className={`p-6 border-2 border-red-200 rounded-xl hover:border-red-300 transition-colors ${cardBg}`}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-red-100 p-3 rounded-full">
                      <Smartphone className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <h3 className={`font-semibold ${textPrimary}`}>Airtel Money</h3>
                      <p className={`text-sm ${textSecondary}`}>Dial *185#</p>
                    </div>
                  </div>
                  <div className="space-y-2 mb-4">
                    <p className={`text-xs ${textMuted}`}>• Instant payment</p>
                    <p className={`text-xs ${textMuted}`}>• Available 24/7</p>
                    <p className={`text-xs ${textMuted}`}>• Low transaction fees</p>
                  </div>
                  <button 
                    onClick={() => {
                      setSelectedPaymentMethod('airtel');
                      setShowPaymentModal(true);
                    }}
                    className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors font-medium"
                  >
                    Pay with Airtel
                  </button>
                </div>

                {/* Stanbic Bank */}
                <div className={`p-6 border-2 border-blue-200 rounded-xl hover:border-blue-300 transition-colors ${cardBg}`}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-blue-100 p-3 rounded-full">
                      <Building className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className={`font-semibold ${textPrimary}`}>Stanbic Bank</h3>
                      <p className={`text-sm ${textSecondary}`}>Bank transfer</p>
                    </div>
                  </div>
                  <div className="space-y-2 mb-4">
                    <p className={`text-xs ${textMuted}`}>• Direct bank transfer</p>
                    <p className={`text-xs ${textMuted}`}>• No transaction fees</p>
                    <p className={`text-xs ${textMuted}`}>• 1-2 business days</p>
                  </div>
                  <button 
                    onClick={() => {
                      setSelectedPaymentMethod('stanbic');
                      setShowPaymentModal(true);
                    }}
                    className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors font-medium"
                  >
                    Pay via Stanbic
                  </button>
                </div>

                {/* Centenary Bank */}
                <div className={`p-6 border-2 border-purple-200 rounded-xl hover:border-purple-300 transition-colors ${cardBg}`}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-purple-100 p-3 rounded-full">
                      <Building className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className={`font-semibold ${textPrimary}`}>Centenary Bank</h3>
                      <p className={`text-sm ${textSecondary}`}>Bank transfer</p>
                    </div>
                  </div>
                  <div className="space-y-2 mb-4">
                    <p className={`text-xs ${textMuted}`}>• Direct bank transfer</p>
                    <p className={`text-xs ${textMuted}`}>• No transaction fees</p>
                    <p className={`text-xs ${textMuted}`}>• 1-2 business days</p>
                  </div>
                  <button 
                    onClick={() => {
                      setSelectedPaymentMethod('centenary');
                      setShowPaymentModal(true);
                    }}
                    className="w-full bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600 transition-colors font-medium"
                  >
                    Pay via Centenary
                  </button>
                </div>

                {/* Equity Bank */}
                <div className={`p-6 border-2 border-green-200 rounded-xl hover:border-green-300 transition-colors ${cardBg}`}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-green-100 p-3 rounded-full">
                      <Building className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className={`font-semibold ${textPrimary}`}>Equity Bank</h3>
                      <p className={`text-sm ${textSecondary}`}>Bank transfer</p>
                    </div>
                  </div>
                  <div className="space-y-2 mb-4">
                    <p className={`text-xs ${textMuted}`}>• Direct bank transfer</p>
                    <p className={`text-xs ${textMuted}`}>• No transaction fees</p>
                    <p className={`text-xs ${textMuted}`}>• 1-2 business days</p>
                  </div>
                  <button 
                    onClick={() => {
                      setSelectedPaymentMethod('equity');
                      setShowPaymentModal(true);
                    }}
                    className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors font-medium"
                  >
                    Pay via Equity
                  </button>
                </div>

                {/* UBA Bank */}
                <div className={`p-6 border-2 border-orange-200 rounded-xl hover:border-orange-300 transition-colors ${cardBg}`}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-orange-100 p-3 rounded-full">
                      <Building className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <h3 className={`font-semibold ${textPrimary}`}>UBA Uganda</h3>
                      <p className={`text-sm ${textSecondary}`}>Bank transfer</p>
                    </div>
                  </div>
                  <div className="space-y-2 mb-4">
                    <p className={`text-xs ${textMuted}`}>• Direct bank transfer</p>
                    <p className={`text-xs ${textMuted}`}>• No transaction fees</p>
                    <p className={`text-xs ${textMuted}`}>• 1-2 business days</p>
                  </div>
                  <button 
                    onClick={() => {
                      setSelectedPaymentMethod('uba');
                      setShowPaymentModal(true);
                    }}
                    className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition-colors font-medium"
                  >
                    Pay via UBA
                  </button>
                </div>
              </div>

              {/* Payment Instructions */}
              <div className={`mt-8 p-6 rounded-xl border ${borderColor} ${cardBg}`}>
                <h3 className={`text-lg font-semibold ${textPrimary} mb-4`}>Payment Instructions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className={`font-medium ${textPrimary} mb-2`}>Mobile Money Payments</h4>
                    <ol className={`space-y-1 text-sm ${textSecondary}`}>
                      <li>1. Dial the appropriate USSD code (*165# for MTN, *185# for Airtel)</li>
                      <li>2. Select "School Pay" or "Education"</li>
                      <li>3. Enter your student number</li>
                      <li>4. Select the fee type to pay</li>
                      <li>5. Enter your PIN to confirm</li>
                    </ol>
                  </div>
                  <div>
                    <h4 className={`font-medium ${textPrimary} mb-2`}>Bank Transfer Payments</h4>
                    <ol className={`space-y-1 text-sm ${textSecondary}`}>
                      <li>1. Visit your bank branch or use online banking</li>
                      <li>2. Select "School Fees Payment"</li>
                      <li>3. Enter school account details</li>
                      <li>4. Use your student number as reference</li>
                      <li>5. Complete the transaction</li>
                    </ol>
                  </div>
                </div>
              </div>

              {/* Bank Account Details */}
              {bankAccounts.length > 0 && (
                <div className={`mt-6 p-6 rounded-xl border ${borderColor} ${cardBg}`}>
                  <h3 className={`text-lg font-semibold ${textPrimary} mb-4`}>School Bank Account Details</h3>
                  <div className="space-y-4">
                    {bankAccounts.map((account, index) => (
                      <div key={index} className={`p-4 rounded-lg border ${borderColor} ${cardBg}`}>
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className={`font-medium ${textPrimary}`}>{account.bank_name}</h4>
                            <p className={`text-sm ${textSecondary}`}>Account: {account.account_number}</p>
                            <p className={`text-sm ${textSecondary}`}>Account Name: {account.account_name}</p>
                          </div>
                          <button 
                            onClick={() => {
                              navigator.clipboard.writeText(`${account.bank_name}\nAccount: ${account.account_number}\nAccount Name: ${account.account_name}`);
                              setShowCopyNotification(true);
                              setTimeout(() => setShowCopyNotification(false), 3000);
                            }}
                            className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
                          >
                            Copy Details
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 'history':
        return (
          <div className="space-y-6">
            {/* Payment History Tab Content */}
            <div className={`${cardBg} rounded-xl shadow-lg p-6 border`}>
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-2xl font-bold ${textPrimary}`}>Payment History</h2>
                <button 
                  onClick={() => {
                    const csvContent = "data:text/csv;charset=utf-8," 
                      + "Date,Description,Amount,Status\n"
                      + paymentHistory.map(p => `${p.date},${p.description},${p.amount},${p.status}`).join("\n");
                    const link = document.createElement("a");
                    link.setAttribute("href", encodeURI(csvContent));
                    link.setAttribute("download", `payment_history_${new Date().toISOString().split('T')[0]}.csv`);
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </button>
              </div>

              <div className="space-y-4">
                {paymentHistory.length > 0 ? (
                  paymentHistory.map((payment) => (
                    <div key={payment.id} className={`flex items-center justify-between p-4 rounded-lg border ${borderColor} ${cardBg}`}>
                      <div className="flex items-center gap-4">
                        <div className={`w-3 h-3 rounded-full ${
                          payment.status === 'completed' ? 'bg-green-500' : 
                          payment.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                        }`}></div>
                        <div>
                          <p className={`font-medium ${textPrimary}`}>{formatCurrency(payment.amount)}</p>
                          <p className={`text-sm ${textSecondary}`}>{payment.method} • {payment.fee_type}</p>
                          <p className={`text-xs ${textMuted}`}>
                            {new Date(payment.initiated_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          payment.status === 'completed' ? 'bg-green-100 text-green-800' :
                          payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {payment.status}
                        </span>
                        <button className={`p-2 ${textMuted} hover:${textPrimary}`}>
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <DollarSign className={`w-16 h-16 ${textMuted} mx-auto mb-4`} />
                    <p className={`${textSecondary} text-lg font-medium`}>No payment history yet</p>
                    <p className={`${textMuted} text-sm mt-2`}>Your payment transactions will appear here</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      default: // overview
        return (
          <div className="space-y-6">
            {/* Fee Balance Section */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-6 mb-8 text-white">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Fee Balance Overview</h2>
                  <p className="text-blue-100">Current outstanding fees and payment status</p>
                </div>
                <div className="bg-white bg-opacity-20 rounded-full p-3">
                  <DollarSign className="w-8 h-8 text-white" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white bg-opacity-10 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm font-medium">Current Balance</p>
                      <p className="text-2xl font-bold">
                        {formatCurrency(paymentSummary?.total_pending || 0)}
                      </p>
                    </div>
                    <AlertTriangle className="w-6 h-6 text-yellow-300" />
                  </div>
                </div>
                
                <div className="bg-white bg-opacity-10 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm font-medium">Overdue Amount</p>
                      <p className="text-2xl font-bold">
                        {formatCurrency((paymentSummary?.total_overdue ?? paymentSummary?.total_pending) || 0)}
                      </p>
                    </div>
                    <Clock className="w-6 h-6 text-red-300" />
                  </div>
                </div>
                
                <div className="bg-white bg-opacity-10 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm font-medium">Next Due Date</p>
                      <p className="text-lg font-semibold">
                        {paymentSummary?.next_due_date 
                          ? new Date(paymentSummary.next_due_date).toLocaleDateString('en-UG', { year: 'numeric', month: 'short', day: 'numeric' })
                          : '—'}
                      </p>
                    </div>
                    <CheckCircle className="w-6 h-6 text-green-300" />
                  </div>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-white bg-opacity-10 rounded-lg">
                <p className="text-sm text-blue-100">
                  <strong>Payment Status:</strong> You have outstanding fees for Term 3. Please make payment to avoid late fees.
                </p>
              </div>
            </div>

            {/* Summary Cards */}
            {paymentSummary && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Payments</p>
                      <p className="text-2xl font-bold text-blue-600">{paymentSummary.total_payments}</p>
                    </div>
                    <div className="bg-blue-100 rounded-full p-3">
                      <CreditCard className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Paid</p>
                      <p className="text-2xl font-bold text-green-600">{formatCurrency(paymentSummary.total_paid)}</p>
                    </div>
                    <div className="bg-green-100 rounded-full p-3">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Pending</p>
                      <p className="text-2xl font-bold text-yellow-600">{formatCurrency(paymentSummary.total_pending)}</p>
                    </div>
                    <div className="bg-yellow-100 rounded-full p-3">
                      <Clock className="w-6 h-6 text-yellow-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Success Rate</p>
                      <p className="text-2xl font-bold text-purple-600">{paymentSummary.payment_success_rate}%</p>
                    </div>
                    <div className="bg-purple-100 rounded-full p-3">
                      <DollarSign className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Payment Options */}
            <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Payment Options</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* MTN Mobile Money */}
                <div className="p-4 border-2 border-yellow-200 rounded-xl hover:border-yellow-300 transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    <Smartphone className="w-6 h-6 text-yellow-600" />
                    <div>
                      <p className="font-medium text-gray-900">MTN Mobile Money</p>
                      <p className="text-sm text-gray-500">Dial *165#</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      setSelectedPaymentMethod('mtn');
                      setShowPaymentModal(true);
                    }}
                    className="w-full bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600 transition-colors"
                  >
                    Pay with MTN
                  </button>
                </div>

                {/* Airtel Money */}
                <div className="p-4 border-2 border-red-200 rounded-xl hover:border-red-300 transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    <Smartphone className="w-6 h-6 text-red-600" />
                    <div>
                      <p className="font-medium text-gray-900">Airtel Money</p>
                      <p className="text-sm text-gray-500">Dial *185#</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      setSelectedPaymentMethod('airtel');
                      setShowPaymentModal(true);
                    }}
                    className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Pay with Airtel
                  </button>
                </div>

                {/* Stanbic Bank */}
                <div className="p-4 border-2 border-blue-200 rounded-xl hover:border-blue-300 transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    <Building className="w-6 h-6 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900">Stanbic Bank</p>
                      <p className="text-sm text-gray-500">Bank transfer</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      setSelectedPaymentMethod('stanbic');
                      setShowPaymentModal(true);
                    }}
                    className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Pay via Stanbic
                  </button>
                </div>

                {/* Centenary Bank */}
                <div className="p-4 border-2 border-purple-200 rounded-xl hover:border-purple-300 transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    <Building className="w-6 h-6 text-purple-600" />
                    <div>
                      <p className="font-medium text-gray-900">Centenary Bank</p>
                      <p className="text-sm text-gray-500">Bank transfer</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      setSelectedPaymentMethod('centenary');
                      setShowPaymentModal(true);
                    }}
                    className="w-full bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600 transition-colors"
                  >
                    Pay via Centenary
                  </button>
                </div>

                {/* Equity Bank */}
                <div className="p-4 border-2 border-green-200 rounded-xl hover:border-green-300 transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    <Building className="w-6 h-6 text-green-600" />
                    <div>
                      <p className="font-medium text-gray-900">Equity Bank</p>
                      <p className="text-sm text-gray-500">Bank transfer</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      setSelectedPaymentMethod('equity');
                      setShowPaymentModal(true);
                    }}
                    className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors"
                  >
                    Pay via Equity
                  </button>
                </div>

                {/* UBA Bank */}
                <div className="p-4 border-2 border-orange-200 rounded-xl hover:border-orange-300 transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    <Building className="w-6 h-6 text-orange-600" />
                    <div>
                      <p className="font-medium text-gray-900">UBA Uganda</p>
                      <p className="text-sm text-gray-500">Bank transfer</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      setSelectedPaymentMethod('uba');
                      setShowPaymentModal(true);
                    }}
                    className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    Pay via UBA
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className={`${containerBg} min-h-screen p-6`}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className={`text-3xl font-bold ${textPrimary} mb-2`}>Payment Management</h1>
          <p className={`${textSecondary}`}>Manage your school fee payments and view transaction history</p>
        </div>

        {/* Navigation Tabs */}
        <div className={`${cardBg} rounded-xl shadow-lg mb-6 border`}>
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Overview', icon: TrendingUp },
                { id: 'payment-plans', label: 'Payment Plans', icon: Calendar },
                { id: 'history', label: 'Payment History', icon: Clock },
                { id: 'methods', label: 'Payment Methods', icon: CreditCard }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    // Only use parent navigation for specific tabs that have app-level equivalents
                    if (userRole === 'admin' && typeof parentSetActiveTab === 'function') {
                      if (tab.id === 'history') {
                        parentSetActiveTab('payment-history');
                      } else if (tab.id === 'payment-plans') {
                        parentSetActiveTab('payment-plans');
                      } else {
                        // For overview and methods, stay within PaymentPanel
                        setActiveTab(tab.id);
                      }
                    } else {
                      setActiveTab(tab.id);
                    }
                  }}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {renderTabContent()}

        {/* Professional Payment Modal */}
        {showPaymentModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              {selectedPaymentMethod === 'mtn' && (
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="bg-yellow-100 p-3 rounded-full">
                        <Smartphone className="w-6 h-6 text-yellow-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">MTN Mobile Money</h3>
                        <p className="text-sm text-gray-500">Complete your payment</p>
                      </div>
                    </div>
                    <button onClick={() => setShowPaymentModal(false)} className="text-gray-400 hover:text-gray-600">
                      ✕
                    </button>
                  </div>
                  
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                    <p className="font-semibold text-yellow-900 mb-2">Payment Instructions</p>
                    <ol className="space-y-2 text-sm text-yellow-800">
                      <li className="flex items-start"><span className="font-bold mr-2">1.</span> Dial *165# on your MTN phone</li>
                      <li className="flex items-start"><span className="font-bold mr-2">2.</span> Select "School Pay"</li>
                      <li className="flex items-start"><span className="font-bold mr-2">3.</span> Enter your Student Number</li>
                      <li className="flex items-start"><span className="font-bold mr-2">4.</span> Select the fee to pay</li>
                      <li className="flex items-start"><span className="font-bold mr-2">5.</span> Enter your PIN to confirm</li>
                    </ol>
                  </div>

                  <div className="space-y-3">
                    <a 
                      href="tel:*165#"
                      className="block w-full bg-yellow-500 text-white py-3 rounded-lg font-semibold hover:bg-yellow-600 transition-colors text-center"
                    >
                      📱 Dial *165# Now
                    </a>
                    
                    {studentNumber && (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600 mb-2">Your Student Number:</p>
                        <div className="flex items-center gap-2">
                          <input 
                            type="text" 
                            value={studentNumber} 
                            readOnly 
                            className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg font-mono font-bold text-lg"
                          />
                          <button 
                            onClick={() => {
                              navigator.clipboard.writeText(studentNumber);
                              alert('Student Number copied to clipboard!');
                            }}
                            className="px-4 py-2 bg-yellow-500 text-white rounded-lg font-semibold hover:bg-yellow-600 transition-colors"
                          >
                            Copy
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <button 
                    onClick={() => setShowPaymentModal(false)}
                    className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                  >
                    Close
                  </button>
                </div>
              )}

              {selectedPaymentMethod === 'airtel' && (
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="bg-red-100 p-3 rounded-full">
                        <Smartphone className="w-6 h-6 text-red-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">Airtel Money</h3>
                        <p className="text-sm text-gray-500">Complete your payment</p>
                      </div>
                    </div>
                    <button onClick={() => setShowPaymentModal(false)} className="text-gray-400 hover:text-gray-600">
                      ✕
                    </button>
                  </div>
                  
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <p className="font-semibold text-red-900 mb-2">Payment Instructions</p>
                    <ol className="space-y-2 text-sm text-red-800">
                      <li className="flex items-start"><span className="font-bold mr-2">1.</span> Dial *185# on your Airtel phone</li>
                      <li className="flex items-start"><span className="font-bold mr-2">2.</span> Select "School Pay"</li>
                      <li className="flex items-start"><span className="font-bold mr-2">3.</span> Enter your Student Number</li>
                      <li className="flex items-start"><span className="font-bold mr-2">4.</span> Select the fee to pay</li>
                      <li className="flex items-start"><span className="font-bold mr-2">5.</span> Enter your PIN to confirm</li>
                    </ol>
                  </div>

                  <div className="space-y-3">
                    <a 
                      href="tel:*185#"
                      className="block w-full bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors text-center"
                    >
                      📱 Dial *185# Now
                    </a>
                    
                    {studentNumber && (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600 mb-2">Your Student Number:</p>
                        <div className="flex items-center gap-2">
                          <input 
                            type="text" 
                            value={studentNumber} 
                            readOnly 
                            className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg font-mono font-bold text-lg"
                          />
                          <button 
                            onClick={() => {
                              navigator.clipboard.writeText(studentNumber);
                              alert('Student Number copied to clipboard!');
                            }}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors"
                          >
                            Copy
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <button 
                    onClick={() => setShowPaymentModal(false)}
                    className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                  >
                    Close
                  </button>
                </div>
              )}

              {/* Bank payment modals would go here */}
            </div>
          </div>
        )}

        {/* Copy Notification */}
        {showCopyNotification && (
          <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <span>Student Number copied to clipboard!</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentPanel;