# EventLedger - Walrus RFP Pitch

This is the pitch landing page for EventLedger, built as a high-performance Next.js application.

## Getting Started

1. **Install Dependencies**
   ```bash
   pnpm install
   ```

2. **Run Development Server**
   ```bash
   pnpm dev
   ```

3. **Open the App**
   - Main Pitch: [http://localhost:3000](http://localhost:3000)
   - Presenter Mode: [http://localhost:3000/presenter](http://localhost:3000/presenter)

## Features

- **Presenter Mode**: Toggle via the sticky header or visit `/presenter`. Increases font sizes and shows timing helpers.
- **Narrative Flow**: 10 sections guiding the viewer from Problem -> Solution -> MVP -> Architecture -> Roadmap.
- **Architecture Diagram**: Pure SVG implementation in `components/sections/architecture.tsx`.
- **Tech Stack**: Next.js 14, TailwindCSS, Framer Motion, Zustand, shadcn/ui.

## Project Structure

- `app/page.tsx`: Main entry point (the pitch deck).
- `store/presenter-store.ts`: State management for Presenter Mode.
- `components/sections/`: Individual slide/section components.
- `components/ui/`: Reusable UI primitives.

## Customization

- **Colors**: Defined in `app/globals.css` (CSS variables).
- **Content**: Edit text directly in `components/sections/*.tsx`.
