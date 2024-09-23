import {Bug, CheckCircle2, Circle, HelpCircle, PackagePlus, ScrollText, Timer, XCircle,} from "lucide-react";

export const status_options = [
    {
        value: "backlog",
        label: "Backlog",
        icon: HelpCircle,
    },
    {
        value: "todo",
        label: "Todo",
        icon: Circle,
    },
    {
        value: "in-progress",
        label: "In Progress",
        icon: Timer,
    },
    {
        value: "done",
        label: "Done",
        icon: CheckCircle2,
    },
    {
        value: "canceled",
        label: "Canceled",
        icon: XCircle,
    },
];

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
