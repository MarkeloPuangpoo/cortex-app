import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { Search, FolderOpen, Database, Zap, FileText, Layers, Command, Cpu, Activity, ArrowRight, Bot, Sparkles } from 'lucide-react';

// --- Components ---
const GlassCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white/60 backdrop-blur-2xl border border-white/40 shadow-xl shadow-blue-100/50 rounded-3xl p-6 transition-all duration-300 hover:shadow-blue-200/50 hover:bg-white/80 ${className}`}>
    {children}
  </div>
);

const Badge = ({ children, type = "default" }: { children: React.ReactNode; type?: "default" | "success" | "error" }) => {
  const styles = {
    default: "bg-blue-50/80 text-blue-600 border-blue-100",
    success: "bg-emerald-50/80 text-emerald-600 border-emerald-100",
    error: "bg-rose-50/80 text-rose-600 border-rose-100",
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider border backdrop-blur-sm ${styles[type]}`}>
      {children}
    </span>
  );
};

// Component ใหม่: สำหรับพิมพ์ข้อความแบบ Typewriter
const TypewriterEffect = ({ text }: { text: string }) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    setDisplayedText("");
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayedText((prev) => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 15); // ความเร็วในการพิมพ์ (ms)
    return () => clearInterval(interval);
  }, [text]);

  return <p className="text-slate-700 leading-relaxed text-sm md:text-base font-medium">{displayedText}</p>;
};

export default function Dashboard() {
  const [folderPath, setFolderPath] = useState("/Users/MacMarc/Documents/TestFolder");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [aiAnswer, setAiAnswer] = useState(""); // State สำหรับเก็บคำตอบ AI
  const [status, setStatus] = useState("System Ready");
  const [isScanning, setIsScanning] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const handleScan = async () => {
    setIsScanning(true);
    setStatus("Ingesting neural data...");
    try {
      const res = await fetch('http://127.0.0.1:8000/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: folderPath }),
      });
      const data = await res.json();
      setStatus(`Memorized ${data.files_processed} nodes.`);
    } catch (e) {
      setStatus("Error: Neural Link Failed");
    }
    setIsScanning(false);
  };

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    setResults([]);
    setAiAnswer(""); // เคลียร์คำตอบเก่า
    setStatus("Analyzing neural pathways...");

    try {
      const res = await fetch('http://127.0.0.1:8000/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();

      setResults(data.results);
      if (data.ai_answer) {
        setAiAnswer(data.ai_answer);
      }
      setStatus("Query resolve.");
    } catch (e) {
      setStatus("Error: Synapse Misfire");
    }
    setIsSearching(false);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] overflow-hidden font-sans selection:bg-blue-200 selection:text-blue-900 relative">
      <Head>
        <title>CORTEX | Intelligence Engine</title>
      </Head>

      {/* Dynamic Background Gradients */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-200/30 rounded-full blur-[120px] mix-blend-multiply animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-indigo-200/30 rounded-full blur-[120px] mix-blend-multiply transition-all duration-1000" />
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10 relative z-10">

        {/* --- Header --- */}
        <header className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="absolute inset-0 bg-blue-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity" />
              <div className="relative w-12 h-12 bg-gradient-to-tr from-white to-blue-50 rounded-2xl flex items-center justify-center border border-white/50 shadow-lg">
                <Layers className="text-blue-600 w-6 h-6" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">CORTEX</h1>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <p className="text-xs font-semibold text-slate-400 tracking-widest uppercase">Neural Interface V1.0</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/40 backdrop-blur-md rounded-full border border-white/40 shadow-sm text-xs font-medium text-slate-600">
              <Activity className="w-3.5 h-3.5 text-blue-500" />
              <span>{status}</span>
            </div>
          </div>
        </header>

        {/* --- Main Grid --- */}
        <div className="grid grid-cols-12 gap-8">

          {/* Left Column: Controls */}
          <div className="col-span-12 md:col-span-4 space-y-6">
            <GlassCard className="relative overflow-hidden group">
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-6">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Database className="w-4 h-4 text-blue-600" />
                  </div>
                  <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Data Source</h2>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-400 uppercase">Target Path</label>
                    <input
                      type="text"
                      value={folderPath}
                      onChange={(e) => setFolderPath(e.target.value)}
                      className="w-full bg-slate-50/50 border border-slate-200 focus:border-blue-400 rounded-xl px-4 py-3 text-xs font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-slate-300"
                    />
                  </div>

                  <button
                    onClick={handleScan}
                    disabled={isScanning}
                    className="w-full bg-slate-900 hover:bg-blue-600 text-white font-medium py-3.5 rounded-xl text-sm transition-all duration-300 shadow-lg shadow-slate-200 disabled:opacity-70 flex items-center justify-center gap-2"
                  >
                    {isScanning ? <Zap className="w-4 h-4 animate-spin" /> : <FolderOpen className="w-4 h-4" />}
                    <span>{isScanning ? "Processing..." : "Ingest Memories"}</span>
                  </button>
                </div>
              </div>
            </GlassCard>

            {/* System Status */}
            <div className="relative p-6 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-xl shadow-blue-300/40 overflow-hidden">
              {/* (Decorative circles) */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10" />
              <div className="relative z-10">
                <p className="text-blue-100 text-xs font-medium mb-1">Total Nodes</p>
                <h3 className="text-3xl font-bold tracking-tight">Active</h3>
                <div className="mt-4 flex items-center gap-2 text-xs text-blue-200/80 font-mono bg-black/10 px-3 py-1.5 rounded-lg w-fit">
                  <Cpu className="w-3 h-3" /> SYSTEM ONLINE
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Search & Results */}
          <div className="col-span-12 md:col-span-8 space-y-6">

            {/* Search Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                <Search className={`h-6 w-6 transition-colors duration-300 ${isSearching ? 'text-blue-500' : 'text-slate-400'}`} />
              </div>
              <form onSubmit={handleSearch}>
                <input
                  type="text"
                  className="block w-full pl-16 pr-20 py-5 bg-white/70 backdrop-blur-xl border border-white/60 rounded-3xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-100/50 transition-all shadow-xl shadow-slate-200/40 text-lg font-medium"
                  placeholder="Ask Cortex anything..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </form>
            </div>

            {/* --- ส่วนที่เพิ่มใหม่: AI Answer Card --- */}
            {aiAnswer && (
              <GlassCard className="!bg-gradient-to-br !from-white !to-blue-50/50 border-blue-100 ring-4 ring-blue-50/50">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-500/30">
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-slate-800">Cortex Intelligence</h3>
                      <span className="flex items-center gap-1 text-[10px] font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
                        <Sparkles className="w-3 h-3" /> AI GENERATED
                      </span>
                    </div>
                    {/* ใช้ Typewriter Effect ตรงนี้ */}
                    <TypewriterEffect text={aiAnswer} />
                  </div>
                </div>
              </GlassCard>
            )}

            {/* Results List */}
            <div className="space-y-4">
              {results.length > 0 && (
                <div className="flex items-center justify-between px-2 pt-4">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    Source Memories
                  </h3>
                </div>
              )}

              {results.map((item, idx) => (
                <GlassCard key={idx} className="!p-4 !bg-white/40 hover:!bg-white/90 group cursor-pointer border-white/60">
                  <div className="flex gap-4">
                    <div className="mt-1 min-w-[36px] h-[36px] rounded-lg bg-white border border-slate-100 flex items-center justify-center shadow-sm">
                      <FileText className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-bold text-slate-700 text-sm truncate pr-4">{item.source}</h4>
                        <Badge type={(item.score * 100) > 60 ? "success" : "default"}>
                          {(item.score * 100)?.toFixed(0)}% Relevancy
                        </Badge>
                      </div>
                      <p className="text-slate-500 text-xs line-clamp-2">{item.content}</p>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}