import { BaseEntity } from "./base";
import { Order } from "./order";
import { PackageXCourse } from "./package-x-course";
import { StudentXPackage } from "./student-x-package";

export enum PackageStatus {
  Active = 1,
  Inactive = 2,
  // Add more statuses as needed
}
export interface Package extends BaseEntity {
  name?: string;
  quantityCourse?: number;
  totalPrice?: number;
  isActive: boolean;
  status?: PackageStatus;
  packageXCourses?: PackageXCourse[];
  orders?: Order[];
  studentXPackages?: StudentXPackage[];
}
