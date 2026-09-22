import React, { useState } from 'react';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  LayoutGrid,
  Table as TableIcon,
  User,
  CheckCircle,
  Clock,
  Filter,
  Eye,
  Award,
} from 'lucide-react';
import { Student, Task, StudentGradeRecord, StudyStatus } from '../types';
import { calculateStudentStats } from '../utils/storage';

interface StudentsTabProps {
  students: Student[];
  tasks: Task[];
  grades: StudentGradeRecord[];
  onAddStudent: (student: Omit<Student, 'id'>) => void;
  onUpdateStudent: (student: Student) => void;
  onDeleteStudent: (id: string, name: string) => void;
  onViewStudentDetail: (student: Student) => void;
}

export const StudentsTab: React.FC<StudentsTabProps> = ({
  students,
  tasks,
  grades,
  onAddStudent,
  onUpdateStudent,
  onDeleteStudent,
  onViewStudentDetail,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('cards');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  // Form inputs
  const [formName, setFormName] = useState('');
  const [formClass, setFormClass] = useState('7A1');
  const [formCode, setFormCode] = useState('');
  const [formGender, setFormGender] = useState<'Nam' | 'Nữ'>('Nam');
  const [formStatus, setFormStatus] = useState<StudyStatus>('Chăm chỉ');
  const [formPhone, setFormPhone] = useState('');
  const [formNotes, setFormNotes] = useState('');

  const openAddModal = () => {
    setEditingStudent(null);
    setFormName('');
    setFormClass('7A1');
    setFormCode(`HS-${Math.floor(10000 + Math.random() * 90000)}`);
    setFormGender('Nam');
    setFormStatus('Chăm chỉ');
    setFormPhone('');
    setFormNotes('');
    setIsModalOpen(true);
  };

  const openEditModal = (s: Student) => {
    setEditingStudent(s);
    setFormName(s.name);
    setFormClass(s.class);
    setFormCode(s.code);
    setFormGender(s.gender);
    setFormStatus(s.status);
    setFormPhone(s.phone || '');
    setFormNotes(s.notes || '');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    if (editingStudent) {
      onUpdateStudent({
        ...editingStudent,
        name: formName.trim(),
        class: formClass,
        code: formCode.trim() || editingStudent.code,
        gender: formGender,
        status: formStatus,
        phone: formPhone.trim(),
        notes: formNotes.trim(),
      });
    } else {
      onAddStudent({
        name: formName.trim(),
        class: formClass,
        code: formCode.trim() || `HS-${Math.floor(10000 + Math.random() * 90000)}`,
        gender: formGender,
        avatarSeed: formName.trim(),
        status: formStatus,
        phone: formPhone.trim(),
        notes: formNotes.trim(),
      });
    }
    setIsModalOpen(false);
  };

  // Filter students
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = classFilter === 'all' || s.class === classFilter;
    const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
    return matchesSearch && matchesClass && matchesStatus;
  });

  const getStatusBadge = (status: StudyStatus) => {
    switch (status) {
      case 'Chăm chỉ':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Tiến bộ tốt':
        return 'bg-teal-50 text-teal-700 border-teal-200';
      case 'Đạt yêu cầu':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Cần cố gắng':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Cần theo dõi':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div id="students-tab-content" className="space-y-6 animate-in fade-in duration-200">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Quản lý học sinh THCS
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Danh sách học sinh, tình hình nộp bài và kết quả học tập theo lớp
          </p>
        </div>

        <button
          type="button"
          id="btn-add-student"
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md shadow-blue-500/20 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm học sinh mới</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex flex-1 items-center gap-3 w-full">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              id="input-search-student"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm theo tên học sinh hoặc mã số (HS-701...)"
              className="w-full pl-9.5 pr-4 py-2 text-sm bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
            />
          </div>

          {/* Class Filter */}
          <div className="flex items-center gap-1.5 shrink-0">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              id="select-filter-class"
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
            >
              <option value="all">Tất cả lớp (7A1, 7A2, 8B1)</option>
              <option value="7A1">Lớp 7A1</option>
              <option value="7A2">Lớp 7A2</option>
              <option value="8B1">Lớp 8B1</option>
            </select>
          </div>

          {/* Status Filter */}
          <select
            id="select-filter-status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="hidden sm:block px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
          >
            <option value="all">Mọi trạng thái học tập</option>
            <option value="Chăm chỉ">Chăm chỉ</option>
            <option value="Tiến bộ tốt">Tiến bộ tốt</option>
            <option value="Đạt yêu cầu">Đạt yêu cầu</option>
            <option value="Cần cố gắng">Cần cố gắng</option>
            <option value="Cần theo dõi">Cần theo dõi</option>
          </select>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl shrink-0 self-end md:self-center">
          <button
            type="button"
            onClick={() => setViewMode('cards')}
            className={`p-1.5 rounded-lg transition cursor-pointer ${
              viewMode === 'cards'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
            title="Xem dạng thẻ"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setViewMode('table')}
            className={`p-1.5 rounded-lg transition cursor-pointer ${
              viewMode === 'table'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
            title="Xem dạng bảng"
          >
            <TableIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Students Count Bar */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>
          Hiển thị <strong>{filteredStudents.length}</strong> / {students.length} học sinh
        </span>
        {searchTerm && (
          <button
            type="button"
            onClick={() => setSearchTerm('')}
            className="text-blue-600 hover:underline cursor-pointer"
          >
            Xóa tìm kiếm
          </button>
        )}
      </div>

      {/* Cards View */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStudents.map((student) => {
            const stats = calculateStudentStats(student, tasks, grades);

            return (
              <div
                key={student.id}
                id={`student-card-${student.id}`}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-blue-100/70 border border-blue-200 text-blue-800 flex items-center justify-center font-bold text-sm">
                        {student.name
                          .split(' ')
                          .map((n) => n[0])
                          .slice(-2)
                          .join('')}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm leading-snug">
                          {student.name}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                          <span className="font-semibold text-blue-700 px-1.5 py-0.2 bg-blue-50 rounded">
                            {student.class}
                          </span>
                          <span>{student.code}</span>
                          <span>•</span>
                          <span>{student.gender}</span>
                        </div>
                      </div>
                    </div>

                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${getStatusBadge(
                        student.status
                      )}`}
                    >
                      {student.status}
                    </span>
                  </div>

                  {/* Student Stats Summary */}
                  <div className="grid grid-cols-2 gap-2 my-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Đã hoàn thành:</span>
                      <span className="font-bold text-emerald-600 flex items-center gap-1 mt-0.5">
                        <CheckCircle className="w-3.5 h-3.5" />
                        {stats.completedCount}/{stats.totalAssigned} nhiệm vụ
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Điểm trung bình:</span>
                      <span className="font-bold text-blue-700 flex items-center gap-1 mt-0.5">
                        <Award className="w-3.5 h-3.5" />
                        {stats.averageScore !== null ? `${stats.averageScore}/10` : 'Chưa có'}
                      </span>
                    </div>
                  </div>

                  {/* Mini Progress Bar */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                      <span>Tiến độ bài học</span>
                      <span className="font-bold text-slate-700">{stats.completionRate}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${stats.completionRate}%` }}
                        className="bg-blue-600 h-full rounded-full transition-all duration-300"
                      />
                    </div>
                  </div>

                  {student.notes && (
                    <p className="text-xs text-slate-500 italic line-clamp-2 bg-slate-50/50 p-2 rounded-lg border border-dashed border-slate-200">
                      "{student.notes}"
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => onViewStudentDetail(student)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 hover:text-teal-900 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Xem chi tiết</span>
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => openEditModal(student)}
                      className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                      title="Chỉnh sửa thông tin"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteStudent(student.id, student.name)}
                      className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                      title="Xóa học sinh"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs font-bold uppercase text-slate-400 border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3.5">Mã HS</th>
                  <th className="px-5 py-3.5">Họ và tên</th>
                  <th className="px-5 py-3.5">Lớp</th>
                  <th className="px-5 py-3.5">Tiến độ nhiệm vụ</th>
                  <th className="px-5 py-3.5">Điểm TB</th>
                  <th className="px-5 py-3.5">Trạng thái học tập</th>
                  <th className="px-5 py-3.5 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map((student) => {
                  const stats = calculateStudentStats(student, tasks, grades);

                  return (
                    <tr
                      key={student.id}
                      className="hover:bg-slate-50/70 transition-colors"
                    >
                      <td className="px-5 py-3 font-mono text-xs text-slate-500">
                        {student.code}
                      </td>
                      <td className="px-5 py-3 font-bold text-slate-900">
                        <div className="flex items-center gap-2">
                          <span>{student.name}</span>
                          <span className="text-xs text-slate-400 font-normal">
                            ({student.gender})
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3 font-semibold text-blue-700">
                        {student.class}
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-emerald-600 text-xs">
                            {stats.completedCount}/{stats.totalAssigned}
                          </span>
                          <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div
                              style={{ width: `${stats.completionRate}%` }}
                              className="bg-emerald-500 h-full rounded-full"
                            />
                          </div>
                          <span className="text-[11px] text-slate-400">
                            {stats.completionRate}%
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3 font-extrabold text-blue-700">
                        {stats.averageScore !== null ? `${stats.averageScore}` : '--'}
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={`text-xs font-bold px-2.5 py-1 rounded-full border ${getStatusBadge(
                            student.status
                          )}`}
                        >
                          {student.status}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => onViewStudentDetail(student)}
                            className="p-1.5 text-slate-600 hover:text-teal-700 hover:bg-teal-50 rounded-lg cursor-pointer"
                            title="Xem chi tiết"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => openEditModal(student)}
                            className="p-1.5 text-slate-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg cursor-pointer"
                            title="Sửa"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onDeleteStudent(student.id, student.name)}
                            className="p-1.5 text-slate-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg cursor-pointer"
                            title="Xóa"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Student Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              {editingStudent ? 'Chỉnh sửa thông tin học sinh' : 'Thêm học sinh mới'}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Nhập các thông tin cơ bản để lưu vào danh bạ học sinh trường THCS Phan Bội Châu
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Họ và tên học sinh *
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Ví dụ: Nguyễn Văn An"
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Lớp *</label>
                  <select
                    value={formClass}
                    onChange={(e) => setFormClass(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="7A1">Lớp 7A1</option>
                    <option value="7A2">Lớp 7A2</option>
                    <option value="8B1">Lớp 8B1</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Mã học sinh
                  </label>
                  <input
                    type="text"
                    value={formCode}
                    onChange={(e) => setFormCode(e.target.value)}
                    placeholder="HS-70105"
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Giới tính
                  </label>
                  <select
                    value={formGender}
                    onChange={(e) => setFormGender(e.target.value as 'Nam' | 'Nữ')}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Trạng thái học tập
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as StudyStatus)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="Chăm chỉ">Chăm chỉ</option>
                    <option value="Tiến bộ tốt">Tiến bộ tốt</option>
                    <option value="Đạt yêu cầu">Đạt yêu cầu</option>
                    <option value="Cần cố gắng">Cần cố gắng</option>
                    <option value="Cần theo dõi">Cần theo dõi</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Số điện thoại liên hệ phụ huynh
                </label>
                <input
                  type="text"
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  placeholder="0912 xxx xxx"
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Ghi chú của giáo viên
                </label>
                <textarea
                  rows={2}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="Ghi nhận về thái độ, điểm mạnh hoặc lưu ý cần bồi dưỡng..."
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
                  {editingStudent ? 'Cập nhật' : 'Lưu học sinh'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
