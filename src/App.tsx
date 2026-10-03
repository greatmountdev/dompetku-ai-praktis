import React, { useState, useRef, useEffect } from "react";
import {
  Menu,
  X,
  Eye,
  EyeOff,
  Copy,
  Mic,
  Send,
  Info,
  Wallet,
  Plus,
  Receipt,
  FileText,
  MessageCircle,
  Camera,
  BarChart3,
  User,
  Download,
  Settings,
  Volume2,
  VolumeX,
  Sparkles,
  ShieldCheck,
  CreditCard,
  PiggyBank,
  Check,
  ChevronRight,
  Trash2,
} from "lucide-react";

type Page =
  | "login"
  | "pattern"
  | "dashboard"
  | "chat"
  | "riwayat"
  | "laporan"
  | "tambah"
  | "tanggungan"
  | "akun"
  | "export"
  | "pengaturan"
  | "pengeluaran";

const DOT_POS = [
  { x: 60, y: 60, n: 1 },
  { x: 150, y: 60, n: 2 },
  { x: 240, y: 60, n: 3 },
  { x: 60, y: 150, n: 4 },
  { x: 150, y: 150, n: 5 },
  { x: 240, y: 150, n: 6 },
  { x: 60, y: 240, n: 7 },
  { x: 150, y: 240, n: 8 },
  { x: 240, y: 240, n: 9 },
];

function PatternLock({ onSave, onBack }: { onSave: (p: number[]) => void; onBack: () => void }) {
  const [path, setPath] = useState<number[]>([]);
  const [currentPos, setCurrentPos] = useState<{ x: number; y: number } | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  const getCoords = (e: React.PointerEvent) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const rect = svgRef.current.getBoundingClientRect();
    const scaleX = 300 / rect.width;
    const scaleY = 300 / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const findDot = (x: number, y: number) => {
    for (const d of DOT_POS) {
      const dx = d.x - x;
      const dy = d.y - y;
      if (Math.sqrt(dx * dx + dy * dy) < 42) return d;
    }
    return null;
  };

  const handleDown = (e: React.PointerEvent) => {
    (e.target as Element).setPointerCapture?.(e.pointerId);
    setIsDrawing(true);
    const { x, y } = getCoords(e);
    const dot = findDot(x, y);
    if (dot && !path.includes(dot.n)) {
      setPath([dot.n]);
    } else {
      setPath([]);
    }
    setCurrentPos({ x, y });
  };

  const handleMove = (e: React.PointerEvent) => {
    if (!isDrawing) return;
    const { x, y } = getCoords(e);
    setCurrentPos({ x, y });
    const dot = findDot(x, y);
    if (dot && !path.includes(dot.n)) {
      setPath((p) => [...p, dot.n]);
      if (navigator.vibrate) navigator.vibrate(10);
    }
  };

  const handleUp = () => {
    setIsDrawing(false);
    setCurrentPos(null);
  };

  const reset = () => {
    setPath([]);
    setCurrentPos(null);
    setIsDrawing(false);
  };

  const pathPoints = path.map((n) => DOT_POS.find((d) => d.n === n)!);
  let dAttr = "";
  if (pathPoints.length > 0) {
    dAttr = `M ${pathPoints[0].x} ${pathPoints[0].y}`;
    for (let i = 1; i < pathPoints.length; i++) {
      dAttr += ` L ${pathPoints[i].x} ${pathPoints[i].y}`;
    }
    if (currentPos && isDrawing) {
      dAttr += ` L ${currentPos.x} ${currentPos.y}`;
    }
  }

  const canSave = path.length >= 4;

  return (
    <div className="min-h-screen bg-white flex flex-col items-center px-6 py-8">
      {/* progress */}
      <div className="flex gap-2 mt-2 mb-8">
        <div className="w-8 h-2 rounded-full bg-gray-200" />
        <div className="w-8 h-2 rounded-full bg-[#7C3AED]" />
        <div className="w-8 h-2 rounded-full bg-gray-200" />
        <div className="w-8 h-2 rounded-full bg-gray-200" />
      </div>

      <button onClick={onBack} className="self-start text-sm text-gray-500 mb-2 flex items-center gap-1">
        ← Kembali
      </button>

      <h1 className="text-[26px] font-bold tracking-tight text-gray-900 mt-2">Buat Pola Kunci</h1>
      <p className="text-sm text-gray-500 mt-1 text-center">Gambar pola dengan menghubungkan minimal 4 titik</p>

      <div className="w-full max-w-[300px] aspect-square mt-10 select-none touch-none">
        <svg
          ref={svgRef}
          viewBox="0 0 300 300"
          className="w-full h-full touch-none"
          style={{ touchAction: "none" }}
          onPointerDown={handleDown}
          onPointerMove={handleMove}
          onPointerUp={handleUp}
          onPointerLeave={handleUp}
        >
          <defs>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="6" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <radialGradient id="dotActive" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0%" stopColor="#A78BFA" />
              <stop offset="100%" stopColor="#7C3AED" />
            </radialGradient>
          </defs>

          {/* trail */}
          {dAttr && (
            <path
              d={dAttr}
              fill="none"
              stroke="#7C3AED"
              strokeWidth={isDrawing ? 6 : 5}
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#glow)"
              opacity={0.9}
              style={{ transition: "stroke-width 0.15s" }}
            />
          )}

          {/* dots */}
          {DOT_POS.map((dot) => {
            const active = path.includes(dot.n);
            const isCurrent = path[path.length - 1] === dot.n && isDrawing;
            return (
              <g key={dot.n} style={{ transition: "transform 0.18s cubic-bezier(.34,1.56,.64,1)" }}>
                <circle
                  cx={dot.x}
                  cy={dot.y}
                  r={active ? (isCurrent ? 30 : 26) : 18}
                  fill={active ? "url(#dotActive)" : "#F3F4F6"}
                  stroke={active ? "#7C3AED" : "#E5E7EB"}
                  strokeWidth={active ? 2 : 1.5}
                  style={{
                    filter: active ? "drop-shadow(0 2px 8px rgba(124,58,237,0.35))" : undefined,
                    transition: "all 0.18s cubic-bezier(.34,1.56,.64,1)",
                  }}
                />
                <circle cx={dot.x} cy={dot.y} r={active ? 9 : 6} fill={active ? "white" : "#9CA3AF"} />
                {/* number subtle */}
                {!active && (
                  <text x={dot.x} y={dot.y + 28} textAnchor="middle" fontSize="10" fill="#D1D5DB" fontWeight="600">
                    {dot.n}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      <div className="mt-6 flex flex-col items-center gap-2">
        <div className="text-sm text-gray-600 font-medium tracking-wide">
          Pola:{" "}
          <span className="font-mono text-[#7C3AED] font-bold">
            {path.length ? path.join("-") : "—"}
          </span>
        </div>
        <div className="flex gap-2">
          <div className="flex gap-1">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i < path.length ? "w-6 bg-[#7C3AED]" : "w-3 bg-gray-200"
                }`}
              />
            ))}
          </div>
        </div>
        {path.length > 0 && path.length < 4 && (
          <p className="text-xs text-amber-600 mt-1">Hubungkan minimal 4 titik bro</p>
        )}
      </div>

      <div className="mt-auto w-full flex gap-3 pt-10">
        <button
          onClick={reset}
          className="flex-1 h-[52px] rounded-2xl border border-gray-200 text-gray-700 font-semibold"
        >
          Reset
        </button>
        <button
          disabled={!canSave}
          onClick={() => onSave(path)}
          className={`flex-1 h-[52px] rounded-2xl font-semibold text-white transition-all ${
            canSave ? "bg-[#7C3AED] shadow-[0_8px_24px_rgba(124,58,237,0.35)] active:scale-[0.98]" : "bg-gray-200 text-gray-400"
          }`}
        >
          Simpan Pola & Lanjut
        </button>
      </div>

      <p className="text-[11px] text-gray-400 mt-4 text-center">Garis mengikuti jari secara real-time • Samsung style</p>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState<Page>("login");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [showInfo, setShowInfo] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [patternPath, setPatternPath] = useState<number[]>([]);
  const [showBalance, setShowBalance] = useState(true);
  const [copyOk, setCopyOk] = useState(false);

  // chat
  const [chatMessages, setChatMessages] = useState<{ role: "user" | "ai"; text: string; time: string }[]>([
    {
      role: "ai",
      text: "Halo Bro! 👋 OVO lu 275rb, jangan boros boba ya! Mau cek keuangan hari ini? Gue siap bantu.",
      time: "09:12",
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [voiceOn, setVoiceOn] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, page]);

  // copy
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText("081212347890");
      setCopyOk(true);
      setTimeout(() => setCopyOk(false), 1500);
    } catch {
      setCopyOk(true);
      setTimeout(() => setCopyOk(false), 1500);
    }
  };

  // speech recognition
  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Browser belum support voice. Coba Chrome ya bro.");
      return;
    }
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }
    const rec = new SpeechRecognition();
    rec.lang = "id-ID";
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    rec.onstart = () => setIsListening(true);
    rec.onend = () => setIsListening(false);
    rec.onresult = (e: any) => {
      const t = e.results[0][0].transcript;
      setChatInput(t);
    };
    recognitionRef.current = rec;
    rec.start();
  };

  const speak = (text: string) => {
    if (!voiceOn) return;
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "id-ID";
    u.rate = 1.0;
    window.speechSynthesis.speak(u);
  };

  const mockResponses = [
    "Halo Bro, OVO lu 275rb, jangan boros boba ya! 🧋 Pengeluaran minggu ini udah 420rb.",
    "Sisa saldo cukup buat 3 hari kalau hemat. Mau gue bikinin anggaran boba mingguan?",
    "Tanggungan listrik 150rb belum dibayar, jangan lupa ya! Deadline besok.",
    "Mantap! Hari ini cuma jajan 35rb, paling irit minggu ini 🔥 Keep going!",
    "Bro, gue lihat transaksi GoFood lu 3x hari ini. Coba masak di rumah yuk, bisa save 60rb.",
    "Laporan: Pengeluaran terbesar lu di kategori Makan & Minum. Kurangin dikit?",
  ];

  const sendChat = () => {
    if (!chatInput.trim()) return;
    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setChatMessages((m) => [...m, { role: "user", text: chatInput, time: now }]);
    const userText = chatInput.toLowerCase();
    setChatInput("");

    setTimeout(() => {
      let reply = mockResponses[Math.floor(Math.random() * mockResponses.length)];
      if (userText.includes("ovo") || userText.includes("saldo")) reply = `OVO lu sekarang Rp 275.000, nomor 0812 **** 7890. Aman bro, masih cukup buat weekend.`;
      if (userText.includes("boros") || userText.includes("hemat")) reply = `Gue cek ya... minggu ini lu hemat 18% dibanding minggu lalu! Lanjutin bro.`;
      if (userText.includes("laporan")) reply = `Laporan harian: Hari ini keluar 87rb, pemasukan 0. Sisa budget harian 63rb. Mau detail chart?`;
      setChatMessages((m) => [...m, { role: "ai", text: reply, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
      speak(reply);
    }, 700);
  };

  // LOGIN SCREEN
  if (page === "login") {
    const valid = email.includes("@") && name.trim().length >= 2;
    return (
      <div className="min-h-screen bg-[#FAF9FF] flex justify-center">
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Poppins:wght@500;600;700&display=swap'); *{font-family:Inter, Poppins, sans-serif}`}</style>
        <div className="w-full max-w-[400px] bg-white min-h-screen relative px-6 py-8 flex flex-col">
          {/* progress */}
          <div className="flex justify-center gap-2 mt-1">
            <div className="w-8 h-2 rounded-full bg-[#7C3AED]" />
            <div className="w-8 h-2 rounded-full bg-gray-200" />
            <div className="w-8 h-2 rounded-full bg-gray-200" />
            <div className="w-8 h-2 rounded-full bg-gray-200" />
          </div>

          <div className="mt-8 flex items-start justify-between">
            <div>
              <h1 className="text-[28px] font-extrabold tracking-tight leading-[1.1] text-gray-900" style={{ fontFamily: "Poppins" }}>
                DompetKu AI
              </h1>
              <p className="text-sm text-gray-500 mt-1">Kelola uang dengan AI • V2 Fixed</p>
            </div>
            <button
              onClick={() => setShowInfo((s) => !s)}
              className="w-9 h-9 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center"
            >
              <Info className="w-4 h-4 text-gray-600" />
            </button>
          </div>

          {showInfo && (
            <div className="mt-4 p-4 rounded-2xl bg-[#FFFBEB] border border-amber-200 text-[13px] leading-relaxed text-amber-900 animate-in fade-in">
              <div className="font-semibold mb-1 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> Paket praktis
              </div>
              Termasuk Saku Dompet (OVO, GoPay), Laporan Harian, Chat Meta AI dengan suara, Export Sheet. APK logic tetap jalan, ini versi web test V2.
              <button onClick={() => setShowInfo(false)} className="mt-2 text-xs underline">Tutup</button>
            </div>
          )}

          <div className="mt-8 space-y-4">
            <div>
              <label className="text-[12px] font-semibold text-gray-600 tracking-wide uppercase">Email Google</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@gmail.com"
                className="mt-1.5 w-full h-[54px] rounded-2xl border border-gray-200 px-4 text-[15px] outline-none focus:border-[#7C3AED] focus:ring-4 focus:ring-violet-100 transition-all bg-gray-50 focus:bg-white"
              />
            </div>
            <div>
              <label className="text-[12px] font-semibold text-gray-600 tracking-wide uppercase">Nama</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Budi Santoso"
                className="mt-1.5 w-full h-[54px] rounded-2xl border border-gray-200 px-4 text-[15px] outline-none focus:border-[#7C3AED] focus:ring-4 focus:ring-violet-100 transition-all bg-gray-50 focus:bg-white"
              />
            </div>
          </div>

          <div className="mt-8 space-y-3">
            <button
              disabled={!valid}
              onClick={() => setPage("pattern")}
              className={`w-full h-[56px] rounded-2xl font-semibold text-[15px] flex items-center justify-center gap-2 transition-all ${
                valid
                  ? "bg-black text-white shadow-[0_8px_24px_rgba(0,0,0,0.18)] active:scale-[0.98]"
                  : "bg-gray-100 text-gray-400"
              }`}
            >
              <span className="w-5 h-5 bg-white rounded-full flex items-center justify-center text-black text-[11px] font-bold">G</span>
              Daftar dengan Google
            </button>

            <button
              disabled={!valid}
              onClick={() => setPage("pattern")}
              className={`w-full h-[56px] rounded-2xl font-semibold text-[15px] flex items-center justify-center gap-2 transition-all border ${
                valid
                  ? "bg-[#1877F2] text-white border-[#1877F2] shadow-[0_8px_24px_rgba(24,119,242,0.28)] active:scale-[0.98]"
                  : "bg-gray-50 text-gray-400 border-gray-200"
              }`}
            >
              <span className="w-5 h-5 bg-white rounded-full flex items-center justify-center text-[#1877F2] text-[12px] font-bold">f</span>
              Daftar dengan Facebook
            </button>

            <p className="text-[11px] text-center text-gray-400 leading-relaxed px-4">
              Dengan mendaftar, kamu setuju dengan Syarat & Ketentuan DompetKu AI. Data aman, pola terkunci.
            </p>
          </div>

          <div className="mt-auto pt-10 flex items-center justify-center gap-2 text-[11px] text-gray-400">
            <ShieldCheck className="w-3.5 h-3.5" /> APK Ready • Web Test V2 Fixed • No popup install
          </div>
        </div>
      </div>
    );
  }

  if (page === "pattern") {
    return (
      <div className="min-h-screen bg-[#FAF9FF] flex justify-center">
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap'); *{font-family:Inter, sans-serif}`}</style>
        <div className="w-full max-w-[400px] bg-white min-h-screen shadow-2xl">
          <PatternLock
            onSave={(p) => {
              setPatternPath(p);
              setPage("dashboard");
            }}
            onBack={() => setPage("login")}
          />
        </div>
      </div>
    );
  }

  // DASHBOARD + DRAWER LAYOUT
  const renderMain = () => {
    if (page === "chat") {
      return (
        <div className="flex flex-col h-[100dvh] bg-[#FAF9FF]">
          {/* header */}
          <div className="h-[64px] flex items-center justify-between px-4 bg-white border-b border-gray-100 sticky top-0 z-10">
            <div className="flex items-center gap-3">
              <button onClick={() => setDrawerOpen(true)} className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center">
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <div className="font-bold text-[15px] flex items-center gap-1.5">
                  Chat dengan Meta AI <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-violet-100 text-violet-700">VOICE</span>
                </div>
                <div className="text-[11px] text-emerald-600 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Online • APK Ready
                </div>
              </div>
            </div>
            <button
              onClick={() => setVoiceOn((v) => !v)}
              className={`w-9 h-9 rounded-full flex items-center justify-center border ${voiceOn ? "bg-violet-50 border-violet-200 text-violet-700" : "bg-gray-50 border-gray-200 text-gray-500"}`}
            >
              {voiceOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            <div className="mx-auto max-w-[340px] bg-white border border-violet-100 rounded-2xl p-3 text-[12px] text-gray-600 flex gap-2">
              <Sparkles className="w-4 h-4 text-violet-600 shrink-0 mt-0.5" />
              <span>
                Ini versi web test. Chat pakai suara: tap 🎤 untuk ngomong, AI jawab pakai suara kalau toggle aktif. Logic sama kayak APK.
              </span>
            </div>

            {chatMessages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[78%] rounded-[20px] px-4 py-3 text-[14px] leading-relaxed ${m.role === "ai" ? "bg-[#7C3AED] text-white rounded-bl-[6px] shadow-[0_6px_18px_rgba(124,58,237,0.25)]" : "bg-white border border-gray-200 text-gray-800 rounded-br-[6px]"}`}>
                  {m.text}
                  <div className={`text-[10px] mt-1 ${m.role === "ai" ? "text-violet-200" : "text-gray-400"}`}>{m.time}</div>
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          <div className="p-3 bg-white border-t border-gray-100">
            <div className="flex items-center gap-2">
              <button
                onClick={startListening}
                className={`w-[44px] h-[44px] rounded-full flex items-center justify-center border transition-all ${isListening ? "bg-red-500 border-red-500 text-white animate-pulse" : "bg-gray-50 border-gray-200 text-gray-600"}`}
              >
                <Mic className="w-5 h-5" />
              </button>
              <div className="flex-1 h-[44px] rounded-full bg-gray-50 border border-gray-200 flex items-center px-4 gap-2">
                <input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendChat()}
                  placeholder={isListening ? "Mendengarkan..." : "Tanya keuangan bro..."}
                  className="flex-1 bg-transparent outline-none text-[14px]"
                />
              </div>
              <button onClick={sendChat} className="w-[44px] h-[44px] rounded-full bg-[#7C3AED] text-white flex items-center justify-center shadow-[0_6px_16px_rgba(124,58,237,0.35)] active:scale-95">
                <Send className="w-4 h-4" />
              </button>
            </div>
            <div className="text-[10px] text-center text-gray-400 mt-2">Meta AI • Voice: Web Speech API • Pola: {patternPath.join("-") || "—"}</div>
          </div>
        </div>
      );
    }

    if (page === "riwayat" || page === "laporan" || page === "tanggungan" || page === "pengeluaran") {
      return (
        <div className="px-5 py-6">
          <h2 className="text-[22px] font-bold tracking-tight">
            {page === "riwayat" ? "Riwayat + Foto" : page === "laporan" ? "Laporan Harian" : page === "tanggungan" ? "Tanggungan" : "Pengeluaran"}
          </h2>
          <p className="text-sm text-gray-500 mt-1">Data asli dari APK dipertahankan • V2 Fixed</p>

          <div className="mt-6 space-y-3">
            {[
              { t: "GoFood - Ayam Geprek", a: "- Rp 32.000", c: "Makan" },
              { t: "Boba Tea - Chatime", a: "- Rp 28.000", c: "Minum" },
              { t: "OVO Topup", a: "+ Rp 100.000", c: "Dompet" },
              { t: "Listrik", a: "- Rp 150.000", c: "Tanggungan" },
            ].map((it, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center">
                    <Receipt className="w-5 h-5 text-violet-600" />
                  </div>
                  <div>
                    <div className="text-[14px] font-semibold">{it.t}</div>
                    <div className="text-[11px] text-gray-500">{it.c} • Hari ini</div>
                  </div>
                </div>
                <div className={`text-[13px] font-bold ${it.a.startsWith("+") ? "text-emerald-600" : "text-gray-900"}`}>{it.a}</div>
              </div>
            ))}
          </div>

          {page === "laporan" && (
            <div className="mt-6 bg-white rounded-[24px] p-5 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="font-semibold">Grafik Mingguan</div>
                <div className="text-[11px] px-2 py-1 rounded-full bg-blue-50 text-blue-600">Biru chart</div>
              </div>
              <div className="mt-4 flex items-end gap-2 h-[90px]">
                {[40, 70, 45, 90, 60, 80, 35].map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                    <div className="w-full rounded-full bg-[#DBEAFE]" style={{ height: `${h}%` }}>
                      <div className="w-full h-full rounded-full bg-[#3B82F6]" style={{ height: i === 3 ? "100%" : "0%", opacity: i === 3 ? 1 : 0 }} />
                    </div>
                    <span className="text-[10px] text-gray-400">{["S", "S", "R", "K", "J", "S", "M"][i]}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 text-[12px] text-gray-500">Pengeluaran tertinggi Kamis • Hemat bro!</div>
            </div>
          )}
        </div>
      );
    }

    // default dashboard
    return (
      <div className="px-4 py-5 pb-28">
        {/* cards */}
        <div className="space-y-4">
          <div className="rounded-[24px] bg-[#7C3AED] p-5 text-white shadow-[0_12px_32px_rgba(124,58,237,0.35)] relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center">
                  <Wallet className="w-5 h-5" />
                </div>
                <div className="font-bold text-[15px] tracking-wide">SAKU DOMPET</div>
              </div>
              <div className="flex items-center gap-1.5">
                <button onClick={() => setShowBalance((s) => !s)} className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center">
                  {showBalance ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <button onClick={handleCopy} className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center">
                  {copyOk ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="mt-5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[12px] font-black text-[#7C3AED]">OVO</div>
                <span className="text-white/80 text-[13px]">OVO Premier</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-400 text-emerald-900 font-bold">AKTIF</span>
              </div>
              <div className="mt-3 text-[28px] font-extrabold tracking-tight">{showBalance ? "Rp 275.000" : "••••••••"}</div>
              <div className="mt-1 text-[13px] text-white/80 flex items-center gap-2">
                No: {showBalance ? "0812 **** 7890" : "•••• •••• ••••"} <span className="w-1 h-1 rounded-full bg-white/60" /> Pola: {patternPath.join("-") || "1-2-5-8"}
              </div>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-2">
              <div className="rounded-xl bg-white/12 backdrop-blur px-3 py-2">
                <div className="text-[10px] text-white/60 uppercase tracking-wide">Masuk</div>
                <div className="text-[13px] font-bold">+120rb</div>
              </div>
              <div className="rounded-xl bg-white/12 backdrop-blur px-3 py-2">
                <div className="text-[10px] text-white/60 uppercase tracking-wide">Keluar</div>
                <div className="text-[13px] font-bold">-87rb</div>
              </div>
              <div className="rounded-xl bg-white text-[#7C3AED] px-3 py-2 flex items-center justify-center gap-1 text-[12px] font-bold">
                <Plus className="w-3.5 h-3.5" /> Topup
              </div>
            </div>
          </div>

          <div className="rounded-[24px] bg-[#DC2626] p-5 text-white shadow-[0_12px_32px_rgba(220,38,38,0.28)] relative overflow-hidden">
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-xl" />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-[14px]">
                <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center">
                  <CreditCard className="w-5 h-5" />
                </div>
                PENGELUARAN
              </div>
              <div className="text-[11px] px-2.5 py-1 rounded-full bg-white/20">Hari ini</div>
            </div>
            <div className="mt-4 flex items-end justify-between">
              <div>
                <div className="text-[26px] font-extrabold">Rp 87.500</div>
                <div className="text-[12px] text-white/80 mt-1">3 transaksi • Hemat 12% dari kemarin</div>
              </div>
              <div className="w-12 h-12 rounded-full bg-white/15 flex items-center justify-center">
                <BarChart3 className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <div className="flex-1 h-1.5 rounded-full bg-white/20">
                <div className="h-full w-[68%] rounded-full bg-white" />
              </div>
              <span className="text-[10px]">68% budget</span>
            </div>
          </div>

          <div className="rounded-[24px] bg-white border border-gray-100 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="font-bold text-[15px] flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center">
                  <BarChart3 className="w-4 h-4 text-blue-600" />
                </div>
                Laporan Harian
              </div>
              <button onClick={() => setPage("laporan")} className="text-[12px] text-[#7C3AED] font-semibold flex items-center gap-1">
                Lihat <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            <div className="mt-5 flex items-end gap-2.5 h-[88px]">
              {[
                { h: 36, l: "Sen" },
                { h: 58, l: "Sel" },
                { h: 42, l: "Rab" },
                { h: 86, l: "Kam" },
                { h: 62, l: "Jum" },
                { h: 74, l: "Sab" },
                { h: 28, l: "Min" },
              ].map((b, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                  <div className="w-full flex justify-center" style={{ height: `${b.h}%` }}>
                    <div className={`w-[14px] rounded-full transition-all ${i === 3 ? "bg-[#3B82F6] shadow-[0_4px_12px_rgba(59,130,246,0.4)]" : "bg-[#E5E7EB]"}`} style={{ height: "100%" }} />
                  </div>
                  <span className="text-[10px] text-gray-400 font-medium">{b.l}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 text-[12px] text-gray-500">Puncak pengeluaran Kamis karena GoFood 3x. Saran AI: masak 2x seminggu.</div>
          </div>

          <div className="rounded-[24px] bg-[#F0FDF4] border border-emerald-100 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white">
                <Download className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[13px] font-bold text-emerald-900">Export ke Google Sheet</div>
                <div className="text-[11px] text-emerald-700/70">Auto sinkron harian • APK ready</div>
              </div>
            </div>
            <button onClick={() => setPage("export")} className="h-9 px-4 rounded-full bg-emerald-600 text-white text-[12px] font-semibold shadow">Export</button>
          </div>

          <div className="flex items-center justify-center gap-2 pt-2 text-[11px] text-gray-400">
            <PiggyBank className="w-3.5 h-3.5" /> Pola aman • Voice aktif • Web test V2 Fixed
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#EFECFF] flex justify-center">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Poppins:wght@600;700&display=swap'); *{font-family:Inter, Poppins, sans-serif} ::-webkit-scrollbar{width:0}`}</style>
      <div className="w-full max-w-[400px] bg-[#FAF9FF] min-h-screen shadow-2xl relative flex flex-col overflow-hidden">
        {/* top bar */}
        {page !== "chat" && (
          <div className="h-[60px] px-4 flex items-center justify-between bg-white border-b border-gray-100 sticky top-0 z-20">
            <div className="flex items-center gap-3">
              <button onClick={() => setDrawerOpen(true)} className="w-10 h-10 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center active:scale-95">
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <div className="font-bold text-[16px] tracking-tight" style={{ fontFamily: "Poppins" }}>
                  DompetKu AI
                </div>
                <div className="text-[10px] text-gray-500 -mt-1">V2 Fixed • {name || "Bro"}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setPage("chat")} className="w-10 h-10 rounded-full bg-violet-600 text-white flex items-center justify-center shadow-[0_6px_16px_rgba(124,58,237,0.3)]">
                <MessageCircle className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto">{renderMain()}</div>

        {/* DRAWER */}
        {drawerOpen && (
          <div className="absolute inset-0 z-40 flex">
            <div className="flex-1 bg-black/40 backdrop-blur-sm" onClick={() => setDrawerOpen(false)} />
            <div className="w-[300px] bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-left duration-200">
              <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#7C3AED] text-white flex items-center justify-center font-bold">{name ? name[0].toUpperCase() : "B"}</div>
                  <div>
                    <div className="font-bold text-[14px]">{name || "Bro Santoso"}</div>
                    <div className="text-[11px] text-gray-500">{email || "bro@gmail.com"}</div>
                  </div>
                </div>
                <button onClick={() => setDrawerOpen(false)} className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {[
                  {
                    title: "Dompet",
                    items: [
                      { icon: Wallet, label: "Saku Dompet", page: "dashboard" as Page, active: page === "dashboard" },
                      { icon: Plus, label: "Tambah Saldo", page: "tambah" as Page },
                    ],
                  },
                  {
                    title: "Keuangan",
                    items: [
                      { icon: CreditCard, label: "Pengeluaran", page: "pengeluaran" as Page },
                      { icon: FileText, label: "Tanggungan", page: "tanggungan" as Page },
                    ],
                  },
                  {
                    title: "AI",
                    items: [
                      { icon: MessageCircle, label: "Chat Meta AI", page: "chat" as Page, badge: "VOICE 🎤" },
                      { icon: Camera, label: "Riwayat + Foto", page: "riwayat" as Page },
                      { icon: BarChart3, label: "Laporan Harian", page: "laporan" as Page },
                    ],
                  },
                  {
                    title: "Akun & Export",
                    items: [
                      { icon: User, label: "Akun", page: "akun" as Page },
                      { icon: Download, label: "Export Sheet", page: "export" as Page },
                      { icon: Settings, label: "Pengaturan", page: "pengaturan" as Page },
                    ],
                  },
                ].map((group) => (
                  <div key={group.title}>
                    <div className="text-[11px] font-bold tracking-widest text-gray-400 uppercase mb-2 px-2">{group.title}</div>
                    <div className="space-y-1">
                      {group.items.map((it) => (
                        <button
                          key={it.label}
                          onClick={() => {
                            setPage(it.page);
                            setDrawerOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-3 rounded-xl text-[14px] font-medium transition-all ${
                            it.active ? "bg-[#7C3AED] text-white shadow-[0_6px_16px_rgba(124,58,237,0.25)]" : "text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          <span className="flex items-center gap-3">
                            <it.icon className={`w-5 h-5 ${it.active ? "text-white" : "text-gray-500"}`} />
                            {it.label}
                          </span>
                          {it.badge ? (
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${it.active ? "bg-white/20" : "bg-violet-100 text-violet-700"}`}>{it.badge}</span>
                          ) : (
                            <ChevronRight className={`w-4 h-4 ${it.active ? "text-white/70" : "text-gray-300"}`} />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}

                <div className="rounded-2xl bg-[#FFFBEB] border border-amber-200 p-3 mt-2">
                  <div className="text-[12px] font-bold text-amber-900 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" /> APK Ready
                  </div>
                  <div className="text-[11px] text-amber-800/80 mt-1 leading-relaxed">
                    Semua logic APK dipertahankan. Ini versi web test V2 Fixed, tanpa popup install ganggu. Pola {patternPath.join("-") || "aman"}.
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-gray-100">
                <button
                  onClick={() => {
                    setPage("login");
                    setDrawerOpen(false);
                  }}
                  className="w-full h-11 rounded-xl bg-gray-900 text-white text-[13px] font-semibold flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" /> Keluar & Reset Pola
                </button>
                <div className="text-[10px] text-center text-gray-400 mt-2">DompetKu AI • V2 Fixed • No scroll kepanjangan</div>
              </div>
            </div>
          </div>
        )}

        {/* placeholder pages */}
        {(page === "tambah" || page === "akun" || page === "export" || page === "pengaturan") && (
          <div className="absolute inset-0 bg-[#FAF9FF] z-30 flex flex-col">
            <div className="h-[60px] px-4 flex items-center gap-3 bg-white border-b border-gray-100">
              <button onClick={() => setPage("dashboard")} className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center">
                <X className="w-5 h-5" />
              </button>
              <div className="font-bold">
                {page === "tambah" ? "Tambah Saldo" : page === "akun" ? "Akun" : page === "export" ? "Export Sheet" : "Pengaturan"}
              </div>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-16 h-16 rounded-[20px] bg-violet-100 flex items-center justify-center mb-4">
                {page === "export" ? <Download className="w-8 h-8 text-violet-600" /> : <Settings className="w-8 h-8 text-violet-600" />}
              </div>
              <h3 className="font-bold text-[18px]">Fitur {page} - APK Ready</h3>
              <p className="text-sm text-gray-500 mt-2 max-w-[280px]">Halaman ini mempertahankan logic APK asli. Di web test V2 ini tampil sebagai preview, tanpa scroll panjang. Drawer kiri sudah fix masalah navigasi kepanjangan.</p>
              <button onClick={() => setPage("dashboard")} className="mt-6 h-11 px-6 rounded-full bg-[#7C3AED] text-white font-semibold">Kembali ke Dompet</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
