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
  HelpCircle
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import heroIllustration from '../../assets/farmer_hero_mockup.jpg';

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
    { value: '१०,०००+', label: 'सक्रिय किसान भाई', icon: Users },
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
            className="w-full relative rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/50 dark:border-slate-800/40 p-6 shadow-2xl glass"
          >
            {/* Phone/Device mockup inside card */}
            <div className="rounded-xl border border-slate-100 dark:border-slate-805 bg-slate-50 dark:bg-slate-950 p-4 shadow-inner space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-200/50 dark:border-slate-800/50 pb-3">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-xs">KM</div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-slate-855 dark:text-slate-200 leading-none">बुंदेली कृषि मित्र</p>
                  <p className="text-[10px] text-green-500 font-medium leading-none mt-1">● ऑनलाइन सहायक</p>
                </div>
              </div>

              {/* Chat simulation */}
              <div className="space-y-3">
                <div className="flex justify-end">
                  <div className="bg-primary text-white text-xs px-3 py-2 rounded-2xl rounded-tr-none max-w-[80%] font-medium">
                    भैया चने में इल्ली लग गई है, का करें?
                  </div>
                </div>

                {/* AI Leaf Scan illustration display */}
                <div className="flex justify-end">
                  <div className="rounded-xl overflow-hidden border border-primary/20 max-w-[70%] shadow-sm relative group">
                    <img src={heroIllustration} alt="Scanned Leaf" className="w-full h-24 object-cover" />
                    <div className="absolute inset-0 bg-primary/10 border border-primary animate-pulse" />
                    <div className="absolute top-1 left-1.5 bg-black/60 backdrop-blur-sm text-[8px] text-white px-1.5 py-0.5 rounded font-display uppercase tracking-wider">
                      YOLOv8: Scanning...
                    </div>
                  </div>
                </div>

                <div className="flex justify-start">
                  <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-xs px-3 py-2 rounded-2xl rounded-tl-none max-w-[80%] text-slate-700 dark:text-slate-300 leading-relaxed shadow-sm">
                    राम राम भाई! चने की फसल में इल्ली भगाने लाने नीम को तेल ५% को छिड़काव कर देव, या फिर इमामेक्टिन बेंजोएट दवाई की ८० ग्राम मात्रा को १५० लीटर पानी में घोल के प्रति एकड़ छिड़क देव।
                  </div>
                </div>
              </div>

              {/* Wave & Mic simulator */}
              <div className="flex items-center gap-3 pt-2">
                <div className="flex-1 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-between px-3">
                  <div className="flex gap-0.5 items-center">
                    <div className="h-3 w-0.5 bg-primary rounded-full animate-pulse" />
                    <div className="h-5 w-0.5 bg-primary rounded-full animate-pulse delay-75" />
                    <div className="h-4 w-0.5 bg-primary rounded-full animate-pulse delay-150" />
                    <div className="h-2 w-0.5 bg-slate-300 rounded-full" />
                  </div>
                  <span className="text-[10px] text-slate-400">बोलकर प्रश्न पूछें...</span>
                </div>
                <button className="h-9 w-9 rounded-full bg-primary flex items-center justify-center text-white shadow-md">
                  <Mic className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Float badge 1 */}
            <div className="absolute -top-4 -left-6 bg-white dark:bg-slate-800 border border-slate-150 dark:border-slate-700/50 rounded-xl p-3 shadow-lg flex items-center gap-2.5 z-10">
              <Scan className="h-5 w-5 text-green-500" />
              <div className="text-left">
                <p className="text-[10px] text-slate-400 font-semibold leading-none">रोग पहचान</p>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1">९७% सटीकता</p>
              </div>
            </div>

            {/* Float badge 2 */}
            <div className="absolute -bottom-4 -right-6 bg-white dark:bg-slate-800 border border-slate-150 dark:border-slate-700/50 rounded-xl p-3 shadow-lg flex items-center gap-2.5 z-10">
              <CircleDollarSign className="h-5 w-5 text-yellow-500" />
              <div className="text-left">
                <p className="text-[10px] text-slate-400 font-semibold leading-none">मंडी भाव (गेहूं)</p>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1">₹२,४५० / क्वि.</p>
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
      <section className="max-w-7xl mx-auto px-6 py-24 text-left">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h3 className="text-3xl font-bold font-display text-white">प्रमुख सुविधाएँ (Core Features)</h3>
          <p className="text-sm text-slate-400">किसान भाइयों के लिए विशेष रूप से बनाई गई स्मार्ट ए.आई. सेवाएँ</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <Card key={idx} className="p-8 glass flex flex-col justify-between h-64">
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
