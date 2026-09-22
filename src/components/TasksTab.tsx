import React, { useState } from 'react';
import {
  Plus,
  Search,
  CheckSquare,
  Clock,
  Calendar,
  BookOpen,
  Edit2,
  Trash2,
  Filter,
  CheckCircle2,
  AlertCircle,
  Award,
} from 'lucide-react';
import { Task, TaskStatus, StudentGradeRecord, Student } from '../types';

interface TasksTabProps {
  tasks: Task[];
  students: Student[];
  grades: StudentGradeRecord[];
  onAddTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  onUpdateTask: (task: Task) => void;
  onDeleteTask: (id: string, title: string) => void;
  onGoToGradingForTask: (task: Task) => void;
}

const SUBJECT_OPTIONS = [
  'Toán học',
  'Ngữ văn',
  'Khoa học tự nhiên',
  'Tiếng Anh',
  'Lịch sử & Địa lí',
  'Tin học',
  'Giáo dục công dân',
  'Công nghệ',
  'Nghệ thuật',
];

export const TasksTab: React.FC<TasksTabProps> = ({
  tasks,
  students,
  grades,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onGoToGradingForTask,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Form states
  const [formTitle, setFormTitle] = useState('');
  const [formSubject, setFormSubject] = useState(SUBJECT_OPTIONS[0]);
  const [formContent, setFormContent] = useState('');
  const [formDueDate, setFormDueDate] = useState('');
  const [formMaxScore, setFormMaxScore] = useState(10);
  const [formTargetClass, setFormTargetClass] = useState('Tất cả');
  const [formStatus, setFormStatus] = useState<TaskStatus>('in_progress');

  const openCreateModal = () => {
    setEditingTask(null);
    setFormTitle('');
    setFormSubject(SUBJECT_OPTIONS[0]);
    setFormContent('');
    // Default due date: 7 days from now
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    setFormDueDate(nextWeek.toISOString().split('T')[0]);
    setFormMaxScore(10);
    setFormTargetClass('Tất cả');
    setFormStatus('in_progress');
    setIsModalOpen(true);
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setFormTitle(task.title);
    setFormSubject(task.subject);
    setFormContent(task.content);
    setFormDueDate(task.dueDate);
    setFormMaxScore(task.maxScore);
    setFormTargetClass(task.targetClass);
    setFormStatus(task.status);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    if (editingTask) {
      onUpdateTask({
        ...editingTask,
        title: formTitle.trim(),
        subject: formSubject,
        content: formContent.trim(),
        dueDate: formDueDate,
        maxScore: Number(formMaxScore) || 10,
        targetClass: formTargetClass,
        status: formStatus,
      });
    } else {
      onAddTask({
        title: formTitle.trim(),
        subject: formSubject,
        content: formContent.trim(),
        dueDate: formDueDate,
        maxScore: Number(formMaxScore) || 10,
        targetClass: formTargetClass,
        status: formStatus,
      });
    }
    setIsModalOpen(false);
  };

  // Filter tasks
  const filteredTasks = tasks.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = subjectFilter === 'all' || t.subject === subjectFilter;
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    return matchesSearch && matchesSubject && matchesStatus;
  });

  const getStatusBadge = (status: TaskStatus) => {
    switch (status) {
      case 'completed':
        return {
          label: 'Đã hoàn thành',
          className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          icon: CheckCircle2,
        };
      case 'in_progress':
        return {
          label: 'Đang thực hiện',
          className: 'bg-amber-50 text-amber-700 border-amber-200',
          icon: Clock,
        };
      case 'pending':
        return {
          label: 'Chưa làm',
          className: 'bg-blue-50 text-blue-700 border-blue-200',
          icon: CheckSquare,
        };
      case 'overdue':
        return {
          label: 'Quá hạn',
          className: 'bg-rose-50 text-rose-700 border-rose-200',
          icon: AlertCircle,
        };
      default:
        return {
          label: status,
          className: 'bg-slate-50 text-slate-700 border-slate-200',
          icon: Clock,
        };
    }
  };

  const getSubjectColor = (subject: string) => {
    switch (subject) {
      case 'Toán học':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Ngữ văn':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Khoa học tự nhiên':
        return 'bg-teal-50 text-teal-700 border-teal-200';
      case 'Tiếng Anh':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Tin học':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'Lịch sử & Địa lí':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div id="tasks-tab-content" className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Quản lý nhiệm vụ học tập
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Giao bài tập, dự án học tập, đặt thời hạn và thiết lập thang điểm
          </p>
        </div>

        <button
          type="button"
          id="btn-create-task"
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md shadow-blue-500/20 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tạo nhiệm vụ mới</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex flex-1 items-center gap-3 w-full">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              id="input-search-task"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm theo tên bài tập hoặc nội dung hướng dẫn..."
              className="w-full pl-9.5 pr-4 py-2 text-sm bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
            />
          </div>

          {/* Subject Filter */}
          <div className="flex items-center gap-1.5 shrink-0">
            <BookOpen className="w-4 h-4 text-slate-400" />
            <select
              id="select-filter-subject"
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
            >
              <option value="all">Tất cả môn học</option>
              {SUBJECT_OPTIONS.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 shrink-0">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              id="select-filter-task-status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="pending">Chưa làm</option>
              <option value="in_progress">Đang thực hiện</option>
              <option value="completed">Đã hoàn thành</option>
              <option value="overdue">Quá hạn</option>
            </select>
          </div>
        </div>
      </div>

      {/* Task List Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTasks.map((task) => {
          const badge = getStatusBadge(task.status);
          const Icon = badge.icon;

          // Count submissions for this task
          const applicableStudents = students.filter(
            (s) => task.targetClass === 'Tất cả' || s.class === task.targetClass
          );
          const taskGrades = grades.filter((g) => g.taskId === task.id);
          const submittedCount = taskGrades.filter(
            (g) => g.status === 'completed' || g.score !== null
          ).length;

          const isOverdue =
            task.status === 'overdue' ||
            (task.status !== 'completed' &&
              new Date(task.dueDate).getTime() < new Date().setHours(0, 0, 0, 0));

          return (
            <div
              key={task.id}
              id={`task-card-${task.id}`}
              className={`bg-white rounded-2xl border p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between ${
                isOverdue ? 'border-rose-200/90' : 'border-slate-200/80'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full border ${getSubjectColor(
                        task.subject
                      )}`}
                    >
                      {task.subject}
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md">
                      Lớp: {task.targetClass}
                    </span>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full border ${badge.className}`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{badge.label}</span>
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-base leading-snug mb-2">
                  {task.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed mb-4 line-clamp-3 bg-slate-50/60 p-3 rounded-xl border border-slate-100">
                  {task.content}
                </p>

                {/* Meta details */}
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 py-2 border-t border-b border-slate-100 my-3">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span>Hạn nộp: <strong className={isOverdue ? 'text-rose-600' : 'text-slate-700'}>{task.dueDate}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-amber-500" />
                    <span>Điểm tối đa: <strong className="text-slate-700">{task.maxScore}đ</strong></span>
                  </div>
                </div>

                {/* Submissions stats */}
                <div className="flex items-center justify-between text-xs text-slate-600 mb-2">
                  <span>
                    Đã nộp bài: <strong>{submittedCount}</strong> / {applicableStudents.length} học sinh
                  </span>
                  <span className="font-bold text-teal-700">
                    {applicableStudents.length > 0
                      ? Math.round((submittedCount / applicableStudents.length) * 100)
                      : 0}
                    %
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-3">
                  <div
                    style={{
                      width: `${
                        applicableStudents.length > 0
                          ? (submittedCount / applicableStudents.length) * 100
                          : 0
                      }%`,
                    }}
                    className="bg-teal-600 h-full rounded-full transition-all"
                  />
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => onGoToGradingForTask(task)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-xl transition cursor-pointer"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>Vào chấm điểm bài này</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => openEditModal(task)}
                    className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                    title="Chỉnh sửa nhiệm vụ"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteTask(task.id, task.title)}
                    className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                    title="Xóa nhiệm vụ"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Add / Edit Task */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              {editingTask ? 'Chỉnh sửa nhiệm vụ học tập' : 'Tạo nhiệm vụ học tập mới'}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Giao bài tập hoặc hoạt động học tập cho học sinh trường THCS Phan Bội Châu
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tên nhiệm vụ / Bài tập *
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Ví dụ: Ôn tập chương 2 - Phép cộng và trừ đa thức"
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Môn học *
                  </label>
                  <select
                    value={formSubject}
                    onChange={(e) => setFormSubject(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    {SUBJECT_OPTIONS.map((sub) => (
                      <option key={sub} value={sub}>
                        {sub}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Lớp áp dụng
                  </label>
                  <select
                    value={formTargetClass}
                    onChange={(e) => setFormTargetClass(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="Tất cả">Tất cả lớp (7 & 8)</option>
                    <option value="7A1">Lớp 7A1</option>
                    <option value="7A2">Lớp 7A2</option>
                    <option value="8B1">Lớp 8B1</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Hạn hoàn thành *
                  </label>
                  <input
                    type="date"
                    required
                    value={formDueDate}
                    onChange={(e) => setFormDueDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Điểm tối đa
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={formMaxScore}
                    onChange={(e) => setFormMaxScore(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Trạng thái
                </label>
                <select
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value as TaskStatus)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="pending">Chưa làm</option>
                  <option value="in_progress">Đang thực hiện</option>
                  <option value="completed">Đã hoàn thành</option>
                  <option value="overdue">Quá hạn</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nội dung & Hướng dẫn thực hiện *
                </label>
                <textarea
                  rows={4}
                  required
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  placeholder="Ghi rõ yêu cầu bài tập, cách nộp bài, tiêu chí đánh giá..."
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/20 transition cursor-pointer"
                >
                  {editingTask ? 'Cập nhật nhiệm vụ' : 'Lưu nhiệm vụ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
