# CLAUDE.md - Instructions for Claude AI

**Version 2.0.0** | **Regis Architecture**

## Project Context

You are working on **Keira**, an AI-powered video watermark removal platform.

### Key Technologies
- **Frontend**: React 19.2 + TypeScript 5.9 + Vite 7.3 + Zustand 5.0 + TailwindCSS 4.1
- **UI Libraries**: Sonner 2.0 (toasts) + Framer Motion 12 + Lucide React
- **Backend**: FastAPI 0.127+ + Python 3.12 + Pydantic 2.12
- **AI/ML**: LaMa ONNX + CUDA/CPU

### Architecture (Regis v2.9.0)
- Layered architecture (UI -> Hooks/Services -> State -> API)
- Custom hooks for business logic
- Glass UI component system
- Barrel exports in all folders
- Strict TypeScript mode

## File Locations

| What | Where |
|------|-------|
| React components | `src/components/` |
| UI primitives | `src/components/ui/Glass.tsx` |
| Custom hooks | `src/hooks/` |
| Services | `src/services/` |
| State store | `src/store/` |
| Types | `src/types/` |
| API routes | `api/routes/` |
| API services | `api/services/` |
| Worker | `worker/` |

### Key Files (v2.0)

| File | Purpose |
|------|---------|
| `src/hooks/useHotkey.ts` | Single keyboard shortcut listener |
| `src/hooks/useKeyboardShortcuts.ts` | Multiple shortcuts manager |
| `src/components/LazyComponents.tsx` | React.lazy code-split definitions |
| `src/components/SuspenseFallback.tsx` | Loading fallback for Suspense |

## Commands

```bash
pnpm dev              # Start frontend (port 5175)
pnpm build            # Build production
pnpm backend          # Start FastAPI (port 8002)
pnpm start            # Run both
pnpm storybook        # Component library
```

## Preferences

- Use pnpm, not npm
- TypeScript strict mode
- Functional components
- Zustand 5 for state
- Tailwind for styling
- Polish UI, English code comments
- Gray glassmorphism theme
