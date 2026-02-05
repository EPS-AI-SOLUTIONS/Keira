# Contributing to Keira

The "Regis" architecture demands precision. Follow these guidelines.

## Development Environment

### Frontend (React)
- **Strict Mode:** Enabled.
- **Components:** Functional. Named exports preferred.
- **Styling:** TailwindCSS 4 utility classes.
- **Linting:** `eslint.config.js` is the source of truth. Run `pnpm lint` before committing.

### Backend (Python)
- **Type Hints:** Mandatory for all function arguments and returns.
- **Formatter:** Black / Ruff.
- **Imports:** Sorted (isort/ruff).

## Workflow

1.  **Feature Branches:** `feat/video-preview`, `fix/onnx-cuda`.
2.  **Testing:**
    - Frontend: `pnpm test` (Vitest).
    - Backend: `pytest` (if available, or manual verification).
3.  **Commit Messages:** Conventional Commits (`feat: add progress bar`).

## Architecture Rules

1.  **Separation:** The `worker` script must remain independent of `FastAPI`. It should be runnable via CLI for debugging.
2.  **State:** Frontend state belongs in Zustand (`src/store`), not massive `useState` chains.
3.  **UI:** Use the Glass components in `src/components/ui/` to maintain the aesthetic.

## Adding Dependencies

- **Frontend:** `pnpm add <package>`
- **Backend:** `pip install <package>` AND update `api/requirements.txt`.

~ Regis
