import React from 'react';
import {
  Users,
  CheckSquare,
  CheckCircle2,
  Clock,
  Award,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Bell,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { Student, Task, StudentGradeRecord, Notice, ActiveTab } from '../types';
import { calculateSystemStats, calculateStudentStats } from '../utils/storage';

interface OverviewTabProps {
  students: Student[];
  tasks: Task[];
  grades: StudentGradeRecord[];
  notices: Notice[];
  onNavigateTab: (tab: ActiveTab) => void;
  onSelectStudent: (student: Student) => void;
  onSelectTask: (task: Task) => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  students,
  tasks,
  grades,
  notices,
  onNavigateTab,
  onSelectStudent,
  onSelectTask,
}) => {
  const stats = calculateSystemStats(students, tasks, grades, 'all');

  // Students requiring extra teacher support
  const attentionStudents = students.filter((s) => {
    const sStats = calculateStudentStats(s, tasks, grades);
    return (
      s.status === 'Cần theo dõi' ||
      s.status === 'Cần cố gắng' ||
      sStats.overdueCount > 0 ||
      (sStats.averageScore !== null && sStats.averageScore < 6.5)
    );
  });

  // Recent tasks
  const recentTasks = [...tasks].slice(0, 4);

  // Urgent or pinned notices
  const recentNotices = [...notices].slice(0, 3);

  // Overdue / Urgent tasks for "Việc cần làm"
  const nowTime = new Date().setHours(0, 0, 0, 0);
  const urgentTasks = tasks.filter((t) => {
    const due = new Date(t.dueDate).getTime();
    return t.status !== 'completed' && due <= nowTime + 3 * 86400000;
  });

  return (
    <div id="overview-tab-content" className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Welcome Banner */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-blue-700 via-blue-600 to-teal-600 text-white shadow-lg shadow-blue-500/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-teal-300" />
            <span>Học kỳ I • Năm học 2026 - 2027</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            Xin chào, Thầy Nguyễn Quang Kiên!
          </h2>
          <p className="text-blue-100 text-sm mt-1 max-w-2xl leading-relaxed">
            Hôm nay có {urgentTasks.length} nhiệm vụ cần theo dõi tiến độ nộp bài từ học sinh các khối 7 và 8.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onNavigateTab('tasks')}
            className="px-4 py-2.5 bg-white text-blue-800 hover:bg-blue-50 font-bold text-xs sm:text-sm rounded-xl shadow-xs transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
          >
            <span>Quản lý nhiệm vụ</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 5 Big Dashboard Cards */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
            Chỉ số tổng quan lớp học
          </h3>
          <span className="text-xs text-slate-400">Cập nhật thời gian thực</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
          {/* 1. Tổng học sinh */}
          <div
            id="card-stat-students"
            onClick={() => onNavigateTab('students')}
            className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-semibold text-slate-500">Tổng học sinh</span>
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-800">
              {stats.totalStudents}
            </div>
            <div className="text-xs text-slate-400 mt-1 flex items-center gap-1">
              <span>Khối 7 & 8 • 3 lớp</span>
            </div>
          </div>

          {/* 2. Tổng nhiệm vụ */}
          <div
            id="card-stat-tasks"
            onClick={() => onNavigateTab('tasks')}
            className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-semibold text-slate-500">Nhiệm vụ học tập</span>
              <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <CheckSquare className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-800">
              {stats.totalTasks}
            </div>
            <div className="text-xs text-slate-400 mt-1 flex items-center gap-1">
              <span>Đang mở & đã nộp</span>
            </div>
          </div>

          {/* 3. Đã hoàn thành */}
          <div
            id="card-stat-completed"
            onClick={() => onNavigateTab('progress')}
            className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-semibold text-slate-500">Đã hoàn thành</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-600">
              {stats.totalTasksCompleted}
            </div>
            <div className="text-xs text-emerald-600/80 font-medium mt-1 flex items-center gap-1">
              <span>Đạt {stats.overallCompletionRate}% chỉ tiêu</span>
            </div>
          </div>

          {/* 4. Chưa hoàn thành */}
          <div
            id="card-stat-pending"
            onClick={() => onNavigateTab('progress')}
            className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-amber-300 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-semibold text-slate-500">Chưa hoàn thành</span>
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-amber-600">
              {stats.totalTasksNotCompleted}
            </div>
            <div className="text-xs text-amber-600/80 font-medium mt-1">
              <span>Cần nhắc nhở nộp bài</span>
            </div>
          </div>

          {/* 5. Điểm trung bình */}
          <div
            id="card-stat-avg-score"
            onClick={() => onNavigateTab('grades')}
            className="col-span-2 sm:col-span-1 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-semibold text-slate-500">Điểm trung bình</span>
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Award className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-blue-700">
              {stats.averageScore > 0 ? stats.averageScore.toFixed(1) : '--'}
              <span className="text-sm font-normal text-slate-400 ml-1">/10</span>
            </div>
            <div className="text-xs text-slate-400 mt-1">
              <span>Toàn khối khảo sát</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress & Urgent To-Do Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visual Progress Bar Widget */}
        <div className="lg:col-span-2 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-teal-50 text-teal-700">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-base">Tiến độ nộp bài toàn diện</h4>
                  <p className="text-xs text-slate-500">Tỷ lệ các bài tập đã nộp và được chấm điểm</p>
                </div>
              </div>
              <span className="text-2xl font-black text-teal-700">{stats.overallCompletionRate}%</span>
            </div>

            {/* Custom Multi-segment progress bar */}
            <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden flex mb-3">
              <div
                style={{ width: `${stats.overallCompletionRate}%` }}
                className="bg-gradient-to-r from-teal-500 to-blue-600 transition-all duration-500"
                title={`Đã hoàn thành: ${stats.overallCompletionRate}%`}
              />
              <div
                style={{ width: `${100 - stats.overallCompletionRate}%` }}
                className="bg-slate-200 transition-all duration-500"
                title="Chưa hoàn thành"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between text-xs text-slate-600 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-teal-500 inline-block" />
                <span>Hoàn thành: <strong>{stats.totalTasksCompleted}</strong> lượt</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-slate-300 inline-block" />
                <span>Chờ nộp / Chưa làm: <strong>{stats.totalTasksNotCompleted}</strong> lượt</span>
              </div>
              <button
                type="button"
                onClick={() => onNavigateTab('progress')}
                className="text-blue-600 hover:text-blue-800 font-semibold inline-flex items-center gap-1 cursor-pointer"
              >
                <span>Xem chi tiết tiến độ</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Quick class distribution badges */}
          <div className="grid grid-cols-3 gap-3 mt-6 pt-5 border-t border-slate-100">
            {['7A1', '7A2', '8B1'].map((cls) => {
              const clsStudents = students.filter((s) => s.class === cls);
              const clsStats = calculateSystemStats(students, tasks, grades, cls);
              return (
                <div key={cls} className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                  <span className="text-xs font-bold text-slate-700 block">Lớp {cls}</span>
                  <span className="text-sm font-extrabold text-blue-700 block mt-0.5">
                    {clsStats.overallCompletionRate}%
                  </span>
                  <span className="text-[11px] text-slate-400">{clsStudents.length} học sinh</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Việc cần làm / Urgent Reminders */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <h4 className="font-bold text-slate-800 text-base">Việc cần làm hôm nay</h4>
              </div>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                {urgentTasks.length} mục
              </span>
            </div>

            <div className="space-y-3">
              {urgentTasks.length === 0 ? (
                <p className="text-xs text-slate-500 py-4 text-center">
                  Tuyệt vời! Không có nhiệm vụ nào cận hạn hoặc quá hạn.
                </p>
              ) : (
                urgentTasks.map((task) => {
                  const isOverdue = new Date(task.dueDate).getTime() < nowTime;
                  return (
                    <div
                      key={task.id}
                      onClick={() => onSelectTask(task)}
                      className={`p-3 rounded-xl border transition cursor-pointer hover:shadow-xs ${
                        isOverdue
                          ? 'bg-rose-50/60 border-rose-200 text-rose-950'
                          : 'bg-amber-50/60 border-amber-200 text-amber-950'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs font-bold leading-snug line-clamp-1">
                          {task.title}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0 ${
                            isOverdue
                              ? 'bg-rose-600 text-white'
                              : 'bg-amber-500 text-white'
                          }`}
                        >
                          {isOverdue ? 'Quá hạn' : 'Sắp tới hạn'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-2 text-[11px] text-slate-600">
                        <span>Môn: <strong>{task.subject}</strong></span>
                        <span className="flex items-center gap-1 font-medium">
                          <Calendar className="w-3 h-3" />
                          Hạn: {task.dueDate}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigateTab('tasks')}
            className="w-full mt-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition text-center cursor-pointer"
          >
            Xem tất cả nhiệm vụ
          </button>
        </div>
      </div>

      {/* Bottom Row: Recent Tasks, Notices, and Students Needing Support */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Recent Tasks */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-blue-600" />
                Nhiệm vụ gần đây
              </h4>
              <button
                type="button"
                onClick={() => onNavigateTab('tasks')}
                className="text-xs text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
              >
                Tất cả
              </button>
            </div>

            <div className="space-y-2.5">
              {recentTasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => onSelectTask(task)}
                  className="p-3 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition cursor-pointer"
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-blue-700 px-2 py-0.5 bg-blue-50 rounded-md">
                      {task.subject}
                    </span>
                    <span className="text-slate-400 font-medium text-[11px]">
                      Lớp: {task.targetClass}
                    </span>
                  </div>
                  <h5 className="text-xs font-bold text-slate-800 line-clamp-1">{task.title}</h5>
                  <div className="flex items-center justify-between mt-1.5 text-[11px] text-slate-500">
                    <span>Điểm tối đa: {task.maxScore}đ</span>
                    <span>Hạn: {task.dueDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Latest Notices */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <Bell className="w-4 h-4 text-teal-600" />
                Thông báo mới
              </h4>
              <button
                type="button"
                onClick={() => onNavigateTab('notifications')}
                className="text-xs text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
              >
                Tất cả
              </button>
            </div>

            <div className="space-y-2.5">
              {recentNotices.map((notice) => (
                <div
                  key={notice.id}
                  onClick={() => onNavigateTab('notifications')}
                  className={`p-3 rounded-xl border transition cursor-pointer ${
                    notice.priority === 'urgent'
                      ? 'bg-rose-50/50 border-rose-200'
                      : notice.priority === 'important'
                      ? 'bg-amber-50/50 border-amber-200'
                      : 'bg-slate-50/50 border-slate-100 hover:border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span
                      className={`font-bold px-2 py-0.5 rounded-md ${
                        notice.priority === 'urgent'
                          ? 'bg-rose-600 text-white'
                          : notice.priority === 'important'
                          ? 'bg-amber-500 text-white'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {notice.priority === 'urgent'
                        ? 'Khẩn cấp'
                        : notice.priority === 'important'
                        ? 'Quan trọng'
                        : 'Bình thường'}
                    </span>
                    <span className="text-slate-400">{notice.date}</span>
                  </div>
                  <h5 className="text-xs font-bold text-slate-800 line-clamp-1">{notice.title}</h5>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {notice.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Học sinh cần theo dõi thêm */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-600" />
                Cần theo dõi thêm
              </h4>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                {attentionStudents.length} học sinh
              </span>
            </div>

            <p className="text-xs text-slate-500 mb-3 leading-relaxed">
              Các em học sinh có nhiệm vụ chưa hoàn thành hoặc cần giáo viên động viên, hỗ trợ học tập:
            </p>

            <div className="space-y-2.5">
              {attentionStudents.slice(0, 3).map((student) => {
                const sStats = calculateStudentStats(student, tasks, grades);
                return (
                  <div
                    key={student.id}
                    onClick={() => onSelectStudent(student)}
                    className="p-3 rounded-xl border border-amber-200 bg-amber-50/30 hover:bg-amber-50/70 transition cursor-pointer flex items-center justify-between gap-2"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{student.name}</span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 bg-slate-200 text-slate-700 rounded-sm">
                          {student.class}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {student.status} • {sStats.completedCount}/{sStats.totalAssigned} bài
                      </div>
                    </div>
                    <button
                      type="button"
                      className="px-2 py-1 text-[11px] font-bold text-blue-700 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 transition shrink-0 cursor-pointer"
                    >
                      Chi tiết
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigateTab('students')}
            className="w-full mt-4 py-2 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl transition text-center cursor-pointer"
          >
            Xem danh sách học sinh
          </button>
        </div>
      </div>
    </div>
  );
};
