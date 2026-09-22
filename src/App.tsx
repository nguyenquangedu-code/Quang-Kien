import React, { useState, useEffect } from 'react';
import {
  Student,
  Task,
  StudentGradeRecord,
  Notice,
  ActiveTab,
  UserRole,
  ToastMessage,
} from './types';
import {
  loadInitialData,
  saveToStorage,
  resetAllData,
  calculateStudentStats,
} from './utils/storage';
import { soundManager } from './utils/audio';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ToastContainer } from './components/Toast';
import { ConfirmModal } from './components/ConfirmModal';
import { OverviewTab } from './components/OverviewTab';
import { StudentsTab } from './components/StudentsTab';
import { TasksTab } from './components/TasksTab';
import { ProgressTab } from './components/ProgressTab';
import { GradesTab } from './components/GradesTab';
import { NotificationsTab } from './components/NotificationsTab';
import { StudentPortalModal } from './components/StudentPortalModal';
import { Download, School, FileText, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [dataLoaded, setDataLoaded] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [grades, setGrades] = useState<StudentGradeRecord[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);

  // Navigation & Role states
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [userRole, setUserRole] = useState<UserRole>('teacher');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Drilldown states
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  // Modals & UI states
  const [studentPortalOpen, setStudentPortalOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  // Load data once on mount
  useEffect(() => {
    const initial = loadInitialData();
    setStudents(initial.students);
    setTasks(initial.tasks);
    setGrades(initial.grades);
    setNotices(initial.notices);
    setSoundEnabled(soundManager.isEnabled());
    setDataLoaded(true);
  }, []);

  // Save to storage whenever core state changes
  useEffect(() => {
    if (dataLoaded) {
      saveToStorage(students, tasks, grades, notices);
    }
  }, [students, tasks, grades, notices, dataLoaded]);

  // Toast Helper
  const addToast = (type: 'success' | 'info' | 'warning' | 'error', message: string) => {
    const id = Date.now().toString() + Math.random().toString().substring(2, 5);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Sound Toggle
  const handleToggleSound = () => {
    const nextState = soundManager.toggle();
    setSoundEnabled(nextState);
    addToast(
      'info',
      nextState ? 'Đã bật âm thanh thông báo' : 'Đã tắt âm thanh thông báo'
    );
  };

  // Reset to initial demo data
  const handleResetData = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Đặt lại dữ liệu mẫu?',
      message:
        'Hệ thống sẽ khôi phục 10 học sinh mẫu, 6 nhiệm vụ ban đầu và 4 thông báo của trường THCS Phan Bội Châu. Mọi thay đổi hiện tại sẽ được thay thế bằng dữ liệu chuẩn.',
      onConfirm: () => {
        const reset = resetAllData();
        setStudents(reset.students);
        setTasks(reset.tasks);
        setGrades(reset.grades);
        setNotices(reset.notices);
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        soundManager.playRemove();
        addToast('info', 'Đã đặt lại dữ liệu mẫu thành công!');
      },
    });
  };

  // 1. Student Actions
  const handleAddStudent = (newStudent: Omit<Student, 'id'>) => {
    const id = `hs-${Date.now().toString().slice(-4)}`;
    const studentWithId: Student = { ...newStudent, id };
    setStudents((prev) => [studentWithId, ...prev]);
    soundManager.playSuccess();
    addToast('success', `Đã thêm học sinh "${studentWithId.name}" (${studentWithId.class})`);
  };

  const handleUpdateStudent = (updatedStudent: Student) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === updatedStudent.id ? updatedStudent : s))
    );
    soundManager.playSuccess();
    addToast('success', `Đã cập nhật thông tin học sinh "${updatedStudent.name}"`);
  };

  const handleDeleteStudent = (id: string, name: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Xóa học sinh?',
      message: `Bạn có chắc chắn muốn xóa học sinh "${name}" khỏi hệ thống? Dữ liệu điểm số và nhiệm vụ liên quan cũng sẽ bị xóa bỏ.`,
      onConfirm: () => {
        setStudents((prev) => prev.filter((s) => s.id !== id));
        setGrades((prev) => prev.filter((g) => g.studentId !== id));
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        soundManager.playRemove();
        addToast('warning', `Đã xóa học sinh "${name}" thành công.`);
      },
    });
  };

  const handleViewStudentDetail = (student: Student) => {
    setSelectedStudentId(student.id);
    setActiveTab('progress');
  };

  // 2. Task Actions
  const handleAddTask = (newTask: Omit<Task, 'id' | 'createdAt'>) => {
    const id = `task-${Date.now().toString().slice(-4)}`;
    const createdAt = new Date().toISOString().split('T')[0];
    const taskWithId: Task = { ...newTask, id, createdAt };
    setTasks((prev) => [taskWithId, ...prev]);
    soundManager.playSuccess();
    addToast('success', `Đã tạo nhiệm vụ "${taskWithId.title}" môn ${taskWithId.subject}`);
  };

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === updatedTask.id ? updatedTask : t))
    );
    soundManager.playSuccess();
    addToast('success', `Đã cập nhật nhiệm vụ "${updatedTask.title}"`);
  };

  const handleDeleteTask = (id: string, title: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Xóa nhiệm vụ học tập?',
      message: `Bạn có chắc chắn muốn xóa nhiệm vụ "${title}"? Thao tác này không thể hoàn tác.`,
      onConfirm: () => {
        setTasks((prev) => prev.filter((t) => t.id !== id));
        setGrades((prev) => prev.filter((g) => g.taskId !== id));
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        soundManager.playRemove();
        addToast('warning', `Đã xóa nhiệm vụ "${title}".`);
      },
    });
  };

  const handleGoToGradingForTask = (task: Task) => {
    setActiveTab('grades');
  };

  // 3. Grading Actions
  const handleSaveGrade = (
    studentId: string,
    taskId: string,
    score: number | null,
    feedback: string,
    status: 'completed' | 'in_progress' | 'not_started' | 'overdue'
  ) => {
    setGrades((prev) => {
      const existingIdx = prev.findIndex(
        (g) => g.studentId === studentId && g.taskId === taskId
      );
      const updatedAt = new Date().toISOString().split('T')[0];

      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx] = {
          ...updated[existingIdx],
          score,
          feedback,
          status,
          updatedAt,
        };
        return updated;
      } else {
        const newRecord: StudentGradeRecord = {
          id: `g-${Date.now().toString().slice(-4)}`,
          studentId,
          taskId,
          score,
          feedback,
          status,
          updatedAt,
        };
        return [...prev, newRecord];
      }
    });

    soundManager.playSuccess();
    const student = students.find((s) => s.id === studentId);
    addToast(
      'success',
      `Đã lưu kết quả cho ${student?.name || 'học sinh'} (${score !== null ? `${score}đ` : 'Đang làm'})`
    );
  };

  // 4. Notification Actions
  const handleAddNotice = (newNotice: Omit<Notice, 'id'>) => {
    const id = `not-${Date.now().toString().slice(-4)}`;
    const noticeWithId: Notice = { ...newNotice, id };
    setNotices((prev) => [noticeWithId, ...prev]);
    soundManager.playChime();
    addToast('success', `Đã đăng thông báo: "${noticeWithId.title}"`);
  };

  const handleDeleteNotice = (id: string, title: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Xóa thông báo?',
      message: `Bạn có chắc chắn muốn xóa thông báo "${title}"?`,
      onConfirm: () => {
        setNotices((prev) => prev.filter((n) => n.id !== id));
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        soundManager.playRemove();
        addToast('warning', `Đã xóa thông báo.`);
      },
    });
  };

  const handleTogglePinNotice = (id: string) => {
    setNotices((prev) =>
      prev.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n))
    );
    soundManager.playSuccess();
  };

  // Student portal submission toggle
  const handleToggleSubmission = (studentId: string, taskId: string) => {
    setGrades((prev) => {
      const existing = prev.find((g) => g.studentId === studentId && g.taskId === taskId);
      const isCompleted = existing?.status === 'completed';
      const newStatus = isCompleted ? 'in_progress' : 'completed';
      const updatedAt = new Date().toISOString().split('T')[0];

      if (existing) {
        return prev.map((g) =>
          g.studentId === studentId && g.taskId === taskId
            ? { ...g, status: newStatus, updatedAt }
            : g
        );
      } else {
        return [
          ...prev,
          {
            id: `g-${Date.now().toString().slice(-4)}`,
            studentId,
            taskId,
            score: null,
            feedback: 'Đã nộp bài, chờ giáo viên chấm',
            status: newStatus,
            updatedAt,
          },
        ];
      }
    });

    soundManager.playSuccess();
    addToast('success', 'Đã cập nhật trạng thái bài làm!');
  };

  // Export standalone single-file HTML and data helper
  const handleDownloadOfflineHTML = () => {
    const link = document.createElement('a');
    link.href = '/quan_tri_hoc_tap_thcs_offline.html';
    link.download = 'QUAN_TRI_HOC_TAP_THCS_PHAN_BOI_CHAU.html';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    soundManager.playSuccess();
    addToast('success', 'Đang tải file HTML độc lập để chạy offline!');
  };

  const handleExportJSONData = () => {
    const backupData = {
      exportDate: new Date().toISOString(),
      school: 'THCS Phan Bội Châu',
      teacher: 'Nguyễn Quang Kiên',
      students,
      tasks,
      grades,
      notices,
    };

    const dataBlob = new Blob([JSON.stringify(backupData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `quan_tri_hoc_tap_thcs_phan_boi_chau_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);

    soundManager.playSuccess();
    addToast('success', 'Đã xuất dữ liệu lưu trữ JSON thành công!');
  };

  return (
    <div className="min-h-screen bg-slate-100/60 text-slate-800 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Toast Feedback System */}
      <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* Student Portal Modal */}
      <StudentPortalModal
        isOpen={studentPortalOpen || userRole === 'student'}
        onClose={() => {
          setStudentPortalOpen(false);
          setUserRole('teacher');
        }}
        students={students}
        tasks={tasks}
        grades={grades}
        notices={notices}
        onToggleSubmission={handleToggleSubmission}
      />

      {/* Main Top Header */}
      <Header
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        userRole={userRole}
        onChangeUserRole={(role) => {
          setUserRole(role);
          if (role === 'student') setStudentPortalOpen(true);
        }}
        onResetData={handleResetData}
        onOpenStudentPortal={() => setStudentPortalOpen(true)}
      />

      {/* Main Layout Body */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex flex-col lg:flex-row">
        {/* Left Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          counts={{
            students: students.length,
            tasks: tasks.length,
            pendingTasks: tasks.filter((t) => t.status !== 'completed').length,
            notices: notices.length,
          }}
        />

        {/* Dynamic Main Workspace Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
          {activeTab === 'overview' && (
            <OverviewTab
              students={students}
              tasks={tasks}
              grades={grades}
              notices={notices}
              onNavigateTab={setActiveTab}
              onSelectStudent={handleViewStudentDetail}
              onSelectTask={handleGoToGradingForTask}
            />
          )}

          {activeTab === 'students' && (
            <StudentsTab
              students={students}
              tasks={tasks}
              grades={grades}
              onAddStudent={handleAddStudent}
              onUpdateStudent={handleUpdateStudent}
              onDeleteStudent={handleDeleteStudent}
              onViewStudentDetail={handleViewStudentDetail}
            />
          )}

          {activeTab === 'tasks' && (
            <TasksTab
              tasks={tasks}
              students={students}
              grades={grades}
              onAddTask={handleAddTask}
              onUpdateTask={handleUpdateTask}
              onDeleteTask={handleDeleteTask}
              onGoToGradingForTask={handleGoToGradingForTask}
            />
          )}

          {activeTab === 'progress' && (
            <ProgressTab
              students={students}
              tasks={tasks}
              grades={grades}
              selectedStudentId={selectedStudentId}
              onSelectStudentId={setSelectedStudentId}
            />
          )}

          {activeTab === 'grades' && (
            <GradesTab
              students={students}
              tasks={tasks}
              grades={grades}
              onSaveGrade={handleSaveGrade}
            />
          )}

          {activeTab === 'notifications' && (
            <NotificationsTab
              notices={notices}
              tasks={tasks}
              onAddNotice={handleAddNotice}
              onDeleteNotice={handleDeleteNotice}
              onTogglePinNotice={handleTogglePinNotice}
              onSelectTask={handleGoToGradingForTask}
            />
          )}
        </main>
      </div>

      {/* Accessible Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 px-4 sm:px-8 mt-auto text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <School className="w-4 h-4 text-teal-600" />
            <span className="font-semibold text-slate-700">Trường THCS Phan Bội Châu</span>
            <span>•</span>
            <span>Hệ thống Quản Trị Học Tập Dành Cho Giáo Viên & Học Sinh</span>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              type="button"
              onClick={handleDownloadOfflineHTML}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-lg transition cursor-pointer"
              title="Tải file HTML duy nhất để chạy không cần mạng"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Tải file .HTML độc lập</span>
            </button>
            <button
              type="button"
              onClick={handleExportJSONData}
              className="inline-flex items-center gap-1.5 text-slate-600 hover:text-slate-900 font-semibold cursor-pointer"
              title="Xuất dữ liệu dự phòng JSON"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Sao lưu JSON</span>
            </button>
            <span className="text-slate-300">|</span>
            <span>GV: <strong>Nguyễn Quang Kiên</strong></span>
          </div>
        </div>
      </footer>
    </div>
  );
}
