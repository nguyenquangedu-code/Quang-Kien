import React from 'react';
import {
  LayoutDashboard,
  Users,
  CheckSquare,
  TrendingUp,
  Award,
  Bell,
  Sparkles,
} from 'lucide-react';
import { ActiveTab } from '../types';

interface SidebarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  counts: {
    students: number;
    tasks: number;
    pendingTasks: number;
    notices: number;
  };
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onSelectTab, counts }) => {
  const menuItems = [
    {
      id: 'overview' as ActiveTab,
      label: 'Tổng quan',
      icon: LayoutDashboard,
      badge: null,
      description: 'Chỉ số & Việc cần làm',
    },
    {
      id: 'students' as ActiveTab,
      label: 'Học sinh',
      icon: Users,
      badge: counts.students.toString(),
      description: 'Danh sách & Lớp học',
    },
    {
      id: 'tasks' as ActiveTab,
      label: 'Nhiệm vụ',
      icon: CheckSquare,
      badge: counts.tasks.toString(),
      description: 'Bài tập & Hạn nộp',
    },
    {
      id: 'progress' as ActiveTab,
      label: 'Tiến độ',
      icon: TrendingUp,
      badge: null,
      description: 'Tỷ lệ hoàn thành',
    },
    {
      id: 'grades' as ActiveTab,
      label: 'Kết quả',
      icon: Award,
      badge: null,
      description: 'Sổ điểm & Nhận xét',
    },
    {
      id: 'notifications' as ActiveTab,
      label: 'Thông báo',
      icon: Bell,
      badge: counts.notices > 0 ? counts.notices.toString() : null,
      description: 'Bản tin & Nhắc việc',
    },
  ];

  return (
    <aside
      id="main-sidebar"
      className="w-full lg:w-64 bg-white border-b lg:border-b-0 lg:border-r border-slate-200 lg:min-h-[calc(100vh-4.5rem)] shrink-0 p-3 sm:p-4 flex lg:flex-col justify-between"
    >
      <div className="w-full">
        {/* Navigation title on desktop */}
        <div className="hidden lg:block px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
          Menu Quản Trị
        </div>

        {/* Navigation list */}
        <nav className="flex lg:flex-col gap-1 sm:gap-1.5 overflow-x-auto lg:overflow-visible pb-1 lg:pb-0 scrollbar-none">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                id={`nav-item-${item.id}`}
                type="button"
                onClick={() => onSelectTab(item.id)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap lg:whitespace-normal cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <span className="text-left font-medium">{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-bold ml-2 ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Classroom Status Footer Card */}
      <div className="hidden lg:block mt-6 p-4 rounded-2xl bg-gradient-to-br from-blue-50/70 to-teal-50/70 border border-blue-100/80 text-xs">
        <div className="flex items-center gap-2 text-blue-900 font-bold mb-1">
          <Sparkles className="w-4 h-4 text-teal-600" />
          <span>Lớp học trực quan</span>
        </div>
        <p className="text-slate-600 leading-relaxed">
          Tối ưu hiển thị cho máy chiếu, bảng tương tác & thiết bị cảm ứng trong phòng học.
        </p>
      </div>
    </aside>
  );
};
