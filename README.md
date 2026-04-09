# Interactive Wall Calendar 2026

A premium interactive wall calendar built with Next.js, inspired by a physical wall calendar aesthetic. Features date range selection, task management, festival markers, and a fully responsive design.

## Live Demo

> https://tuf-calendar-internship-challnage.vercel.app/

## Preview
> https://youtu.be/p17DKV8BJ00

---

## Features

- **Year View** — All 12 months displayed as mini calendar cards with today highlighted
- **Wall Calendar Aesthetic** — Binding holes, hero image, month name overlay — physical calendar feel
- **Date Range Selection** — Click start date, hover to preview range, click end date. Visual states for start, end, and in-between dates
- **Range Info Bar** — Shows `Mar 5 → Mar 12 · 8 days` when range is selected
- **Festival Markers** — Indian festivals 2026 pre-loaded with orange dot indicators on calendar dates
- **Task Management** — Add, edit, delete tasks per date stored in localStorage
- **Month Notes** — Free-form textarea per month, also persisted in localStorage
- **Notes Panel** — Shows all month tasks collapsed; click a date to see only that day's tasks and festivals
- **Today Highlight** — Orange ring on today's date in both year view and month view
- **Keyboard Navigation** — `←` `→` to navigate months, `ESC` to go back to year view
- **Year Navigation** — Arrow buttons to switch years in year view
- **Responsive Design** — Stacks vertically on mobile, side-by-side on desktop
- **Smooth Animations** — Framer Motion slide transitions for month changes, expand/collapse animations

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| Next.js 15 (App Router) | Framework |
| TypeScript | Type safety |
| Tailwind CSS v4 | Styling |
| Framer Motion | Animations |
| date-fns | Date calculations |
| Lucide React | UI icons |
| React Icons | Additional icons |
| tailwind-merge + clsx | Class merging utility |

---

## Design Decisions

- **Background `#0A0A0A`** — Near black for premium dark feel
- **Accent `#FF6500`** — Orange for headings, today highlight, festival dots
- **Per-month color themes** — Each month has its own primary/accent color that drives range selection highlight and task dots
- **Binding holes bar** — Top bar with circular holes mimics a real wall calendar's spiral binding
- **Monday-first week** — Calendar grid starts on Monday (`weekStartsOn: 1`) as is standard in most calendars
- **localStorage only** — No backend needed; all data persists client-side
- **`cn()` with tailwind-merge** — Prevents conflicting Tailwind class issues

---

## Project Structure

```
tuf-calendar/
├── app/
│   ├── components/
│   │   └── calendar/
│   │       ├── CalendarView.tsx   # Main month view layout
│   │       ├── CalendarGrid.tsx   # Date grid with range selection
│   │       ├── NotesPanel.tsx     # Tasks + notes right panel
│   │       └── YearView.tsx       # Landing year overview
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── lib/
│   ├── data.ts      # Festivals, month themes, constants
│   ├── utils.ts     # Date helpers, localStorage helpers
│   └── cn.ts        # tailwind-merge + clsx utility
└── types/
    └── index.ts     # TypeScript interfaces
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
git clone https://github.com/shivamshrma09/tuf-calendar-challnage

cd tuf-calendar
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
npm run build
npm start
```

---

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `←` | Previous month |
| `→` | Next month |
| `ESC` | Back to year view |
