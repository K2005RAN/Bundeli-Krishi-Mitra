import React, { useState, useEffect } from 'react';
import { mockApi } from '../../services/mockApi';
import { DiseaseScanReport, FertilizerRecommendation } from '../../types';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Dialog } from '../../components/ui/Dialog';
import { Button } from '../../components/ui/Button';
import {
  History as HistoryIcon,
  Search,
  Scan,
  Calculator,
  Download,
  Calendar,
  Eye,
  Trash2
} from 'lucide-react';
import { useToast } from '../../components/ui/Toast';

export const History: React.FC = () => {
  const { toast } = useToast();

  const [scans, setScans] = useState<DiseaseScanReport[]>([]);
  const [fertilizers, setFertilizers] = useState<FertilizerRecommendation[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'scans' | 'fertilizer'>('all');
  const [selectedScan, setSelectedScan] = useState<DiseaseScanReport | null>(null);
  const [selectedFertilizer, setSelectedFertilizer] = useState<FertilizerRecommendation | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const sData = await mockApi.getDiseaseHistory();
      const fData = await mockApi.getFertilizerHistory();
      setScans(sData);
      setFertilizers(fData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // Merge history arrays into single unified log
  const getUnifiedHistory = () => {
    const unified: any[] = [];
    
    if (filterType === 'all' || filterType === 'scans') {
      scans.forEach(s => unified.push({ ...s, recordType: 'scan' }));
    }
    
    if (filterType === 'all' || filterType === 'fertilizer') {
      fertilizers.forEach(f => unified.push({ ...f, recordType: 'fertilizer' }));
    }

    return unified
      .filter(item => {
        const query = searchQuery.toLowerCase();
        const cropName = item.cropName.toLowerCase();
        const detail = item.recordType === 'scan' ? item.diseaseName.toLowerCase() : 'खाद कैलकुलेटर';
        return cropName.includes(query) || detail.includes(query);
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const filteredHistory = getUnifiedHistory();

  const handleDeleteRecord = (id: string, recordType: 'scan' | 'fertilizer') => {
    // Mock deletion
    if (recordType === 'scan') {
      const reports: DiseaseScanReport[] = JSON.parse(localStorage.getItem('km_disease_scans') || '[]');
      const filtered = reports.filter(r => r.id !== id);
      localStorage.setItem('km_disease_scans', JSON.stringify(filtered));
      setScans(prev => prev.filter(r => r.id !== id));
    } else {
      const recs: FertilizerRecommendation[] = JSON.parse(localStorage.getItem('km_fertilizer_recs') || '[]');
      const filtered = recs.filter(r => r.id !== id);
      localStorage.setItem('km_fertilizer_recs', JSON.stringify(filtered));
      setFertilizers(prev => prev.filter(r => r.id !== id));
    }
    toast('रिकॉर्ड सफलतापूर्वक हटा दिया गया है।', 'success');
  };

  return (
    <div className="space-y-6 text-left pb-12">
      {/* Header */}
      <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <HistoryIcon className="h-6 w-6 text-primary" />
          इतिहास और पिछला रिकॉर्ड (Farmer History)
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          पूर्व में किए गए फसल रोग स्कैन और खाद गणनाओं का रिकॉर्ड डेटाबेस।
        </p>
      </div>

      {/* Filters Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-850/80 shadow-sm">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-3 h-4.5 w-4.5 text-slate-400" />
          <input
            type="text"
            placeholder="फसल या बीमारी का नाम खोजें..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs font-semibold text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-primary"
          />
        </div>

        {/* Filters Select */}
        <div className="flex gap-2.5">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-350 focus:outline-none cursor-pointer"
          >
            <option value="all">सभी रिकॉर्ड</option>
            <option value="scans">रोग स्कैन रिपोर्ट</option>
            <option value="fertilizer">खाद कैलकुलेटर</option>
          </select>
        </div>
      </div>

      {/* History Log List */}
      <Card>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {loading ? (
              <p className="text-xs text-center text-slate-400 py-10">लोड हो रहा है...</p>
            ) : filteredHistory.length === 0 ? (
              <p className="text-xs text-center text-slate-450 py-10">कोई रिकॉर्ड नहीं मिला।</p>
            ) : (
              filteredHistory.map((item, idx) => {
                const isScan = item.recordType === 'scan';
                const formattedDate = new Date(item.date).toLocaleDateString('hi-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                });
                return (
                  <div
                    key={item.id || idx}
                    className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-all text-left"
                  >
                    <div className="flex items-start gap-4">
                      {/* Icon type */}
                      <div className={`h-11 w-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        isScan
                          ? 'bg-green-50 text-green-600 dark:bg-green-950/30 dark:text-green-400'
                          : 'bg-teal-50 text-teal-600 dark:bg-teal-950/30 dark:text-teal-400'
                      }`}>
                        {isScan ? <Scan className="h-5 w-5" /> : <Calculator className="h-5 w-5" />}
                      </div>

                      <div>
                        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                          {item.cropName.split(' ')[0]} - {isScan ? item.diseaseName : 'खाद गणना'}
                        </h4>
                        
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-semibold text-slate-400 mt-1">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            {formattedDate}
                          </span>
                          <span>•</span>
                          <span>
                            {isScan 
                              ? `सटीकता: ${item.confidence}%` 
                              : `रकबा: ${item.area} एकड़ (${item.soilType.split(' ')[0]})`
                            }
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 self-end sm:self-center">
                      <Button
                        variant="outline"
                        size="sm"
                        leftIcon={<Eye className="h-4 w-4" />}
                        onClick={() => isScan ? setSelectedScan(item) : setSelectedFertilizer(item)}
                      >
                        देखें
                      </Button>
                      <button
                        onClick={() => handleDeleteRecord(item.id, item.recordType)}
                        className="p-2 border border-slate-100 dark:border-slate-800 rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-500 cursor-pointer"
                        title="रिकॉर्ड हटाएं"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>

      {/* Modal 1: Disease Scan details */}
      <Dialog
        isOpen={!!selectedScan}
        onClose={() => setSelectedScan(null)}
        title="फसल रोग स्कैनर रिपोर्ट"
        size="lg"
      >
        {selectedScan && (
          <div className="space-y-5 text-left pb-4">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h4 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                  {selectedScan.diseaseName}
                </h4>
                <p className="text-xs font-semibold text-slate-400 mt-1">फसल: {selectedScan.cropName} | दिनांक: {new Date(selectedScan.date).toLocaleDateString('hi-IN')}</p>
              </div>
              <span className="text-2xl font-black text-primary font-display">{selectedScan.confidence}%</span>
            </div>

            <div className="rounded-xl overflow-hidden max-h-56 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 flex justify-center">
              <img src={selectedScan.imageUrl} alt="Leaf preview" className="object-contain max-h-56 w-full" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">कीटनाशक / दवा</span>
                <p className="text-xs font-bold text-slate-700 dark:text-slate-200">{selectedScan.treatment.medicine}</p>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">मात्रा (Dosage)</span>
                <p className="text-xs font-bold text-slate-700 dark:text-slate-200">{selectedScan.treatment.dosage}</p>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl md:col-span-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase">शेड्यूल</span>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-semibold">{selectedScan.treatment.schedule}</p>
              </div>
            </div>

            <div className="space-y-2">
              <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200">बचाव के सामान्य तरीके:</h5>
              <ul className="text-xs text-slate-500 dark:text-slate-400 pl-4 list-disc space-y-1 font-medium">
                {selectedScan.preventionTips.map((tip, idx) => <li key={idx}>{tip}</li>)}
              </ul>
            </div>

            <div className="flex gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <Button variant="outline" className="flex-1" leftIcon={<Download className="h-4 w-4" />} onClick={() => window.print()}>
                डाउनलोड
              </Button>
              <Button variant="ghost" className="flex-1" onClick={() => setSelectedScan(null)}>
                बंद करें
              </Button>
            </div>
          </div>
        )}
      </Dialog>

      {/* Modal 2: Fertilizer details */}
      <Dialog
        isOpen={!!selectedFertilizer}
        onClose={() => setSelectedFertilizer(null)}
        title="खाद कैलकुलेटर रिपोर्ट"
        size="md"
      >
        {selectedFertilizer && (
          <div className="space-y-5 text-left pb-4">
            <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
              <h4 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                खाद अनुशंसा रिपोर्ट
              </h4>
              <p className="text-xs font-semibold text-slate-400 mt-1">फसल: {selectedFertilizer.cropName} | रकबा: {selectedFertilizer.area} एकड़</p>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
                <p className="text-[9px] font-bold text-slate-400 uppercase">यूरिया</p>
                <p className="text-lg font-extrabold text-slate-800 dark:text-slate-200 mt-1 font-display">{selectedFertilizer.recommendation.urea} किग्रा</p>
              </div>
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
                <p className="text-[9px] font-bold text-slate-400 uppercase">डी.ए.पी.</p>
                <p className="text-lg font-extrabold text-slate-800 dark:text-slate-200 mt-1 font-display">{selectedFertilizer.recommendation.dap} किग्रा</p>
              </div>
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
                <p className="text-[9px] font-bold text-slate-400 uppercase">पोटाश</p>
                <p className="text-lg font-extrabold text-slate-800 dark:text-slate-200 mt-1 font-display">{selectedFertilizer.recommendation.potash} किग्रा</p>
              </div>
            </div>

            <div className="p-3 bg-amber-55/10 border border-amber-100 dark:border-amber-900/30 rounded-xl text-xs font-semibold">
              <span className="font-bold text-amber-800 dark:text-amber-400 block mb-0.5">सूक्ष्म पोषक तत्व</span>
              <p className="text-slate-650 dark:text-slate-350">{selectedFertilizer.recommendation.micronutrients}</p>
            </div>

            <div className="space-y-3.5">
              <h5 className="text-xs font-bold text-slate-800 dark:text-slate-250"> छिड़काव सारणी:</h5>
              <div className="space-y-3 pl-2 relative border-l border-slate-100 dark:border-slate-800 ml-1">
                {selectedFertilizer.recommendation.schedule.map((step, idx) => (
                  <div key={idx} className="relative pl-6 text-xs">
                    <span className="absolute -left-[13px] top-1.5 h-6 w-6 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-[10px] text-primary dark:bg-slate-900">
                      {idx + 1}
                    </span>
                    <p className="text-slate-600 dark:text-slate-300 font-semibold">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <Button variant="outline" className="flex-1" leftIcon={<Download className="h-4 w-4" />} onClick={() => window.print()}>
                डाउनलोड
              </Button>
              <Button variant="ghost" className="flex-1" onClick={() => setSelectedFertilizer(null)}>
                बंद करें
              </Button>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
};
