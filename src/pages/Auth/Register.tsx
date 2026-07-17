import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/ui/Toast';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { User, Phone, MapPin, Check } from 'lucide-react';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { toast } = useToast();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [district, setDistrict] = useState('झाँसी');
  const [selectedCrops, setSelectedCrops] = useState<string[]>(['गेहूं']);
  const [isLoading, setIsLoading] = useState(false);

  const districts = ['झाँसी', 'टीकमगढ़', 'सागर', 'छतरपुर', 'ललितपुर', 'दमोह'];
  const cropOptions = ['गेहूं', 'चना', 'सोयाबीन', 'सरसों', 'टमाटर'];

  const toggleCrop = (crop: string) => {
    if (selectedCrops.includes(crop)) {
      setSelectedCrops((prev) => prev.filter((c) => c !== crop));
    } else {
      setSelectedCrops((prev) => [...prev, crop]);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast('कृपया अपना नाम दर्ज करें।', 'warning');
      return;
    }
    if (phone.length < 10) {
      toast('कृपया १० अंकों का सही मोबाइल नंबर दर्ज करें।', 'warning');
      return;
    }
    if (selectedCrops.length === 0) {
      toast('कृपया कम से कम एक मुख्य फसल का चयन करें।', 'warning');
      return;
    }

    setIsLoading(true);
    try {
      await register(name, phone, district, selectedCrops);
      toast('पंजीकरण सफल! बुंदेली कृषि मित्र ऐप में आपका स्वागत है।', 'success');
      navigate('/dashboard');
    } catch (err: any) {
      toast(err.message || 'पंजीकरण विफल रहा। कृपया पुनः प्रयास करें।', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-mesh flex items-center justify-center p-4 py-12">
      <Card className="w-full max-w-lg p-8 glass" hoverLift={false}>
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg mb-3">
            <span className="text-2xl font-bold font-display">KM</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">नया किसान पंजीकरण</h2>
          <p className="text-sm text-slate-400 mt-1">ताजा मंडी भाव और फसल डॉक्टरों से जुड़ें</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5 text-left">
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              किसान भाई का नाम (Full Name)
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="अपना नाम भरें"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl py-3 pl-11 pr-4 text-slate-800 dark:text-slate-100 font-medium focus:outline-none focus:border-primary"
                required
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              मोबाइल नंबर (Phone Number)
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
              <input
                type="tel"
                maxLength={10}
                placeholder="अपना 10 अंकों का मोबाइल नंबर डालें"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                className="w-full bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl py-3 pl-11 pr-4 text-slate-800 dark:text-slate-100 font-medium focus:outline-none focus:border-primary"
                required
              />
            </div>
          </div>

          {/* District Select */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              जिला (District)
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl py-3 pl-11 pr-4 text-slate-800 dark:text-slate-100 font-medium focus:outline-none focus:border-primary cursor-pointer appearance-none"
              >
                {districts.map((d) => (
                  <option key={d} value={d} className="dark:bg-slate-900">
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Preferred Crops Selection */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
              मुख्य फसलें (Preferred Crops)
            </label>
            <div className="flex flex-wrap gap-2">
              {cropOptions.map((crop) => {
                const isSelected = selectedCrops.includes(crop);
                return (
                  <button
                    key={crop}
                    type="button"
                    onClick={() => toggleCrop(crop)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-primary text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {isSelected && <Check className="h-4 w-4" />}
                    <span>{crop}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <Button
            variant="primary"
            className="w-full py-3.5 mt-2"
            isLoading={isLoading}
            type="submit"
          >
            खाता बनाएं और प्रवेश करें
          </Button>
        </form>

        <p className="text-sm text-slate-500 dark:text-slate-400 mt-6 text-center">
          पहले से पंजीकृत हैं?{' '}
          <Link to="/login" className="text-primary font-bold hover:underline">
            लॉगिन करें (Sign In)
          </Link>
        </p>
      </Card>
    </div>
  );
};
