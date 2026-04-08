import { format, isSameDay, isWithinInterval, startOfDay } from "date-fns";
import { Festival, Task } from "@/types";
import { INDIAN_FESTIVALS_2026 } from "./data";

export function formatDateKey(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

export function getFestivalsForDate(date: Date): Festival[] {
  const key = formatDateKey(date);
  return INDIAN_FESTIVALS_2026.filter((f) => f.date === key);
}

export function getTasksForDate(date: Date, tasks: Task[]): Task[] {
  const key = formatDateKey(date);
  return tasks.filter((t) => t.date === key);
}

export function isInRange(date: Date, start: Date | null, end: Date | null): boolean {
  if (!start || !end) return false;
  const s = startOfDay(start);
  const e = startOfDay(end);
  const d = startOfDay(date);
  if (s > e) return isWithinInterval(d, { start: e, end: s });
  return isWithinInterval(d, { start: s, end: e });
}

export function isRangeStart(date: Date, start: Date | null): boolean {
  if (!start) return false;
  return isSameDay(date, start);
}

export function isRangeEnd(date: Date, end: Date | null): boolean {
  if (!end) return false;
  return isSameDay(date, end);
}

export function loadTasks(): Task[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem("calendar-tasks") || "[]");
  } catch {
    return [];
  }
}

export function saveTasks(tasks: Task[]): void {
  localStorage.setItem("calendar-tasks", JSON.stringify(tasks));
}

export function loadNotes(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem("calendar-notes") || "{}");
  } catch {
    return {};
  }
}

export function saveNotes(notes: Record<string, string>): void {
  localStorage.setItem("calendar-notes", JSON.stringify(notes));
}

export function generateId(): string {
  return Math.random().toString(36).slice(2, 9);
}
