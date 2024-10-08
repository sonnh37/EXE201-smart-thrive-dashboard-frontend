import {CourseStatus, CourseType} from "@/types/enums/course";
import {OrderStatus, PaymentMethod} from "@/types/enums/order";
import {PackageStatus} from "@/types/enums/package";

export const isDeleted_options = [
    {label: "Active", value: false},
    {label: "Deactivated", value: true},
];

export const isActive_options = [
    {label: "Displaying", value: false},
    {label: "Not show", value: true},
];

export const status_order_options = [
    {label: "Pending", value: OrderStatus.Pending},
    {label: "Cancelled", value: OrderStatus.Cancelled},
    {label: "Completed", value: OrderStatus.Completed},
];

export const type_course_options = [
    {label: "Online", value: CourseType.Online},
    {label: "Offline", value: CourseType.Offline},
];

export const status_course_options = [
    {label: "Pending", value: CourseStatus.Pending},
    {label: "Approved", value: CourseStatus.Approved},
    {label: "Rejected", value: CourseStatus.Rejected},
];

export const status_package_options = [
    {label: "Pending", value: PackageStatus.Pending},
    {label: "Approved", value: PackageStatus.Approved},
    {label: "Rejected", value: PackageStatus.Rejected},
];

export const payment_order_options = [
    {label: "Creadit card", value: PaymentMethod.CreditCard},
    {label: "Paypal", value: PaymentMethod.Paypal},
    {label: "Bank Transfer", value: PaymentMethod.BankTransfer},
];
