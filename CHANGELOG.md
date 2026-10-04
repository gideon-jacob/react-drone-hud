# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-10-04

### Added
- **ArduPilot / Mission Planner PFD Layout**:
  - Horizontal 360° dynamic compass ribbon with cardinal heading labels and center readout.
  - Curvilinear roll arc with intermediate/major degree ticks and dynamic roll pointer.
  - Dual glass columns: Speed tape (left) and Altitude tape (right) with illuminated arrow badges.
  - Pitch ladder with degree labels.
  - Center boresight reticle and horizon bar segments.
  - Central `DISARMED` banner alert when aircraft is disarmed.
  - GPS satellite counter and uppercase flight mode indicator.
- **Camera Overlay Mode**:
  - `overlay` prop allowing transparent background for overlaying HUD directly onto live camera / video streams.
- **Universal Packaging**:
  - Dual ESM and CommonJS bundle outputs.
  - TypeScript `.d.ts` declaration maps.
  - Standalone compiled CSS bundle (`dist/style.css`).
  - React 18 & 19 peer dependencies support.
- **Interactive Playground**:
  - Live avionics telemetry controls with sliders for pitch, roll, yaw, speed, altitude, and satellites.
  - Flight mode selector, armed toggle, overlay mode toggle, and instant JSX snippet generator.
