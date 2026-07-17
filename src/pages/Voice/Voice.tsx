import React, { useState, useEffect, useRef } from 'react';
import { mockApi } from '../../services/mockApi';
import { VoiceConversation, Message } from '../../types';
import { useToast } from '../../components/ui/Toast';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import {
  Mic,
  Send,
  Volume2,
  VolumeX,
  Copy,
  Share2,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
  RefreshCcw,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Voice: React.FC = () => {
  const { toast } = useToast();
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [conversations, setConversations] = useState<VoiceConversation[]>([]);
  const [activeChat, setActiveChat] = useState<VoiceConversation | null>(null);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeakingId, setIsSpeakingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Suggested Questions Chips
  const suggestions = [
    'गेहूं में पीला रोग का इलाज बताएं',
    'चना की फसल में इल्ली लग गई है',
    'यूरिया खाद कितनी मात्रा में डालें?',
    'आज झाँसी मंडी में गेहूं का क्या रेट है?'
  ];

  useEffect(() => {
    const loadConversations = async () => {
      const chats = await mockApi.getVoiceConversations();
      setConversations(chats);
      if (chats.length > 0) {
        setActiveChat(chats[0]);
      }
    };
    loadConversations();
  }, []);

  useEffect(() => {
    // Scroll to bottom on new messages
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChat?.messages, isTyping]);

  const handleSendText = async (text: string) => {
    if (!text.trim()) return;
    setInputText('');
    setIsTyping(true);

    const chatId = activeChat ? activeChat.id : null;

    try {
      const response = await mockApi.sendVoiceChat(chatId, text);
      
      // Update local state
      const chats = await mockApi.getVoiceConversations();
      setConversations(chats);
      
      const updatedChat = chats.find(c => c.id === response.conversation.id) || response.conversation;
      setActiveChat(updatedChat);
      setIsTyping(false);

      // Proactively play the voice response!
      speakText(response.replyText, updatedChat.messages[updatedChat.messages.length - 1].id);

    } catch (e) {
      setIsTyping(false);
      toast('संदेश भेजने में त्रुटि हुई। कृपया दोबारा प्रयास करें।', 'error');
    }
  };

  // Real Mic Recording using Web Speech API
  const startVoiceRecording = () => {
    if (isRecording) return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast('क्षमा करें, आपका ब्राउज़र वॉयस इनपुट सपोर्ट नहीं करता है।', 'error');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'hi-IN'; // Use Hindi for Bundeli dialect recognition
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsRecording(true);
      toast('बुंदेली में बोलना शुरू करें, ए.आई. सुन रहा है...', 'info');
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      toast(`पहचाना गया प्रश्न: "${transcript}"`, 'success');
      setInputText(transcript);
      handleSendText(transcript);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      if (event.error === 'not-allowed' || event.error === 'permission-denied') {
        toast('माइक्रोफोन की अनुमति नहीं है। कृपया ब्राउज़र सेटिंग्स में माइक चालू करें।', 'error');
      } else {
        toast('सुनने में त्रुटि हुई, कृपया दोबारा बोलें।', 'error');
      }
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.start();
  };

  // Web Speech API Voice synthesis
  const speakText = (text: string, msgId: string) => {
    // Stop any running speech
    window.speechSynthesis.cancel();

    if (isSpeakingId === msgId) {
      setIsSpeakingId(null);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'hi-IN'; // Indian Hindi voice speaks Bundeli accent perfectly
    utterance.rate = 0.9; // Slightly slower for rural accessibility

    utterance.onend = () => {
      setIsSpeakingId(null);
    };

    utterance.onerror = () => {
      setIsSpeakingId(null);
    };

    setIsSpeakingId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeakingId(null);
  };

  const handleCopyText = (text: string, msgId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(msgId);
    toast('संदेश कॉपी कर लिया गया है!', 'success');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleShareText = (text: string) => {
    if (navigator.share) {
      navigator.share({
        title: 'बुंदेली कृषि मित्र सलाह',
        text: text
      });
    } else {
      toast('शेयरिंग लिंक कॉपी कर ली गई है!', 'success');
      navigator.clipboard.writeText(text);
    }
  };

  const handleLike = (rating: 'like' | 'dislike') => {
    if (!activeChat) return;
    mockApi.rateVoiceChat(activeChat.id, rating);
    
    // Update active chat rating
    setActiveChat({
      ...activeChat,
      rating
    });
    
    toast(rating === 'like' ? 'सलाह को लाइक करने के लिए धन्यवाद!' : 'फीडबैक के लिए धन्यवाद, हम सुधार करेंगे।', 'success');
  };

  const startNewConversation = () => {
    stopSpeaking();
    setActiveChat(null);
    toast('नयी बातचीत शुरू करें।', 'info');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] lg:h-[calc(100vh-6.5rem)] text-left">
      {/* Sidebar switcher on Desktop */}
      <div className="flex-1 flex gap-6 overflow-hidden">
        {/* Left conversations list */}
        <div className="hidden md:flex flex-col w-64 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 overflow-y-auto space-y-4">
          <Button
            variant="primary"
            className="w-full justify-center text-sm py-2"
            onClick={startNewConversation}
          >
            + नयी बातचीत शुरू करें
          </Button>

          <div className="space-y-1.5 flex-1 overflow-y-auto">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">पिछली बातचीत</h4>
            {conversations.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">कोई पूर्व बातचीत नहीं है।</p>
            ) : (
              conversations.map((c, idx) => (
                <button
                  key={c.id || idx}
                  onClick={() => { stopSpeaking(); setActiveChat(c); }}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold truncate transition-colors cursor-pointer ${
                    activeChat?.id === c.id
                      ? 'bg-slate-50 dark:bg-slate-800 text-primary dark:text-white border-l-4 border-primary'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  {c.title}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Right chat interface */}
        <div className="flex-1 flex flex-col bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden relative shadow-sm">
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-none mb-1">
                  बुंदेली वॉइस असिस्टेंट (AI Voice)
                </h3>
                <p className="text-[10px] text-slate-400 font-semibold leading-none">
                  Whisper + Gemini संचालित
                </p>
              </div>
            </div>
            
            {/* New chat button for mobile */}
            <Button
              variant="outline"
              size="sm"
              className="md:hidden"
              onClick={startNewConversation}
            >
              नयी बातचीत
            </Button>
          </div>

          {/* Messages Display */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
            <AnimatePresence>
              {!activeChat || activeChat.messages.length === 0 ? (
                /* Welcome Screen */
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center h-full text-center max-w-md mx-auto space-y-6"
                >
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary animate-bounce">
                    <Mic className="h-8 w-8" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-800 dark:text-slate-100">
                      राम राम भैया! हम हैं तुमाओ किसान मित्र
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                      खेती-बाड़ी, फसल की बीमारियों, मंडी भाव या खाद की मात्रा के बारे में सीधे बोलकर या लिखकर बुंदेली भाषा में सलाह लें।
                    </p>
                  </div>

                  {/* Suggestion Chips */}
                  <div className="space-y-2.5 w-full pt-4">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-left">पूछने के तरीके:</p>
                    <div className="grid grid-cols-1 gap-2">
                      {suggestions.map((s, i) => (
                        <button
                          key={i}
                          onClick={() => handleSendText(s)}
                          className="w-full text-left px-4 py-2.5 rounded-xl border border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 cursor-pointer transition-colors"
                        >
                          💬 "{s}"
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ) : (
                /* Chat Bubble list */
                activeChat.messages.map((m) => {
                  const isUser = m.sender === 'user';
                  return (
                    <motion.div
                      key={m.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className="max-w-[85%] sm:max-w-[75%] space-y-1">
                        <div
                          className={`p-4 rounded-2xl text-xs leading-relaxed shadow-sm font-medium ${
                            isUser
                              ? 'bg-primary text-white rounded-tr-none'
                              : 'bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none'
                          }`}
                        >
                          <p>{m.text}</p>
                        </div>

                        {/* Helper actions under bubble */}
                        {!isUser && (
                          <div className="flex items-center gap-3 pl-1 text-[10px] font-bold text-slate-400">
                            {/* Speak TTS Button */}
                            <button
                              onClick={() => speakText(m.text, m.id)}
                              className={`flex items-center gap-1 hover:text-primary transition-colors cursor-pointer ${
                                isSpeakingId === m.id ? 'text-primary' : ''
                              }`}
                            >
                              {isSpeakingId === m.id ? (
                                <>
                                  <VolumeX className="h-3.5 w-3.5" />
                                  <span>आवाज रोकें</span>
                                </>
                              ) : (
                                <>
                                  <Volume2 className="h-3.5 w-3.5" />
                                  <span>आवाज सुनें</span>
                                </>
                              )}
                            </button>
                            
                            {/* Copy */}
                            <button
                              onClick={() => handleCopyText(m.text, m.id)}
                              className="flex items-center gap-1 hover:text-primary transition-colors cursor-pointer"
                            >
                              {copiedId === m.id ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                              <span>कॉपी</span>
                            </button>

                            {/* Share */}
                            <button
                              onClick={() => handleShareText(m.text)}
                              className="flex items-center gap-1 hover:text-primary transition-colors cursor-pointer"
                            >
                              <Share2 className="h-3.5 w-3.5" />
                              <span>शेयर</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })
              )}

              {/* Typing loader */}
              {isTyping && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                  <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl rounded-tl-none p-4 flex gap-1.5 items-center">
                    <span className="h-2 w-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0s' }} />
                    <span className="h-2 w-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0.15s' }} />
                    <span className="h-2 w-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0.3s' }} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={chatEndRef} />
          </div>

          {/* Recording overlay wave */}
          <AnimatePresence>
            {isRecording && (
              <motion.div
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 100 }}
                className="absolute inset-x-0 bottom-0 bg-white/95 dark:bg-slate-900/95 border-t border-slate-100 dark:border-slate-800 p-8 flex flex-col items-center justify-center z-10 space-y-4"
              >
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">बुंदेली में बोलें, ए.आई. सुन रहा है...</p>
                
                {/* Audio Wave anim */}
                <div className="flex gap-1 items-center justify-center h-12 w-48">
                  {Array.from({ length: 9 }).map((_, idx) => (
                    <div
                      key={idx}
                      className="w-1.5 bg-primary rounded-full voice-bar"
                      style={{
                        height: '100%',
                        animationDelay: `${idx * 0.1}s`
                      }}
                    />
                  ))}
                </div>

                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => setIsRecording(false)}
                >
                  रोकें (Stop)
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Rating area under active chat */}
          {activeChat && activeChat.messages.length > 0 && (
            <div className="bg-slate-50/50 dark:bg-slate-950/40 border-t border-slate-100 dark:border-slate-800 px-6 py-2 flex items-center justify-between text-xs text-slate-400">
              <span>क्या आप इस सलाह से संतुष्ट हैं?</span>
              <div className="flex gap-4">
                <button
                  onClick={() => handleLike('like')}
                  className={`flex items-center gap-1 cursor-pointer hover:text-green-600 ${
                    activeChat.rating === 'like' ? 'text-green-600' : ''
                  }`}
                >
                  <ThumbsUp className="h-3.5 w-3.5" /> हाँ
                </button>
                <button
                  onClick={() => handleLike('dislike')}
                  className={`flex items-center gap-1 cursor-pointer hover:text-red-500 ${
                    activeChat.rating === 'dislike' ? 'text-red-500' : ''
                  }`}
                >
                  <ThumbsDown className="h-3.5 w-3.5" /> नहीं
                </button>
              </div>
            </div>
          )}

          {/* Input text / voice area */}
          <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-4">
            <button
              onClick={startVoiceRecording}
              disabled={isRecording}
              className={`h-11 w-11 rounded-full flex items-center justify-center text-white shadow-md cursor-pointer flex-shrink-0 transition-all ${
                isRecording ? 'bg-red-500 hover:bg-red-600 animate-pulse' : 'bg-primary hover:bg-primary-hover'
              }`}
            >
              <Mic className="h-5 w-5" />
            </button>

            <input
              type="text"
              placeholder="यहाँ टाइप करें या बुंदेली में बोलने के लिए माइक दबाएं..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendText(inputText)}
              className="flex-1 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-850 rounded-xl py-3 px-4 text-xs font-semibold text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-primary"
            />

            <button
              onClick={() => handleSendText(inputText)}
              disabled={!inputText.trim()}
              className="h-11 w-11 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-primary dark:hover:text-primary flex items-center justify-center cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
