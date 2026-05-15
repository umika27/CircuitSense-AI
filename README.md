# CircuitSense AI

CircuitSense AI is a Next.js 15 App Router application that acts like an intelligent electronics lab assistant. It accepts a circuit image, a natural-language circuit description, or both, then returns structured analysis, debugging guidance, equations, LTspice netlists, and conceptual quiz questions.

## Tech Stack

- Next.js 15, TypeScript, Tailwind CSS
- shadcn-style glass UI components
- Lucide React icons
- Framer Motion
- react-dropzone
- sonner toasts
- zod validation
- Google Gemini multimodal API

## Environment

Create `.env.local`:

```bash
GEMINI_API_KEY=your_api_key_here
GEMINI_MODEL=gemini-2.5-flash
```

`GEMINI_MODEL` is optional. The app defaults to `gemini-2.5-flash`.

## Commands

```bash
npm run dev
npm run build
npm run lint
```

## API

`POST /api/analyze` accepts multipart form data:

- `image`: optional image file
- `description`: optional text description

At least one input is required.
