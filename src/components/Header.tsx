import React from 'react';
import { Volume2, VolumeX, School, UserCheck, RotateCcw, GraduationCap, Eye } from 'lucide-react';
import { UserRole } from '../types';

interface HeaderProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
  userRole: UserRole;
  onChangeUserRole: (role: UserRole) => void;
  onResetData: () => void;
  onOpenStudentPortal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  soundEnabled,
  onToggleSound,
  userRole,
  onChangeUserRole,
  onResetData,
  onOpenStudentPortal,
}) => {
  return (
    <header
      id="app-header"
      className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 gap-4">
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-700 via-blue-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 shrink-0">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight truncate">
                  QUẢN TRỊ HỌC TẬP THCS
                </h1>
                <span className="hidden md:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                  Năm học 2026 - 2027
                </span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-500 mt-0.5">
                <span className="flex items-center gap-1 font-medium text-slate-700">
                  <School className="w-3.5 h-3.5 text-teal-600" />
                  THCS Phan Bội Châu
                </span>
                <span className="text-slate-300">•</span>
                <span className="flex items-center gap-1 font-medium text-blue-700">
                  <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                  GV: Nguyễn Quang Kiên
                </span>
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Student Preview Portal Button */}
            <button
              type="button"
              id="header-student-portal-btn"
              onClick={onOpenStudentPortal}
              title="Mở giao diện góc nhìn học sinh"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-xl transition cursor-pointer"
            >
              <Eye className="w-4 h-4 text-teal-600" />
              <span>Góc nhìn Học sinh</span>
            </button>

            {/* Sound Toggle */}
            <button
              type="button"
              id="header-sound-toggle-btn"
              onClick={onToggleSound}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border transition cursor-pointer ${
                soundEnabled
                  ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
                  : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
              }`}
              title={soundEnabled ? 'Đang bật âm thanh thông báo' : 'Đang tắt âm thanh thông báo'}
              aria-label="Bật/Tắt âm thanh"
            >
              {soundEnabled ? (
                <>
                  <Volume2 className="w-4 h-4 text-blue-600 animate-pulse" />
                  <span className="hidden sm:inline">Âm thanh: Bật</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4 text-slate-500" />
                  <span className="hidden sm:inline">Âm thanh: Tắt</span>
                </>
              )}
            </button>

            {/* Role Switcher Pill */}
            <div
              id="header-role-switcher"
              className="inline-flex bg-slate-100 p-1 rounded-xl border border-slate-200"
            >
              <button
                type="button"
                onClick={() => onChangeUserRole('teacher')}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition cursor-pointer ${
                  userRole === 'teacher'
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Giáo viên
              </button>
              <button
                type="button"
                onClick={() => onChangeUserRole('student')}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition cursor-pointer ${
                  userRole === 'student'
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Học sinh
              </button>
            </div>

            {/* Reset Demo Data Button */}
            <button
              type="button"
              id="header-reset-data-btn"
              onClick={onResetData}
              title="Đặt lại dữ liệu mẫu ban đầu"
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl border border-transparent hover:border-slate-200 transition cursor-pointer"
              aria-label="Đặt lại dữ liệu"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
