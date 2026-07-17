import React, { useState } from 'react';
import { mockApi } from '../../services/mockApi';
import { FertilizerRecommendation } from '../../types';
import { useToast } from '../../components/ui/Toast';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import {
  Calculator,
  Download,
  Calendar,
  Layers,
  Sparkles,
  Info,
  RotateCcw
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

export const Fertilizer: React.FC = () => {
  const { toast } = useToast();

  const [crop, setCrop] = useState('गेहूं');
  const [area, setArea] = useState('1');
  const [soilType, setSoilType] = useState('दोमट मिट्टी (Loamy Soil)');
  const [season, setSeason] = useState('रबी (Rabi)');
  const [stage, setStage] = useState('वानस्पतिक चरण (Vegetative)');
  const [isCalculating, setIsCalculating] = useState(false);
  const [result, setResult] = useState<FertilizerRecommendation | null>(null);

  const cropOptions = ['गेहूं', 'चना', 'सोयाबीन', 'सरसों', 'टमाटर'];
  const soilOptions = ['दोमट मिट्टी (Loamy Soil)', 'काली मिट्टी (Black Soil)', 'बलुई मिट्टी (Sandy Soil)', 'लाल माटी (Red Soil)'];
  const seasonOptions = ['रबी (Rabi)', 'खरीफ (Kharif)', 'जायद (Zaid)'];
  const stageOptions = ['बुवाई से पूर्व (Pre-sowing)', 'वानस्पतिक चरण (Vegetative)', 'फूल आने का चरण (Flowering)', 'फल आने का चरण (Fruiting)'];

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    const areaNum = parseFloat(area);
    if (isNaN(areaNum) || areaNum <= 0) {
      toast('कृपया रकबा (क्षेत्रफल) की सही संख्या भरें।', 'warning');
      return;
    }

    setIsCalculating(true);
    try {
      const rec = await mockApi.calculateFertilizer(crop, areaNum, soilType, season, stage);
      setResult(rec);
      toast('खाद की मात्रा की सही गणना कर दी गई है!', 'success');
    } catch (err) {
      toast('गणना करने में त्रुटि हुई। पुनः प्रयास करें।', 'error');
    } finally {
      setIsCalculating(false);
    }
  };

  const handleReset = () => {
    setCrop('गेहूं');
    setArea('1');
    setSoilType('दोमट मिट्टी (Loamy Soil)');
    setSeason('रबी (Rabi)');
    setStage('वानस्पतिक चरण (Vegetative)');
    setResult(null);
  };

  // Pie chart colors
  const COLORS = ['#2E7D32', '#4CAF50', '#FFC107'];

  // Prepare chart dataset
  const getChartData = () => {
    if (!result) return [];
    return [
      { name: 'यूरिया (Urea)', value: result.recommendation.urea },
      { name: 'डी.ए.पी. (DAP)', value: result.recommendation.dap },
      { name: 'पोटाश (Potash)', value: result.recommendation.potash }
    ];
  };

  const chartData = getChartData();

  return (
    <div className="space-y-6 text-left pb-12">
      {/* Header */}
      <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <Calculator className="h-6 w-6 text-primary" />
          ए.आई. संतुलित खाद कैलकुलेटर (Fertilizer Calculator)
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          अपनी मिट्टी, फसल और रकबे के अनुसार नाइट्रोजन, फास्फोरस और पोटेशियम (NPK) की सटीक मात्रा जानें।
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Input Form */}
        <div className="lg:col-span-5 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-bold">1. खेत और फसल का विवरण भरें</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCalculate} className="space-y-5">
                {/* Crop Select */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">फसल (Crop)</label>
                  <select
                    value={crop}
                    onChange={(e) => setCrop(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 px-4 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none"
                  >
                    {cropOptions.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                {/* Area Input */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">खेत का रकबा (एकड़ में)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 px-4 text-xs font-bold text-slate-700 dark:text-slate-350 focus:outline-none"
                    required
                  />
                </div>

                {/* Soil Type Select */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">मिट्टी का प्रकार (Soil Type)</label>
                  <select
                    value={soilType}
                    onChange={(e) => setSoilType(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 px-4 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none"
                  >
                    {soilOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                {/* Season Select */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">मौसम (Season)</label>
                  <select
                    value={season}
                    onChange={(e) => setSeason(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 px-4 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none"
                  >
                    {seasonOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                {/* Crop Stage Select */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">फसल की वर्तमान अवस्था</label>
                  <select
                    value={stage}
                    onChange={(e) => setStage(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 px-4 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none"
                  >
                    {stageOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                  <Button
                    variant="outline"
                    type="button"
                    leftIcon={<RotateCcw className="h-4 w-4" />}
                    onClick={handleReset}
                    disabled={isCalculating}
                  >
                    रीसेट
                  </Button>
                  <Button
                    variant="primary"
                    type="submit"
                    className="flex-1"
                    isLoading={isCalculating}
                    leftIcon={<Calculator className="h-4 w-4" />}
                  >
                    गणना करें
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Output Results */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {/* Loading */}
            {isCalculating && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col items-center justify-center p-12 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm text-center"
              >
                <div className="relative flex items-center justify-center mb-6">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
                  <Calculator className="h-6 w-6 text-primary absolute animate-pulse" />
                </div>
                <h4 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                  खाद गणना की जा रही है...
                </h4>
                <p className="text-xs text-slate-400 mt-2 max-w-xs">
                  मिट्टी की पोषक तत्व धारण क्षमता और फसल की जरूरतों का मिलान किया जा रहा है।
                </p>
              </motion.div>
            )}

            {/* Results Output */}
            {result && !isCalculating && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <Card className="border border-green-100 dark:border-green-950/20">
                  <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-slate-150 dark:border-slate-800">
                    <div>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-50 text-green-600 dark:bg-green-950/20">
                        🌱 NPK संतुलित मात्रा
                      </span>
                      <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mt-2">
                        अनुशंसित पोषक तत्व रिपोर्ट
                      </h3>
                      <p className="text-xs text-slate-400 font-semibold mt-1">फसल: {result.cropName} | रकबा: {result.area} एकड़</p>
                    </div>
                  </CardHeader>

                  <CardContent className="py-6 space-y-6">
                    {/* Nutrient breakdown cards */}
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">यूरिया (N)</span>
                        <p className="text-xl font-extrabold text-slate-800 dark:text-slate-200 font-display">{result.recommendation.urea} किग्रा</p>
                      </div>
                      <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">डी.ए.पी. (P)</span>
                        <p className="text-xl font-extrabold text-slate-800 dark:text-slate-200 font-display">{result.recommendation.dap} किग्रा</p>
                      </div>
                      <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">पोटाश (K)</span>
                        <p className="text-xl font-extrabold text-slate-800 dark:text-slate-200 font-display">{result.recommendation.potash} किग्रा</p>
                      </div>
                    </div>

                    {/* Chart & Recommendations grid */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                      {/* Pie chart representation */}
                      <div className="md:col-span-5 h-48 flex justify-center items-center">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={chartData}
                              cx="50%"
                              cy="50%"
                              innerRadius={45}
                              outerRadius={65}
                              paddingAngle={4}
                              dataKey="value"
                            >
                              {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                            <Legend verticalAlign="bottom" height={24} iconSize={8} iconType="circle" />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>

                      {/* Micro-nutrients & Details */}
                      <div className="md:col-span-7 space-y-3 text-xs leading-relaxed font-semibold">
                        <div className="p-4 bg-amber-50/50 dark:bg-amber-950/10 border border-amber-100 dark:border-amber-900/30 rounded-xl">
                          <span className="font-bold text-amber-800 dark:text-amber-400 flex items-center gap-1.5 mb-1">
                            <Sparkles className="h-4 w-4" />
                            सूक्ष्म पोषक तत्व सलाह (Micronutrients)
                          </span>
                          <p className="text-slate-600 dark:text-slate-350">{result.recommendation.micronutrients}</p>
                        </div>

                        <div className="p-3 bg-slate-50 dark:bg-slate-800/30 rounded-xl flex gap-2">
                          <Info className="h-4 w-4 text-primary flex-shrink-0" />
                          <p className="text-slate-500 dark:text-slate-400">यह गणना झाँसी क्षेत्र की मिट्टी परीक्षण डेटाबेस के अनुकूलित मूल्यों पर आधारित है।</p>
                        </div>
                      </div>
                    </div>

                    {/* Fertilization schedule timeline */}
                    <div className="space-y-4 border-t border-slate-100 dark:border-slate-800 pt-6">
                      <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                        <Calendar className="h-4.5 w-4.5 text-primary" />
                        खाद छिड़काव समय-सारणी (Timeline)
                      </h4>
                      <div className="space-y-3.5 pl-2 relative border-l border-slate-100 dark:border-slate-800/60 ml-2">
                        {result.recommendation.schedule.map((stepStr, idx) => (
                          <div key={idx} className="relative pl-6">
                            <span className="absolute -left-[13px] top-1.5 h-6 w-6 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-[10px] text-primary dark:bg-slate-900">
                              {idx + 1}
                            </span>
                            <p className="text-xs text-slate-650 dark:text-slate-300 font-semibold">{stepStr}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Export */}
                    <div className="flex gap-4 border-t border-slate-100 dark:border-slate-800 pt-6">
                      <Button
                        variant="outline"
                        leftIcon={<Download className="h-4 w-4" />}
                        className="flex-1"
                        onClick={() => window.print()}
                      >
                        रिपोर्ट डाउनलोड करें
                      </Button>
                      <Button
                        variant="ghost"
                        className="flex-1"
                        leftIcon={<RotateCcw className="h-4 w-4" />}
                        onClick={handleReset}
                      >
                        नयी गणना करें
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Empty state */}
            {!result && !isCalculating && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center p-12 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm text-center"
              >
                <div className="h-16 w-16 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-4">
                  <Layers className="h-8 w-8" />
                </div>
                <h4 className="text-base font-bold text-slate-800 dark:text-slate-100">
                  कोई रिपोर्ट उपलब्ध नहीं है
                </h4>
                <p className="text-xs text-slate-400 mt-2 max-w-xs leading-relaxed">
                  बाएं पैनल में रकबा और फसल का चयन करें, फिर "गणना करें" पर क्लिक करें। पोषक तत्व विश्लेषण यहाँ दिखाई देगा।
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
