import React, { useState } from 'react';
import {
  Bell,
  Plus,
  AlertTriangle,
  Pin,
  Trash2,
  Calendar,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  Search,
} from 'lucide-react';
import { Notice, PriorityLevel, Task } from '../types';

interface NotificationsTabProps {
  notices: Notice[];
  tasks: Task[];
  onAddNotice: (notice: Omit<Notice, 'id'>) => void;
  onDeleteNotice: (id: string, title: string) => void;
  onTogglePinNotice: (id: string) => void;
  onSelectTask: (task: Task) => void;
}

export const NotificationsTab: React.FC<NotificationsTabProps> = ({
  notices,
  tasks,
  onAddNotice,
  onDeleteNotice,
  onTogglePinNotice,
  onSelectTask,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formTitle, setFormTitle] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0]);
  const [formRecipient, setFormRecipient] = useState('Toàn bộ học sinh');
  const [formPriority, setFormPriority] = useState<PriorityLevel>('normal');

  const openCreateModal = () => {
    setFormTitle('');
    setFormContent('');
    setFormDate(new Date().toISOString().split('T')[0]);
    setFormRecipient('Toàn bộ học sinh');
    setFormPriority('normal');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formContent.trim()) return;

    onAddNotice({
      title: formTitle.trim(),
      content: formContent.trim(),
      date: formDate,
      recipient: formRecipient,
      priority: formPriority,
      pinned: formPriority === 'urgent',
    });

    setIsModalOpen(false);
  };

  // Filter notices
  const filteredNotices = notices.filter((n) => {
    const matchesSearch =
      n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = priorityFilter === 'all' || n.priority === priorityFilter;
    return matchesSearch && matchesPriority;
  });

  // Calculate "Việc cần làm"
  const now = new Date().setHours(0, 0, 0, 0);
  const overdueTasks = tasks.filter(
    (t) =>
      t.status !== 'completed' &&
      new Date(t.dueDate).getTime() < now
  );

  const dueSoonTasks = tasks.filter((t) => {
    const due = new Date(t.dueDate).getTime();
    return t.status !== 'completed' && due >= now && due <= now + 4 * 86400000;
  });

  const getPriorityBadge = (priority: PriorityLevel) => {
    switch (priority) {
      case 'urgent':
        return {
          label: 'Khẩn cấp',
          badgeClass: 'bg-rose-600 text-white shadow-xs shadow-rose-500/20',
        };
      case 'important':
        return {
          label: 'Quan trọng',
          badgeClass: 'bg-amber-500 text-white shadow-xs shadow-amber-500/20',
        };
      case 'normal':
      default:
        return {
          label: 'Bình thường',
          badgeClass: 'bg-slate-200 text-slate-700',
        };
    }
  };

  return (
    <div id="notifications-tab-content" className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Thông báo & Nhắc việc học tập
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Phát thông báo lớp học, thông báo lịch kiểm tra và theo dõi danh sách việc cần xử lý
          </p>
        </div>

        <button
          type="button"
          id="btn-add-notice"
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md shadow-blue-500/20 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tạo thông báo mới</span>
        </button>
      </div>

      {/* Việc cần làm Section */}
      <div className="bg-gradient-to-br from-amber-50/70 via-white to-rose-50/50 p-5 sm:p-6 rounded-2xl border border-amber-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500 text-white">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">
                Khu vực "Việc cần làm" & Nhắc việc giáo viên
              </h3>
              <p className="text-xs text-slate-500">
                Các nhiệm vụ quá hạn hoặc sắp đến ngày hạn chót nộp bài
              </p>
            </div>
          </div>

          <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
            {overdueTasks.length + dueSoonTasks.length} nhiệm vụ cần chú ý
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {/* Overdue tasks */}
          <div className="bg-white/90 p-4 rounded-xl border border-rose-200 shadow-xs">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-bold text-rose-700 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4" />
                Nhiệm vụ đã quá hạn ({overdueTasks.length})
              </span>
              <span className="text-[11px] text-rose-500 font-semibold">Ưu tiên xử lý</span>
            </div>

            {overdueTasks.length === 0 ? (
              <p className="text-xs text-slate-400 py-3 text-center">Không có nhiệm vụ nào bị quá hạn.</p>
            ) : (
              <div className="space-y-2">
                {overdueTasks.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => onSelectTask(t)}
                    className="p-2.5 bg-rose-50/60 hover:bg-rose-100/60 rounded-lg border border-rose-100 transition cursor-pointer flex items-center justify-between gap-2 text-xs"
                  >
                    <div>
                      <span className="font-bold text-rose-900 block leading-snug">{t.title}</span>
                      <span className="text-[11px] text-rose-600 font-medium">
                        Môn: {t.subject} • Lớp: {t.targetClass}
                      </span>
                    </div>
                    <span className="text-[11px] font-bold text-rose-700 whitespace-nowrap">
                      Hạn: {t.dueDate}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sắp hết hạn */}
          <div className="bg-white/90 p-4 rounded-xl border border-amber-200 shadow-xs">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-bold text-amber-700 flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                Nhiệm vụ sắp hết hạn ({dueSoonTasks.length})
              </span>
              <span className="text-[11px] text-amber-600 font-semibold">Trong 4 ngày tới</span>
            </div>

            {dueSoonTasks.length === 0 ? (
              <p className="text-xs text-slate-400 py-3 text-center">Không có nhiệm vụ nào cận hạn.</p>
            ) : (
              <div className="space-y-2">
                {dueSoonTasks.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => onSelectTask(t)}
                    className="p-2.5 bg-amber-50/60 hover:bg-amber-100/60 rounded-lg border border-amber-100 transition cursor-pointer flex items-center justify-between gap-2 text-xs"
                  >
                    <div>
                      <span className="font-bold text-amber-900 block leading-snug">{t.title}</span>
                      <span className="text-[11px] text-amber-700 font-medium">
                        Môn: {t.subject} • Lớp: {t.targetClass}
                      </span>
                    </div>
                    <span className="text-[11px] font-bold text-amber-800 whitespace-nowrap">
                      Hạn: {t.dueDate}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar for Notices */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm kiếm thông báo theo tiêu đề hoặc nội dung..."
            className="w-full pl-9.5 pr-4 py-2 text-sm bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="px-3.5 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none cursor-pointer shrink-0"
        >
          <option value="all">Tất cả mức độ ưu tiên</option>
          <option value="urgent">Khẩn cấp</option>
          <option value="important">Quan trọng</option>
          <option value="normal">Bình thường</option>
        </select>
      </div>

      {/* Notice Cards List */}
      <div className="space-y-4">
        {filteredNotices.map((notice) => {
          const priority = getPriorityBadge(notice.priority);
          const isUrgent = notice.priority === 'urgent';
          const isImportant = notice.priority === 'important';

          return (
            <div
              key={notice.id}
              id={`notice-card-${notice.id}`}
              className={`rounded-2xl p-5 sm:p-6 transition-all border shadow-xs hover:shadow-md ${
                isUrgent
                  ? 'bg-rose-50/40 border-rose-300 ring-1 ring-rose-200'
                  : isImportant
                  ? 'bg-amber-50/40 border-amber-300 ring-1 ring-amber-200'
                  : 'bg-white border-slate-200/80'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-2.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${priority.badgeClass}`}
                  >
                    {priority.label}
                  </span>

                  <span className="text-xs font-semibold px-2.5 py-0.5 bg-slate-100 text-slate-700 rounded-full border border-slate-200 flex items-center gap-1">
                    <Users className="w-3 h-3 text-slate-500" />
                    {notice.recipient}
                  </span>

                  {notice.pinned && (
                    <span className="text-[11px] font-bold px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full flex items-center gap-1">
                      <Pin className="w-3 h-3 fill-current" />
                      Đã ghim
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => onTogglePinNotice(notice.id)}
                    className={`p-1.5 rounded-lg transition cursor-pointer ${
                      notice.pinned
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                    }`}
                    title={notice.pinned ? 'Bỏ ghim' : 'Ghim thông báo lên đầu'}
                  >
                    <Pin className={`w-4 h-4 ${notice.pinned ? 'fill-current' : ''}`} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteNotice(notice.id, notice.title)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                    title="Xóa thông báo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2 leading-snug">
                {notice.title}
              </h3>

              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line mb-3">
                {notice.content}
              </p>

              <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-100/80">
                <span className="flex items-center gap-1 font-medium">
                  <Calendar className="w-3.5 h-3.5" />
                  Ngày đăng: {notice.date}
                </span>
                <span className="font-medium text-slate-500">Người gửi: GV. Nguyễn Quang Kiên</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Add Notice */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Tạo thông báo mới</h3>
            <p className="text-xs text-slate-500 mb-4">
              Gửi thông báo và nhắc việc đến học sinh THCS Phan Bội Châu
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tiêu đề thông báo *
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Ví dụ: Kế hoạch ôn tập kiểm tra giữa kỳ..."
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Đối tượng nhận
                  </label>
                  <select
                    value={formRecipient}
                    onChange={(e) => setFormRecipient(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="Toàn bộ học sinh">Toàn bộ học sinh</option>
                    <option value="Toàn trường">Toàn trường</option>
                    <option value="Lớp 7A1">Lớp 7A1</option>
                    <option value="Lớp 7A2">Lớp 7A2</option>
                    <option value="Lớp 8B1">Lớp 8B1</option>
                    <option value="Giáo viên bộ môn">Giáo viên bộ môn</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Mức độ ưu tiên
                  </label>
                  <select
                    value={formPriority}
                    onChange={(e) => setFormPriority(e.target.value as PriorityLevel)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="normal">Bình thường</option>
                    <option value="important">Quan trọng</option>
                    <option value="urgent">Khẩn cấp</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Ngày đăng
                </label>
                <input
                  type="date"
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nội dung thông báo chi tiết *
                </label>
                <textarea
                  rows={4}
                  required
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  placeholder="Ghi rõ thông tin cần truyền đạt đến các em học sinh..."
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
                  Đăng thông báo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
