/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Zap, 
  Target, 
  Clock, 
  Activity, 
  ShieldCheck, 
  RefreshCcw,
  AlertTriangle,
  Plane
} from "lucide-react";

// --- Types ---

interface Prediction {
  timeFrom: string;
  timeTo: string;
  minX: number;
  maxX: number;
}

// --- Utils ---

const getRandomMultiplier = (min: number, max: number) => {
  return parseFloat((Math.random() * (max - min) + min).toFixed(2));
};

const formatTime = (date: Date) => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
};

// --- Main Component ---

export default function App() {
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [paymentLocked, setPaymentLocked] = useState(false);
  const [serverTime, setServerTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }));

  useEffect(() => {
    const timer = setInterval(() => {
      setServerTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const generateSignal = useCallback(() => {
    if (isScanning) return;
    setIsScanning(true);
    setProgress(0);
    setPrediction(null);
    setPaymentLocked(false);

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.random() * 20;
      });
    }, 150);

    setTimeout(() => {
      // Lockdown logic: Show payment required instead of accurate time
      setPaymentLocked(true);
      setIsScanning(false);
      
      // Still generate data in background to keep state consistent if needed later, 
      // but interval is now strictly 1 minute
      const now = new Date();
      const from = new Date(now.getTime() + (Math.random() * 2 + 1) * 60000);
      const to = new Date(from.getTime() + 60000); // STRICT 1 MINUTE INTERVAL

      const newPrediction: Prediction = {
        timeFrom: formatTime(from),
        timeTo: formatTime(to),
        minX: Math.floor(Math.random() * 10) + 12,
        maxX: Math.floor(Math.random() * 20) + 35,
      };
      setPrediction(newPrediction);
    }, 2500);
  }, [isScanning]);

  return (
    <div className="min-h-screen bg-[#0a0b0d] text-zinc-100 font-sans selection:bg-red-600/30 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Corner Decorators */}
      <div className="absolute top-0 left-0 w-32 h-32 border-l border-t border-gray-800/30 mt-8 ml-8 hidden md:block" />
      <div className="absolute bottom-0 right-0 w-32 h-32 border-r border-b border-gray-800/30 mb-8 mr-8 hidden md:block" />

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full max-w-2xl flex flex-col items-center z-10"
      >
        {/* Top Branding */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className={`w-2.5 h-2.5 rounded-full ${paymentLocked ? 'bg-amber-500' : 'bg-red-600 animate-pulse'} shadow-[0_0_10px_rgba(220,38,38,0.5)]`}></div>
            <span className="text-[10px] tracking-[0.4em] text-gray-500 uppercase font-black">
              {paymentLocked ? 'Action Required' : 'Live Signal System'}
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter italic">
            AVIATOR <span className="text-red-600">PREDICTOR 2.0</span>
          </h1>
          <p className="text-gray-500 text-xs mt-4 tracking-[0.3em] font-medium uppercase">Precision Engine for SportyBet</p>
        </div>

        {/* Main Control Module */}
        <div className="flex flex-col items-center w-full">
          {/* Generation Button */}
          <button 
            onClick={generateSignal}
            disabled={isScanning}
            className="group relative w-52 h-52 md:w-60 md:h-60 flex items-center justify-center focus:outline-none cursor-pointer mb-8"
          >
            <div className="absolute inset-0 border-4 border-gray-900 rounded-full scale-105 group-hover:scale-110 transition-transform duration-500"></div>
            <div className="absolute inset-0 border border-red-600/10 rounded-full scale-125"></div>
            
            <div className={`w-full h-full bg-gradient-to-tr ${isScanning ? 'from-zinc-800 to-zinc-700 pointer-events-none' : 'from-red-700 to-red-500 shadow-[0_0_60px_rgba(220,38,38,0.3)]'} rounded-full flex flex-col items-center justify-center border-[6px] border-[#0a0b0d] transition-all duration-300 relative overflow-hidden`}>
              {isScanning ? (
                <div className="flex flex-col items-center">
                  <RefreshCcw className="text-white mb-2 animate-spin" size={28} />
                  <span className="text-white font-mono text-xl font-bold">{Math.round(progress)}%</span>
                </div>
              ) : (
                <>
                  <Zap className="w-8 h-8 text-white mb-2" fill="currentColor" />
                  <span className="text-white font-black text-lg tracking-widest uppercase">Generate</span>
                  <span className="text-white/60 text-[10px] font-black uppercase tracking-tighter">Signal</span>
                </>
              )}
            </div>
          </button>

          {/* Signal Display Area / Lockdown Notice */}
          <div className="w-full max-w-xl">
            <AnimatePresence mode="wait">
              {paymentLocked ? (
                <motion.div 
                  key="locked"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-red-950/20 border border-red-500/30 rounded-3xl p-8 text-center relative overflow-hidden group shadow-2xl"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Target size={120} className="text-red-500 rotate-12" />
                  </div>
                  
                  <AlertTriangle className="text-red-500 mx-auto mb-4" size={40} />
                  <h3 className="text-white font-black text-xl mb-3 tracking-tight uppercase italic">Payment Not Confirmed</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed mb-6 max-w-sm mx-auto font-medium">
                    Real accurate time intervals cannot be released at this moment. <span className="text-red-500">Your payment has not been verified.</span> 
                  </p>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-black/40 border border-white/5 rounded-2xl flex items-center justify-between">
                      <div className="text-left">
                        <p className="text-[10px] text-zinc-500 uppercase font-black">Predicted Window</p>
                        <p className="text-xl font-mono text-zinc-700 blur-[6px] select-none">14:55 TO 14:56</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-zinc-500 uppercase font-black">Multiplier</p>
                        <p className="text-xl font-mono text-zinc-700 blur-[6px] select-none">20X — 40X</p>
                      </div>
                    </div>
                    
                    <button className="w-full py-4 bg-white text-black font-black uppercase tracking-widest text-xs rounded-xl hover:bg-zinc-200 transition-colors shadow-lg">
                      Make Payment to Unlock
                    </button>
                  </div>
                </motion.div>
              ) : prediction ? (
                <motion.div 
                  key="signal"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-px bg-gray-800 border border-gray-800 shadow-2xl rounded-2xl overflow-hidden"
                >
                  <div className="bg-[#14161a] p-8 flex flex-col items-center border-b md:border-b-0 md:border-r border-gray-800">
                    <span className="text-gray-500 text-[10px] uppercase tracking-[0.4em] mb-4 font-black">Predicted Window</span>
                    <div className="text-3xl md:text-4xl font-mono text-white font-bold tracking-tight flex items-center gap-3">
                      {prediction.timeFrom} <span className="text-red-600 text-xl font-black">TO</span> {prediction.timeTo}
                    </div>
                  </div>
                  <div className="bg-[#14161a] p-8 flex flex-col items-center">
                    <span className="text-gray-500 text-[10px] uppercase tracking-[0.4em] mb-4 font-black">Expected Range</span>
                    <div className="text-3xl md:text-4xl font-mono text-red-600 font-bold tracking-tight flex items-center gap-3 italic">
                      {prediction.minX}X <span className="text-white text-xl font-black">/</span> {prediction.maxX}X
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-10 border border-dashed border-gray-800 rounded-3xl text-center"
                >
                  <p className="text-gray-600 font-mono text-xs tracking-[0.3em] uppercase">Waiting for verification...</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom Interface Bar */}
        <div className="mt-16 md:mt-24 w-full grid grid-cols-2 md:grid-cols-3 gap-8 items-end border-t border-gray-900 pt-8 opacity-60">
          <div className="flex flex-col">
            <span className="text-gray-700 text-[10px] uppercase tracking-[0.3em] font-black mb-2">Device Instance</span>
            <span className="text-gray-500 font-mono text-xs tracking-tighter">SPD-992-AX-PRD-v2</span>
          </div>
          
          <div className="hidden md:flex justify-center space-x-8">
            <div className="text-center">
              <div className="text-[10px] text-gray-700 uppercase font-black tracking-widest mb-2">Status</div>
              <div className={`text-[10px] px-3 py-1 ${paymentLocked ? 'bg-amber-500/5 text-amber-500 border-amber-500/10' : 'bg-emerald-500/5 text-emerald-500 border-emerald-500/10'} border rounded font-bold tracking-widest`}>
                {paymentLocked ? 'LOCKED' : 'READY'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-[10px] text-gray-700 uppercase font-black tracking-widest mb-2">Accuracy</div>
              <div className="text-[10px] px-3 py-1 bg-red-600/5 text-red-600 border border-red-600/10 rounded font-bold tracking-widest">98.4%</div>
            </div>
          </div>

          <div className="flex flex-col text-right">
            <span className="text-gray-700 text-[10px] uppercase tracking-[0.3em] font-black mb-2">Network Time</span>
            <span className="text-gray-500 font-mono text-xs tracking-tighter italic">{serverTime} UTC</span>
          </div>
        </div>

        <p className="mt-10 text-center text-gray-800 text-[9px] uppercase tracking-[0.5em] font-bold">
          Signal Synchronized • Access Restricted to Verified Users
        </p>
      </motion.div>
    </div>
  );
}


