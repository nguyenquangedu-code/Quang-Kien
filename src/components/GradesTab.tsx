import React, { useState } from 'react';
import {
  Award,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Save,
  Edit3,
  BookOpen,
  Info,
  Check,
} from 'lucide-react';
import { Student, Task, StudentGradeRecord } from '../types';

interface GradesTabProps {
  students: Student[];
  tasks: Task[];
  grades: StudentGradeRecord[];
  onSaveGrade: (
    studentId: string,
    taskId: string,
    score: number | null,
    feedback: string,
    status: 'completed' | 'in_progress' | 'not_started' | 'overdue'
  ) => void;
}

export const GradesTab: React.FC<GradesTabProps> = ({
  students,
  tasks,
  grades,
  onSaveGrade,
}) => {
  const [viewBy, setViewBy] = useState<'student' | 'task'>('task');
  const [selectedTaskId, setSelectedTaskId] = useState<string>(tasks[0]?.id || '');
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || '');
  const [classFilter, setClassFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Editing state for individual row
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [scoreInput, setScoreInput] = useState<string>('');
  const [feedbackInput, setFeedbackInput] = useState<string>('');

  const QUICK_FEEDBACKS = [
    'Hoàn thành tốt',
    'Đạt yêu cầu',
    'Cần cố gắng thêm',
    'Chữ viết đẹp, bài làm cẩn thận',
    'Cần bổ sung phần lập luận',
    'Làm bài sáng tạo',
  ];

  const getScoreBadge = (score: number | null | undefined) => {
    if (score === null || score === undefined) {
      return {
        label: 'Chưa chấm',
        badgeClass: 'bg-slate-100 text-slate-500 border-slate-200',
        textClass: 'text-slate-400',
      };
    }
    if (score >= 8.5) {
      return {
        label: `${score}đ (Tốt)`,
        badgeClass: 'bg-teal-50 text-teal-800 border-teal-200 font-bold',
        textClass: 'text-teal-700 font-extrabold',
      };
    }
    if (score >= 6.5) {
      return {
        label: `${score}đ (Khá)`,
        badgeClass: 'bg-blue-50 text-blue-800 border-blue-200 font-bold',
        textClass: 'text-blue-700 font-extrabold',
      };
    }
    if (score >= 5.0) {
      return {
        label: `${score}đ (Đạt)`,
        badgeClass: 'bg-amber-50 text-amber-800 border-amber-200 font-bold',
        textClass: 'text-amber-700 font-extrabold',
      };
    }
    return {
      label: `${score}đ (Cần cố gắng)`,
      badgeClass: 'bg-rose-50 text-rose-800 border-rose-200 font-bold',
      textClass: 'text-rose-700 font-extrabold',
    };
  };

  const startEdit = (studentId: string, taskId: string, currentScore: number | null | undefined, currentFeedback: string | undefined) => {
    setEditingKey(`${studentId}_${taskId}`);
    setScoreInput(currentScore !== null && currentScore !== undefined ? currentScore.toString() : '');
    setFeedbackInput(currentFeedback || 'Hoàn thành tốt');
  };

  const saveEdit = (studentId: string, taskId: string) => {
    const num = scoreInput.trim() === '' ? null : Math.min(10, Math.max(0, parseFloat(scoreInput)));
    const finalFeedback = feedbackInput.trim() || (num !== null && num >= 8 ? 'Hoàn thành tốt' : 'Đạt yêu cầu');
    const status = num !== null ? 'completed' : 'in_progress';
    onSaveGrade(studentId, taskId, num, finalFeedback, status);
    setEditingKey(null);
  };

  const currentTask = tasks.find((t) => t.id === selectedTaskId) || tasks[0];
  const currentStudent = students.find((s) => s.id === selectedStudentId) || students[0];

  return (
    <div id="grades-tab-content" className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Quản lý điểm và kết quả học tập
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Nhập điểm, cập nhật nhận xét và theo dõi đánh giá quá trình theo từng bài học
          </p>
        </div>

        {/* View Switcher */}
        <div className="inline-flex bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0">
          <button
            type="button"
            onClick={() => setViewBy('task')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
              viewBy === 'task'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Theo nhiệm vụ
          </button>
          <button
            type="button"
            onClick={() => setViewBy('student')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
              viewBy === 'student'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Theo học sinh
          </button>
        </div>
      </div>

      {/* Educational Guidance Notice */}
      <div className="p-3.5 sm:p-4 bg-blue-50/70 border border-blue-200/80 rounded-2xl flex items-start gap-3 text-xs text-blue-900 leading-relaxed">
        <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Lưu ý sư phạm:</span> Điểm số và nhận xét ở đây đóng vai trò đánh giá quá trình và hỗ trợ sự tiến bộ của học sinh. Hệ thống không tự động đưa ra kết luận mang tính đánh giá chính thức về toàn bộ năng lực học sinh chỉ dựa trên một điểm số đơn lẻ.
        </div>
      </div>

      {/* VIEW BY TASK */}
      {viewBy === 'task' && currentTask && (
        <div className="space-y-4">
          {/* Task selector & Class filter bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="flex flex-1 items-center gap-3 w-full">
              <div className="flex items-center gap-2 flex-1">
                <BookOpen className="w-4 h-4 text-slate-400 shrink-0" />
                <select
                  value={selectedTaskId}
                  onChange={(e) => {
                    setSelectedTaskId(e.target.value);
                    setEditingKey(null);
                  }}
                  className="w-full px-3 py-2 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
                >
                  {tasks.map((t) => (
                    <option key={t.id} value={t.id}>
                      [{t.subject}] {t.title} ({t.targetClass})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <Filter className="w-4 h-4 text-slate-400" />
                <select
                  value={classFilter}
                  onChange={(e) => setClassFilter(e.target.value)}
                  className="px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl text-slate-700 cursor-pointer"
                >
                  <option value="all">Tất cả học sinh</option>
                  <option value="7A1">Lớp 7A1</option>
                  <option value="7A2">Lớp 7A2</option>
                  <option value="8B1">Lớp 8B1</option>
                </select>
              </div>
            </div>
          </div>

          {/* Current Task Detail Pill */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <span className="font-bold text-blue-700 px-2 py-0.5 bg-blue-100/70 rounded-md mr-2">
                {currentTask.subject}
              </span>
              <strong className="text-slate-800 text-sm">{currentTask.title}</strong>
              <span className="text-slate-500 block mt-1 line-clamp-1">{currentTask.content}</span>
            </div>
            <div className="flex items-center gap-4 text-slate-600 shrink-0">
              <span>Hạn: <strong>{currentTask.dueDate}</strong></span>
              <span>Thang điểm: <strong>10đ</strong></span>
            </div>
          </div>

          {/* Grading Matrix Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-xs font-bold uppercase text-slate-400 border-b border-slate-200">
                  <tr>
                    <th className="px-5 py-3.5">Học sinh</th>
                    <th className="px-5 py-3.5">Lớp</th>
                    <th className="px-5 py-3.5">Trạng thái nộp</th>
                    <th className="px-5 py-3.5">Điểm số (0 - 10)</th>
                    <th className="px-5 py-3.5">Nhận xét của giáo viên</th>
                    <th className="px-5 py-3.5 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {students
                    .filter((s) => classFilter === 'all' || s.class === classFilter)
                    .map((student) => {
                      const gradeRecord = grades.find(
                        (g) => g.studentId === student.id && g.taskId === currentTask.id
                      );
                      const isEditing = editingKey === `${student.id}_${currentTask.id}`;
                      const scoreBadge = getScoreBadge(gradeRecord?.score);

                      return (
                        <tr
                          key={student.id}
                          className={`hover:bg-slate-50/60 transition ${
                            isEditing ? 'bg-blue-50/30' : ''
                          }`}
                        >
                          <td className="px-5 py-3">
                            <div className="font-bold text-slate-900 text-sm">
                              {student.name}
                            </div>
                            <div className="text-[11px] text-slate-400 font-mono">
                              {student.code}
                            </div>
                          </td>

                          <td className="px-5 py-3 font-semibold text-blue-700">
                            {student.class}
                          </td>

                          <td className="px-5 py-3">
                            <span
                              className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                                gradeRecord?.status === 'completed'
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  : gradeRecord?.status === 'in_progress'
                                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                                  : 'bg-slate-50 text-slate-600 border-slate-200'
                              }`}
                            >
                              {gradeRecord?.status === 'completed'
                                ? 'Đã hoàn thành'
                                : gradeRecord?.status === 'in_progress'
                                ? 'Đang thực hiện'
                                : 'Chưa nộp'}
                            </span>
                          </td>

                          {/* Score Cell */}
                          <td className="px-5 py-3">
                            {isEditing ? (
                              <div className="flex items-center gap-1">
                                <input
                                  type="number"
                                  step="0.5"
                                  min="0"
                                  max="10"
                                  value={scoreInput}
                                  onChange={(e) => setScoreInput(e.target.value)}
                                  placeholder="Điểm"
                                  className="w-18 px-2 py-1 text-sm font-bold text-blue-700 bg-white border border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                  autoFocus
                                />
                                <span className="text-xs text-slate-400">/ 10</span>
                              </div>
                            ) : (
                              <span
                                className={`text-xs px-2.5 py-1 rounded-full border inline-block ${scoreBadge.badgeClass}`}
                              >
                                {scoreBadge.label}
                              </span>
                            )}
                          </td>

                          {/* Feedback Cell */}
                          <td className="px-5 py-3">
                            {isEditing ? (
                              <div className="space-y-1.5">
                                <input
                                  type="text"
                                  value={feedbackInput}
                                  onChange={(e) => setFeedbackInput(e.target.value)}
                                  placeholder="Nhập nhận xét..."
                                  className="w-full px-2.5 py-1 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                />
                                <div className="flex flex-wrap gap-1">
                                  {QUICK_FEEDBACKS.slice(0, 3).map((fb) => (
                                    <button
                                      key={fb}
                                      type="button"
                                      onClick={() => setFeedbackInput(fb)}
                                      className="text-[10px] px-1.5 py-0.5 bg-slate-100 hover:bg-blue-100 hover:text-blue-800 rounded transition cursor-pointer"
                                    >
                                      {fb}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            ) : (
                              <span className="text-xs text-slate-600 italic">
                                {gradeRecord?.feedback ? `"${gradeRecord.feedback}"` : 'Chưa có nhận xét'}
                              </span>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="px-5 py-3 text-right">
                            {isEditing ? (
                              <div className="inline-flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => saveEdit(student.id, currentTask.id)}
                                  className="px-2.5 py-1 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition cursor-pointer flex items-center gap-1"
                                >
                                  <Save className="w-3.5 h-3.5" />
                                  <span>Lưu</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setEditingKey(null)}
                                  className="px-2 py-1 text-xs font-medium text-slate-500 hover:bg-slate-100 rounded-lg cursor-pointer"
                                >
                                  Hủy
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() =>
                                  startEdit(
                                    student.id,
                                    currentTask.id,
                                    gradeRecord?.score,
                                    gradeRecord?.feedback
                                  )
                                }
                                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition cursor-pointer"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                                <span>Nhập/Sửa điểm</span>
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW BY STUDENT */}
      {viewBy === 'student' && currentStudent && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-1">
              <span className="text-xs font-bold text-slate-700 shrink-0">Học sinh:</span>
              <select
                value={selectedStudentId}
                onChange={(e) => {
                  setSelectedStudentId(e.target.value);
                  setEditingKey(null);
                }}
                className="w-full max-w-md px-3 py-2 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
              >
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} - Lớp {s.class} ({s.code})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Student Grade Summary Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-xs font-bold uppercase text-slate-400 border-b border-slate-200">
                  <tr>
                    <th className="px-5 py-3.5">Môn học</th>
                    <th className="px-5 py-3.5">Nhiệm vụ / Bài tập</th>
                    <th className="px-5 py-3.5">Hạn nộp</th>
                    <th className="px-5 py-3.5">Điểm số</th>
                    <th className="px-5 py-3.5">Nhận xét của giáo viên</th>
                    <th className="px-5 py-3.5 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {tasks
                    .filter(
                      (t) => t.targetClass === 'Tất cả' || t.targetClass === currentStudent.class
                    )
                    .map((task) => {
                      const gradeRecord = grades.find(
                        (g) => g.studentId === currentStudent.id && g.taskId === task.id
                      );
                      const isEditing = editingKey === `${currentStudent.id}_${task.id}`;
                      const scoreBadge = getScoreBadge(gradeRecord?.score);

                      return (
                        <tr
                          key={task.id}
                          className={`hover:bg-slate-50/60 transition ${
                            isEditing ? 'bg-blue-50/30' : ''
                          }`}
                        >
                          <td className="px-5 py-3 font-bold text-blue-700 text-xs">
                            {task.subject}
                          </td>
                          <td className="px-5 py-3 font-bold text-slate-900 text-xs">
                            {task.title}
                          </td>
                          <td className="px-5 py-3 text-xs text-slate-500">
                            {task.dueDate}
                          </td>
                          <td className="px-5 py-3">
                            {isEditing ? (
                              <input
                                type="number"
                                step="0.5"
                                min="0"
                                max="10"
                                value={scoreInput}
                                onChange={(e) => setScoreInput(e.target.value)}
                                className="w-18 px-2 py-1 text-sm font-bold text-blue-700 bg-white border border-blue-400 rounded-lg focus:outline-none"
                              />
                            ) : (
                              <span
                                className={`text-xs px-2.5 py-1 rounded-full border inline-block ${scoreBadge.badgeClass}`}
                              >
                                {scoreBadge.label}
                              </span>
                            )}
                          </td>
                          <td className="px-5 py-3">
                            {isEditing ? (
                              <input
                                type="text"
                                value={feedbackInput}
                                onChange={(e) => setFeedbackInput(e.target.value)}
                                className="w-full px-2.5 py-1 text-xs bg-white border border-slate-300 rounded-lg"
                              />
                            ) : (
                              <span className="text-xs text-slate-600 italic">
                                {gradeRecord?.feedback ? `"${gradeRecord.feedback}"` : 'Chưa có nhận xét'}
                              </span>
                            )}
                          </td>
                          <td className="px-5 py-3 text-right">
                            {isEditing ? (
                              <button
                                type="button"
                                onClick={() => saveEdit(currentStudent.id, task.id)}
                                className="px-2.5 py-1 text-xs font-bold text-white bg-emerald-600 rounded-lg cursor-pointer"
                              >
                                Lưu
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() =>
                                  startEdit(
                                    currentStudent.id,
                                    task.id,
                                    gradeRecord?.score,
                                    gradeRecord?.feedback
                                  )
                                }
                                className="px-2.5 py-1 text-xs font-semibold text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 cursor-pointer"
                              >
                                Sửa điểm
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
