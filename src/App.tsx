import { useState } from "react";
import { DroneHud } from "./components/DroneHud";

const FLIGHT_MODES = [
  "AUTO",
  "STABILIZE",
  "LOITER",
  "RTL",
  "GUIDED",
  "ACRO",
  "LAND",
  "POSHOLD",
];

export default function App() {
  const [pitch, setPitch] = useState(6);
  const [roll, setRoll] = useState(-10);
  const [yaw, setYaw] = useState(45);
  const [speed, setSpeed] = useState(15.2);
  const [altitude, setAltitude] = useState(72);
  const [satellites, setSatellites] = useState(14);
  const [flightMode, setFlightMode] = useState("AUTO");
  const [armed, setArmed] = useState(true);
  const [overlay, setOverlay] = useState(false);
  const [copied, setCopied] = useState(false);

  const resetToLevel = () => {
    setPitch(0);
    setRoll(0);
    setYaw(0);
    setSpeed(12);
    setAltitude(50);
    setSatellites(14);
    setFlightMode("AUTO");
    setArmed(true);
  };

  const codeSnippet = `<DroneHud
  pitch={${pitch}}
  roll={${roll}}
  yaw={${yaw}}
  speed={${speed}}
  altitude={${altitude}}
  satellites={${satellites}}
  flightMode="${flightMode}"
  armed={${armed}}${overlay ? '\n  overlay={true}' : ''}
/>`;

  const copyCode = async () => {
    await navigator.clipboard.writeText(codeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Navbar */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-50 px-4 lg:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center font-mono font-bold text-emerald-400 text-sm">
            HUD
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-white flex items-center gap-2">
              react-drone-hud
              <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                v1.0.0
              </span>
            </h1>
            <p className="text-xs text-slate-400 hidden sm:block">
              ArduPilot & Mission Planner Primary Flight Display (PFD) for React
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <code className="hidden md:inline-block px-2.5 py-1 rounded bg-slate-800/80 border border-slate-700/80 text-xs font-mono text-slate-300">
            npm i @gideon-jacob/react-drone-hud
          </code>
          <a
            href="https://github.com/gideon-jacob/react-drone-hud"
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-white transition flex items-center gap-1.5"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            GitHub
          </a>
        </div>
      </header>

      {/* Main Grid: Live HUD & Compact Controls */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* HUD Display Column */}
        <section className="lg:col-span-7 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Live HUD Telemetry View
            </span>
            <div className="flex items-center gap-2">
              <span
                className={`text-xs px-2 py-0.5 rounded font-mono font-medium ${
                  armed
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    : "bg-red-500/10 text-red-400 border border-red-500/20"
                }`}
              >
                {armed ? "ARMED" : "DISARMED"}
              </span>
              <span className="text-xs px-2 py-0.5 rounded font-mono font-medium bg-slate-800 text-slate-300 border border-slate-700">
                {overlay ? "OVERLAY MODE" : "PFD HORIZON"}
              </span>
            </div>
          </div>

          {/* HUD Container Card */}
          <div
            className={`relative rounded-xl overflow-hidden border border-slate-800 shadow-2xl p-1 sm:p-2 transition-colors ${
              overlay
                ? "bg-[radial-gradient(#1e293b_1px,transparent_1px)] bg-size-[16px_16px] bg-slate-900"
                : "bg-slate-900/40"
            }`}
          >
            <div className="w-full max-w-2xl mx-auto rounded-lg overflow-hidden shadow-inner">
              <DroneHud
                pitch={pitch}
                roll={roll}
                yaw={yaw}
                speed={speed}
                altitude={altitude}
                satellites={satellites}
                flightMode={flightMode}
                armed={armed}
                overlay={overlay}
              />
            </div>
          </div>

          {/* Code Snippet Box */}
          <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono text-slate-400">React Component Usage</span>
              <button
                onClick={copyCode}
                className="px-2.5 py-1 rounded text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
              >
                {copied ? "✓ Copied!" : "Copy JSX"}
              </button>
            </div>
            <pre className="text-xs font-mono text-emerald-300/90 overflow-x-auto p-2.5 rounded bg-slate-950/80 border border-slate-800/80">
              {codeSnippet}
            </pre>
          </div>
        </section>

        {/* Telemetry Sliders Column */}
        <section className="lg:col-span-5 rounded-xl border border-slate-800 bg-slate-900/60 p-4 sm:p-5 flex flex-col gap-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Telemetry Sliders
              </h2>
              <p className="text-xs text-slate-400">
                Adjust values to test responsive avionics gauges
              </p>
            </div>
            <button
              onClick={resetToLevel}
              className="text-xs px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-medium transition"
            >
              Reset Level
            </button>
          </div>

          {/* Sliders Grid */}
          <div className="flex flex-col gap-3.5">
            {/* Pitch */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Pitch Angle</span>
                <span className="font-mono text-emerald-400 font-bold">{pitch}°</span>
              </div>
              <input
                type="range"
                min="-30"
                max="30"
                step="1"
                value={pitch}
                onChange={(e) => setPitch(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>-30° (Down)</span>
                <span>0°</span>
                <span>+30° (Up)</span>
              </div>
            </div>

            {/* Roll */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Roll Angle (Bank)</span>
                <span className="font-mono text-emerald-400 font-bold">{roll}°</span>
              </div>
              <input
                type="range"
                min="-60"
                max="60"
                step="1"
                value={roll}
                onChange={(e) => setRoll(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>-60° (Left)</span>
                <span>0°</span>
                <span>+60° (Right)</span>
              </div>
            </div>

            {/* Yaw / Heading */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Heading (Yaw)</span>
                <span className="font-mono text-emerald-400 font-bold">{yaw}°</span>
              </div>
              <input
                type="range"
                min="0"
                max="359"
                step="1"
                value={yaw}
                onChange={(e) => setYaw(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>0° (N)</span>
                <span>90° (E)</span>
                <span>180° (S)</span>
                <span>270° (W)</span>
              </div>
            </div>

            {/* Speed */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Airspeed (m/s)</span>
                <span className="font-mono text-emerald-400 font-bold">{speed.toFixed(1)} m/s</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                step="0.5"
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            {/* Altitude */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Altitude (m)</span>
                <span className="font-mono text-emerald-400 font-bold">{altitude} m</span>
              </div>
              <input
                type="range"
                min="-5"
                max="250"
                step="1"
                value={altitude}
                onChange={(e) => setAltitude(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            {/* Satellites */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">GPS Satellites</span>
                <span className="font-mono text-emerald-400 font-bold">{satellites} Sat</span>
              </div>
              <input
                type="range"
                min="0"
                max="24"
                step="1"
                value={satellites}
                onChange={(e) => setSatellites(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            {/* Mode & Toggles Row */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800">
              {/* Flight Mode */}
              <div className="flex flex-col gap-1">
                <label className="text-xs text-slate-300 font-medium">Flight Mode</label>
                <select
                  value={flightMode}
                  onChange={(e) => setFlightMode(e.target.value)}
                  className="bg-slate-800 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                >
                  {FLIGHT_MODES.map((mode) => (
                    <option key={mode} value={mode}>
                      {mode}
                    </option>
                  ))}
                </select>
              </div>

              {/* Armed Status Toggle */}
              <div className="flex flex-col gap-1">
                <label className="text-xs text-slate-300 font-medium">Arm Status</label>
                <button
                  type="button"
                  onClick={() => setArmed(!armed)}
                  className={`w-full py-1.5 px-3 rounded text-xs font-bold transition ${
                    armed
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30"
                      : "bg-red-500/20 text-red-300 border border-red-500/40 hover:bg-red-500/30"
                  }`}
                >
                  {armed ? "ARMED" : "DISARMED"}
                </button>
              </div>
            </div>

            {/* Camera Overlay Toggle */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-200 block">Camera Overlay Mode</span>
                <span className="text-[11px] text-slate-400 block">Transparent sky/ground for video streams</span>
              </div>
              <button
                type="button"
                onClick={() => setOverlay(!overlay)}
                className={`px-3 py-1.5 rounded text-xs font-semibold transition ${
                  overlay
                    ? "bg-emerald-500 text-black font-bold"
                    : "bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700"
                }`}
              >
                {overlay ? "Enabled" : "Disabled"}
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 py-4 px-4 text-center text-xs text-slate-500">
        Originally crafted for <span className="text-slate-300 font-medium">NIDAR Edition 2 (2026)</span> by Manju, Pawan Sai, Kiruthika, & Gideon Jacob. Open source under MIT License.
      </footer>
    </div>
  );
}
