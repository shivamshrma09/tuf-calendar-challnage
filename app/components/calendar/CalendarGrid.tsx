"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  eachDayOfInterval, isSameMonth, isToday, isSameDay, format,
} from "date-fns";
import { Task, MonthData, DateRangeState } from "@/types";
import { getFestivalsForDate, getTasksForDate, isInRange, isRangeStart, isRangeEnd } from "@/lib/utils";
import { DAY_NAMES } from "@/lib/data";
import { cn } from "@/lib/cn";

interface CalendarGridProps {
  monthData: MonthData;
  tasks: Task[];
  selectedDate: Date | null;
  rangeState: DateRangeState;
  hoverDate: Date | null;
  onDateClick: (date: Date) => void;
  onDateHover: (date: Date | null) => void;
  direction: number;
}

export default function CalendarGrid({
  monthData, tasks, selectedDate, rangeState, hoverDate, onDateClick, onDateHover, direction,
}: CalendarGridProps) {
  const currentDate = new Date(monthData.year, monthData.month, 1);
  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(currentDate), { weekStartsOn: 1 }),
    end: endOfWeek(endOfMonth(currentDate), { weekStartsOn: 1 }),
  });

  const effectiveEnd = rangeState.selecting && hoverDate ? hoverDate : rangeState.end;

  return (
    <AnimatePresence mode="wait" custom={direction}>
      <motion.div
        key={`${monthData.month}-${monthData.year}`}
        custom={direction}
        variants={{
          enter: (d: number) => ({ x: d > 0 ? 60 : -60, opacity: 0 }),
          center: { x: 0, opacity: 1 },
          exit: (d: number) => ({ x: d > 0 ? -60 : 60, opacity: 0 }),
        }}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{ duration: 0.35, ease: "easeInOut" }}
      >
        <div className="grid grid-cols-7 mb-2">
          {DAY_NAMES.map((d) => (
            <div key={d} className="text-center text-neutral-500 text-xs font-medium py-2 tracking-wider">
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-y-1">
          {days.map((day) => {
            const festivals = getFestivalsForDate(day);
            const dayTasks = getTasksForDate(day, tasks);
            const hasFestival = festivals.length > 0;
            const hasTask = dayTasks.length > 0;
            const inMonth = isSameMonth(day, currentDate);
            const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;
            const isCurrentDay = isToday(day);
            const isStart = isRangeStart(day, rangeState.start);
            const isEnd = isRangeEnd(day, effectiveEnd);
            const inRange = isInRange(day, rangeState.start, effectiveEnd);
            const isRangeOnly = inRange && !isStart && !isEnd;

            return (
              <motion.button
                key={day.toISOString()}
                whileHover={{ scale: inMonth ? 1.08 : 1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => inMonth && onDateClick(day)}
                onMouseEnter={() => onDateHover(day)}
                onMouseLeave={() => onDateHover(null)}
                className={cn(
                  "relative flex flex-col items-center justify-start py-1.5 transition-all duration-150 min-h-[44px] group",
                  !inMonth && "opacity-20 cursor-default",
                  inMonth && "cursor-pointer",
                  isRangeOnly && "rounded-none",
                  isStart && !isEnd && "rounded-l-full rounded-r-none",
                  isEnd && !isStart && "rounded-r-full rounded-l-none",
                  isStart && isEnd && "rounded-full",
                  !isStart && !isEnd && !isRangeOnly && "rounded-full",
                )}
              >
                {inRange && (
                  <div
                    className="absolute inset-y-0 inset-x-0"
                    style={{ backgroundColor: `${monthData.theme.accent}25` }}
                  />
                )}

                <div
                  className={cn(
                    "relative z-10 w-8 h-8 flex items-center justify-center rounded-full text-sm font-semibold transition-all duration-150",
                    !inMonth && "text-neutral-700",
                    inMonth && !isStart && !isEnd && !isSelected && !isCurrentDay && "text-neutral-300 group-hover:text-white group-hover:bg-white/10",
                    isCurrentDay && !isStart && !isEnd && "ring-2 ring-[#FF6500] text-[#FF6500] font-bold",
                    isSelected && !isStart && !isEnd && "bg-white/20 text-white",
                    (isStart || isEnd) && "text-white",
                  )}
                  style={(isStart || isEnd) ? { backgroundColor: monthData.theme.accent } : undefined}
                >
                  {format(day, "d")}
                </div>

                {inMonth && (
                  <div className="relative z-10 flex gap-0.5 mt-0.5">
                    {hasFestival && <span className="w-1.5 h-1.5 rounded-full bg-[#FF6500]" />}
                    {hasTask && <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: monthData.theme.primary }} />}
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>

        <div className="flex items-center gap-4 mt-4 pt-3 border-t border-neutral-800/50">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#FF6500]" />
            <span className="text-neutral-500 text-xs">Festival</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: monthData.theme.primary }} />
            <span className="text-neutral-500 text-xs">Task</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full ring-2 ring-[#FF6500]" />
            <span className="text-neutral-500 text-xs">Today</span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
