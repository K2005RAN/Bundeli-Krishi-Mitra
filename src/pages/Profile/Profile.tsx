import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/ui/Toast';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import {
  User,
  Phone,
  MapPin,
  Check,
  Languages,
  Sun,
  Moon,
  Sparkles
} from 'lucide-react';

export const Profile: React.FC = () => {
  const { user, updateUser, theme, toggleTheme } = useAuth();
  const { toast } = useToast();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [district, setDistrict] = useState(user?.district || 'झाँसी');
  const [language, setLanguage] = useState(user?.language || 'Bundeli');
  const [selectedCrops, setSelectedCrops] = useState<string[]>(user?.preferredCrops || ['गेहूं']);
  const [isUpdating, setIsUpdating] = useState(false);

  const districts = ['झाँसी', 'टीकमगढ़', 'सागर', 'छतरपुर', 'ललितपुर', 'दमोह'];
  const languagesOptions = ['Bundeli', 'Hindi', 'English'];
  const cropOptions = ['गेहूं', 'चना', 'सोयाबीन', 'सरसों', 'टमाटर'];

  const toggleCrop = (crop: string) => {
    if (selectedCrops.includes(crop)) {
      setSelectedCrops(prev => prev.filter(c => c !== crop));
    } else {
      setSelectedCrops(prev => [...prev, crop]);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast('नाम खाली नहीं हो सकता।', 'warning');
      return;
    }
    if (phone.length < 10) {
      toast('सही मोबाइल नंबर भरें।', 'warning');
      return;
    }
    if (selectedCrops.length === 0) {
      toast('कम से कम एक फसल चुनें।', 'warning');
      return;
    }

    setIsUpdating(true);
    try {
      const updated = {
        ...user!,
        name,
        phone,
        district,
        language: language as any,
        preferredCrops: selectedCrops
      };
      await updateUser(updated);
      toast('प्रोफ़ाइल जानकारी सफलतापूर्वक अपडेट कर दी गई है!', 'success');
    } catch (err) {
      toast('प्रोफ़ाइल अपडेट करने में त्रुटि हुई।', 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6 text-left pb-12">
      {/* Header */}
      <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <User className="h-6 w-6 text-primary" />
          किसान प्रोफ़ाइल एवं सेटिंग्स (Profile & Settings)
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          अपनी भाषा, जिले और फसलों का विवरण व्यवस्थित करें।
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form */}
        <div className="lg:col-span-8">
          <Card>
            <CardContent className="py-6">
              <form onSubmit={handleUpdate} className="space-y-6">
                {/* Grid Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                      किसान भाई का नाम
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-3.5 h-4.5 w-4.5 text-slate-400" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl py-3 pl-11 pr-4 text-xs font-semibold text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                      मोबाइल नंबर
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3.5 h-4.5 w-4.5 text-slate-400" />
                      <input
                        type="tel"
                        maxLength={10}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                        className="w-full bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl py-3 pl-11 pr-4 text-xs font-bold text-slate-700 dark:text-slate-350 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* District Select */}
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                      जिला (District)
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3.5 h-4.5 w-4.5 text-slate-400" />
                      <select
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl py-3 pl-11 pr-4 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none appearance-none cursor-pointer"
                      >
                        {districts.map((d) => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Language Select */}
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                      पसंदीदा भाषा (Language)
                    </label>
                    <div className="relative">
                      <Languages className="absolute left-3 top-3.5 h-4.5 w-4.5 text-slate-400" />
                      <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value as any)}
                        className="w-full bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl py-3 pl-11 pr-4 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none appearance-none cursor-pointer"
                      >
                        {languagesOptions.map((l) => (
                          <option key={l} value={l}>
                            {l === 'Bundeli' ? 'बुंदेली (Bundeli)' : l === 'Hindi' ? 'हिंदी (Hindi)' : 'English'}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Crops chips selection */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                    मुख्य फसलें (Crops)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {cropOptions.map((crop) => {
                      const isSelected = selectedCrops.includes(crop);
                      return (
                        <button
                          key={crop}
                          type="button"
                          onClick={() => toggleCrop(crop)}
                          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-primary text-white shadow-sm'
                              : 'bg-slate-50 dark:bg-slate-850 text-slate-550 dark:text-slate-450 hover:bg-slate-100'
                          }`}
                        >
                          {isSelected && <Check className="h-4 w-4" />}
                          <span>{crop}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="border-t border-slate-100 dark:border-slate-800 pt-6 flex justify-end">
                  <Button
                    variant="primary"
                    type="submit"
                    className="w-full sm:w-auto px-8"
                    isLoading={isUpdating}
                  >
                    सहेजें (Save Settings)
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Right Settings Cards */}
        <div className="lg:col-span-4 space-y-6">
          {/* Quick theme toggler */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-bold text-slate-500">डिस्प्ले थीम</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-xs text-slate-400 font-semibold leading-relaxed">किसान मित्र ऐप में रात की सुविधा के लिए डार्क मोड की सुविधा है।</p>
              
              <div className="flex bg-slate-50 dark:bg-slate-800/40 p-1.5 rounded-xl border border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => theme === 'dark' && toggleTheme()}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    theme === 'light'
                      ? 'bg-white dark:bg-slate-700 text-primary dark:text-white shadow-sm font-extrabold'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-750'
                  }`}
                >
                  <Sun className="h-4 w-4 text-accent" />
                  <span>दिन (Light)</span>
                </button>
                <button
                  onClick={() => theme === 'light' && toggleTheme()}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    theme === 'dark'
                      ? 'bg-white dark:bg-slate-700 text-primary dark:text-white shadow-sm font-extrabold'
                      : 'text-slate-550 dark:text-slate-400 hover:text-slate-750'
                  }`}
                >
                  <Moon className="h-4 w-4" />
                  <span>रात (Dark)</span>
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Quick support info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-bold text-slate-500">किसान हेल्पलाइन</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5 text-xs leading-relaxed font-semibold">
              <p className="text-slate-550 dark:text-slate-400">यदि ऐप में कोई तकनीकी समस्या है तो कृपया संपर्क करें:</p>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl space-y-1">
                <p className="text-[10px] text-slate-400">हेल्पलाइन नंबर</p>
                <p className="text-sm font-extrabold text-slate-800 dark:text-slate-200 font-display">1800-180-1551</p>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl space-y-1">
                <p className="text-[10px] text-slate-400">ईमेल पता</p>
                <p className="text-xs font-extrabold text-slate-800 dark:text-slate-200">support@kisanmitra.gov.in</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
