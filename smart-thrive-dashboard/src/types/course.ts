import Module from "module";
import { BaseEntity } from "./base";
import { Feedback } from "./feedback";
import { Subject } from "./subject";
import { Provider } from "./provider";
import { PackageXCourse } from "./package-x-course";

export enum CourseType {
  Online = 1,
  Offline = 2,
}

export enum CourseStatus {
  Active = 1,
  Inactive = 2,
  Completed = 3,
}

export enum DayInWeek {
  Monday = 1,
  Tuesday = 2,
  Wednesday = 3,
}

export interface Course extends BaseEntity {
  subjectId?: string;
  providerId?: string;
  teacherName?: string;
  type?: CourseType;
  name?: string;
  code?: string;
  courseName?: string;
  description?: string;
  backgroundImage?: string;
  price?: number;
  soldCourses?: number;
  totalSlots?: number;
  totalSessions?: number;
  startTime?: string;
  endTime?: string;
  status?: CourseStatus;
  isActive: boolean;
  startDate?: Date;
  endDate?: Date;
  dayInWeek?: DayInWeek;
  subject?: Subject;
  provider?: Provider;
  modules?: Module[];
  feedbacks?: Feedback[];
  packageXCourses?: PackageXCourse[];
}
