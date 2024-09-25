import { OrderStatus } from "@/types/enums/order";
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
    {label: "Active", value: "false"},
    {label: "Deactivated", value: "true"},
];

export const status_order_options = [
    {label: "Pending", value: OrderStatus.Pending.toString()},
    {label: "Completed", value: OrderStatus.Completed.toString()},
    {label: "Cancelled", value: OrderStatus.Cancelled.toString()},
];