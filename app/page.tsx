"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import YearView from "./components/calendar/YearView";
import CalendarView from "./components/calendar/CalendarView";

export default function Home() {
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);

  return (
    <AnimatePresence mode="wait">
      {selectedMonth === null ? (
        <motion.div
          key="year"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.3 }}
        >
          <YearView onSelectMonth={setSelectedMonth} />
        </motion.div>
      ) : (
        <motion.div
          key="month"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <CalendarView
            initialMonth={selectedMonth}
            onYearView={() => setSelectedMonth(null)}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
