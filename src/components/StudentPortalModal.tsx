import React, { useState } from 'react';
import {
  X,
  GraduationCap,
  CheckCircle2,
  Clock,
  Award,
  BookOpen,
  Calendar,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { Student, Task, StudentGradeRecord, Notice } from '../types';
import { calculateStudentStats } from '../utils/storage';

interface StudentPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
  tasks: Task[];
  grades: StudentGradeRecord[];
  notices: Notice[];
  onToggleSubmission: (studentId: string, taskId: string) => void;
}

export const StudentPortalModal: React.FC<StudentPortalModalProps> = ({
  isOpen,
  onClose,
  students,
  tasks,
  grades,
  notices,
  onToggleSubmission,
}) => {
  const [activeStudentId, setActiveStudentId] = useState<string>(students[0]?.id || '');

  if (!isOpen) return null;

  const currentStudent = students.find((s) => s.id === activeStudentId) || students[0];
  const stats = currentStudent ? calculateStudentStats(currentStudent, tasks, grades) : null;

  // Tasks applicable to this student
  const applicableTasks = currentStudent
    ? tasks.filter((t) => t.targetClass === 'Tất cả' || t.targetClass === currentStudent.class)
    : [];

  // Notices for this student
  const relevantNotices = currentStudent
    ? notices.filter(
        (n) =>
          n.recipient === 'Toàn bộ học sinh' ||
          n.recipient === 'Toàn trường' ||
          n.recipient === `Lớp ${currentStudent.class}`
      )
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div
        id="student-portal-dialog"
        className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-100 flex flex-col"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-teal-700 via-teal-600 to-blue-700 text-white p-5 sm:p-6 rounded-t-3xl flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center text-white shrink-0">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-teal-200">
                THCS Phan Bội Châu • Góc Học Tập Của Em
              </span>
              <h2 className="text-lg sm:text-xl font-black leading-tight">
                Không gian học tập học sinh
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition cursor-pointer"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-6">
          {/* Student Selector Switcher */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700">Chọn tài khoản học sinh:</span>
              <select
                value={activeStudentId}
                onChange={(e) => setActiveStudentId(e.target.value)}
                className="px-3 py-1.5 text-xs font-bold bg-white border border-slate-300 rounded-xl text-slate-800 shadow-xs focus:outline-none cursor-pointer"
              >
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} - Lớp {s.class} ({s.code})
                  </option>
                ))}
              </select>
            </div>

            <span className="text-xs text-slate-500">
              GV phụ trách: <strong className="text-blue-700">Thầy Nguyễn Quang Kiên</strong>
            </span>
          </div>

          {/* Student Banner with Stats */}
          {currentStudent && stats && (
            <div className="p-5 rounded-2xl bg-gradient-to-br from-teal-50 to-blue-50 border border-teal-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-slate-900">{currentStudent.name}</h3>
                  <span className="px-2 py-0.5 text-xs font-bold bg-teal-600 text-white rounded-md">
                    Lớp {currentStudent.class}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  Mã số: <strong>{currentStudent.code}</strong> • Trạng thái: {currentStudent.status}
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs">
                <div className="bg-white px-3.5 py-2 rounded-xl border border-slate-200 text-center">
                  <span className="text-slate-400 block text-[10px]">Đã hoàn thành</span>
                  <span className="text-base font-black text-teal-700">
                    {stats.completedCount}/{stats.totalAssigned} bài
                  </span>
                </div>

                <div className="bg-white px-3.5 py-2 rounded-xl border border-slate-200 text-center">
                  <span className="text-slate-400 block text-[10px]">Điểm trung bình</span>
                  <span className="text-base font-black text-blue-700">
                    {stats.averageScore !== null ? `${stats.averageScore}đ` : '--'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Progress bar */}
          {stats && (
            <div>
              <div className="flex items-center justify-between text-xs text-slate-600 mb-1.5">
                <span>Tiến độ hoàn thành nhiệm vụ</span>
                <span className="font-extrabold text-teal-700">{stats.completionRate}%</span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div
                  style={{ width: `${stats.completionRate}%` }}
                  className="bg-teal-600 h-full rounded-full transition-all duration-500"
                />
              </div>
            </div>
          )}

          {/* Assignments List */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-teal-600" />
              Danh sách bài tập và nhiệm vụ của em
            </h4>

            <div className="space-y-3">
              {applicableTasks.map((task) => {
                const gradeRecord = grades.find(
                  (g) => g.studentId === currentStudent?.id && g.taskId === task.id
                );
                const isCompleted = gradeRecord?.status === 'completed';
                const hasScore = gradeRecord?.score !== null && gradeRecord?.score !== undefined;

                return (
                  <div
                    key={task.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      isCompleted
                        ? 'bg-emerald-50/30 border-emerald-200'
                        : 'bg-white border-slate-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md">
                            {task.subject}
                          </span>
                          <span className="text-xs text-slate-500 flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            Hạn: {task.dueDate}
                          </span>
                        </div>
                        <h5 className="font-bold text-slate-900 text-sm">{task.title}</h5>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed bg-slate-50 p-2 rounded-lg">
                          {task.content}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        {hasScore ? (
                          <div className="text-center p-2 bg-blue-50 border border-blue-200 rounded-xl">
                            <span className="text-[10px] text-blue-700 font-bold block">
                              Điểm của em
                            </span>
                            <span className="text-lg font-black text-blue-700">
                              {gradeRecord.score}đ
                            </span>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() =>
                              currentStudent && onToggleSubmission(currentStudent.id, task.id)
                            }
                            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
                              isCompleted
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-teal-600 hover:bg-teal-700 text-white shadow-xs'
                            }`}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>{isCompleted ? 'Đã nộp bài' : 'Đánh dấu đã nộp'}</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {gradeRecord?.feedback && (
                      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-start gap-2 text-xs text-slate-700">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                        <span>
                          <strong>Nhận xét từ thầy Kiên:</strong> "{gradeRecord.feedback}"
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Student Notices */}
          {relevantNotices.length > 0 && (
            <div className="pt-4 border-t border-slate-100">
              <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-blue-600" />
                Thông báo lớp học dành cho em
              </h4>
              <div className="space-y-2.5">
                {relevantNotices.map((n) => (
                  <div
                    key={n.id}
                    className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs"
                  >
                    <div className="flex items-center justify-between font-bold text-slate-800 mb-1">
                      <span>{n.title}</span>
                      <span className="text-[11px] text-slate-400 font-normal">{n.date}</span>
                    </div>
                    <p className="text-slate-600 leading-relaxed">{n.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 rounded-b-3xl flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-sm font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition cursor-pointer"
          >
            Đóng giao diện học sinh
          </button>
        </div>
      </div>
    </div>
  );
};
