# Task Management App

A single-page task management application built with React, TypeScript, and Supabase. Users can create, view, update, and delete tasks — each with a title, description, status, and due date. The interface features a glassmorphism design with summary statistics, task filtering, and overdue highlighting.

## Features

- **Full CRUD** — Create, read, update, and delete tasks through a clean sidebar form.
- **Status workflow** — Tasks move through four stages: _Backlog → In Progress → In Review → Done_.
- **Dashboard stats** — At-a-glance counts for open, in-review, done, and overdue tasks.
- **Filtering** — Quick-toggle between All, Active, and Done views.
- **Overdue detection** — Tasks past their due date (and not marked done) are visually flagged.
- **Optimistic UI** — React Query handles caching, background refetching, and mutation state.
- **Form validation** — Client-side validation powered by Zod schemas with inline error messages.
- **Toast notifications** — Success and error feedback via Sonner.
- **Delete confirmation** — A modal prevents accidental task deletion.

## Tech Stack

| Layer | Technology | Purpose |
| --- | --- | --- |
| **Framework** | [React 19](https://react.dev) | UI component library |
| **Language** | [TypeScript 6](https://www.typescriptlang.org) | Static type safety |
| **Build tool** | [Vite 8](https://vite.dev) | Dev server with HMR and production bundling |
| **Styling** | [Tailwind CSS 4](https://tailwindcss.com) | Utility-first CSS framework |
| **UI primitives** | [shadcn/ui](https://ui.shadcn.com) + [Radix UI](https://www.radix-ui.com) | Accessible, unstyled component primitives |
| **Icons** | [Lucide React](https://lucide.dev) | SVG icon library |
| **Backend / DB** | [Supabase](https://supabase.com) (hosted PostgreSQL) | Database, REST API, and real-time subscriptions |
| **ORM** | [Drizzle ORM](https://orm.drizzle.team) | Type-safe SQL schema definition and migrations |
| **Data fetching** | [TanStack React Query](https://tanstack.com/query) | Server-state management with caching and mutations |
| **Validation** | [Zod](https://zod.dev) | Runtime schema validation for forms and API responses |
| **Notifications** | [Sonner](https://sonner.emilkowal.dev) | Lightweight toast notifications |
| **Package manager** | [pnpm](https://pnpm.io) | Fast, disk-efficient package management |

## Project Structure

```
assessment/
├── public/                     # Static assets
├── src/
│   ├── components/
│   │   ├── ui/                 # Reusable UI primitives (Button, Spinner)
│   │   ├── confirm-modal.tsx   # Delete confirmation dialog
│   │   ├── status-badge.tsx    # Colour-coded status pill
│   │   ├── task-card.tsx       # Task list item
│   │   ├── task-details.tsx    # Selected task detail panel
│   │   └── task-form.tsx       # Create / edit task form
│   ├── db/
│   │   └── schema.ts           # Drizzle ORM table definitions
│   ├── lib/
│   │   ├── task-schema.ts      # Zod schemas and TypeScript types
│   │   └── tasks-api.ts        # Supabase CRUD functions
│   ├── utils/
│   │   └── supabase.ts         # Supabase client initialisation
│   ├── App.tsx                 # Root component (QueryClient + Toaster)
│   ├── TasksPage.tsx           # Main dashboard page
│   ├── main.tsx                # Application entry point
│   ├── App.css                 # Component-level styles
│   └── index.css               # Global styles and design tokens
├── drizzle.config.ts           # Drizzle Kit migration configuration
├── vite.config.ts              # Vite + Tailwind plugin configuration
├── components.json             # shadcn/ui configuration
├── tsconfig.json               # TypeScript project references
└── package.json
```

## Prerequisites

- **Node.js** ≥ 18 (built with v22)
- **pnpm** ≥ 9 — install with `npm install -g pnpm` if you don't have it

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/minast1/task-management-assessment.git
cd task-management-assessment
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Start the development server

```bash
pnpm dev
```

The app will be available at **http://localhost:5173** (or the next available port).

### 4. Build for production (optional)

```bash
pnpm build
pnpm preview     # serve the production build locally
```

## Assumptions & Design Decisions

1. **Single-page app with no routing** — The scope is a single dashboard view, so a client-side router (e.g. React Router) was intentionally omitted to keep the bundle lean. If the app grows to multiple pages, adding a router would be the natural next step.

2. **Supabase as a Backend-as-a-Service** — Rather than building a custom API layer, the app talks directly to Supabase's auto-generated REST API from the client. This dramatically reduces boilerplate while still providing a real PostgreSQL database, row-level security capabilities, and real-time support.

3. **Drizzle ORM for schema definition only** — Drizzle is used to define the database schema and generate migrations (via `drizzle-kit`). Runtime queries go through the Supabase JS client instead of Drizzle's query builder, since the app communicates with Supabase over HTTP rather than a direct database connection.

4. **Client-side validation only** — Form inputs are validated with Zod schemas before being sent to Supabase. I've also enforced proper typings to the data returned from the database using Zod's infer and refined types. This eliminates the need for server-side validation middleware, which is a reasonable trade-off given that Supabase enforces column constraints at the database level.

5. **No authentication** — The app does not implement user login for now. Ideally, tasks should be associated with a particular user, but all tasks are globally visible for now. Adding Supabase Auth and RLS policies would be the recommended approach for a multi-user deployment.


