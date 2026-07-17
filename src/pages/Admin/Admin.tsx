import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { mockApi } from '../../services/mockApi';
import { User, MandiPrice, BroadcastAdvisory } from '../../types';
import { useToast } from '../../components/ui/Toast';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import {
  ShieldAlert,
  Send,
  CircleDollarSign,
  Users,
  Megaphone,
  TrendingUp,
  RefreshCw,
  PlusCircle,
  FileText
} from 'lucide-react';
import { motion } from 'framer-motion';

export const Admin: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [users, setUsers] = useState<User[]>([]);
  const [mandis, setMandis] = useState<MandiPrice[]>([]);
  const [advisories, setAdvisories] = useState<BroadcastAdvisory[]>([]);
  const [loading, setLoading] = useState(true);

  // Advisory broadcast form state
  const [advisoryTitle, setAdvisoryTitle] = useState('');
  const [advisoryContent, setAdvisoryContent] = useState('');
  const [advisoryContentBundeli, setAdvisoryContentBundeli] = useState('');
  const [advisoryCategory, setAdvisoryCategory] = useState<'pest' | 'weather' | 'general'>('general');
  const [isBroadcasting, setIsBroadcasting] = useState(false);

  // Price editor state
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [editPriceValue, setEditPriceValue] = useState('');
  const [isUpdatingPrice, setIsUpdatingPrice] = useState(false);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const uData = await mockApi.getUsersList();
      const mData = await mockApi.getMandiPrices();
      const aData = await mockApi.getAdvisories();
      
      setUsers(uData);
      setMandis(mData);
      setAdvisories(aData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'admin') {
      loadAdminData();
    }
  }, [user]);

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!advisoryTitle.trim() || !advisoryContent.trim() || !advisoryContentBundeli.trim()) {
      toast('कृपया सभी फ़ील्ड भरें।', 'warning');
      return;
    }

    setIsBroadcasting(true);
    try {
      await mockApi.broadcastAdvisory(
        advisoryTitle,
        advisoryContent,
        advisoryContentBundeli,
        advisoryCategory
      );
      toast('सलाह/चेतावनी का प्रसारण सफलतापूर्वक कर दिया गया है!', 'success');
      
      // Reset form
      setAdvisoryTitle('');
      setAdvisoryContent('');
      setAdvisoryContentBundeli('');
      
      // Reload lists
      const aData = await mockApi.getAdvisories();
      setAdvisories(aData);
    } catch (err) {
      toast('प्रसारण विफल रहा।', 'error');
    } finally {
      setIsBroadcasting(false);
    }
  };

  const handlePriceUpdate = async (id: string) => {
    const priceNum = parseInt(editPriceValue);
    if (isNaN(priceNum) || priceNum <= 0) {
      toast('कृपया सही मूल्य दर्ज करें।', 'warning');
      return;
    }

    setIsUpdatingPrice(true);
    try {
      await mockApi.updateMandiPrice(id, priceNum);
      toast('मंडी दर सफलतापूर्वक अपडेट कर दी गई है!', 'success');
      setEditingPriceId(null);
      setEditPriceValue('');
      
      // Reload
      const mData = await mockApi.getMandiPrices();
      setMandis(mData);
    } catch (err) {
      toast('मूल्य अपडेट करने में असमर्थ।', 'error');
    } finally {
      setIsUpdatingPrice(false);
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="p-8 text-center max-w-md mx-auto space-y-4">
        <ShieldAlert className="h-16 w-16 text-red-500 mx-auto" />
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">पहुंच वर्जित (Access Denied)</h3>
        <p className="text-sm text-slate-500">यह पैनल केवल अधिकृत कृषि वैज्ञानिकों के लिए ही उपलब्ध है।</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left pb-12">
      {/* Header */}
      <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <ShieldAlert className="h-6 w-6 text-red-500" />
          कृषि वैज्ञानिक प्रशासन कंसोल (Admin Control Panel)
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          यहाँ से किसानों को मौसम चेतावनी प्रसारित करें और मंडी भाव को अपडेट करें।
        </p>
      </div>

      {/* Stats Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400 flex items-center justify-center">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">कुल पंजीकृत किसान</span>
            <p className="text-2xl font-extrabold text-slate-800 dark:text-white font-display mt-0.5">{users.length}</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-yellow-50 text-yellow-600 dark:bg-yellow-950/30 dark:text-yellow-400 flex items-center justify-center">
            <CircleDollarSign className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">मंडी फसलें ट्रैक</span>
            <p className="text-2xl font-extrabold text-slate-800 dark:text-white font-display mt-0.5">{mandis.length}</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400 flex items-center justify-center">
            <Megaphone className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">सक्रिय ब्रॉडकास्ट</span>
            <p className="text-2xl font-extrabold text-slate-800 dark:text-white font-display mt-0.5">{advisories.length}</p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Broadcast form */}
        <div className="lg:col-span-6 space-y-6">
          <Card>
            <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-3">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Megaphone className="h-5 w-5 text-primary animate-bounce" />
                किसानों के लिए चेतावनी प्रसारित करें (Broadcast Advisory)
              </CardTitle>
            </CardHeader>
            <CardContent className="py-5">
              <form onSubmit={handleBroadcast} className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">शीर्षक (Title in Hindi)</label>
                  <input
                    type="text"
                    value={advisoryTitle}
                    onChange={(e) => setAdvisoryTitle(e.target.value)}
                    placeholder="जैसे: कीड़ा प्रकोप या वर्षा अलर्ट"
                    className="w-full bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 px-4 text-xs font-semibold text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-primary"
                    required
                  />
                </div>

                {/* Category select */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">श्रेणी (Category)</label>
                  <select
                    value={advisoryCategory}
                    onChange={(e) => setAdvisoryCategory(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 px-4 text-xs font-semibold text-slate-700 dark:text-slate-355 focus:outline-none cursor-pointer"
                  >
                    <option value="weather">⚠️ मौसम चेतावनी (Weather Alert)</option>
                    <option value="pest">🐛 कीट/बीमारी चेतावनी (Pest Warning)</option>
                    <option value="general">ℹ️ सामान्य कृषि सलाह (General Info)</option>
                  </select>
                </div>

                {/* Content Hindi */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">सलाह संदेश (Hindi)</label>
                  <textarea
                    rows={3}
                    value={advisoryContent}
                    onChange={(e) => setAdvisoryContent(e.target.value)}
                    placeholder="किसानों के लिए विस्तृत सलाह हिंदी में लिखें..."
                    className="w-full bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 px-4 text-xs font-semibold text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none"
                    required
                  />
                </div>

                {/* Content Bundeli */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">सलाह संदेश (बुंदेली अनुवाद - USP First)</label>
                  <textarea
                    rows={3}
                    value={advisoryContentBundeli}
                    onChange={(e) => setAdvisoryContentBundeli(e.target.value)}
                    placeholder="संदेश का बुंदेली बोली में अनुवाद यहाँ लिखें..."
                    className="w-full bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 px-4 text-xs font-semibold text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none"
                    required
                  />
                </div>

                <Button
                  variant="danger"
                  className="w-full py-3"
                  isLoading={isBroadcasting}
                  leftIcon={<Send className="h-4.5 w-4.5" />}
                  type="submit"
                >
                  ब्रॉडकास्ट जारी करें
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Right: Mandi Editor List */}
        <div className="lg:col-span-6 space-y-6">
          <Card>
            <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <CircleDollarSign className="h-5 w-5 text-primary" />
                मंडी भाव प्रबंधन (Mandi Editor)
              </CardTitle>
              <button onClick={loadAdminData} className="p-1 rounded-lg hover:bg-slate-50 text-slate-400 cursor-pointer">
                <RefreshCw className="h-4 w-4" />
              </button>
            </CardHeader>

            <CardContent className="py-4 max-h-[520px] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                <p className="text-xs text-center text-slate-450 py-8">लोड हो रहा है...</p>
              ) : mandis.map((m, idx) => (
                <div key={m.id || idx} className="py-3 flex items-center justify-between gap-4 text-xs">
                  <div>
                    <h5 className="font-bold text-slate-800 dark:text-slate-200">{m.cropName.split(' ')[0]}</h5>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{m.mandiName} ({m.district})</p>
                  </div>

                  <div className="flex items-center gap-3">
                    {editingPriceId === m.id ? (
                      <div className="flex gap-2 items-center">
                        <input
                          type="number"
                          value={editPriceValue}
                          placeholder="दर"
                          onChange={(e) => setEditPriceValue(e.target.value)}
                          className="w-20 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-850 rounded-lg py-1.5 px-2 text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none"
                        />
                        <Button
                          variant="primary"
                          size="sm"
                          isLoading={isUpdatingPrice}
                          onClick={() => handlePriceUpdate(m.id)}
                        >
                          सहेजें
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-slate-400"
                          onClick={() => { setEditingPriceId(null); setEditPriceValue(''); }}
                        >
                          रद्द
                        </Button>
                      </div>
                    ) : (
                      <>
                        <span className="font-extrabold text-slate-800 dark:text-slate-250 font-display">₹{m.priceToday} / क्वि.</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => { setEditingPriceId(m.id); setEditPriceValue(m.priceToday.toString()); }}
                        >
                          बदलें
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
