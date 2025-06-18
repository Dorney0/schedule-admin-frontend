export interface ScheduleItem {
    id: number;
    lessonNumber: number;
    subjectId: number;
    subjectName: string;
    employeeId: number;
    employeeName: string;
    cabinetId: number;
    cabinetName: string;
    classId: number;
    className: string;
    date: string;
    dayOfWeek: number;  // 1 = Понедельник, 2 = Вторник и т.д.
    durationMinutes: number;
}
