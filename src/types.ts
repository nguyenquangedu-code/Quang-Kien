export type StudyStatus = 'Chăm chỉ' | 'Tiến bộ tốt' | 'Đạt yêu cầu' | 'Cần cố gắng' | 'Cần theo dõi';

export interface Student {
  id: string;
  code: string; // Mã học sinh, ví dụ: HS-701
  name: string; // Họ và tên
  class: string; // Lớp, ví dụ: 7A1, 7A2, 8B1
  gender: 'Nam' | 'Nữ';
  avatarSeed: string;
  status: StudyStatus;
  phone?: string;
  parentContact?: string;
  notes?: string;
}

export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'overdue';

export interface Task {
  id: string;
  title: string;
  subject: string;
  content: string; // Nội dung & Hướng dẫn thực hiện
  dueDate: string; // YYYY-MM-DD
  maxScore: number; // Mặc định 10
  targetClass: string; // 'Tất cả' hoặc mã lớp cụ thể như '7A1'
  status: TaskStatus;
  createdAt: string;
}

export type SubmissionStatus = 'not_started' | 'in_progress' | 'completed' | 'overdue';

export interface StudentGradeRecord {
  id: string;
  studentId: string;
  taskId: string;
  status: SubmissionStatus;
  score: number | null; // Điểm số từ 0 - 10
  feedback: string; // Nhận xét ngắn của giáo viên
  updatedAt: string;
}

export type PriorityLevel = 'normal' | 'important' | 'urgent';

export interface Notice {
  id: string;
  title: string;
  content: string;
  date: string;
  recipient: string; // 'Toàn trường' | 'Toàn bộ học sinh' | 'Lớp 7A1' | 'Lớp 7A2' | 'Lớp 8B1'
  priority: PriorityLevel;
  pinned?: boolean;
}

export type ActiveTab = 'overview' | 'students' | 'tasks' | 'progress' | 'grades' | 'notifications';

export type UserRole = 'teacher' | 'student';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
}
