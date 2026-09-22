import React, { useState } from 'react';
import {
  TrendingUp,
  CheckCircle2,
  Clock,
  Award,
  BookOpen,
  Filter,
  Check,
  AlertCircle,
  BarChart2,
  PieChart,
} from 'lucide-react';
import { Student, Task, StudentGradeRecord } from '../types';
import { calculateSystemStats, calculateStudentStats } from '../utils/storage';

interface ProgressTabProps {
  students: Student[];
  tasks: Task[];
  grades: StudentGradeRecord[];
  selectedStudentId?: string | null;
  onSelectStudentId: (id: string | null) => void;
}

export const ProgressTab: React.FC<ProgressTabProps> = ({
  students,
  tasks,
  grades,
  selectedStudentId,
  onSelectStudentId,
}) => {
  const [selectedClass, setSelectedClass] = useState('all');

  const systemStats = calculateSystemStats(students, tasks, grades, selectedClass);

  // Selected student for detailed drill-down
  const activeStudent = students.find((s) => s.id === selectedStudentId) || students[0];
  const studentStats = activeStudent
    ? calculateStudentStats(activeStudent, tasks, grades)
    : null;

  // Student's tasks list
  const studentTasks = activeStudent
    ? tasks.filter(
        (t) => t.targetClass === 'Tất cả' || t.targetClass === activeStudent.class
      )
    : [];

  const completedStudentTasks = studentTasks.filter((t) => {
    const rec = grades.find((g) => g.studentId === activeStudent?.id && g.taskId === t.id);
    return rec?.status === 'completed';
  });

  const pendingStudentTasks = studentTasks.filter((t) => {
    const rec = grades.find((g) => g.studentId === activeStudent?.id && g.taskId === t.id);
    return rec?.status !== 'completed';
  });

  // Calculate subject completion rates
  const subjectBreakdown: { [subject: string]: { total: number; done: number } } = {};
  tasks.forEach((t) => {
    if (!subjectBreakdown[t.subject]) {
      subjectBreakdown[t.subject] = { total: 0, done: 0 };
    }
    const applicable = students.filter(
      (s) => t.targetClass === 'Tất cả' || s.class === t.targetClass
    );
    subjectBreakdown[t.subject].total += applicable.length;

    applicable.forEach((s) => {
      const g = grades.find((gr) => gr.studentId === s.id && gr.taskId === t.id);
      if (g?.status === 'completed') {
        subjectBreakdown[t.subject].done += 1;
      }
    });
  });

  return (
    <div id="progress-tab-content" className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Header with class filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Theo dõi tiến độ học tập
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Phân tích tỷ lệ nộp bài, điểm số trung bình và chi tiết tiến độ từng học sinh
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-3.5 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
          >
            <option value="all">Toàn bộ các lớp (7A1, 7A2, 8B1)</option>
            <option value="7A1">Lớp 7A1</option>
            <option value="7A2">Lớp 7A2</option>
            <option value="8B1">Lớp 8B1</option>
          </select>
        </div>
      </div>

      {/* Top Statistical Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs text-slate-500 font-medium block">Học sinh</span>
          <span className="text-2xl font-black text-slate-800 mt-1 block">
            {systemStats.totalStudents}
          </span>
          <span className="text-[11px] text-slate-400">Em đang theo học</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs text-slate-500 font-medium block">Nhiệm vụ</span>
          <span className="text-2xl font-black text-slate-800 mt-1 block">
            {systemStats.totalTasks}
          </span>
          <span className="text-[11px] text-slate-400">Đã giao</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs text-slate-500 font-medium block">Đã hoàn thành</span>
          <span className="text-2xl font-black text-emerald-600 mt-1 block">
            {systemStats.totalTasksCompleted}
          </span>
          <span className="text-[11px] text-emerald-600/80">Lượt nộp bài</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs text-slate-500 font-medium block">Chưa hoàn thành</span>
          <span className="text-2xl font-black text-amber-600 mt-1 block">
            {systemStats.totalTasksNotCompleted}
          </span>
          <span className="text-[11px] text-amber-600/80">Cần tiếp tục làm</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs text-slate-500 font-medium block">Tỷ lệ hoàn thành</span>
          <span className="text-2xl font-black text-teal-700 mt-1 block">
            {systemStats.overallCompletionRate}%
          </span>
          <span className="text-[11px] text-teal-600/80">Tiến độ chung</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs text-slate-500 font-medium block">Điểm trung bình</span>
          <span className="text-2xl font-black text-blue-700 mt-1 block">
            {systemStats.averageScore > 0 ? systemStats.averageScore.toFixed(1) : '--'}
          </span>
          <span className="text-[11px] text-blue-600/80">Thang điểm 10</span>
        </div>
      </div>

      {/* Visual Chart: Subject Breakdown & Overall Gauge */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SVG Progress Gauge & Overall Bar Chart */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <PieChart className="w-4 h-4 text-teal-600" />
                Vòng tròn tiến độ chung
              </h3>
              <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full">
                {systemStats.overallCompletionRate}%
              </span>
            </div>

            {/* Circular Progress Gauge */}
            <div className="flex flex-col items-center justify-center my-4">
              <div className="relative w-44 h-44 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-slate-100"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={2 * Math.PI * 40}
                    strokeDashoffset={
                      2 * Math.PI * 40 * (1 - systemStats.overallCompletionRate / 100)
                    }
                    strokeLinecap="round"
                    className="text-teal-600 transition-all duration-700"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="text-3xl font-black text-slate-900">
                    {systemStats.overallCompletionRate}%
                  </span>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Đã hoàn thành
                  </span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600 leading-relaxed border border-slate-100 mt-2">
              Lớp đang duy trì tiến độ nộp bài ổn định. Các nhiệm vụ môn Khoa học tự nhiên và Tin học có tỷ lệ hoàn thành cao nhất.
            </div>
          </div>
        </div>

        {/* Bar chart per subject */}
        <div className="lg:col-span-2 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-blue-600" />
                Tiến độ hoàn thành theo từng bộ môn
              </h3>
              <span className="text-xs text-slate-400">Tỷ lệ bài nộp</span>
            </div>

            <div className="space-y-4">
              {Object.entries(subjectBreakdown).map(([subject, data]) => {
                const rate = data.total > 0 ? Math.round((data.done / data.total) * 100) : 0;
                return (
                  <div key={subject}>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-bold text-slate-700 flex items-center gap-2">
                        <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                        {subject}
                      </span>
                      <span className="font-bold text-slate-700">
                        {rate}% ({data.done}/{data.total} bài)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${rate}%` }}
                        className={`h-full rounded-full transition-all duration-500 ${
                          rate >= 80
                            ? 'bg-emerald-500'
                            : rate >= 60
                            ? 'bg-blue-600'
                            : rate >= 40
                            ? 'bg-amber-500'
                            : 'bg-rose-500'
                        }`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
            <span>Xanh lá: ≥ 80%</span>
            <span>Xanh dương: 60 - 79%</span>
            <span>Vàng: 40 - 59%</span>
            <span>Đỏ: &lt; 40%</span>
          </div>
        </div>
      </div>

      {/* Detailed Student Drill-Down */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-teal-600" />
              Chi tiết tiến độ học tập từng học sinh
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Bấm chọn học sinh bên dưới để kiểm tra toàn bộ nhiệm vụ đã nộp, điểm số và nhận xét
            </p>
          </div>

          {/* Quick student picker */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600 shrink-0">Chọn học sinh:</span>
            <select
              value={activeStudent?.id || ''}
              onChange={(e) => onSelectStudentId(e.target.value)}
              className="px-3.5 py-2 text-xs font-bold bg-blue-50 border border-blue-200 rounded-xl text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
            >
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} - Lớp {s.class} ({s.code})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Selected Student Banner */}
        {activeStudent && studentStats && (
          <div className="space-y-6">
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-50 to-blue-50/50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-base shadow-sm">
                  {activeStudent.name
                    .split(' ')
                    .map((n) => n[0])
                    .slice(-2)
                    .join('')}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-bold text-slate-900">{activeStudent.name}</h4>
                    <span className="px-2 py-0.5 text-xs font-bold bg-blue-100 text-blue-800 rounded-md">
                      {activeStudent.class}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">({activeStudent.code})</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Trạng thái: <strong>{activeStudent.status}</strong> • Ghi chú: {activeStudent.notes || 'Bình thường'}
                  </p>
                </div>
              </div>

              {/* Student quick metrics */}
              <div className="flex items-center gap-4 text-xs">
                <div className="text-center px-3 py-1.5 bg-white rounded-xl border border-slate-200">
                  <span className="text-slate-400 block text-[10px]">Tỷ lệ hoàn thành</span>
                  <span className="text-base font-black text-teal-700">
                    {studentStats.completionRate}%
                  </span>
                </div>
                <div className="text-center px-3 py-1.5 bg-white rounded-xl border border-slate-200">
                  <span className="text-slate-400 block text-[10px]">Điểm trung bình</span>
                  <span className="text-base font-black text-blue-700">
                    {studentStats.averageScore !== null ? studentStats.averageScore : '--'}
                  </span>
                </div>
              </div>
            </div>

            {/* Two Column Task Lists: Completed vs Uncompleted */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Completed Tasks */}
              <div className="border border-emerald-200 bg-emerald-50/20 rounded-2xl p-4 sm:p-5">
                <div className="flex items-center justify-between mb-3.5">
                  <h5 className="font-bold text-emerald-900 text-sm flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Nhiệm vụ đã hoàn thành ({completedStudentTasks.length})
                  </h5>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    Đạt
                  </span>
                </div>

                {completedStudentTasks.length === 0 ? (
                  <p className="text-xs text-slate-400 py-4 text-center italic">
                    Chưa có nhiệm vụ nào được đánh dấu hoàn thành.
                  </p>
                ) : (
                  <div className="space-y-2.5">
                    {completedStudentTasks.map((t) => {
                      const gradeRecord = grades.find(
                        (g) => g.studentId === activeStudent.id && g.taskId === t.id
                      );

                      return (
                        <div
                          key={t.id}
                          className="bg-white p-3.5 rounded-xl border border-emerald-200/80 shadow-xs"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <span className="text-[10px] font-bold px-1.5 py-0.2 bg-emerald-50 text-emerald-700 rounded border border-emerald-100">
                                {t.subject}
                              </span>
                              <h6 className="font-bold text-slate-900 text-xs mt-1">{t.title}</h6>
                            </div>
                            <div className="text-right shrink-0">
                              <span className="text-sm font-extrabold text-blue-700">
                                {gradeRecord?.score !== null && gradeRecord?.score !== undefined
                                  ? `${gradeRecord.score}đ`
                                  : 'Đã nộp'}
                              </span>
                              <span className="text-[10px] text-slate-400 block">
                                / {t.maxScore}đ
                              </span>
                            </div>
                          </div>

                          {gradeRecord?.feedback && (
                            <p className="text-[11px] text-slate-600 mt-2 pt-2 border-t border-slate-100 italic bg-slate-50/50 p-1.5 rounded">
                              Nhận xét: "{gradeRecord.feedback}"
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Uncompleted / Pending Tasks */}
              <div className="border border-amber-200 bg-amber-50/20 rounded-2xl p-4 sm:p-5">
                <div className="flex items-center justify-between mb-3.5">
                  <h5 className="font-bold text-amber-900 text-sm flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-600" />
                    Nhiệm vụ chưa hoàn thành ({pendingStudentTasks.length})
                  </h5>
                  <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                    Cần nộp
                  </span>
                </div>

                {pendingStudentTasks.length === 0 ? (
                  <div className="p-6 text-center text-xs text-emerald-700 bg-emerald-50 rounded-xl font-medium">
                    Xuất sắc! Học sinh đã hoàn thành tất cả nhiệm vụ được giao.
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {pendingStudentTasks.map((t) => {
                      const gradeRecord = grades.find(
                        (g) => g.studentId === activeStudent.id && g.taskId === t.id
                      );
                      const isOverdue =
                        new Date(t.dueDate).getTime() < new Date().setHours(0, 0, 0, 0);

                      return (
                        <div
                          key={t.id}
                          className={`bg-white p-3.5 rounded-xl border shadow-xs ${
                            isOverdue ? 'border-rose-200' : 'border-amber-200/80'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-[10px] font-bold px-1.5 py-0.2 bg-slate-100 text-slate-700 rounded">
                                  {t.subject}
                                </span>
                                {isOverdue && (
                                  <span className="text-[10px] font-bold px-1.5 py-0.2 bg-rose-100 text-rose-700 rounded">
                                    Quá hạn
                                  </span>
                                )}
                              </div>
                              <h6 className="font-bold text-slate-900 text-xs mt-1">{t.title}</h6>
                            </div>
                            <span className="text-xs font-medium text-slate-500 shrink-0">
                              Hạn: {t.dueDate}
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-100">
                            <span>
                              Trạng thái: <strong>{gradeRecord?.status === 'in_progress' ? 'Đang thực hiện' : 'Chưa nộp'}</strong>
                            </span>
                            <span>Điểm tối đa: {t.maxScore}đ</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
