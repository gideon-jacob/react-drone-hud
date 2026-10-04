# react-drone-hud

[![npm version](https://img.shields.io/npm/v/@gideonjacob/react-drone-hud.svg?style=flat-square&color=emerald)](https://www.npmjs.com/package/@gideonjacob/react-drone-hud)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![React 18 & 19](https://img.shields.io/badge/React-18%20%7C%2019-61dafb.svg?style=flat-square)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178c6.svg?style=flat-square)](https://www.typescriptlang.org/)

A responsive, high-performance **Primary Flight Display (PFD) / Artificial Horizon HUD** for UAVs and autonomous drones built for React. Faithfully replicates the avionics visual style of **ArduPilot** and **Mission Planner**.

Built with pure SVG, CSS Container Queries, and modern React—offering zero heavy canvas dependencies, crisp scaling at any resolution, and native support for transparent live camera / FPV video overlays.

---

## Features

- **Avionics Fidelity**: Faithful to ArduPilot / Mission Planner layout:
  - Top dynamic 360° compass heading tape with cardinal readouts (N, NE, E, SE, S, SW, W, NW) and center digital box.
  - Curvilinear roll arc with radial degree markings, red zero-apex marker, and dynamic pointer.
  - Pitch ladder with degree numbers and center level horizon.
  - Dual glass columns: Left Airspeed tape and Right Altitude tape with illuminated readout badges.
  - Center boresight chevron reticle and horizon segment marks.
  - Telemetry readouts: GPS satellite count and uppercase flight mode annunciator.
  - Central red `DISARMED` alert banner when disarmed.
- **Camera Overlay Mode**: Toggle `overlay={true}` to make the sky and ground transparent, allowing seamless overlay directly over live drone camera streams (WebRTC, RTSP, HLS, or `<video>`).
- **Container Query Responsive**: Automatically resizes and scales proportionally to any container width or aspect ratio using `cqw` container query units.
- **Universal Packaging**: Shipped with precompiled ESM, CommonJS, TypeScript declarations (`.d.ts`), and standalone CSS. Works out of the box with Next.js, Remix, Vite, or Create React App.

---

## Installation

```bash
npm install @gideonjacob/react-drone-hud
```
or with yarn / pnpm / bun:
```bash
yarn add @gideonjacob/react-drone-hud
# or
pnpm add @gideonjacob/react-drone-hud
# or
bun add @gideonjacob/react-drone-hud
```

---

## Quick Start

Import the component and its stylesheet in your React project:

```tsx
import { DroneHud } from "@gideonjacob/react-drone-hud";
import "@gideonjacob/react-drone-hud/style.css";

export function GroundStation() {
  return (
    <div style={{ width: "640px", maxWidth: "100%" }}>
      <DroneHud
        pitch={5}
        roll={-12}
        yaw={180}
        speed={14.8}
        altitude={85}
        satellites={16}
        flightMode="AUTO"
        armed={true}
      />
    </div>
  );
}
```

---

## Live Video / Camera Overlay Mode

For drone ground control stations displaying live camera feeds (e.g. FPV camera, RTSP stream, or video player), pass `overlay={true}`:

```tsx
import { DroneHud } from "react-drone-hud";
import "react-drone-hud/style.css";

export function FpvCockpit() {
  return (
    <div className="relative w-full h-125">
      {/* Live Video Feed */}
      <video
        src="/drone-stream.mp4"
        autoPlay
        loop
        muted
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Transparent HUD Overlay */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-4">
        <DroneHud
          pitch={2}
          roll={-4}
          yaw={90}
          speed={18.5}
          altitude={120}
          satellites={18}
          flightMode="GUIDED"
          armed={true}
          overlay={true}
        />
      </div>
    </div>
  );
}
```

---

## Component API (`DroneHudProps`)

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `pitch` | `number` | `0` | Aircraft pitch angle in degrees (clamped between `-30°` and `+30°`). Positive pitches nose up, negative pitches nose down. |
| `roll` | `number` | `0` | Aircraft roll/bank angle in degrees (clamped between `-60°` and `+60°`). Positive banks right, negative banks left. |
| `yaw` | `number` | `0` | Compass heading / yaw in degrees (`0°` to `360°`). |
| `speed` | `number` | `0` | Airspeed / ground speed (m/s). Displayed on the left tape. |
| `altitude` | `number` | `28` | Current altitude (meters). Displayed on the right tape. |
| `satellites` | `number` | `12` | Number of acquired GPS satellites. |
| `gps` | `number` | `12` | Alias for `satellites`. |
| `flightMode` | `string` | `"AUTO"` | Current autopilot flight mode (e.g. `AUTO`, `LOITER`, `STABILIZE`, `RTL`, `GUIDED`, `LAND`). |
| `armed` | `boolean` | `true` | Arm status. When `false`, displays a central red `DISARMED` banner. |
| `overlay` | `boolean` | `false` | When `true`, hides the solid sky/ground horizon gradients so the HUD can be overlaid on live video streams. |
| `className` | `string` | `""` | Optional CSS classes to attach to the root container. |
| `style` | `CSSProperties` | `undefined` | Optional inline styles for custom sizing and positioning. |

---

## The Origin Story

### Built for NIDAR Edition 2, Shared with the World

While building the Ground Control Station for **NIDAR Edition 2** (autonomous UAV & robotics platform) in 2026, our team needed a React-based Primary Flight Display that faithfully matched the familiar ArduPilot and Mission Planner HUD.

While searching across open-source repositories, we found some incredible HUD designs and flight instrument libraries—yet none of them featured the classic **Mission Planner / ArduPilot** layout. Our UI/UX developers loved the clean simplicity of that interface, and our drone pilots found it intuitive and dependable in flight.

Instead of compromising on a design both our developers and pilots genuinely preferred, our engineering team decided to build it ourselves. **Manju** laid the architectural foundation and built the core HUD implementation. **Pawan Sai**, **Kiruthika**, and **Gideon Jacob** iteratively refined the telemetry tapes, roll arc, pitch ladders, container queries, and camera overlay support.

Once we had a battle-tested component that met our needs, we asked: *why should other drone and aerospace engineers have to rebuild this from scratch?*

Today, we're giving it back to the community under the permissive MIT license.

### Contributors & Acknowledgments
- **[Manju](https://github.com/gideon-jacob)** – Architected and built the core HUD implementation.
- **[Pawan Sai](https://github.com/gideon-jacob)** – Engineering and development contributor.
- **[Kiruthika](https://github.com/gideon-jacob)** – Engineering and development contributor.
- **[Gideon Jacob](https://github.com/gideon-jacob)** – ArduPilot design refinement, overlay mode, packaging, and open-source release maintainer.

---

## Development

```bash
# Clone the repository
git clone https://github.com/gideon-jacob/react-drone-hud.git
cd react-drone-hud

# Install dependencies
npm install

# Start interactive playground
npm run dev

# Build library bundle
npm run build:lib

# Run linter
npm run lint
```

---

## License

MIT © [Gideon Jacob and Contributors](LICENSE)
