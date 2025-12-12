import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { paymentApi } from '../../api/paymentApi';

const PaymentPage: React.FC = () => {
  const { orderId, amount } = useParams<{ orderId: string; amount: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedMethod, setSelectedMethod] = useState<'wechat' | 'alipay'>('wechat');
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // 验证参数
  useEffect(() => {
    if (!orderId || !amount || isNaN(Number(amount))) {
      navigate('/cart');
    }
  }, [orderId, amount, navigate]);

  // 处理支付方式选择
  const handleMethodChange = (method: 'wechat' | 'alipay') => {
    setSelectedMethod(method);
  };

  // 处理支付提交
  const handlePaymentSubmit = async () => {
    if (!orderId || !amount) return;

    try {
      setPaymentStatus('processing');
      setErrorMessage('');

      const paymentAmount = Number(amount);
      const response = await paymentApi.createPayment(orderId, paymentAmount, selectedMethod);

      setPaymentId(response.data.payment.transaction_id);

      // 根据支付方式处理不同的支付流程
      if (selectedMethod === 'wechat') {
        // 微信支付流程（这里简化处理）
        console.log('微信支付参数:', response.data.payParams);
        // 模拟支付成功
        simulatePaymentSuccess(response.data.payment.transaction_id);
      } else {
        // 支付宝支付流程（这里简化处理）
        console.log('支付宝支付参数:', response.data.payParams);
        // 模拟支付成功
        simulatePaymentSuccess(response.data.payment.transaction_id);
      }
    } catch (error: any) {
      console.error('支付失败:', error);
      setPaymentStatus('failed');
      setErrorMessage(error.response?.data?.message || '支付请求失败，请稍后重试');
    }
  };

  // 模拟支付成功（仅用于测试）
  const simulatePaymentSuccess = async (transactionId: string) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1500)); // 模拟支付过程
      await paymentApi.simulatePaymentSuccess?.(transactionId) || Promise.resolve();
      setPaymentStatus('success');
      
      // 支付成功后跳转到订单确认页面
      setTimeout(() => {
        navigate(`/order-confirm/${orderId}`);
      }, 2000);
    } catch (error) {
      console.error('模拟支付成功失败:', error);
      setPaymentStatus('failed');
      setErrorMessage('支付过程中出现错误，请稍后重试');
    }
  };

  // 取消支付
  const handleCancelPayment = () => {
    navigate('/checkout');
  };

  return (
    <div className="payment-page min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8 text-center">订单支付</h1>
        
        {errorMessage && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {errorMessage}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">订单信息</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">订单ID：</p>
              <p className="font-medium">{orderId}</p>
            </div>
            <div>
              <p className="text-gray-600">支付金额：</p>
              <p className="font-medium text-xl text-red-600">¥{amount}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-gray-600">用户：</p>
              <p className="font-medium">{user?.username || '未知用户'}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">选择支付方式</h2>
          <div className="flex flex-col space-y-4">
            <div 
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${selectedMethod === 'wechat' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-300'}`}
              onClick={() => handleMethodChange('wechat')}
            >
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                  微信
                </div>
                <div>
                  <h3 className="font-medium">微信支付</h3>
                  <p className="text-sm text-gray-500">支持微信扫码支付</p>
                </div>
                <div className="ml-auto">
                  {selectedMethod === 'wechat' && (
                    <div className="w-4 h-4 rounded-full border-2 border-green-500 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div 
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${selectedMethod === 'alipay' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}
              onClick={() => handleMethodChange('alipay')}
            >
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                  支付宝
                </div>
                <div>
                  <h3 className="font-medium">支付宝</h3>
                  <p className="text-sm text-gray-500">支持支付宝扫码支付</p>
                </div>
                <div className="ml-auto">
                  {selectedMethod === 'alipay' && (
                    <div className="w-4 h-4 rounded-full border-2 border-blue-500 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between space-y-4 sm:space-y-0">
          <button 
            className="px-6 py-3 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium transition-colors"
            onClick={handleCancelPayment}
            disabled={paymentStatus === 'processing'}
          >
            取消支付
          </button>
          <button 
            className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
            onClick={handlePaymentSubmit}
            disabled={paymentStatus === 'processing'}
          >
            {paymentStatus === 'processing' ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>处理中...</span>
              </>
            ) : (
              <span>确认支付</span>
            )}
          </button>
        </div>

        {/* 支付结果显示 */}
        {paymentStatus === 'success' && (
          <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white text-3xl mx-auto mb-4">
              ✓
            </div>
            <h3 className="text-xl font-bold text-green-700 mb-2">支付成功</h3>
            <p className="text-gray-600 mb-4">您的订单已支付完成</p>
            <p className="text-sm text-gray-500">支付ID：{paymentId}</p>
          </div>
        )}

        {paymentStatus === 'failed' && (
          <div className="mt-8 bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center text-white text-3xl mx-auto mb-4">
              ✗
            </div>
            <h3 className="text-xl font-bold text-red-700 mb-2">支付失败</h3>
            <p className="text-gray-600 mb-4">请检查支付信息后重试</p>
            <button 
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm"
              onClick={() => setPaymentStatus('idle')}
            >
              重新支付
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentPage;
