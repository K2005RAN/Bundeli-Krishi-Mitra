import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { mockApi } from '../../services/mockApi';
import {
  DiseaseScanReport,
  MandiPrice,
  WeatherAlert,
  WeatherCondition
} from '../../types';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Alert } from '../../components/ui/Alert';
import { Button } from '../../components/ui/Button';
import {
  CloudSun,
  Camera,
  TrendingUp,
  ListTodo,
  CalendarDays,
  FileCheck2,
  ChevronRight,
  TrendingDown,
  Dot
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  CartesianGrid,
  Legend
} from 'recharts';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [weather, setWeather] = useState<WeatherCondition | null>(null);
  const [alerts, setAlerts] = useState<WeatherAlert[]>([]);
  const [latestScan, setLatestScan] = useState<DiseaseScanReport | null>(null);
  const [mandiPrices, setMandiPrices] = useState<MandiPrice[]>([]);
  const [cropActivity, setCropActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      try {
        const district = user?.district || 'झाँसी';
        
        // 1. Weather
        const wData = await mockApi.getWeatherCondition(district);
        setWeather(wData.current);

        // 2. Alerts
        const activeAlerts = await mockApi.getWeatherAlerts();
        setAlerts(activeAlerts.slice(0, 2));

        // 3. Scans
        const scans = await mockApi.getDiseaseHistory();
        if (scans.length > 0) {
          setLatestScan(scans[0]);
        }

        // 4. Mandi
        const prices = await mockApi.getMandiPrices();
        const favs = mockApi.getFavoriteCrops();
        const filteredPrices = prices.filter(p => favs.includes(p.cropName) || user?.preferredCrops.includes(p.cropName.split(' ')[0]));
        setMandiPrices(filteredPrices.length > 0 ? filteredPrices : prices.slice(0, 2));

        // 5. Activity data for chart
        // Let's create static scan category counts
        const wheatScans = scans.filter(s => s.cropName.includes('गेहूं')).length;
        const tomatoScans = scans.filter(s => s.cropName.includes('टमाटर')).length;
        const chickpeaScans = scans.filter(s => s.cropName.includes('चना')).length;
        const soyScans = scans.filter(s => s.cropName.includes('सोयाबीन')).length;

        setCropActivity([
          { name: 'गेहूं', 'बीमारी स्कैन': wheatScans || 2 },
          { name: 'टमाटर', 'बीमारी स्कैन': tomatoScans || 1 },
          { name: 'चना', 'बीमारी स्कैन': chickpeaScans || 0 },
          { name: 'सोयाबीन', 'बीमारी स्कैन': soyScans || 0 }
        ]);

      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [user]);

  // Tasks suggestion list
  const tasks = [
    { id: 1, text: 'खेत में पानी की निकासी का प्रबंध करें (तेज बारिश की संभावना है)।', type: 'danger' },
    { id: 2, text: 'पके हुए टमाटरों की तुड़ाई पूरी करें, भाव अभी बाज़ार में बढ़े हुए हैं।', type: 'success' },
    { id: 3, text: 'गेहूं के पत्तों में पीलापन की जांच करें (पीला रतुआ का समय है)।', type: 'warning' }
  ];

  // Chart dataset for temperature trend
  const forecastData = [
    { day: 'सोम', temp: 31, 'बारिश %': 15 },
    { day: 'मंगल', temp: 32, 'बारिश %': 25 },
    { day: 'बुध', temp: 28, 'बारिश %': 80 },
    { day: 'गुरु', temp: 29, 'बारिश %': 70 },
    { day: 'शुक्र', temp: 30, 'बारिश %': 40 },
    { day: 'शनि', temp: 32, 'बारिश %': 10 },
    { day: 'रवि', temp: 33, 'बारिश %': 5 }
  ];

  return (
    <div className="space-y-6 text-left pb-10">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
            राम राम, {user?.name}!
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            आज आपका खेत सुरक्षित है। नीचे ताज़ा अपडेट देखें।
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="primary"
            leftIcon={<Camera className="h-4 w-4" />}
            onClick={() => navigate('/disease')}
          >
            बीमारी जांचें
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/voice')}
          >
            बुंदेली सहायक से पूछें
          </Button>
        </div>
      </div>

      {/* Grid: 4 Widget Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Weather Card */}
        <Card className="flex flex-col justify-between">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-slate-500 dark:text-slate-400">आज का मौसम ({user?.district})</CardTitle>
            <CloudSun className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent className="mt-2">
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-extrabold text-slate-800 dark:text-white font-display">
                {weather ? `${weather.temp}°C` : '--°C'}
              </span>
              <span className="text-xs font-semibold text-slate-400">धूप/नमी</span>
            </div>
            <p className="text-xs font-bold text-secondary mt-1">
              {weather ? weather.conditionBundeli : 'लोड हो रहा है...'}
            </p>
            <div className="grid grid-cols-2 gap-2 mt-4 text-[11px] font-medium text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-3">
              <div>नमी: <span className="text-slate-700 dark:text-slate-200">{weather?.humidity}%</span></div>
              <div>बारिश: <span className="text-slate-700 dark:text-slate-200">{weather?.rainProb}%</span></div>
            </div>
          </CardContent>
        </Card>

        {/* Latest Disease Scan */}
        <Card className="flex flex-col justify-between">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-slate-500 dark:text-slate-400">पिछली बीमारी जांच</CardTitle>
            <CalendarDays className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent className="mt-2">
            {latestScan ? (
              <div className="space-y-2">
                <p className="text-base font-bold text-slate-800 dark:text-slate-200 truncate">{latestScan.diseaseName}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">सटीकता:</span>
                  <span className="text-xs font-extrabold text-primary font-display">{latestScan.confidence}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-primary h-1.5 rounded-full" style={{ width: `${latestScan.confidence}%` }}></div>
                </div>
                <button
                  onClick={() => navigate('/history')}
                  className="text-xs font-bold text-primary hover:underline flex items-center gap-0.5 mt-2 cursor-pointer"
                >
                  उपचार विवरण देखें <ChevronRight className="h-3 w-3" />
                </button>
              </div>
            ) : (
              <div className="py-2 text-center">
                <p className="text-xs text-slate-400">कोई पुराना रिपोर्ट नहीं है</p>
                <Button variant="ghost" size="sm" className="mt-2 text-xs" onClick={() => navigate('/disease')}>
                  फोटो डालें
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Mandi Price Widget */}
        <Card className="flex flex-col justify-between">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-slate-500 dark:text-slate-400">बाज़ार भाव (मुख्य मंडी)</CardTitle>
            <TrendingUp className="h-5 w-5 text-yellow-500" />
          </CardHeader>
          <CardContent className="mt-2">
            <div className="space-y-3">
              {mandiPrices.slice(0, 2).map((item, idx) => (
                <div key={item.id || idx} className="flex justify-between items-center text-xs border-b border-slate-50 dark:border-slate-800/40 pb-1.5 last:border-0 last:pb-0">
                  <div>
                    <p className="font-bold text-slate-800 dark:text-slate-200">{item.cropName.split(' ')[0]}</p>
                    <p className="text-[10px] text-slate-400">{item.mandiName.split(' ')[0]}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-extrabold text-slate-800 dark:text-slate-200 font-display">₹{item.priceToday}</p>
                    <span className={`inline-flex items-center gap-0.5 text-[9px] font-bold ${
                      item.trend === 'up' ? 'text-green-600' : item.trend === 'down' ? 'text-red-500' : 'text-slate-400'
                    }`}>
                      {item.trend === 'up' ? (
                        <TrendingUp className="h-2.5 w-2.5" />
                      ) : (
                        <TrendingDown className="h-2.5 w-2.5" />
                      )}
                      {item.trend === 'up' ? 'तेजी' : item.trend === 'down' ? 'मंदी' : 'स्थिर'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Dynamic Alerts count */}
        <Card className="flex flex-col justify-between">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-slate-500 dark:text-slate-400">सक्रिय कृषि सूचनाएं</CardTitle>
            <FileCheck2 className="h-5 w-5 text-red-500" />
          </CardHeader>
          <CardContent className="mt-2">
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-extrabold text-red-500 font-display">
                {alerts.length}
              </span>
              <span className="text-xs font-semibold text-slate-400">अलर्ट लागू</span>
            </div>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              मौसम विज्ञान और कृषि वैज्ञानिकों द्वारा जारी चेतावनी।
            </p>
            <button
              onClick={() => navigate('/weather')}
              className="text-xs font-bold text-primary hover:underline flex items-center gap-0.5 mt-3 cursor-pointer"
            >
              सभी अलर्ट पढ़ें <ChevronRight className="h-3 w-3" />
            </button>
          </CardContent>
        </Card>
      </div>

      {/* Main Row: Alerts & Tasks Checklists */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Active Alerts & Suggested Tasks */}
        <div className="lg:col-span-8 space-y-6">
          {/* Active alerts warnings */}
          {alerts.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">महत्वपूर्ण घोषणाएं</h3>
              {alerts.map((a, idx) => (
                <Alert
                  key={a.id || idx}
                  variant={a.type === 'danger' ? 'danger' : a.type === 'warning' ? 'warning' : 'info'}
                  title={a.type === 'danger' ? 'अति आवश्यक चेतावनी!' : 'कृषि सलाह'}
                  className="shadow-sm"
                >
                  {user?.language === 'English' ? a.message : a.messageBundeli}
                </Alert>
              ))}
            </div>
          )}

          {/* Daily Tasks checklist */}
          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
              <ListTodo className="h-5 w-5 text-primary" />
              <CardTitle className="text-base font-bold">आज के अनुशंसित कार्य (Checklist)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3.5">
                {tasks.map((t) => (
                  <div key={t.id} className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
                    <span className="mt-1 flex-shrink-0">
                      <Dot className={`h-4 w-4 rounded-full ${
                        t.type === 'danger' ? 'bg-red-500' : t.type === 'warning' ? 'bg-amber-500' : 'bg-green-500'
                      }`} />
                    </span>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{t.text}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: History & Actions */}
        <div className="lg:col-span-4 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-bold">आसान टूल्स (Quick Actions)</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <Button
                variant="outline"
                className="w-full text-sm text-left justify-start"
                leftIcon={<Camera className="h-4 w-4 text-green-600" />}
                onClick={() => navigate('/disease')}
              >
                फसल रोग स्कैनर
              </Button>
              <Button
                variant="outline"
                className="w-full text-sm text-left justify-start"
                leftIcon={<CloudSun className="h-4 w-4 text-blue-600" />}
                onClick={() => navigate('/weather')}
              >
                7 दिनों का मौसम पूर्वानुमान
              </Button>
              <Button
                variant="outline"
                className="w-full text-sm text-left justify-start"
                leftIcon={<TrendingUp className="h-4 w-4 text-yellow-600" />}
                onClick={() => navigate('/mandi')}
              >
                मंडी की ताज़ा दरें
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weather Trend Forecast Chart */}
        <Card className="p-4">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-bold">7-दिवसीय मौसम एवं वर्षा पूर्वानुमान</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={forecastData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} />
                  <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: '12px' }} />
                  <Legend verticalAlign="top" height={36} iconType="circle" />
                  <Line
                    type="monotone"
                    dataKey="temp"
                    name="तापमान (°C)"
                    stroke="#FFC107"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="बारिश %"
                    name="वर्षा की संभावना (%)"
                    stroke="#4CAF50"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Crop Scans Distribution chart */}
        <Card className="p-4">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-bold">फसल बीमारी जांच विश्लेषण (इतिहास)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cropActivity}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: '12px' }} />
                  <Legend verticalAlign="top" height={36} iconType="circle" />
                  <Bar
                    dataKey="बीमारी स्कैन"
                    fill="#2E7D32"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={45}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
