import { useCallback, useEffect, useRef, useState } from "react";

function App() {
  const [length, setLength] = useState(16);
  const [numberAllowed, setNumberAllowed] = useState(true);
  const [charAllowed, setCharAllowed] = useState(true);
  const [password, setPassword] = useState("");
  const [dark, setDark] = useState(true);
  const [toast, setToast] = useState(false);

  const passwordRef = useRef(null);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  const generatePassword = useCallback(() => {
    let chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (numberAllowed) chars += "0123456789";
    if (charAllowed) chars += "!@#$%^&*()_+";

    let pass = "";
    for (let i = 0; i < length; i++) {
      pass += chars[Math.floor(Math.random() * chars.length)];
    }
    setPassword(pass);
  }, [length, numberAllowed, charAllowed]);

  useEffect(() => {
    generatePassword();
  }, [generatePassword]);

  const copyPassword = () => {
    passwordRef.current?.select();
    navigator.clipboard.writeText(password);
    setToast(true);
    setTimeout(() => setToast(false), 2000);
  };

  const charsetSize = 52 + (numberAllowed ? 10 : 0) + (charAllowed ? 12 : 0);
  const entropy = Math.round(length * Math.log2(charsetSize));
  const strength = entropy < 50 ? "Weak" : entropy < 80 ? "Strong" : "Secure";

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 transition-colors duration-500 px-4">
      <div
        className={`fixed top-10 z-50 transition-all duration-500 ${
          toast ? "translate-y-0 opacity-100" : "-translate-y-12 opacity-0"
        }`}
      >
        <div className="bg-indigo-600 text-white px-8 py-3 rounded-2xl shadow-[0_10px_30px_rgba(79,70,229,0.4)] font-bold text-sm">
          🚀 Password Copied!
        </div>
      </div>

      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 shadow-[0_20px_60px_rgba(0,0,0,0.03)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.4)] border border-slate-200/60 dark:border-slate-800">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-black tracking-tight dark:text-white text-slate-900">
              Interior
            </h1>
            <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em] mt-1">
              Advanced Encryption
            </p>
          </div>
          <button
            onClick={() => setDark(!dark)}
            className="w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 text-xl hover:scale-110 transition-all"
          >
            {dark ? "☀️" : "🌙"}
          </button>
        </div>

        {/* Password Result Box */}
        <div className="bg-slate-50 dark:bg-slate-950 rounded-[2rem] p-4 mb-10 border border-slate-200/50 dark:border-slate-800 shadow-inner">
          <div className="relative group">
            <input
              ref={passwordRef}
              value={password}
              readOnly
              className="w-full bg-transparent px-4 py-6 font-mono text-2xl text-center text-indigo-600 dark:text-indigo-400 outline-none selection:bg-indigo-100"
            />
            <button
              onClick={generatePassword}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-3 text-slate-400 hover:text-indigo-500 hover:rotate-180 transition-all duration-500"
            >
              <span className="text-xl">🔄</span>
            </button>
          </div>
          <button
            onClick={copyPassword}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-[0_10px_20px_rgba(79,70,229,0.3)] active:scale-[0.97] transition-all"
          >
            Copy to Clipboard
          </button>
        </div>

        {/* Content Controls */}
        <div className="space-y-10 px-2">
          {/* Custom Slider Section */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <span className="text-xs font-black uppercase tracking-widest text-slate-400">
                Key Length
              </span>
              <span className="text-lg font-black text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-4 py-1 rounded-full">
                {length}
              </span>
            </div>
            <input
              type="range"
              min={8}
              max={40}
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              className="custom-slider"
            />
          </div>

          {/* Feature Toggles */}
          <div className="grid grid-cols-2 gap-6">
            <FeatureBtn
              icon="0-9"
              label="Numbers"
              active={numberAllowed}
              onClick={() => setNumberAllowed(!numberAllowed)}
            />
            <FeatureBtn
              icon="#&%"
              label="Symbols"
              active={charAllowed}
              onClick={() => setCharAllowed(!charAllowed)}
            />
          </div>

          {/* Strength Bar */}
          <div className="pt-4">
            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest mb-3 opacity-40">
              <span>Security Strength</span>
              <span>{strength}</span>
            </div>
            <div className="flex gap-2 h-1.5">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`flex-1 rounded-full transition-all duration-700 ${
                    strength === "Weak" && i <= 1
                      ? "bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.4)]"
                      : strength === "Strong" && i <= 3
                      ? "bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.4)]"
                      : strength === "Secure"
                      ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]"
                      : "bg-slate-200 dark:bg-slate-800"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Sub-component for clean code
function FeatureBtn({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-2 p-5 rounded-[1.5rem] border-2 transition-all ${
        active
          ? "border-indigo-600 bg-indigo-50/50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400"
          : "border-slate-100 dark:border-slate-800 bg-transparent text-slate-400"
      }`}
    >
      <span className="text-xs font-black">{icon}</span>
      <span className="text-[10px] font-black uppercase tracking-tighter">
        {label}
      </span>
    </button>
  );
}

export default App;
