import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { mockApi } from '../../services/mockApi';
import { WeatherAlert, WeatherCondition, ForecastDay } from '../../types';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Alert } from '../../components/ui/Alert';
import {
  CloudSun,
  Droplet,
  Wind,
  Sun,
  CloudRain,
  Calendar,
  AlertTriangle,
  Info,
  BadgeAlert
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';

export const Weather: React.FC = () => {
  const { user } = useAuth();

  const [current, setCurrent] = useState<WeatherCondition | null>(null);
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [alerts, setAlerts] = useState<WeatherAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeatherData = async () => {
      setLoading(true);
      try {
        const district = user?.district || 'झाँसी';
        
        // Load weather
        const data = await mockApi.getWeatherCondition(district);
        setCurrent(data.current);
        setForecast(data.forecast);

        // Load alerts
        const allAlerts = await mockApi.getWeatherAlerts();
        setAlerts(allAlerts);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, [user]);

  // Formulate warning advisories
  const getAdvisories = () => {
    const list = [];
    if (current) {
      if (current.rainProb > 60) {
        list.push({
          type: 'danger',
          text: 'भारी वर्षा की संभावना: खेतों में सिंचाई रोक दें और नालियों को साफ़ रखें ताकि जल-जमाव न हो।',
          textBundeli: 'भारी पानी गिरबे को डर है: खेतों में पानी लगाइबो रोक देव और जल निकासी को इंतज़ाम करो।'
        });
      }
      if (current.windSpeed > 15) {
        list.push({
          type: 'warning',
          text: 'तेज़ हवाएँ: आज कीटनाशकों या लिक्विड यूरिया का छिड़काव न करें, क्योंकि दवा हवा में बह जाएगी।',
          textBundeli: 'तेज़ हवा चल सकत है: आज दवाई को छिड़काव टाल देव, दवा उड़ जैहै।'
        });
      }
      if (current.temp > 35) {
        list.push({
          type: 'warning',
          text: 'अत्यधिक तापमान: हरी सब्जियों और बागवानी फसलों में हल्की सिंचाई शाम के समय करें।',
          textBundeli: 'घाम बहुत तेज है: साग-भाजी में हलको पानी संझा के टेम लगाओ।'
        });
      }
    }
    return list;
  };

  const advisories = getAdvisories();

  return (
    <div className="space-y-6 text-left pb-12">
      {/* Header */}
      <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <CloudSun className="h-6 w-6 text-primary" />
          मौसम पूर्वानुमान एवं कृषि अलर्ट ({user?.district})
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          तापमान, वर्षा और स्थानीय कृषि वैज्ञानिक सलाह की ताज़ा रिपोर्ट।
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Current Weather Details */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="bg-gradient-to-br from-green-700 to-green-900 text-white border-0 shadow-lg relative overflow-hidden">
            {/* Decorator background */}
            <div className="absolute -right-10 -bottom-10 h-36 w-36 bg-white/5 rounded-full blur-2xl" />

            <div className="space-y-6 relative">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold tracking-wider opacity-85 uppercase">{user?.district} आज</span>
                <span className="text-xs bg-white/20 px-2 py-1 rounded-md font-bold">LIVE</span>
              </div>

              <div className="flex items-center gap-4">
                <Sun className="h-12 w-12 text-accent" />
                <div>
                  <p className="text-5xl font-extrabold font-display leading-none">
                    {current ? `${current.temp}°` : '--°'}
                  </p>
                  <p className="text-xs font-semibold opacity-90 mt-1.5">
                    {user?.language === 'English' ? current?.condition : current?.conditionBundeli}
                  </p>
                </div>
              </div>

              {/* Extra Stats */}
              <div className="grid grid-cols-3 gap-2 border-t border-white/10 pt-4 text-center">
                <div className="space-y-1">
                  <Droplet className="h-4 w-4 mx-auto text-blue-200" />
                  <p className="text-[10px] opacity-75 font-semibold">नमी (Humidity)</p>
                  <p className="text-xs font-bold font-display">{current?.humidity}%</p>
                </div>
                <div className="space-y-1">
                  <Wind className="h-4 w-4 mx-auto text-slate-200" />
                  <p className="text-[10px] opacity-75 font-semibold">हवा (Wind)</p>
                  <p className="text-xs font-bold font-display">{current?.windSpeed} km/h</p>
                </div>
                <div className="space-y-1">
                  <Sun className="h-4 w-4 mx-auto text-accent" />
                  <p className="text-[10px] opacity-75 font-semibold">यूवी इंडेक्स</p>
                  <p className="text-xs font-bold font-display">{current?.uvIndex}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Action advisories box */}
          {advisories.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold text-slate-500 flex items-center gap-1.5">
                  <BadgeAlert className="h-4 w-4 text-primary" />
                  विशेषज्ञ कृषि सलाह
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {advisories.map((ad, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl border text-xs leading-relaxed ${
                      ad.type === 'danger'
                        ? 'bg-red-50 dark:bg-red-950/20 border-red-100 dark:border-red-900/30 text-red-800 dark:text-red-300'
                        : 'bg-amber-50 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900/30 text-amber-800 dark:text-amber-300'
                    }`}
                  >
                    <p className="font-bold mb-1">💡 {ad.type === 'danger' ? 'अति महत्वपूर्ण' : 'चेतावनी'}</p>
                    <p>{user?.language === 'English' ? ad.text : ad.textBundeli}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column: Alerts & Chart & 7-Day Forecast */}
        <div className="lg:col-span-8 space-y-6">
          {/* Active Alerts List */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              सक्रिय चेतावनी (Active Alerts)
            </h3>
            {alerts.filter(a => a.active).map((alert) => (
              <Alert
                key={alert.id}
                variant={alert.type === 'danger' ? 'danger' : alert.type === 'warning' ? 'warning' : 'info'}
                title={alert.type === 'danger' ? '🔴 गंभीर मौसम अलर्ट' : alert.type === 'warning' ? '🟡 सामान्य चेतावनी' : '🟢 सामान्य कृषि सूचना'}
                className="shadow-sm font-semibold"
              >
                {user?.language === 'English' ? alert.message : alert.messageBundeli}
              </Alert>
            ))}
          </div>

          {/* Forecast Trend chart */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-bold text-slate-500">साप्ताहिक तापमान एवं वर्षा की संभावना का विश्लेषण</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={forecast.map(f => ({ name: f.day, 'अधिकतम (°C)': f.tempMax, 'न्यूनतम (°C)': f.tempMin, 'वर्षा %': f.rainProb }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: '12px' }} />
                    <Legend verticalAlign="top" height={36} iconType="circle" />
                    <Line type="monotone" dataKey="अधिकतम (°C)" stroke="#FFC107" strokeWidth={3} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="न्यूनतम (°C)" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="वर्षा %" stroke="#2E7D32" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* 7-Day Grid Cards */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
              <Calendar className="h-5 w-5 text-primary" />
              7-दिवसीय मौसम पूर्वानुमान
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              {forecast.map((f, idx) => (
                <Card key={idx} className="p-3 text-center space-y-1.5 flex flex-col justify-between items-center">
                  <span className="text-[11px] font-bold text-slate-400">{f.day}</span>
                  {f.rainProb > 50 ? (
                    <CloudRain className="h-6 w-6 text-blue-500 animate-bounce" />
                  ) : (
                    <Sun className="h-6 w-6 text-accent animate-pulse" />
                  )}
                  <div>
                    <p className="text-xs font-extrabold text-slate-800 dark:text-slate-200 font-display">
                      {f.tempMax}° / {f.tempMin}°
                    </p>
                    <p className="text-[9px] text-slate-400 font-semibold mt-0.5">वर्षा: {f.rainProb}%</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
