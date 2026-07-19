import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Scan,
  Mic,
  CloudSun,
  CircleDollarSign,
  Calculator,
  ArrowRight,
  TrendingUp,
  Award,
  Users,
  CheckCircle,
  HelpCircle,
  Droplets,
  Leaf
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

export const Landing: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: 'रोग पहचान (Disease Detection)',
      desc: 'फसल के बीमार पत्ते की फोटो खींचे और तुरंत रोग का नाम, दवा और बचाव के उपाय पाएं।',
      icon: Scan,
      color: 'bg-green-50 text-green-600 dark:bg-green-950/30 dark:text-green-400'
    },
    {
      title: 'बुंदेली वॉइस सहायक (AI Voice Assistant)',
      desc: 'माइक दबाकर बुंदेली में बोलें, जैसे: "भैया गेहूं मा पीला रोग लग गओ, का करैं?"। AI बोलकर जवाब देगा।',
      icon: Mic,
      color: 'bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400'
    },
    {
      title: 'मौसम अलर्ट (Weather Warnings)',
      desc: 'भारी बारिश, पाला या कीटों के प्रकोप की समय पर चेतावनी सीधे आपके मोबाइल पर।',
      icon: CloudSun,
      color: 'bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400'
    },
    {
      title: 'मंडी भाव (Mandi Prices)',
      desc: 'झाँसी, सागर और आसपास की मंडियों के ताज़ा भाव। साप्ताहिक मूल्य चार्ट और मूल्य रुझान।',
      icon: CircleDollarSign,
      color: 'bg-purple-50 text-purple-600 dark:bg-purple-950/30 dark:text-purple-400'
    },
    {
      title: 'खाद कैलकुलेटर (Fertilizer)',
      desc: 'फसल, रकबा और माटी के हिसाब से यूरिया, डीएपी और पोटाश की सही मात्रा व छिड़काव का समय।',
      icon: Calculator,
      color: 'bg-teal-50 text-teal-600 dark:bg-teal-950/30 dark:text-teal-400'
    }
  ];

  const stats = [
    { value: '५१+', label: 'सक्रिय किसान भाई', icon: Users },
    { value: '९५%', label: 'रोग पहचान सटीकता', icon: CheckCircle },
    { value: '२४x७', label: 'ए.आई. वैज्ञानिक सलाह', icon: TrendingUp },
    { value: '५०+', label: 'फसलें और सब्ज़ियां', icon: Award }
  ];

  const faqs = [
    {
      q: 'क्या यह सेवा पूरी तरह से मुफ़्त है?',
      a: 'हाँ, बुंदेली कृषि मित्र की सभी मुख्य सेवाएँ (रोग जांच, मौसम सलाह, मंडी भाव और वॉइस चैट) किसानों के लिए पूरी तरह से मुफ़्त हैं।'
    },
    {
      q: 'बुंदेली वॉइस असिस्टेंट का उपयोग कैसे करें?',
      a: 'आप माइक बटन दबाकर सीधे बुंदेली भाषा में बोल सकते हैं, जैसे: "भैया गेहूं मा पीला रोग लग गओ, का करैं?"। ए.आई. आपको बोलकर और लिखकर बुंदेली में ही जवाब देगा।'
    },
    {
      q: 'बीमारी की जांच के लिए कैसी फोटो अपलोड करनी चाहिए?',
      a: 'फसल के ग्रसित पत्ते की साफ़ और नज़दीक से ली गई फोटो अपलोड करें। ध्यान रखें कि फोटो में पर्याप्त धूप या रोशनी हो।'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-mesh overflow-x-hidden">
      {/* Navbar */}
      <header className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center bg-white/40 dark:bg-slate-900/40 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100/50 dark:border-slate-800/30">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
            <span className="text-xl font-bold font-display">KM</span>
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-850 dark:text-slate-100 leading-tight">बुंदेली कृषि मित्र</h1>
            <p className="text-xs text-secondary font-medium">आपका अपना खेती सलाहकार</p>
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" size="sm" onClick={() => navigate('/login')}>लॉगिन</Button>
          <Button variant="primary" size="sm" onClick={() => navigate('/register')}>पंजीकरण करें</Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-6 text-left">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary dark:text-primary-hover"
          >
            🌱 बुंदेलखंड के किसान भाइयों के लिए खास सौगात
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display leading-[1.15] text-slate-900 dark:text-white"
          >
            बुंदेली कृषि मित्र <br />
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              आपका अपना खेती सलाहकार
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl"
          >
            फसल बीमारियों की पहचान, बुंदेली में वैज्ञानिक सलाह, ताज़ा मंडी भाव, मौसम अलर्ट और खाद की सही गणना - अब सब कुछ एक ही जगह, अपनी बुंदेली बोली में।
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-4 pt-2"
          >
            <Button
              variant="primary"
              size="lg"
              rightIcon={<ArrowRight className="h-5 w-5" />}
              onClick={() => navigate('/register')}
            >
              अभी शुरू करें
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/login')}
            >
              लॉगिन करें
            </Button>
          </motion.div>
        </div>

        {/* Hero Banner Illustration */}
        <div className="lg:col-span-5 relative px-4 lg:px-0">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', damping: 20, stiffness: 100 }}
            className="w-full relative rounded-3xl p-2 glass-card tilt-element shadow-[0_20px_50px_rgba(16,185,129,0.15)] h-[480px] flex items-center justify-center overflow-hidden border border-white/5 bg-[#050505]"
          >
            {/* Dark Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:30px_30px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]" />

            {/* Central Glowing AI Core */}
            <div className="relative z-10 flex items-center justify-center">
              {/* Outer pulsing ring */}
              <div className="absolute w-80 h-80 border border-primary/20 rounded-full animate-[spin_12s_linear_infinite]" />
              <div className="absolute w-80 h-80 border-t-2 border-primary/40 rounded-full animate-[spin_8s_linear_infinite_reverse]" />
              
              {/* Middle dashed ring */}
              <div className="absolute w-64 h-64 border-[1.5px] border-dashed border-secondary/30 rounded-full animate-[spin_20s_linear_infinite]" />
              
              {/* Inner energetic core */}
              <div className="absolute w-40 h-40 bg-primary/10 rounded-full blur-xl animate-pulse" />
              <div className="absolute w-32 h-32 bg-primary/20 rounded-full blur-lg animate-pulse delay-75" />
              
              {/* Core element */}
              <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-primary to-emerald-900 border border-white/20 shadow-[0_0_40px_rgba(16,185,129,0.5)] flex items-center justify-center z-20">
                <Leaf className="h-10 w-10 text-white animate-pulse" />
                <div className="absolute inset-0 rounded-full bg-white/20 animate-ping opacity-20" />
              </div>
            </div>

            {/* Scanning Beam */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50 shadow-[0_0_15px_rgba(16,185,129,1)] animate-[scan_3s_ease-in-out_infinite]" />

            {/* Floating Data Panels */}
            
            {/* Panel 1: Soil Moisture */}
            <div className="absolute top-12 left-8 glass-card border border-white/10 rounded-2xl p-4 shadow-2xl z-30 animate-float-3d bg-black/40 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                  <Droplets className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">मृदा नमी</p>
                  <div className="flex items-end gap-2 mt-1">
                    <span className="text-xl font-bold text-white leading-none">४२%</span>
                    <span className="text-[10px] text-blue-400 font-medium">इष्टतम</span>
                  </div>
                </div>
              </div>
              {/* Mini chart */}
              <div className="mt-3 flex gap-1 h-6 items-end">
                {[40, 60, 45, 80, 55, 75, 42].map((h, i) => (
                  <div key={i} className="flex-1 bg-blue-500/30 rounded-t-sm" style={{ height: `${h}%` }} />
                ))}
              </div>
            </div>

            {/* Panel 2: Disease Detection AI */}
            <div className="absolute bottom-12 left-6 glass-card border border-primary/30 rounded-2xl p-4 shadow-[0_10px_30px_rgba(16,185,129,0.15)] z-30 animate-float-slow tilt-element bg-black/60 backdrop-blur-md w-56">
              <div className="flex items-center gap-3 mb-3 border-b border-white/10 pb-3">
                <div className="relative">
                  <Scan className="h-6 w-6 text-primary" />
                  <span className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full animate-ping" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">रोग विश्लेषण सक्रिय</p>
                  <p className="text-[9px] text-primary mt-0.5">YOLOv8 Neural Network</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between items-center text-[10px] mb-1">
                    <span className="text-slate-300">पत्ती धब्बा (Leaf Spot)</span>
                    <span className="text-white font-bold">०.०१%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5">
                    <div className="bg-primary h-1.5 rounded-full w-[5%]" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center text-[10px] mb-1">
                    <span className="text-slate-300">स्वस्थ फसल (Healthy)</span>
                    <span className="text-primary font-bold">९९.९%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5">
                    <div className="bg-primary h-1.5 rounded-full w-[99%]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Panel 3: AI Voice Assistant */}
            <div className="absolute top-1/2 -translate-y-1/2 right-6 glass-card border border-accent/20 rounded-2xl p-4 shadow-2xl z-30 animate-float-3d delay-150 bg-black/40 backdrop-blur-md w-56">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-accent/20 flex items-center justify-center border border-accent/30">
                    <Mic className="h-4 w-4 text-accent animate-pulse" />
                  </div>
                  <p className="text-[11px] font-bold text-white">बुंदेली AI वॉइस</p>
                </div>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
                </span>
              </div>
              <p className="text-[10px] text-slate-300 italic mb-3 leading-relaxed border-l-2 border-accent/50 pl-2">
                "राम राम! आज मौसम साफ रएगो, खाद डारबे को सही समय आय।"
              </p>
              <div className="flex items-center justify-center gap-1 h-4">
                {[1, 2, 3, 4, 5, 4, 3, 2, 1].map((i, idx) => (
                  <div key={idx} className="w-1 bg-accent rounded-full voice-bar" style={{ animationDelay: `${idx * 0.1}s` }} />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-slate-900/40 border-y border-slate-800/50 py-12 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="flex flex-col items-center text-center space-y-2">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-1">
                  <Icon className="h-5 w-5" />
                </div>
                <p className="text-3xl font-extrabold font-display text-white">{stat.value}</p>
                <p className="text-xs font-bold text-slate-400">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-6 py-24 text-left relative">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h3 className="text-3xl font-bold font-display text-white">प्रमुख सुविधाएँ (Core Features)</h3>
          <p className="text-sm text-slate-400">किसान भाइयों के लिए विशेष रूप से बनाई गई स्मार्ट ए.आई. सेवाएँ</p>
        </div>

        {/* 3D Smart Farm Banner - Ethereal Aurora Glass */}
        <div className="w-full h-64 md:h-80 mb-16 rounded-3xl overflow-hidden relative border border-white/5 bg-[#030303] flex items-center justify-center group">
          
          {/* Animated Aurora Orbs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary/20 rounded-full blur-[80px] animate-[pulse_6s_ease-in-out_infinite]" />
            <div className="absolute top-1/2 -right-20 w-80 h-80 bg-secondary/15 rounded-full blur-[100px] animate-[pulse_8s_ease-in-out_infinite_reverse]" />
            <div className="absolute -bottom-20 left-1/3 w-72 h-72 bg-blue-500/15 rounded-full blur-[90px] animate-[pulse_10s_ease-in-out_infinite]" />
          </div>

          {/* Subtly Animated Starfield (Noise/Dots) */}
          <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:24px_24px] opacity-20" />

          {/* Center Glass Panel */}
          <div className="relative z-20 flex flex-col items-center justify-center p-8 md:p-12 text-center glass-card bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] transform transition-transform duration-700 group-hover:scale-105 max-w-4xl mx-4">
            <div className="h-14 w-14 rounded-2xl bg-white/5 backdrop-blur-md flex items-center justify-center mb-5 border border-white/10 shadow-inner relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-transparent" />
              <TrendingUp className="h-7 w-7 text-white relative z-10" />
            </div>
            <h4 className="text-3xl md:text-5xl font-extrabold font-display text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400 mb-4 tracking-tight">
              आधुनिक डिजिटल खेती
            </h4>
            <p className="text-sm md:text-lg text-slate-300 max-w-2xl font-medium leading-relaxed">
              कृत्रिम बुद्धिमत्ता (AI) और आधुनिक तकनीकों के साथ, अपनी खेती को बनाएं और भी ज्यादा स्मार्ट और सुरक्षित।
            </p>
            
            {/* Elegant glowing underline */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/3 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <Card key={idx} hoverLift glass tilt className="p-8 flex flex-col justify-between h-64">
                <div className="space-y-4">
                  <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${feat.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h4 className="text-lg font-bold text-white">{feat.title}</h4>
                  <p className="text-xs leading-relaxed text-slate-400">{feat.desc}</p>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* FAQ Accordions */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-left">
        <h3 className="text-2xl font-bold font-display text-white text-center mb-12">सामान्य प्रश्न (FAQ)</h3>
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-2 backdrop-blur-sm">
              <div className="flex gap-2.5 items-start">
                <HelpCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <h4 className="text-sm font-bold text-white">{faq.q}</h4>
              </div>
              <p className="text-xs text-slate-400 pl-7 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-8 bg-slate-950/60 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-slate-400 font-semibold">
          <p>© २०२६ बुंदेली कृषि मित्र। सर्वाधिकार सुरक्षित।</p>
          <div className="flex flex-col md:flex-row items-center gap-1.5 md:gap-4 text-center md:text-left">
            <span>विकासकर्ता: करन राय</span>
            <span className="hidden md:inline text-slate-700">•</span>
            <span>मोबाइल: 9301887727</span>
            <span className="hidden md:inline text-slate-700">•</span>
            <span>स्थान: दमोह, मध्य प्रदेश</span>
            <span className="hidden md:inline text-slate-700">•</span>
            <span>ईमेल: raik182005@gamil.com</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
