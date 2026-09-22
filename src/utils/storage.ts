import { Student, Task, StudentGradeRecord, Notice } from '../types';
import { INITIAL_STUDENTS, INITIAL_TASKS, INITIAL_GRADES, INITIAL_NOTICES } from '../data/initialData';

const STORAGE_KEYS = {
  STUDENTS: 'thcs_students_v1',
  TASKS: 'thcs_tasks_v1',
  GRADES: 'thcs_grades_v1',
  NOTICES: 'thcs_notices_v1',
};

export const loadInitialData = () => {
  try {
    const rawStudents = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    const rawTasks = localStorage.getItem(STORAGE_KEYS.TASKS);
    const rawGrades = localStorage.getItem(STORAGE_KEYS.GRADES);
    const rawNotices = localStorage.getItem(STORAGE_KEYS.NOTICES);

    let notices: Notice[] = rawNotices ? JSON.parse(rawNotices) : INITIAL_NOTICES;
    if (Array.isArray(notices)) {
      notices = notices.map((n: Notice) => ({
        ...n,
        content: n.content
          ? n.content
              .replace(/thầy Dương Thành Tín/gi, 'thầy Nguyễn Quang Kiên')
              .replace(/thầy Nguyễn Quang/gi, 'thầy Nguyễn Quang Kiên')
              .replace(/Dương Thành Tín/gi, 'Nguyễn Quang Kiên')
          : n.content,
      }));
    }

    return {
      students: rawStudents ? JSON.parse(rawStudents) : INITIAL_STUDENTS,
      tasks: rawTasks ? JSON.parse(rawTasks) : INITIAL_TASKS,
      grades: rawGrades ? JSON.parse(rawGrades) : INITIAL_GRADES,
      notices,
    };
  } catch (err) {
    console.error('Error loading data from localStorage:', err);
    return {
      students: INITIAL_STUDENTS,
      tasks: INITIAL_TASKS,
      grades: INITIAL_GRADES,
      notices: INITIAL_NOTICES,
    };
  }
};

export const saveToStorage = (
  students: Student[],
  tasks: Task[],
  grades: StudentGradeRecord[],
  notices: Notice[]
) => {
  try {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    localStorage.setItem(STORAGE_KEYS.GRADES, JSON.stringify(grades));
    localStorage.setItem(STORAGE_KEYS.NOTICES, JSON.stringify(notices));
  } catch (err) {
    console.error('Error saving data to localStorage:', err);
  }
};

export const resetAllData = () => {
  localStorage.removeItem(STORAGE_KEYS.STUDENTS);
  localStorage.removeItem(STORAGE_KEYS.TASKS);
  localStorage.removeItem(STORAGE_KEYS.GRADES);
  localStorage.removeItem(STORAGE_KEYS.NOTICES);
  return {
    students: INITIAL_STUDENTS,
    tasks: INITIAL_TASKS,
    grades: INITIAL_GRADES,
    notices: INITIAL_NOTICES,
  };
};

/**
 * Calculate Student Stats:
 * - Completed tasks count
 * - Total tasks assigned to their class
 * - Completion rate (%)
 * - Average score (0 - 10)
 */
export const calculateStudentStats = (
  student: Student,
  tasks: Task[],
  grades: StudentGradeRecord[]
) => {
  // Tasks applicable to student
  const applicableTasks = tasks.filter(
    (t) => t.targetClass === 'Tất cả' || t.targetClass === student.class
  );

  const studentGrades = grades.filter((g) => g.studentId === student.id);

  let completedCount = 0;
  let inProgressCount = 0;
  let overdueCount = 0;
  let notStartedCount = 0;
  let scoreSum = 0;
  let scoredCount = 0;

  applicableTasks.forEach((task) => {
    const record = studentGrades.find((g) => g.taskId === task.id);
    const status = record?.status || 'not_started';

    if (status === 'completed') {
      completedCount++;
    } else if (status === 'in_progress') {
      inProgressCount++;
    } else if (status === 'overdue') {
      overdueCount++;
    } else {
      // Check if task itself is past due
      const isPastDue = new Date(task.dueDate).getTime() < new Date().setHours(0, 0, 0, 0);
      if (isPastDue) overdueCount++;
      else notStartedCount++;
    }

    if (record?.score !== null && record?.score !== undefined) {
      scoreSum += record.score;
      scoredCount++;
    }
  });

  const totalAssigned = applicableTasks.length;
  const completionRate = totalAssigned > 0 ? Math.round((completedCount / totalAssigned) * 100) : 0;
  const averageScore = scoredCount > 0 ? Number((scoreSum / scoredCount).toFixed(1)) : null;

  return {
    totalAssigned,
    completedCount,
    inProgressCount,
    overdueCount,
    notStartedCount,
    completionRate,
    averageScore,
    scoredCount,
  };
};

/**
 * System-wide / Filtered Metrics
 */
export const calculateSystemStats = (
  students: Student[],
  tasks: Task[],
  grades: StudentGradeRecord[],
  filterClass: string = 'all'
) => {
  const filteredStudents =
    filterClass === 'all' ? students : students.filter((s) => s.class === filterClass);

  const filteredTasks =
    filterClass === 'all'
      ? tasks
      : tasks.filter((t) => t.targetClass === 'Tất cả' || t.targetClass === filterClass);

  let totalTasksCompleted = 0;
  let totalTasksNotCompleted = 0;
  let allScores: number[] = [];

  filteredStudents.forEach((student) => {
    const applicable = tasks.filter(
      (t) => t.targetClass === 'Tất cả' || t.targetClass === student.class
    );
    applicable.forEach((t) => {
      const g = grades.find((gr) => gr.studentId === student.id && gr.taskId === t.id);
      if (g?.status === 'completed') {
        totalTasksCompleted++;
      } else {
        totalTasksNotCompleted++;
      }
      if (g?.score !== null && g?.score !== undefined) {
        allScores.push(g.score);
      }
    });
  });

  const totalOpportunities = totalTasksCompleted + totalTasksNotCompleted;
  const overallCompletionRate =
    totalOpportunities > 0 ? Math.round((totalTasksCompleted / totalOpportunities) * 100) : 0;

  const averageScore =
    allScores.length > 0
      ? Number((allScores.reduce((a, b) => a + b, 0) / allScores.length).toFixed(1))
      : 0;

  return {
    totalStudents: filteredStudents.length,
    totalTasks: filteredTasks.length,
    totalTasksCompleted,
    totalTasksNotCompleted,
    overallCompletionRate,
    averageScore,
  };
};
