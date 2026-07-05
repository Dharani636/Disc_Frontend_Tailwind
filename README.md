# Seminar Admin — Tailwind Edition

Same functionality as the original app (React + TypeScript + Axios + React Router),
fully restyled from inline styles / plain CSS to **Tailwind CSS**, with a
professional admin-dashboard look and consistent design tokens.

## What changed
- All inline `style={{ ... }}` and the old `App.css`/global stylesheet were
  replaced with Tailwind utility classes.
- Introduced a small set of reusable component classes in `src/index.css`
  (`.field`, `.btn-primary`, `.btn-soft`, `.card`, `.table-shell`, `.th-cell`,
  `.td-cell`) so every master page (Batch, Semester, Specialization, Job,
  DISC Activities) shares one consistent look.
- Custom Tailwind theme (`tailwind.config.js`) with:
  - `ink` — dark sidebar shades
  - `brand` — primary indigo accent (buttons, active nav, links)
  - `disc` — dedicated D/I/S/C data-visualization colors, kept separate from
    the UI accent color so charts stay legible regardless of theme changes
- No logic, API calls, routes, or state management were changed — this is a
  pure presentation-layer upgrade.

## Project structure
```
seminar-admin/
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
└── src/
    ├── main.tsx                 # React root
    ├── App.tsx                  # Renders <AppRoutes />
    ├── index.css                # Tailwind directives + shared component classes
    ├── api/
    │   ├── api.ts                # Axios instance w/ JWT interceptor (admin routes)
    │   └── Publicapi.ts          # Axios instance for public/student routes
    ├── components/
    │   ├── Layout.tsx            # Sidebar + Navbar + content shell
    │   ├── Sidebar.tsx           # Left nav with icons & active-route styling
    │   └── Navbar.tsx            # Top bar with logged-in admin + logout
    ├── routes/
    │   ├── AppRoutes.tsx         # All app routes
    │   └── ProtectedRoute.tsx    # Redirects to "/" if not logged in
    ├── types/
    │   ├── Student.ts
    │   ├── Batch.ts
    │   ├── Semester.ts
    │   ├── Specialization.ts
    │   └── JobPreferred.ts
    └── pages/
        ├── Login.tsx             # Admin login
        ├── Dashboard.tsx         # Summary cards
        ├── Students.tsx          # Student CRUD, DISC scores, promote/edit/delete
        ├── Batch.tsx             # Batch master (CRUD)
        ├── Semesters.tsx         # Semester master (CRUD)
        ├── Specializations.tsx   # Specialization master (CRUD)
        ├── JobPreferred.tsx      # Job preference master (CRUD)
        ├── DISCActivities.tsx    # D/I/S/C tabbed activity master
        ├── Analytics.tsx         # Per-student DISC donut charts across semesters
        └── StudentView.tsx       # Public student-facing results portal
```

## Getting started
```bash
npm install
npm run dev       # http://localhost:5173
```

Make sure your backend API is running at `http://localhost:8080`
(see `src/api/api.ts` / `src/api/Publicapi.ts` for the base URL — update
it there if your backend runs elsewhere).

## Build
```bash
npm run build
npm run preview
```
