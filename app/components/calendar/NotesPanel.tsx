"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { MdCelebration } from "react-icons/md";
import { Plus, X, Pencil, Trash2, Check, ChevronDown, ChevronUp } from "lucide-react";
import { Task, MonthData, DateRangeState } from "@/types";
import { getFestivalsForDate, generateId, loadNotes, saveNotes } from "@/lib/utils";
import { MONTH_NAMES } from "@/lib/data";

interface NotesPanelProps {
  monthData: MonthData;
  tasks: Task[];
  selectedDate: Date | null;
  rangeState: DateRangeState;
  onTasksChange: (tasks: Task[]) => void;
}

export default function NotesPanel({ monthData, tasks, selectedDate, rangeState, onTasksChange }: NotesPanelProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [addDate, setAddDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [expandedDates, setExpandedDates] = useState<Record<string, boolean>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});

  const noteKey = `${monthData.year}-${monthData.month}`;

  useEffect(() => { setNotes(loadNotes()); }, []);

  function handleNoteChange(value: string) {
    const updated = { ...notes, [noteKey]: value };
    setNotes(updated);
    saveNotes(updated);
  }

  function toggleExpand(dateKey: string) {
    setExpandedDates((prev) => ({ ...prev, [dateKey]: !prev[dateKey] }));
  }

  const monthTasks = tasks.filter((t) => {
    const d = new Date(t.date);
    return d.getMonth() === monthData.month && d.getFullYear() === monthData.year;
  });

  const grouped: Record<string, Task[]> = {};
  monthTasks.forEach((t) => {
    if (!grouped[t.date]) grouped[t.date] = [];
    grouped[t.date].push(t);
  });
  const sortedDates = Object.keys(grouped).sort();

  const selectedKey = selectedDate ? format(selectedDate, "yyyy-MM-dd") : null;
  const displayDates = selectedKey ? (grouped[selectedKey] ? [selectedKey] : []) : sortedDates;
  const selectedFestivals = selectedDate ? getFestivalsForDate(selectedDate) : [];

  function handleAdd() {
    if (!newTitle.trim()) return;
    onTasksChange([...tasks, { id: generateId(), date: addDate, title: newTitle.trim(), description: newDesc.trim() || undefined }]);
    setNewTitle(""); setNewDesc(""); setShowAddForm(false);
  }

  function handleDelete(id: string) {
    onTasksChange(tasks.filter((t) => t.id !== id));
  }

  function handleEditSave(id: string) {
    onTasksChange(tasks.map((t) => t.id === id ? { ...t, title: editTitle, description: editDesc || undefined } : t));
    setEditingId(null);
  }

  return (
    <div className="flex flex-col h-full gap-4">
      <div>
        <p className="text-neutral-500 text-xs tracking-wider uppercase mb-1.5">
          {MONTH_NAMES[monthData.month]} Notes
        </p>
        <textarea
          value={notes[noteKey] || ""}
          onChange={(e) => handleNoteChange(e.target.value)}
          placeholder="Jot down anything for this month..."
          rows={3}
          className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-white text-xs placeholder-neutral-600 focus:outline-none focus:border-neutral-600 resize-none transition-colors"
        />
      </div>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-white font-bold text-base">
            {selectedDate ? format(selectedDate, "d MMM") : MONTH_NAMES[monthData.month]}
          </h3>
          <p className="text-neutral-500 text-xs mt-0.5">
            {rangeState.start && rangeState.end
              ? "Range Selected"
              : selectedDate
              ? "Selected Day"
              : "All Tasks"}
          </p>
        </div>
        <button
          onClick={() => { setShowAddForm(true); if (selectedDate) setAddDate(format(selectedDate, "yyyy-MM-dd")); }}
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full hover:opacity-80 transition-opacity"
          style={{ backgroundColor: monthData.theme.accent, color: "#fff" }}
        >
          <Plus size={13} /> Add Task
        </button>
      </div>
      <AnimatePresence>
        {showAddForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <div className="bg-neutral-900 border border-neutral-700/50 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-white text-sm font-semibold">New Task</span>
                <button onClick={() => setShowAddForm(false)} className="text-neutral-500 hover:text-white"><X size={14} /></button>
              </div>
              <input type="date" value={addDate} onChange={(e) => setAddDate(e.target.value)}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-neutral-500" />
              <input type="text" placeholder="Task title..." value={newTitle} onChange={(e) => setNewTitle(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-white text-sm placeholder-neutral-500 focus:outline-none focus:border-neutral-500" />
              <textarea placeholder="Description (optional)..." value={newDesc} onChange={(e) => setNewDesc(e.target.value)} rows={2}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-white text-sm placeholder-neutral-500 focus:outline-none focus:border-neutral-500 resize-none" />
              <button onClick={handleAdd} className="w-full py-2 rounded-lg text-white text-sm font-semibold hover:opacity-80 transition-opacity"
                style={{ backgroundColor: monthData.theme.accent }}>Save Task</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-thin">

        {selectedDate && selectedFestivals.map((f) => (
          <motion.div key={f.name} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className="rounded-sm border border-[#FF6500]/20 px-3 py-2.5 flex items-center gap-3">
            <MdCelebration size={18} className="text-[#FF6500] flex-shrink-0" />
            <div>
              <p className="text-[#FF6500] text-sm font-semibold">{f.name}</p>
              <p className="text-neutral-500 text-xs">Festival</p>
            </div>
          </motion.div>
        ))}

        {displayDates.length === 0 && selectedFestivals.length === 0 && (
          <div className="text-center py-8">
            <p className="text-neutral-600 text-sm">{selectedDate ? "No tasks on this day" : "No tasks this month"}</p>
            <p className="text-neutral-700 text-xs mt-1">Click "Add Task" to get started</p>
          </div>
        )}

        {displayDates.map((dateKey, i) => {
          const d = new Date(dateKey + "T00:00:00");
          const dateTasks = grouped[dateKey];
          const isSelectedDay = selectedKey === dateKey;
          const isExpanded = !!expandedDates[dateKey];

          return (
            <motion.div key={dateKey} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              className="rounded-sm border overflow-hidden"
              style={{ borderColor: isSelectedDay ? `${monthData.theme.accent}60` : "#262626" }}
            >
              <button onClick={() => toggleExpand(dateKey)}
                className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-neutral-900/50 transition-colors">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{ backgroundColor: isSelectedDay ? monthData.theme.accent : "#1a1a1a", color: isSelectedDay ? "#fff" : "#a3a3a3" }}>
                    {format(d, "d")}
                  </div>
                  <div className="text-left">
                    <p className="text-white text-xs font-medium">{format(d, "EEE, MMM d")}</p>
                    <p className="text-neutral-500 text-xs">{dateTasks.length} task{dateTasks.length > 1 ? "s" : ""}</p>
                  </div>
                </div>
                {isExpanded ? <ChevronUp size={14} className="text-neutral-500 flex-shrink-0" /> : <ChevronDown size={14} className="text-neutral-500 flex-shrink-0" />}
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                    <div className="px-3 pb-3 pt-1 space-y-2 border-t border-neutral-800/50">
                      {dateTasks.map((t) => (
                        <div key={t.id} className="flex items-start gap-2 group">
                          <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: monthData.theme.primary }} />
                          <div className="flex-1 min-w-0">
                            {editingId === t.id ? (
                              <div className="space-y-1.5">
                                <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)}
                                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-2 py-1 text-white text-xs focus:outline-none" />
                                <input value={editDesc} onChange={(e) => setEditDesc(e.target.value)} placeholder="Description..."
                                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-2 py-1 text-white text-xs focus:outline-none" />
                                <div className="flex gap-1">
                                  <button onClick={() => handleEditSave(t.id)} className="text-green-400 hover:text-green-300"><Check size={12} /></button>
                                  <button onClick={() => setEditingId(null)} className="text-neutral-500 hover:text-white"><X size={12} /></button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <p className="text-neutral-300 text-xs font-medium">{t.title}</p>
                                {t.description && <p className="text-neutral-600 text-xs mt-0.5">{t.description}</p>}
                              </>
                            )}
                          </div>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                            <button onClick={() => { setEditingId(t.id); setEditTitle(t.title); setEditDesc(t.description || ""); }}
                              className="text-neutral-600 hover:text-white"><Pencil size={11} /></button>
                            <button onClick={() => handleDelete(t.id)} className="text-neutral-600 hover:text-red-400"><Trash2 size={11} /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

