import { OrderStatus, PaymentMethod } from "@/types/enums/order";
import { Bug, PackagePlus, ScrollText } from "lucide-react";


export const label_options = [
    {
        value: "bug",
        label: "Bug",
        icon: Bug,
    },
    {
        value: "feature",
        label: "Feature",
        icon: PackagePlus,
    },
    {
        value: "documentation",
        label: "Documentation",
        icon: ScrollText,
    },
];

export const isDeleted_options = [
    {label: "Active", value: false},
    {label: "Deactivated", value: true},
];

export const status_order_options = [
    {label: "Pending", value: OrderStatus.Pending},
    {label: "Cancelled", value: OrderStatus.Cancelled},
    {label: "Completed", value: OrderStatus.Completed},
];

export const payment_order_options = [
    {label: "Creadit card", value: PaymentMethod.CreditCard},
    {label: "Paypal", value: PaymentMethod.Paypal},
    {label: "Bank Transfer", value: PaymentMethod.BankTransfer},
];

