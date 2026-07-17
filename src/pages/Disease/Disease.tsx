import React, { useState, useRef } from 'react';
import { mockApi } from '../../services/mockApi';
import { DiseaseScanReport } from '../../types';
import { useToast } from '../../components/ui/Toast';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Alert } from '../../components/ui/Alert';
import {
  UploadCloud,
  Camera,
  Download,
  AlertTriangle,
  RefreshCw,
  FileCheck2,
  CheckCircle2,
  Sparkles,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Disease: React.FC = () => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedCrop, setSelectedCrop] = useState('गेहूं');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [report, setReport] = useState<DiseaseScanReport | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Real Camera States
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const cropOptions = ['गेहूं', 'टमाटर', 'चना', 'सोयाबीन'];

  const handleFileChange = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast('कृपया केवल इमेज (फोटो) फाइल ही अपलोड करें।', 'warning');
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setReport(null);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const startRealCamera = async () => {
    try {
      setIsCameraActive(true);
      // Wait for React to render the overlay video element
      setTimeout(async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
          });
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
          toast('कैमरा सक्रिय हो गया है!', 'success');
        } catch (innerErr) {
          setIsCameraActive(false);
          toast('कैमरा चालू करने में असमर्थ। अनुमति जांचें।', 'error');
        }
      }, 300);
    } catch (err: any) {
      setIsCameraActive(false);
      toast('कैमरा एक्सेस ब्लॉक कर दिया गया है।', 'error');
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && streamRef.current) {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setImagePreview(dataUrl);
        
        // Convert to File object for backend Mongoose upload
        fetch(dataUrl)
          .then(res => res.blob())
          .then(blob => {
            const file = new File([blob], 'camera_capture.jpg', { type: 'image/jpeg' });
            setImageFile(file);
          });
        
        setReport(null);
        stopCamera();
        toast('फोटो सफलतापूर्वक ली गई!', 'success');
      }
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const runDetectionFlow = async (previewUrl: string) => {
    setIsScanning(true);
    setScanStep(0); // "फोटो की जांच चालू है..."

    setTimeout(() => {
      setScanStep(1); // "माडल लोड हो रहा है..."
    }, 800);

    setTimeout(() => {
      setScanStep(2); // "पत्ती का विश्लेषण किया जा रहा है..."
    }, 1600);

    setTimeout(() => {
      setScanStep(3); // "दवाई की गणना चालू है..."
    }, 2400);

    try {
      const inputMedia = imageFile || previewUrl;
      const result = await mockApi.predictDisease(inputMedia, selectedCrop);
      
      setTimeout(() => {
        setReport(result);
        setIsScanning(false);
        toast('फसल बीमारी पहचान रिपोर्ट तैयार है!', 'success');
      }, 3000);
    } catch (err: any) {
      setIsScanning(false);
      if (err.message === 'NOT_A_LEAF') {
        toast('कौनों असली पत्ता की फोटो खींच के डालो भैया, ईमा पत्ता नई दिख रओ है।', 'error');
      } else if (err.message && err.message.startsWith('CROP_MISMATCH:')) {
        const errorMsg = err.message.split('CROP_MISMATCH:')[1];
        toast(errorMsg, 'error');
      } else {
        toast('जांच विफल रही। कृपया दोबारा फोटो अपलोड करें।', 'error');
      }
    }
  };

  const handleScanSubmit = () => {
    if (!imagePreview) {
      toast('कृपया पहले फसल की पत्ती का फोटो चुनें।', 'warning');
      return;
    }
    runDetectionFlow(imagePreview);
  };

  const resetScanner = () => {
    setImageFile(null);
    setImagePreview(null);
    setReport(null);
    setIsScanning(false);
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  const scanStepsText = [
    'कैमरा तैयार किया जा रहा है...',
    'YOLOv8 मॉडल लोड हो रहा है...',
    'पत्ती के रोगग्रस्त हिस्से का स्कैन चालू है...',
    'उपचार और कीटनाशक की सही मात्रा जांची जा रही है...'
  ];

  return (
    <div className="space-y-6 text-left pb-12">
      {/* Header */}
      <div className="border-b border-slate-100 dark:border-slate-800 pb-4 no-print">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" />
          ए.आई. फसल रोग स्कैनर (FastAPI Disease Detection)
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          बीमार पत्ते की फोटो खींचकर या गैलरी से अपलोड कर तुरंत समाधान पाएं।
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Input Section */}
        <div className="lg:col-span-5 space-y-6 no-print">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-bold">1. फसल और फोटो चुनें</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Crop Select */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  अपनी फसल चुनें
                </label>
                <div className="flex flex-wrap gap-2">
                  {cropOptions.map((crop) => (
                    <button
                      key={crop}
                      type="button"
                      onClick={() => setSelectedCrop(crop)}
                      className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                        selectedCrop === crop
                          ? 'bg-primary text-white shadow-sm'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                      }`}
                    >
                      {crop}
                    </button>
                  ))}
                </div>
              </div>

              {/* Upload Zone */}
              <div
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all ${
                  isDragging
                    ? 'border-primary bg-primary/5'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-350 bg-slate-50/50 dark:bg-slate-900/40'
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
                  className="hidden"
                  accept="image/*"
                />

                {imagePreview ? (
                  <div className="relative group rounded-xl overflow-hidden shadow-inner max-w-full max-h-56">
                    <img
                      src={imagePreview}
                      alt="Crop leaf preview"
                      className="object-cover max-h-56 rounded-xl"
                    />
                    <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-xl">
                      <p className="text-white text-xs font-bold">दूसरी फोटो चुनें</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <UploadCloud className="h-10 w-10 text-slate-400 mb-3" />
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300">फोटो खींचें या अपलोड करें</p>
                    <p className="text-xs text-slate-400 mt-1">यहाँ ड्रैग एंड ड्रॉप करें या ब्राउज़ करें</p>
                  </>
                )}
              </div>

              {/* Quick Actions Buttons */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  leftIcon={<Camera className="h-4 w-4" />}
                  onClick={startRealCamera}
                  disabled={isScanning}
                >
                  कैमरा ऑन करें
                </Button>
                {imagePreview && (
                  <Button
                    variant="ghost"
                    className="text-red-500 hover:bg-red-50"
                    onClick={resetScanner}
                    disabled={isScanning}
                  >
                    हटाएं
                  </Button>
                )}
              </div>

              {/* Scan Submit */}
              {imagePreview && !report && (
                <Button
                  variant="primary"
                  className="w-full py-3"
                  isLoading={isScanning}
                  leftIcon={<FileCheck2 className="h-5 w-5" />}
                  onClick={handleScanSubmit}
                >
                  ए.आई. बीमारी जांच शुरू करें
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Output Section */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {/* 1. Loading Step Animation */}
            {isScanning && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col items-center justify-center p-12 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm text-center"
              >
                <div className="relative flex items-center justify-center mb-6">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
                  <RefreshCw className="h-6 w-6 text-primary absolute animate-pulse" />
                </div>
                <h4 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                  फसल की जांच की जा रही है...
                </h4>
                <p className="text-sm text-slate-400 mt-2 max-w-xs">
                  {scanStepsText[scanStep]}
                </p>
                <div className="w-48 bg-slate-100 dark:bg-slate-800 h-1 rounded-full overflow-hidden mt-6">
                  <div
                    className="bg-primary h-1 rounded-full transition-all duration-500"
                    style={{ width: `${(scanStep + 1) * 25}%` }}
                  ></div>
                </div>
              </motion.div>
            )}

            {/* 2. Disease Report Details */}
            {report && !isScanning && (() => {
              const user = mockApi.getCurrentUser();
              return (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                  id="disease-report-print"
                >
                  <Card className="border-4 border-solid border-emerald-500 rounded-3xl relative overflow-hidden bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 shadow-xl max-w-4xl mx-auto">
                    
                    {/* Certified Watermark Stamp */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0 overflow-hidden">
                      <div className="print-watermark hidden flex flex-col items-center justify-center border-4 border-emerald-500/10 text-emerald-500/10 font-black text-center p-8 rounded-full uppercase tracking-widest text-4xl w-96 h-96">
                        <div>TESTED BY</div>
                        <div className="text-5xl mt-2 font-display">BUNDELI</div>
                        <div className="text-3xl mt-1">KRISHI MITRA</div>
                        <div className="text-xs mt-4 border-t border-emerald-500/10 pt-2 font-semibold">बुंदेली कृषि मित्र प्रमाणित</div>
                      </div>
                    </div>

                    <CardContent className="p-6 space-y-6 relative z-10">

                    {/* Report Header */}
                    <div className="border-b-2 border-emerald-500 pb-4 mb-4 relative z-10 flex justify-between items-center text-left">
                      <div>
                        <span className="bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">बुंदेली कृषि मित्र ए.आई.</span>
                        <h1 className="text-2xl font-black text-emerald-600 font-display mt-1.5">फसल स्वास्थ्य प्रमाणपत्र (Crop Health Report)</h1>
                      </div>
                      <div className="text-right text-xs text-slate-500 dark:text-slate-400">
                        <p className="font-bold">दिनांक: {new Date().toLocaleDateString('hi-IN')}</p>
                        <p className="text-[10px] font-mono">ID: BKM-{Math.floor(100000 + Math.random() * 900000)}</p>
                      </div>
                    </div>

                    {/* Centered Leaf Scan Image */}
                    <div className="flex flex-col items-center justify-center mb-6 relative z-10">
                      <div className="rounded-2xl overflow-hidden border-2 border-slate-200 dark:border-slate-800 aspect-square max-h-48 w-48 bg-slate-50 dark:bg-slate-950 flex items-center justify-center shadow-md">
                        <img
                          src={report.imageUrl}
                          alt="Scan Frame"
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <p className="text-[10px] text-slate-400 font-medium italic mt-2 no-print">संक्रमित पत्ती का चित्र (Leaf Scan Frame)</p>
                    </div>

                    {/* Main Content Grid: 2-Columns to fit single page */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 relative z-10 text-left">
                      {/* Left Column (Metadata Details) */}
                      <div className="md:col-span-5 space-y-4">
                        {/* Farmer Profile Card */}
                        <div className="p-4 bg-emerald-50/50 dark:bg-slate-800/40 rounded-2xl border border-emerald-100 dark:border-slate-800 text-left space-y-2">
                          <span className="text-emerald-800 dark:text-emerald-400 font-bold uppercase text-[9px] block tracking-wide">किसान का विवरण (Farmer Profile)</span>
                          <p className="text-sm font-bold text-slate-800 dark:text-slate-200">किसान भाई: <span className="font-medium text-slate-600 dark:text-slate-400">{user?.name || 'नया किसान भाई'}</span></p>
                          <p className="text-sm font-bold text-slate-800 dark:text-slate-200">जिला: <span className="font-medium text-slate-600 dark:text-slate-400">{user?.district || 'झाँसी'}</span></p>
                          <p className="text-sm font-bold text-slate-800 dark:text-slate-200">भाषा: <span className="font-medium text-slate-600 dark:text-slate-400">बुंदेली (Bundeli)</span></p>
                        </div>
                      </div>

                      {/* Right Column (Condition & Remedies) */}
                      <div className="md:col-span-7 space-y-4">
                        {/* Current Condition (वर्तमान स्थिति) */}
                        <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800 text-left">
                          <span className="text-slate-400 font-bold uppercase text-[9px] block tracking-wide mb-1">वर्तमान स्थिति (Current Condition)</span>
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="text-lg font-black text-slate-800 dark:text-slate-100">{report.diseaseName}</h4>
                              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">लक्षित फसल: {selectedCrop}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              report.severity === 'High'
                                ? 'bg-red-100 text-red-700 dark:bg-red-950/20 dark:text-red-400'
                                : report.severity === 'Medium'
                                ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400'
                                : 'bg-green-100 text-green-700 dark:bg-green-950/20 dark:text-green-400'
                            }`}>
                              {report.severity === 'High' ? '🔴 गंभीर प्रकोप' : report.severity === 'Medium' ? '🟡 मध्यम प्रकोप' : '🟢 हल्का प्रकोप'}
                            </span>
                          </div>
                        </div>


                        {/* Next Steps (अगले कदम व उपचार) */}
                        <div className="p-4 bg-emerald-50/30 dark:bg-emerald-950/10 rounded-2xl border border-emerald-100/50 dark:border-emerald-950/20 text-left space-y-3">
                          <span className="text-emerald-800 dark:text-emerald-400 font-bold uppercase text-[9px] block tracking-wide">अगले कदम व उपचार (Next Steps & To-Do)</span>
                          
                          <div className="grid grid-cols-2 gap-3 text-xs">
                            <div className="bg-white dark:bg-slate-950 p-3 rounded-xl border border-slate-100 dark:border-slate-850">
                              <span className="text-slate-400 font-bold text-[9px] block uppercase">कीटनाशक / दवा</span>
                              <p className="font-bold text-slate-700 dark:text-slate-350 mt-0.5">{report.treatment.medicine}</p>
                            </div>
                            <div className="bg-white dark:bg-slate-950 p-3 rounded-xl border border-slate-100 dark:border-slate-850">
                              <span className="text-slate-400 font-bold text-[9px] block uppercase">मात्रा (Dosage)</span>
                              <p className="font-bold text-slate-700 dark:text-slate-350 mt-0.5">{report.treatment.dosage}</p>
                            </div>
                          </div>

                          <div className="bg-white dark:bg-slate-950 p-3 rounded-xl border border-slate-100 dark:border-slate-850 text-xs">
                            <span className="text-slate-400 font-bold text-[9px] block uppercase">छिड़काव शेड्यूल</span>
                            <p className="font-medium text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">{report.treatment.schedule}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Machine Generated Disclaimer Note */}
                    <div className="text-left text-[8.5px] text-slate-500 dark:text-slate-400 font-bold italic mt-3 relative z-10 leading-none">
                      * नोट: यह एक मशीन जनरेटेड रिपोर्ट है, इसकी सत्यता की कोई गारंटी नहीं है।
                    </div>

                    {/* Footer */}
                    <div className="border-t border-slate-100 dark:border-slate-800 pt-4 mt-2 flex justify-between items-center relative z-10 text-xs text-left">
                      <div className="text-slate-500 dark:text-slate-400">
                        <p className="font-bold">मदद हेल्पलाइन नंबर: १८००-१२३-४५६७</p>
                        <p className="text-[10px]">कृषि विज्ञान सलाहकार विभाग | बुंदेली डिजिटल पोर्टल</p>
                      </div>
                      
                      {/* Digital Seal Badge (No signature line needed) */}
                      <div className="flex items-center gap-2 border-2 border-dashed border-emerald-500 p-2 px-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20">
                        <CheckCircle2 className="h-6 w-6 text-emerald-600 flex-shrink-0" />
                        <div className="text-left">
                          <span className="font-bold text-emerald-700 dark:text-emerald-400 block text-[8px] uppercase tracking-wider leading-none">सत्यापित निदान</span>
                          <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-black mt-0.5">कृषि मित्र ए.आई. प्रमाणित</p>
                        </div>
                      </div>
                    </div>

                    {/* Export Buttons */}
                    <div className="flex gap-4 border-t border-slate-100 dark:border-slate-800 pt-6 no-print">
                      <Button
                        variant="outline"
                        leftIcon={<Download className="h-4 w-4" />}
                        className="flex-1"
                        onClick={handleDownloadPDF}
                      >
                        रिपोर्ट डाउनलोड करें (PDF)
                      </Button>
                      <Button
                        variant="ghost"
                        className="flex-1"
                        leftIcon={<RefreshCw className="h-4 w-4" />}
                        onClick={resetScanner}
                      >
                        दुबारा जांचें
                      </Button>
                    </div>
                  </CardContent>
                  </Card>
                </motion.div>
              );
            })()}

            {/* 3. Empty State */}
            {!imagePreview && !report && !isScanning && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center p-12 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm text-center"
              >
                <div className="h-16 w-16 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-4">
                  <Info className="h-8 w-8" />
                </div>
                <h4 className="text-base font-bold text-slate-800 dark:text-slate-100">
                  कोई रिपोर्ट प्रदर्शित नहीं है
                </h4>
                <p className="text-xs text-slate-400 mt-2 max-w-xs leading-relaxed">
                  बाएं पैनल का उपयोग करके फसल का पत्ता अपलोड करें और "जांच शुरू करें" पर क्लिक करें। रिपोर्ट यहाँ दिखाई देगी।
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Real Camera Stream Modal */}
      {isCameraActive && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl p-6 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Camera className="h-5 w-5 text-primary" />
                कैमरा लाइव फ़ीड (Rear Camera)
              </h3>
              <button 
                onClick={stopCamera} 
                className="text-slate-400 hover:text-white text-xs font-semibold cursor-pointer p-1 rounded hover:bg-slate-800"
              >
                बंद करें
              </button>
            </div>
            
            <div className="relative rounded-2xl overflow-hidden aspect-video bg-black border border-slate-800 shadow-inner">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="flex gap-4">
              <Button
                variant="primary"
                className="flex-1 py-3 font-semibold text-xs rounded-xl"
                onClick={capturePhoto}
              >
                फोटो कैप्चर करें (Capture)
              </Button>
              <Button
                variant="outline"
                className="px-6 rounded-xl text-xs font-semibold"
                onClick={stopCamera}
              >
                रद्द करें
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
