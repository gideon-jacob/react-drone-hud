import type { CSSProperties } from "react";

// ---------------------------------------------------------
// HUD CONFIGURATION CONSTANTS (Faithfully matching Mission Planner / ArduPilot)
// ---------------------------------------------------------
const COMPASS_SPAN = 45; // Degrees of heading shown on either side of the center marker
const TAPE_SPAN = 6; // Units (m or m/s) shown on either side of center value
const PITCH_MARKS = [25, 20, 15, 10, 5, 0, -5, -10, -15, -20, -25]; // Ladder degrees
const ROLL_MARKS = [-60, -45, -30, -20, -10, 0, 10, 20, 30, 45, 60];
const ROLL_MINOR = [-25, -15, -5, 5, 15, 25];

const HEADING_NAMES: Record<number, string> = {
  0: "N",
  45: "NE",
  90: "E",
  135: "SE",
  180: "S",
  225: "SW",
  270: "W",
  315: "NW",
  360: "N",
};

// ---------------------------------------------------------
// UTILITY FUNCTIONS
// ---------------------------------------------------------
const normalizeHeading = (d: number) => ((Math.round(d) % 360) + 360) % 360;

// ---------------------------------------------------------
// COMPASS COMPONENT
// Full-width horizontal strip with heading tape and center readout box
// ---------------------------------------------------------
function Compass({
  heading,
  overlay = false,
}: {
  heading: number;
  overlay?: boolean;
}) {
  const ticks = [];

  for (
    let d = Math.ceil((heading - COMPASS_SPAN) / 5) * 5;
    d <= heading + COMPASS_SPAN;
    d += 5
  ) {
    const n = normalizeHeading(d);
    const major = n % 15 === 0;

    ticks.push(
      <div
        key={d}
        className="absolute bottom-0 flex flex-col items-center -translate-x-1/2"
        style={{ left: `calc(50% + ${d - heading} * 1.05 * 1cqw)` }}
      >
        {major && (
          <span className="text-[2.9cqw] font-bold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] mb-[0.2cqw] whitespace-nowrap leading-none select-none">
            {HEADING_NAMES[n] ?? n}
          </span>
        )}
        <div
          className={`bg-white w-[0.16cqw] ${major ? "h-[1.5cqw]" : "h-[0.9cqw]"}`}
        />
      </div>
    );
  }

  return (
    <div
      className={`absolute top-0 inset-x-0 h-[7.5cqw] overflow-hidden z-4 border-b-[0.16cqw] border-white/80 ${
        overlay ? "bg-slate-950/75 backdrop-blur-xs" : "bg-slate-900/95"
      }`}
    >
      {/* Ticks ribbon */}
      {ticks}

      {/* Center Translucent Heading Box */}
      <div className="absolute left-1/2 top-[0.6cqw] -translate-x-1/2 flex flex-col items-center z-2">
        <div className="px-[1.2cqw] py-[0.15cqw] bg-white/90 text-black font-extrabold text-[3.2cqw] leading-tight rounded-xs shadow-md border border-white">
          {String(normalizeHeading(heading)).padStart(3, "0")}
        </div>
        {/* Center green tick line */}
        <div className="w-[0.25cqw] h-[1cqw] bg-emerald-400 mt-[0.2cqw]" />
      </div>
    </div>
  );
}

// ---------------------------------------------------------
// ROLL ARC COMPONENT
// Vector roll meter with outward radial labels and red apex marker
// ---------------------------------------------------------
const ARC = { cx: 200, cy: 160, r: 125 };

const polar = (deg: number, r: number): [number, number] => {
  const a = (deg * Math.PI) / 180;
  return [ARC.cx + r * Math.sin(a), ARC.cy - r * Math.cos(a)];
};

function RollArc({ roll }: { roll: number }) {
  const [x1, y1] = polar(-60, ARC.r);
  const [x2, y2] = polar(60, ARC.r);

  return (
    <svg
      className="absolute top-[0.2cqw] left-1/2 w-[56cqw] -translate-x-1/2 overflow-visible pointer-events-none drop-shadow-[0_1px_3px_rgba(0,0,0,0.85)]"
      viewBox="0 0 400 175"
    >
      {/* Main white arc line */}
      <path
        d={`M${x1} ${y1} A${ARC.r} ${ARC.r} 0 0 1 ${x2} ${y2}`}
        fill="none"
        stroke="#ffffff"
        strokeWidth="2.5"
      />

      {/* Intermediate minor ticks */}
      {ROLL_MINOR.map((m) => {
        const [ax, ay] = polar(m, ARC.r);
        const [bx, by] = polar(m, ARC.r + 8);
        return (
          <line
            key={m}
            x1={ax}
            y1={ay}
            x2={bx}
            y2={by}
            stroke="#ffffff"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        );
      })}

      {/* Major tick lines and numbers */}
      {ROLL_MARKS.map((m) => {
        if (m === 0) return null; // 0 has the red apex triangle
        const [ax, ay] = polar(m, ARC.r);
        const [bx, by] = polar(m, ARC.r + 13);
        const [tx, ty] = polar(m, ARC.r + 28);

        return (
          <g key={m}>
            <line
              x1={ax}
              y1={ay}
              x2={bx}
              y2={by}
              stroke="#ffffff"
              strokeWidth="2.8"
              strokeLinecap="round"
            />
            <text
              x={tx}
              y={ty + 5}
              textAnchor="middle"
              fill="#ffffff"
              fontSize="17"
              fontWeight="bold"
              style={{ filter: "drop-shadow(0 1.5px 3px rgba(0,0,0,0.95))" }}
            >
              {Math.abs(m)}
            </text>
          </g>
        );
      })}

      {/* Red hollow reference triangle pointing UP at 0 degrees */}
      <polygon
        points="200,20 189,36 211,36"
        fill="none"
        stroke="#ef4444"
        strokeWidth="3.2"
        strokeLinejoin="round"
      />

      {/* Dynamic white indicator pointer tracking aircraft roll */}
      <g transform={`rotate(${roll} ${ARC.cx} ${ARC.cy})`}>
        <polygon
          points="200,23 191,40 209,40"
          fill="#ffffff"
          stroke="#000000"
          strokeWidth="1.4"
        />
      </g>
    </svg>
  );
}

// ---------------------------------------------------------
// SPEED TAPE (Left) - Zoomed flat glass column with large numbers and arrow badge
// ---------------------------------------------------------
function SpeedTape({ value }: { value: number }) {
  const ticks = [];
  const minVal = Math.floor(value - TAPE_SPAN);
  const maxVal = Math.ceil(value + TAPE_SPAN);

  for (let i = minVal; i <= maxVal; i++) {
    const isMajor = i % 5 === 0;
    ticks.push(
      <div
        key={i}
        className="absolute right-0 flex items-center justify-end w-full"
        style={{
          top: `calc(50% - ${i - value} * 3.4 * 1cqw)`,
          transform: "translateY(-50%)",
        }}
      >
        {isMajor && (
          <span className="text-[3.8cqw] font-black text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.95)] mr-[1cqw] leading-none select-none">
            {i}
          </span>
        )}
        <div
          className={`bg-white ${isMajor ? "h-[0.24cqw] w-[2.6cqw]" : "h-[0.16cqw] w-[1.4cqw] opacity-80"}`}
        />
      </div>
    );
  }

  return (
    <div className="absolute left-[1.5cqw] top-1/2 -translate-y-1/2 w-[12.5cqw] h-[36cqw] pointer-events-none select-none">
      {/* Flat Glass Panel Background */}
      <div className="absolute inset-0 bg-white/20 backdrop-blur-[2px] border-[0.18cqw] border-white/90 rounded-xs shadow-[0_2px_6px_rgba(0,0,0,0.4)]" />

      {/* Scrolling Numbers Container with fade mask */}
      <div
        className="absolute inset-y-[1.2cqw] left-[0.8cqw] right-[0.3cqw] overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(transparent, #000 15%, #000 85%, transparent)",
          WebkitMaskImage:
            "linear-gradient(transparent, #000 15%, #000 85%, transparent)",
        }}
      >
        {ticks}
      </div>

      {/* Center Black Readout Badge pointing RIGHT to horizon */}
      <div className="absolute top-1/2 right-[-2.2cqw] -translate-y-1/2 w-[11.5cqw] h-[5.6cqw] z-10 drop-shadow-md">
        <svg viewBox="0 0 90 36" className="w-full h-full overflow-visible">
          <polygon
            points="0,3 64,3 86,18 64,33 0,33"
            fill="#000000"
            stroke="#ffffff"
            strokeWidth="2"
          />
          <text
            x="32"
            y="24"
            fill="#ffffff"
            fontSize="18"
            fontWeight="bold"
            textAnchor="middle"
            fontFamily="monospace, sans-serif"
          >
            {value.toFixed(1)}
          </text>
        </svg>
      </div>
    </div>
  );
}

// ---------------------------------------------------------
// ALTITUDE TAPE (Right) - Zoomed flat glass column with large numbers and arrow badge
// ---------------------------------------------------------
function AltitudeTape({ value }: { value: number }) {
  const ticks = [];
  const minVal = Math.floor(value - TAPE_SPAN);
  const maxVal = Math.ceil(value + TAPE_SPAN);

  for (let i = minVal; i <= maxVal; i++) {
    const isMajor = i % 5 === 0;
    ticks.push(
      <div
        key={i}
        className="absolute left-0 flex items-center justify-start w-full"
        style={{
          top: `calc(50% - ${i - value} * 3.4 * 1cqw)`,
          transform: "translateY(-50%)",
        }}
      >
        <div
          className={`bg-white ${isMajor ? "h-[0.24cqw] w-[2.6cqw]" : "h-[0.16cqw] w-[1.4cqw] opacity-80"}`}
        />
        {isMajor && (
          <span className="text-[3.8cqw] font-black text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.95)] ml-[1cqw] leading-none select-none">
            {i}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="absolute right-[1.5cqw] top-1/2 -translate-y-1/2 w-[12.5cqw] h-[36cqw] pointer-events-none select-none">
      {/* Flat Glass Panel Background */}
      <div className="absolute inset-0 bg-white/20 backdrop-blur-[2px] border-[0.18cqw] border-white/90 rounded-xs shadow-[0_2px_6px_rgba(0,0,0,0.4)]" />

      {/* Scrolling Numbers Container with fade mask */}
      <div
        className="absolute inset-y-[1.2cqw] left-[0.3cqw] right-[0.8cqw] overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(transparent, #000 15%, #000 85%, transparent)",
          WebkitMaskImage:
            "linear-gradient(transparent, #000 15%, #000 85%, transparent)",
        }}
      >
        {ticks}
      </div>

      {/* Center Black Readout Badge pointing LEFT to horizon */}
      <div className="absolute top-1/2 left-[-2.2cqw] -translate-y-1/2 w-[11.5cqw] h-[5.6cqw] z-10 drop-shadow-md">
        <svg viewBox="0 0 90 36" className="w-full h-full overflow-visible">
          <polygon
            points="90,3 26,3 4,18 26,33 90,33"
            fill="#000000"
            stroke="#ffffff"
            strokeWidth="2"
          />
          <text
            x="58"
            y="24"
            fill="#ffffff"
            fontSize="19"
            fontWeight="bold"
            textAnchor="middle"
            fontFamily="monospace, sans-serif"
          >
            {Math.round(value)}
          </text>
        </svg>
      </div>
    </div>
  );
}

// ---------------------------------------------------------
// DRONE HUD COMPONENT PROPS
// ---------------------------------------------------------
export interface DroneHudProps {
  pitch?: number; // degrees (-30 to +30)
  roll?: number; // degrees (-60 to +60)
  yaw?: number; // degrees (heading)
  speed?: number; // m/s
  altitude?: number; // meters
  satellites?: number;
  gps?: number; // alias for satellites
  flightMode?: string;
  armed?: boolean;
  overlay?: boolean; // When true, sky and ground are transparent for FPV camera feed overlay
  className?: string;
  style?: CSSProperties;
}

/**
 * Heads-Up Display (Primary Flight Display / Artificial Horizon)
 * Faithfully matches the avionics visual design from ArduPilot / Mission Planner reference.
 */
export function DroneHud({
  pitch = 0,
  roll = 0,
  yaw = 0,
  speed = 0,
  altitude = 28,
  satellites,
  gps,
  flightMode = "AUTO",
  armed = true,
  overlay = false,
  className = "",
  style,
}: DroneHudProps) {
  // Normalize and clamp flight parameters for safe display
  const clampedRoll = Math.max(-60, Math.min(60, roll || 0));
  const clampedPitch = Math.max(-30, Math.min(30, pitch || 0));
  const heading = normalizeHeading(yaw || 0);
  const displaySpeed = Math.max(0, speed || 0);
  const displayAlt = altitude || 0;
  const numSatellites = satellites ?? gps ?? 12;

  return (
    <div
      className={`relative w-full aspect-4/3 sm:aspect-16/11 min-h-57.5 rounded-none overflow-hidden ${
        overlay ? "bg-transparent" : "bg-slate-900"
      } select-none shadow-md border ${
        overlay ? "border-white/20" : "border-slate-700/60"
      } ${className}`}
      style={{ containerType: "size", ...style }}
    >
      {/* 1. TOP COMPASS HEADING RIBBON (Yaw) */}
      <Compass heading={heading} overlay={overlay} />

      {/* 2. ARTIFICIAL HORIZON VIEWPORT */}
      <div className="absolute inset-x-0 top-[7.5cqw] bottom-0 overflow-hidden">
        {/* Dynamic Horizon Canvas (tilts with roll, translates with pitch) */}
        <div
          className="absolute will-change-transform"
          style={{
            width: "320cqw",
            height: "320cqw",
            left: "calc(50% - 160cqw)",
            top: "calc(50% - 160cqw)",
            transform: `rotate(${clampedRoll * -1}deg) translateY(${clampedPitch * 0.9}cqw)`,
            transformOrigin: "center center",
          }}
        >
          {/* Blue Sky (Top Half) */}
          {!overlay && (
            <div
              className="absolute inset-x-0 top-0 bottom-1/2"
              style={{
                background:
                  "linear-gradient(180deg, #4b89f5 0%, #68a0f8 45%, #9ec5fa 100%)",
              }}
            />
          )}

          {/* Olive-Green Ground (Bottom Half) */}
          {!overlay && (
            <div
              className="absolute inset-x-0 top-1/2 bottom-0"
              style={{
                background:
                  "linear-gradient(180deg, #87a71d 0%, #769615 50%, #638010 100%)",
              }}
            />
          )}

          {/* Center White Horizon Line */}
          <div
            className="absolute left-0 right-0 bg-white shadow-[0_0_0.3cqw_rgba(0,0,0,0.6)]"
            style={{
              top: "calc(50% - 0.1cqw)",
              height: "0.2cqw",
            }}
          />

          {/* Pitch Ladder Rungs */}
          {PITCH_MARKS.map((p) => {
            const isMajor = p % 10 === 0;

            return (
              <div
                key={p}
                className="absolute left-1/2 flex items-center justify-center pointer-events-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]"
                style={{
                  top: `calc(50% - ${p} * 0.9 * 1cqw)`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                {/* Degree Label on the LEFT of the rung */}
                <div className="w-[5.2cqw] flex justify-end items-center pr-[1cqw]">
                  {isMajor && (
                    <span className="text-[3.2cqw] font-bold text-white leading-none select-none">
                      {p}
                    </span>
                  )}
                </div>

                {/* White Ladder Line (Mathematically Centered) */}
                <div
                  className={`bg-white h-[0.24cqw] shrink-0 ${
                    p === 0
                      ? "w-[24cqw]"
                      : isMajor
                        ? "w-[18cqw]"
                        : "w-[11cqw]"
                  }`}
                />

                {/* Symmetric Spacer / Label on the RIGHT of the rung */}
                <div className="w-[5.2cqw] flex justify-start items-center pl-[1cqw]">
                  {isMajor && p !== 0 && (
                    <span className="text-[3.2cqw] font-bold text-white leading-none select-none">
                      {p}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* 3. DYNAMIC ROLL ARC */}
        <RollArc roll={clampedRoll} />

        {/* 4. HORIZON RED DASHES & GREEN SEGMENT (Fixed to horizon level) */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-between px-[14cqw] pointer-events-none">
          {/* Left Red Dash */}
          <div className="w-[6cqw] h-[0.4cqw] bg-[#ef4444] rounded-full drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]" />
          {/* Center Green Bar */}
          <div className="w-[7.5cqw] h-[0.4cqw] bg-[#22c55e] rounded-full drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]" />
          {/* Right Red Dash */}
          <div className="w-[6cqw] h-[0.4cqw] bg-[#ef4444] rounded-full drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]" />
        </div>

        {/* 5. AIRCRAFT BORESIGHT RETICLE (Center Red Chevron /\) */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[16cqw] h-[8cqw] pointer-events-none flex items-center justify-center">
          <svg
            viewBox="0 0 100 50"
            className="w-full h-full drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] overflow-visible"
          >
            {/* Red Inverted V Chevron: apex at (50, 25) exactly on horizon level */}
            <polyline
              points="15,45 50,25 85,45"
              fill="none"
              stroke="#ef4444"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* 6. CENTRAL DISARMED ALERT BANNER (Hidden when armed) */}
        {!armed && (
          <div className="absolute left-1/2 top-[calc(50%-7.5cqw)] -translate-x-1/2 text-[5.2cqw] font-black tracking-wider text-[#ef4444] pointer-events-none select-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">
            DISARMED
          </div>
        )}

        {/* 7. SPEED TAPE (Left - Shorter) */}
        <SpeedTape value={displaySpeed} />

        {/* 8. ALTITUDE TAPE (Right - Shorter) */}
        <AltitudeTape value={displayAlt} />

        {/* 9. BOTTOM STATUS: GPS (Left) and Flight Mode (Right) */}
        <div className="absolute bottom-[2.5cqw] left-[3cqw] font-bold text-[3.2cqw] font-mono text-emerald-300 drop-shadow-[0_2px_3px_rgba(0,0,0,0.95)] pointer-events-none select-none">
          GPS: {numSatellites} Sat
        </div>
        <div className="absolute bottom-[2.5cqw] right-[3cqw] font-bold text-[3.4cqw] tracking-wide uppercase text-white/95 drop-shadow-[0_2px_3px_rgba(0,0,0,0.95)] pointer-events-none select-none">
          {flightMode || "AUTO"}
        </div>
      </div>
    </div>
  );
}

export default DroneHud;
