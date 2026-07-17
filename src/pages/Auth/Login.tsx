import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/ui/Toast';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Phone, ArrowRight, KeyRound } from 'lucide-react';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();

  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 10) {
      toast('कृपया १० अंकों का सही मोबाइल नंबर भरें।', 'warning');
      return;
    }
    if (!password) {
      toast('कृपया अपना पासवर्ड दर्ज करें।', 'warning');
      return;
    }
    
    setIsLoading(true);
    try {
      await login(phone, password);
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
          <p className="text-sm text-slate-400 mt-1">अपने खाते में सुरक्षित लॉगिन करें</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5 text-left">
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

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              पासवर्ड (Password)
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
              <input
                type="password"
                placeholder="अपना पासवर्ड डालें"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl py-3 pl-11 pr-4 text-slate-800 dark:text-slate-100 font-medium placeholder-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                required
              />
            </div>
          </div>

          <Button
            variant="primary"
            className="w-full py-3 mt-4"
            isLoading={isLoading}
            rightIcon={<ArrowRight className="h-5 w-5" />}
            type="submit"
          >
            लॉगिन करें
          </Button>
        </form>

        {/* Sign up prompt */}
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-8 text-center">
          खाता नहीं है?{' '}
          <Link to="/register" className="text-primary font-bold hover:underline">
            पंजीकरण करें (Sign Up)
          </Link>
        </p>
      </Card>
    </div>
  );
};
