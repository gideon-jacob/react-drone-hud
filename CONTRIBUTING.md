# Contributing to react-drone-hud

We welcome contributions from drone enthusiasts, aerospace developers, and frontend engineers!

## Getting Started

1. **Fork and clone the repository:**
   ```bash
   git clone https://github.com/your-username/react-drone-hud.git
   cd react-drone-hud
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```
   This will start the interactive playground with live HMR.

## Making Changes

- All core component code lives in `src/components/DroneHud.tsx`.
- The library entry point is `src/index.ts`.
- The interactive demo and test harness is in `src/App.tsx`.

## Testing and Verification

Before submitting a pull request, ensure the following checks pass:

1. **Lint code:**
   ```bash
   npm run lint
   ```

2. **Build the library bundle:**
   ```bash
   npm run build:lib
   ```

3. **Build the demo app:**
   ```bash
   npm run build:demo
   ```

## Pull Request Guidelines

- Provide a clear and concise description of the change.
- If introducing new telemetry fields or visuals, include screenshots or a screen recording.
- Follow existing code formatting and naming conventions.
- Keep component dependencies minimal (avoid adding heavy external libraries).

Thank you for helping make `react-drone-hud` better for everyone!
