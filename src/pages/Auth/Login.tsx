import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/ui/Toast';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Phone, ArrowRight, UserCheck, ShieldAlert, KeyRound } from 'lucide-react';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();

  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'farmer' | 'admin'>('farmer');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 10) {
      toast('कृपया १० अंकों का सही मोबाइल नंबर भरें।', 'warning');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep('otp');
      toast('लॉगिन ओटीपी (OTP) सफलतापूर्वक भेजा गया (परीक्षण के लिए 123456 दर्ज करें)।', 'success');
    }, 1000);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 4) {
      toast('कृपया सही ओटीपी दर्ज करें।', 'warning');
      return;
    }
    
    setIsLoading(true);
    try {
      await login(phone, role);
      toast('सफलतापूर्वक लॉगिन हो गया!', 'success');
      navigate('/dashboard');
    } catch (err: any) {
      toast(err.message || 'लॉगिन विफल रहा। कृपया पुनः प्रयास करें।', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-mesh flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 glass" hoverLift={false}>
        {/* Brand */}
        <div className="flex flex-col items-center mb-8">
          <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg mb-3">
            <span className="text-2xl font-bold font-display">KM</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-850 dark:text-slate-100">बुंदेली कृषि मित्र</h2>
          <p className="text-sm text-slate-400 mt-1">सुरक्षित और आसान पासवर्ड-रहित लॉगिन</p>
        </div>

        {/* Role Toggle Switch */}
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl mb-6">
          <button
            type="button"
            onClick={() => { setRole('farmer'); setStep('phone'); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold rounded-lg transition-all ${
              role === 'farmer'
                ? 'bg-white dark:bg-slate-700 text-primary dark:text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
            }`}
          >
            <UserCheck className="h-4 w-4" />
            <span>किसान भाई</span>
          </button>
          <button
            type="button"
            onClick={() => { setRole('admin'); setStep('phone'); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold rounded-lg transition-all ${
              role === 'admin'
                ? 'bg-white dark:bg-slate-700 text-red-600 dark:text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
            }`}
          >
            <ShieldAlert className="h-4 w-4" />
            <span>कृषि वैज्ञानिक (Admin)</span>
          </button>
        </div>

        {step === 'phone' ? (
          /* Phone Stage */
          <form onSubmit={handleSendOtp} className="space-y-5 text-left">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                मोबाइल नंबर (Phone Number)
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                <input
                  type="tel"
                  maxLength={10}
                  placeholder="अपना 10 अंकों का नंबर डालें"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  className="w-full bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl py-3 pl-11 pr-4 text-slate-800 dark:text-slate-100 font-medium placeholder-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  required
                />
              </div>
            </div>

            <Button
              variant="primary"
              className="w-full py-3"
              isLoading={isLoading}
              rightIcon={<ArrowRight className="h-5 w-5" />}
              type="submit"
            >
              ओटीपी प्राप्त करें
            </Button>
          </form>
        ) : (
          /* OTP Stage */
          <form onSubmit={handleVerifyOtp} className="space-y-5 text-left">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                ओटीपी दर्ज करें (Enter OTP)
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  maxLength={6}
                  placeholder="6 अंकों का ओटीपी कोड दर्ज करें"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  className="w-full bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl py-3 pl-11 pr-4 text-slate-800 dark:text-slate-100 font-bold tracking-widest placeholder-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  required
                />
              </div>
              <button
                type="button"
                onClick={() => setStep('phone')}
                className="text-xs text-primary font-semibold hover:underline mt-2 inline-block"
              >
                ← मोबाइल नंबर बदलें
              </button>
            </div>

            <Button
              variant="primary"
              className="w-full py-3"
              isLoading={isLoading}
              type="submit"
            >
              सत्यापित करें और लॉगिन करें
            </Button>
          </form>
        )}

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-100 dark:border-slate-800"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white dark:bg-slate-900 px-3 text-slate-400 font-semibold">या</span>
          </div>
        </div>

        {/* Google Login Mock Button */}
        <Button
          variant="outline"
          className="w-full py-3 border border-slate-200 dark:border-slate-700"
          type="button"
          onClick={() => {
            toast('गूगल लॉगिन सिमुलेशन सक्रिय! कल्याण सिंह के रूप में लॉगिन किया जा रहा है।', 'success');
            login('9876543210', 'farmer').then(() => navigate('/dashboard'));
          }}
        >
          <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.147 4.114-3.478 0-6.3-2.823-6.3-6.3 0-3.478 2.822-6.3 6.3-6.3 1.506 0 2.882.533 3.974 1.419l3.07-3.07C18.966 2.213 15.828 1 12.24 1C6.033 1 1 6.033 1 12.24s5.033 11.24 11.24 11.24c5.898 0 10.871-4.212 10.871-11.24 0-.768-.082-1.39-.23-1.955H12.24z" />
          </svg>
          गूगल (Google) से जुड़ें
        </Button>

        {/* Sign up prompt */}
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-6 text-center">
          खाता नहीं है?{' '}
          <Link to="/register" className="text-primary font-bold hover:underline">
            पंजीकरण करें (Sign Up)
          </Link>
        </p>
      </Card>
    </div>
  );
};
