"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { format, differenceInDays } from "date-fns";
import { Task, MonthData, DateRangeState } from "@/types";
import { MONTH_DATA, MONTH_NAMES } from "@/lib/data";
import { loadTasks, saveTasks } from "@/lib/utils";
import CalendarGrid from "./CalendarGrid";
import NotesPanel from "./NotesPanel";
import { HiChevronLeft, HiChevronRight, HiCalendar } from "react-icons/hi";

interface CalendarViewProps {
  initialMonth: number;
  onYearView: () => void;
}

export default function CalendarView({ initialMonth, onYearView }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(initialMonth);
  const [direction, setDirection] = useState(1);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [rangeState, setRangeState] = useState<DateRangeState>({ start: null, end: null, selecting: false });

  const monthData: MonthData = MONTH_DATA[currentMonth];

  useEffect(() => { setTasks(loadTasks()); }, []);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") {
        setDirection(-1);
        setCurrentMonth((m) => (m === 0 ? 11 : m - 1));
        setSelectedDate(null);
        setRangeState({ start: null, end: null, selecting: false });
      }
      if (e.key === "ArrowRight") {
        setDirection(1);
        setCurrentMonth((m) => (m === 11 ? 0 : m + 1));
        setSelectedDate(null);
        setRangeState({ start: null, end: null, selecting: false });
      }
      if (e.key === "Escape") onYearView();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onYearView]);

  function goToPrev() {
    setDirection(-1);
    setCurrentMonth((m) => (m === 0 ? 11 : m - 1));
    setSelectedDate(null);
    setRangeState({ start: null, end: null, selecting: false });
  }

  function goToNext() {
    setDirection(1);
    setCurrentMonth((m) => (m === 11 ? 0 : m + 1));
    setSelectedDate(null);
    setRangeState({ start: null, end: null, selecting: false });
  }

  function handleDateClick(date: Date) {
    if (!rangeState.selecting || !rangeState.start) {
      setRangeState({ start: date, end: null, selecting: true });
      setSelectedDate(date);
    } else {
      const sorted = date < rangeState.start
        ? { start: date, end: rangeState.start }
        : { start: rangeState.start, end: date };
      setRangeState({ ...sorted, selecting: false });
      setSelectedDate(date);
    }
  }

  function clearRange() {
    setRangeState({ start: null, end: null, selecting: false });
    setSelectedDate(null);
  }

  function handleTasksChange(updated: Task[]) {
    setTasks(updated);
    saveTasks(updated);
  }

  const rangeDays = rangeState.start && rangeState.end
    ? differenceInDays(rangeState.end, rangeState.start) + 1
    : null;

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-start justify-center p-4 md:p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl"
      >
        <div className="rounded-2xl overflow-hidden shadow-2xl shadow-black/70 border border-neutral-800/60" style={{ background: "#111111" }}>

          <div className="relative flex items-center justify-center gap-10 py-3 bg-neutral-900 border-b border-neutral-800">
            <button onClick={onYearView}
              className="absolute left-4 flex items-center gap-1.5 text-neutral-500 hover:text-[#FF6500] text-xs tracking-widest uppercase transition-colors duration-200">
              <HiCalendar size={14} /> 2026
            </button>
            {[...Array(7)].map((_, i) => (
              <div key={i} className="w-5 h-5 rounded-full bg-[#0A0A0A] border border-neutral-700 shadow-inner" />
            ))}
            <div className="absolute right-4 flex gap-2">
              <button onClick={goToPrev}
                className="w-7 h-7 rounded-full border border-neutral-700 hover:border-[#FF6500]/50 flex items-center justify-center text-neutral-400 hover:text-[#FF6500] transition-all">
                <HiChevronLeft size={16} />
              </button>
              <button onClick={goToNext}
                className="w-7 h-7 rounded-full border border-neutral-700 hover:border-[#FF6500]/50 flex items-center justify-center text-neutral-400 hover:text-[#FF6500] transition-all">
                <HiChevronRight size={16} />
              </button>
            </div>
          </div>

          <div className="relative w-full h-56 sm:h-64 md:h-72 overflow-hidden">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={monthData.month}
                custom={direction}
                variants={{
                  enter: (d: number) => ({ x: d > 0 ? "100%" : "-100%", opacity: 0 }),
                  center: { x: 0, opacity: 1 },
                  exit: (d: number) => ({ x: d > 0 ? "-100%" : "100%", opacity: 0 }),
                }}
                initial="enter" animate="center" exit="exit"
                transition={{ duration: 0.45, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                <Image src={monthData.image} alt={MONTH_NAMES[monthData.month]} fill className="object-cover hidden md:block" priority sizes="100vw" />
                <Image src="https://ik.imagekit.io/qwzhnpeqg/Screenshot%202026-04-09%20013653.png" alt={MONTH_NAMES[monthData.month]} fill className="object-cover block md:hidden" sizes="100vw" />
                <div className={`absolute inset-0 bg-gradient-to-b ${monthData.theme.gradient} opacity-60`} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent" />
              </motion.div>
            </AnimatePresence>

            <div className="absolute bottom-4 left-6 z-10">
              <AnimatePresence mode="wait">
                <motion.div key={monthData.month} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}>
                  <p className="text-neutral-400 text-xs tracking-[0.3em] uppercase font-medium">2026</p>
                  <h2 className="text-5xl md:text-6xl font-black tracking-tight leading-none mt-0.5" style={{ color: monthData.theme.primary }}>
                    {MONTH_NAMES[monthData.month]}
                  </h2>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <AnimatePresence>
            {rangeState.start && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden border-b border-neutral-800"
              >
                <div className="flex items-center justify-between px-5 py-2">
                  <p className="text-xs" style={{ color: monthData.theme.primary }}>
                    {rangeState.selecting
                      ? `From ${format(rangeState.start, "MMM d")} — select end date`
                      : rangeState.end
                      ? `${format(rangeState.start, "MMM d")} → ${format(rangeState.end, "MMM d")} · ${rangeDays} day${rangeDays !== 1 ? "s" : ""}`
                      : `${format(rangeState.start, "MMM d")} selected`}
                  </p>
                  <button onClick={clearRange} className="text-neutral-600 hover:text-white text-xs transition-colors">
                    Clear
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex flex-col lg:flex-row border-t-2 border-neutral-800">
            <div className="flex-1 p-5 md:p-7 border-b lg:border-b-0 lg:border-r border-neutral-800">
              <CalendarGrid
                monthData={monthData}
                tasks={tasks}
                selectedDate={selectedDate}
                rangeState={rangeState}
                hoverDate={hoverDate}
                onDateClick={handleDateClick}
                onDateHover={setHoverDate}
                direction={direction}
              />
            </div>
            <div className="w-full lg:w-72 xl:w-80 p-5 md:p-6 overflow-y-auto max-h-[480px] lg:max-h-none bg-neutral-950/50">
              <NotesPanel
                monthData={monthData}
                tasks={tasks}
                selectedDate={selectedDate}
                rangeState={rangeState}
                onTasksChange={handleTasksChange}
              />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

