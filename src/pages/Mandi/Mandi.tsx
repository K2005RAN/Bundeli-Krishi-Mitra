import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { mockApi } from '../../services/mockApi';
import { MandiPrice } from '../../types';
import { useToast } from '../../components/ui/Toast';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import {
  TrendingUp,
  TrendingDown,
  Star,
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  CircleDollarSign,
  Locate,
  LineChart as LineIcon,
  ChevronDown,
  Leaf,
  MapPin
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

export const Mandi: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [pricesList, setPricesList] = useState<MandiPrice[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedCrop, setSelectedCrop] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'all' | 'favorites'>('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const [isMandiDropdownOpen, setIsMandiDropdownOpen] = useState(false);
  const [isCropDropdownOpen, setIsCropDropdownOpen] = useState(false);
  const [selectedMandi, setSelectedMandi] = useState<string>('');

  const currentDistrict = user?.district || 'दमोह';
  
  // Only show crop varieties that are actually available in the selected mandi
  const uniqueCrops = Array.from(new Set(
    pricesList
      .filter(p => p.district === currentDistrict && (!selectedMandi || p.mandiName === selectedMandi))
      .map(p => p.cropName)
  ));

  const availableMandis = Array.from(new Set(
    pricesList
      .filter(p => p.district === currentDistrict)
      .map(p => p.mandiName)
  ));

  useEffect(() => {
    const loadPrices = async () => {
      const data = await mockApi.getMandiPrices();
      setPricesList(data);
      setFavorites(mockApi.getFavoriteCrops());
      if (data.length > 0) {
        // Find mandis in user's district
        const mandisInDistrict = data.filter(p => p.district === currentDistrict);
        
        if (mandisInDistrict.length > 0) {
          setSelectedCrop(mandisInDistrict[0].cropName);
          setSelectedMandi(mandisInDistrict[0].mandiName);
        } else {
          setSelectedCrop(data[0].cropName);
          setSelectedMandi(data[0].mandiName);
        }
      }
    };
    loadPrices();
  }, []);

  const toggleFavorite = (cropName: string) => {
    const updated = mockApi.toggleFavoriteCrop(cropName);
    setFavorites(updated);
    toast(favorites.includes(cropName) ? 'पसंदीदा सूची से हटाया गया।' : 'पसंदीदा सूची में जोड़ा गया।', 'success');
  };

  const handleSortToggle = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    toast(`भाव ${sortOrder === 'asc' ? 'उच्च से निम्न' : 'निम्न से उच्च'} क्रम में किए गए।`, 'info');
  };

  // Filter prices list
  const filteredList = pricesList.filter((item) => {
    const matchesSearch = item.cropName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.mandiName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDistrict = item.district === currentDistrict;
    const matchesTab = activeTab === 'favorites' ? favorites.includes(item.cropName) : true;

    return matchesSearch && matchesDistrict && matchesTab;
  }).sort((a, b) => {
    return sortOrder === 'desc' ? b.priceToday - a.priceToday : a.priceToday - b.priceToday;
  });

  // Selected crop details for chart
  const activeCropDetails = pricesList.find(p => p.cropName === selectedCrop && p.district === currentDistrict && p.mandiName === selectedMandi) || 
                             pricesList.find(p => p.cropName === selectedCrop && p.district === currentDistrict) ||
                             pricesList.find(p => p.cropName === selectedCrop) ||
                             pricesList[0];

  return (
    <div className="space-y-6 text-left pb-12">
      {/* Header */}
      <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <CircleDollarSign className="h-6 w-6 text-primary" />
          ताज़ा मंडी बाज़ार भाव (Market Prices)
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          स्थानीय कृषि मंडियों के दैनिक थोक मूल्य सूचकांक और साप्ताहिक दर विश्लेषण।
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Price Graph & Comparison */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main selection and Graph widget */}
          {activeCropDetails && (
            <Card>
              <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleFavorite(activeCropDetails.cropName)}
                    className="p-1 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-400 hover:text-yellow-500 cursor-pointer"
                  >
                    <Star className={`h-6 w-6 ${favorites.includes(activeCropDetails.cropName) ? 'text-yellow-500 fill-yellow-500' : ''}`} />
                  </button>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 leading-none">
                      {activeCropDetails.cropName}
                    </h3>
                    <p className="text-xs text-slate-400 font-semibold mt-1">मंडी: {activeCropDetails.mandiName} ({activeCropDetails.district})</p>
                  </div>
                </div>

                {/* Modern Custom Dropdowns */}
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto mt-4 sm:mt-0 relative z-40">
                  {/* Mandi Selector */}
                  <div className="relative">
                    <div 
                      className="flex items-center justify-between gap-2 px-3.5 py-2.5 bg-primary/10 text-primary hover:bg-primary/15 border border-primary/20 rounded-xl text-xs font-extrabold cursor-pointer transition-colors w-full sm:w-auto min-w-[140px]" 
                      onClick={() => { setIsMandiDropdownOpen(!isMandiDropdownOpen); setIsCropDropdownOpen(false); }}
                    >
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span className="truncate max-w-[100px]">{selectedMandi || 'मंडी चुनें'}</span>
                      </div>
                      <ChevronDown className={`h-3.5 w-3.5 transition-transform ${isMandiDropdownOpen ? 'rotate-180' : ''}`} />
                    </div>
                    {isMandiDropdownOpen && (
                      <div className="absolute top-full left-0 sm:left-auto mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-xl p-2 z-50 max-h-72 overflow-y-auto custom-scrollbar animate-in fade-in zoom-in-95 duration-100">
                        <p className="px-3 py-2 text-[9px] font-bold text-slate-400 uppercase tracking-wider sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm z-10">{currentDistrict} की मंडियां</p>
                        {availableMandis.length === 0 && <p className="px-3 py-3 text-xs font-semibold text-slate-400 text-center">कोई मंडी उपलब्ध नहीं</p>}
                        {availableMandis.map(m => (
                          <button 
                            key={m} 
                            onClick={() => { 
                              setSelectedMandi(m); 
                              setIsMandiDropdownOpen(false);
                              // Auto-switch crop if needed
                              const cropsInMandi = pricesList.filter(p => p.mandiName === m).map(p => p.cropName);
                              if (cropsInMandi.length > 0 && !cropsInMandi.includes(selectedCrop)) {
                                setSelectedCrop(cropsInMandi[0]);
                              }
                            }} 
                            className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors mb-0.5 ${selectedMandi === m ? 'bg-primary text-white shadow-sm' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                          >
                            {m}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Crop Variety Selector */}
                  <div className="relative">
                    <div 
                      className="flex items-center justify-between gap-2 px-3.5 py-2.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-650 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 border border-emerald-200/60 dark:border-emerald-800/50 rounded-xl text-xs font-extrabold cursor-pointer transition-colors w-full sm:w-auto min-w-[150px]" 
                      onClick={() => { setIsCropDropdownOpen(!isCropDropdownOpen); }}
                    >
                      <div className="flex items-center gap-2">
                        <Leaf className="h-4 w-4" />
                        <span className="truncate max-w-[120px]">{selectedCrop || 'फसल चुनें'}</span>
                      </div>
                      <ChevronDown className={`h-3.5 w-3.5 transition-transform ${isCropDropdownOpen ? 'rotate-180' : ''}`} />
                    </div>
                    {isCropDropdownOpen && (
                      <div className="absolute top-full right-0 sm:right-0 sm:left-auto mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-xl p-2 z-50 max-h-72 overflow-y-auto custom-scrollbar animate-in fade-in zoom-in-95 duration-100">
                        <p className="px-3 py-2 text-[9px] font-bold text-slate-400 uppercase tracking-wider sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm z-10">उपलब्ध फसलें व किस्में (Varieties)</p>
                        {uniqueCrops.length === 0 && <p className="px-3 py-3 text-xs font-semibold text-slate-400 text-center">कोई फसल उपलब्ध नहीं</p>}
                        {uniqueCrops.map(c => (
                          <button 
                            key={c} 
                            onClick={() => { setSelectedCrop(c); setIsCropDropdownOpen(false); }} 
                            className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors mb-0.5 ${selectedCrop === c ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 shadow-sm' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                          >
                            {c}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="py-6 space-y-6">
                {/* Price Display */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 bg-slate-50 dark:bg-slate-800/20 p-4 rounded-xl items-center">
                  <div className="text-left">
                    <span className="text-[10px] font-bold text-slate-450 uppercase">आज का भाव</span>
                    <p className="text-3xl font-extrabold text-slate-800 dark:text-white font-display mt-0.5">₹{activeCropDetails.priceToday}</p>
                    <span className={`inline-flex items-center gap-0.5 text-[10px] font-bold mt-1 ${
                      activeCropDetails.trend === 'up' ? 'text-green-600' : activeCropDetails.trend === 'down' ? 'text-red-500' : 'text-slate-450'
                    }`}>
                      {activeCropDetails.trend === 'up' ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                      {activeCropDetails.trend === 'up' ? 'कल से बढ़त' : activeCropDetails.trend === 'down' ? 'कल से गिरावट' : 'स्थिर भाव'}
                    </span>
                  </div>

                  <div className="text-left border-l border-slate-200/50 pl-6">
                    <span className="text-[10px] font-bold text-slate-450 uppercase">कल का भाव</span>
                    <p className="text-lg font-bold text-slate-700 dark:text-slate-350 font-display mt-1">₹{activeCropDetails.priceYesterday}</p>
                  </div>

                  <div className="text-left border-l border-slate-200/50 pl-6 col-span-2 sm:col-span-1">
                    <span className="text-[10px] font-bold text-slate-450 uppercase">साप्ताहिक औसत</span>
                    <p className="text-lg font-bold text-slate-700 dark:text-slate-350 font-display mt-1">₹{activeCropDetails.averagePrice}</p>
                  </div>
                </div>

                {/* Price History Line Chart */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-450 flex items-center gap-1.5 uppercase">
                    <LineIcon className="h-4 w-4 text-primary" />
                    साप्ताहिक मूल्य उतार-चढ़ाव (दर/क्विंटल)
                  </h4>
                  <div className="h-56 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={activeCropDetails.weeklyPrices}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} />
                        <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} tickLine={false} />
                        <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} domain={['dataMin - 100', 'dataMax + 100']} />
                        <Tooltip contentStyle={{ borderRadius: '12px' }} />
                        <Line
                          type="monotone"
                          dataKey="price"
                          name="मूल्य (₹)"
                          stroke="#2E7D32"
                          strokeWidth={3}
                          dot={{ r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Comparison nearby mandis */}
                <div className="space-y-3 border-t border-slate-100 dark:border-slate-800 pt-6">
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Locate className="h-4.5 w-4.5 text-primary" />
                    आसपास की मंडियों में भाव तुलना (Nearby Mandis)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {activeCropDetails.nearbyMandis.map((n, idx) => (
                      <div key={idx} className="flex justify-between items-center p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 text-xs">
                        <span className="font-semibold text-slate-700 dark:text-slate-350">{n.mandiName}</span>
                        <span className="font-extrabold text-slate-900 dark:text-slate-200 font-display">₹{n.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column: Search List & Filters */}
        <div className="lg:col-span-5 space-y-6">
          <Card>
            <CardHeader className="space-y-4">
              {/* Search input */}
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4.5 w-4.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="फसल या मंडी का नाम खोजें..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs font-semibold text-slate-700 dark:text-slate-200 placeholder-slate-450 focus:outline-none focus:border-primary"
                />
              </div>

              {/* Filters header toolbar */}
              <div className="flex items-center justify-between gap-2 border-b border-slate-150 dark:border-slate-800 pb-2">
                {/* Tabs */}
                <div className="flex bg-slate-50 dark:bg-slate-800/50 p-1 rounded-lg">
                  <button
                    onClick={() => setActiveTab('all')}
                    className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
                      activeTab === 'all'
                        ? 'bg-white dark:bg-slate-700 text-primary dark:text-white shadow-sm'
                        : 'text-slate-550 dark:text-slate-400 hover:text-slate-700'
                    }`}
                  >
                    सभी फसलें
                  </button>
                  <button
                    onClick={() => setActiveTab('favorites')}
                    className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
                      activeTab === 'favorites'
                        ? 'bg-white dark:bg-slate-700 text-primary dark:text-white shadow-sm'
                        : 'text-slate-550 dark:text-slate-400 hover:text-slate-700'
                    }`}
                  >
                    पसंदीदा
                  </button>
                </div>

                <div className="flex gap-2">
                  {/* Sort */}
                  <button
                    onClick={handleSortToggle}
                    className="p-2 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-850/50 text-slate-500 dark:text-slate-400 cursor-pointer"
                    title="कीमत के अनुसार क्रम बदलें"
                  >
                    <ArrowUpDown className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="max-h-[500px] overflow-y-auto space-y-3">
              {filteredList.length === 0 ? (
                <p className="text-xs text-center text-slate-400 py-8">कोई फसल नहीं मिली।</p>
              ) : (
                filteredList.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    onClick={() => {
                      setSelectedCrop(item.cropName);
                      setSelectedDistrict(item.district);
                    }}
                    className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer hover:shadow-sm transition-all ${
                      selectedCrop === item.cropName && selectedDistrict === item.district
                        ? 'bg-primary/5 dark:bg-primary/10 border-primary shadow-sm'
                        : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800/80'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(item.cropName);
                        }}
                        className="p-1 rounded text-slate-300 hover:text-yellow-500 transition-colors"
                      >
                        <Star className={`h-4.5 w-4.5 ${favorites.includes(item.cropName) ? 'text-yellow-500 fill-yellow-500' : ''}`} />
                      </button>
                      <div>
                        <h4 className="text-sm font-bold text-slate-850 dark:text-slate-200 leading-none">
                          {item.cropName.split(' ')[0]}
                        </h4>
                        <p className="text-[10px] text-slate-400 font-semibold mt-1">
                          {item.mandiName} ({item.district})
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-base font-extrabold text-slate-800 dark:text-white font-display">₹{item.priceToday}</p>
                      <span className={`inline-flex items-center gap-0.5 text-[9px] font-bold ${
                        item.trend === 'up' ? 'text-green-600' : item.trend === 'down' ? 'text-red-500' : 'text-slate-400'
                      }`}>
                        {item.trend === 'up' ? '▲ तेजी' : item.trend === 'down' ? '▼ मंदी' : '● स्थिर'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
