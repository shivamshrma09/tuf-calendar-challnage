"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  eachDayOfInterval, isSameMonth, isToday, format,
} from "date-fns";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { MONTH_NAMES, DAY_NAMES } from "@/lib/data";

interface YearViewProps {
  onSelectMonth: (month: number) => void;
}

function MiniCalendar({ month, year }: { month: number; year: number }) {
  const date = new Date(year, month, 1);
  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(date)),
    end: endOfWeek(endOfMonth(date)),
  });

  return (
    <div className="w-full">
      <div className="grid grid-cols-7 mb-1">
        {DAY_NAMES.map((d) => (
          <div key={d} className="text-center text-neutral-600 text-[9px] font-medium py-0.5">
            {d[0]}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-y-0.5">
        {days.map((day) => {
          const inMonth = isSameMonth(day, date);
          const todayDate = isToday(day);
          return (
            <div
              key={day.toISOString()}
              className={`relative text-center text-[10px] py-0.5 rounded-sm font-medium ${
                !inMonth
                  ? "text-neutral-700"
                  : todayDate
                  ? "text-[#FF6500] font-bold"
                  : "text-neutral-300"
              }`}
            >
              {todayDate && inMonth && (
                <span className="absolute inset-0 rounded-sm ring-1 ring-[#FF6500] ring-inset" />
              )}
              {format(day, "d")}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function YearView({ onSelectMonth }: YearViewProps) {
  const [year, setYear] = useState(2026);
  const [direction, setDirection] = useState(0);

  function prevYear() { setDirection(-1); setYear((y) => y - 1); }
  function nextYear() { setDirection(1); setYear((y) => y + 1); }

  return (
    <div className="min-h-screen bg-[#0A0A0A] px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-10"
      >
        <p className="text-neutral-500 text-sm tracking-[0.3em] uppercase mb-2">
          Select a Month
        </p>
        <AnimatePresence mode="wait">
          <motion.h1
            key={year}
            initial={{ opacity: 0, y: direction > 0 ? 20 : -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: direction > 0 ? -20 : 20 }}
            transition={{ duration: 0.25 }}
            className="text-7xl font-black text-[#FF6500] tracking-tight text-center"
          >
            {year}
          </motion.h1>
        </AnimatePresence>
      </motion.div>

      <div className="max-w-5xl mx-auto flex justify-end mb-2 gap-2">
        <button
          onClick={prevYear}
          className="w-8 h-8 rounded-full border border-neutral-800 hover:border-[#FF6500]/50 flex items-center justify-center text-neutral-400 hover:text-[#FF6500] transition-all duration-200"
        >
          <HiChevronLeft size={18} />
        </button>
        <button
          onClick={nextYear}
          className="w-8 h-8 rounded-full border border-neutral-800 hover:border-[#FF6500]/50 flex items-center justify-center text-neutral-400 hover:text-[#FF6500] transition-all duration-200"
        >
          <HiChevronRight size={18} />
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={year}
          initial={{ opacity: 0, x: direction > 0 ? 40 : -40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction > 0 ? -40 : 40 }}
          transition={{ duration: 0.3 }}
          className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3"
        >
          {Array.from({ length: 12 }, (_, i) => i).map((month, i) => (
            <motion.button
              key={month}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.03 }}
              whileHover={{ y: -3, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onSelectMonth(month)}
              className="bg-neutral-950 border border-neutral-800 hover:border-[#FF6500]/40 rounded-xl p-3 text-left cursor-pointer transition-colors duration-200 group"
            >
              <div className="mb-3 pb-2 border-b border-neutral-800 group-hover:border-[#FF6500]/20 transition-colors">
                <h2 className="text-white font-bold text-base leading-tight group-hover:text-[#FF6500] transition-colors duration-200">
                  {MONTH_NAMES[month]}
                </h2>
              </div>
              <MiniCalendar month={month} year={year} />
            </motion.button>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
