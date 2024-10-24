"use client";

import {DataTableColumnHeader} from "@/components/common/data-table-generic/data-table-column-header";
import {Badge} from "@/components/ui/badge";
import {Checkbox} from "@/components/ui/checkbox";
import {CourseStatus, CourseType} from "@/types/enums/course";
import {Course} from "@/types/course";
import {ColumnDef} from "@tanstack/react-table";
import Actions from "./actions";
import Image from "next/image";

export const columns: ColumnDef<Course>[] = [
    {
        id: "select",
        header: ({table}) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({row}) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "backgroundImage",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title="Image"/>
        ),
        cell: ({row}) => {
            const imageUrl = row.getValue("backgroundImage") as string;
            return (
                <Image
                    src={imageUrl}
                    alt="Background"
                    width={100}
                    height={100}
                    style={{objectFit: 'cover'}}
                />
            );
        },
    },
    {
        accessorKey: "name",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title="Name"/>
        ),
    },
    {
        accessorKey: "code",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title="Code"/>
        ),
    },
    {
        accessorKey: "subject.name",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title="Subject"/>
        ),
    },
    {
        accessorKey: "provider.website",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title="Website's Provider"/>
        ),
    },
    {
        accessorKey: "teacherName",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title="Teacher"/>
        ),
    },
    {
        accessorKey: "description",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title="Description"/>
        ),
        cell: ({row}) => {
            return (
                <div className="truncate max-w-xs">{row.getValue("description")}</div>
            );
        },
    },
    {
        accessorKey: "price",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title="Price"/>
        ),
        cell: ({row}) => {
            const amount = parseFloat(row.getValue("price"));

            const formatted = new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
            }).format(amount);

            return <div className="font-medium">{formatted}</div>;
        },
    },
    {
        accessorKey: "totalSlots",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title="totalSlots"/>
        ),
        cell: ({row}) => {
            const amount = parseFloat(row.getValue("totalSlots"));

            return <div className="font-medium">{amount}</div>;
        },
    },
    {
        accessorKey: "totalSessions",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title="totalSessions"/>
        ),
        cell: ({row}) => {
            const amount = parseFloat(row.getValue("totalSessions"));

            return <div className="font-medium">{amount}</div>;
        },
    },
    {
        accessorKey: "startTime",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title="Start Time"/>
        ),
        cell: ({row}) => {
            const timeSpan = row.getValue('startTime') as string;

            if (timeSpan) {
                const [hours, minutes] = timeSpan.split(':'); // Tách giờ và phút
                const ampm = parseInt(hours) < 12 ? 'AM' : 'PM'; // Xác định AM hoặc PM

                const formattedTime = `${hours}:${minutes} ${ampm}`; // Định dạng đẹp

                return <span>{formattedTime}</span>;
            }
            return <span>N/A</span>;
        },
    },
    {
        accessorKey: "endTime",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title="End Time"/>
        ),
        cell: ({row}) => {
            const timeSpan = row.getValue('endTime') as string;

            if (timeSpan) {
                const [hours, minutes] = timeSpan.split(':'); // Tách giờ và phút
                const ampm = parseInt(hours) < 12 ? 'AM' : 'PM'; // Xác định AM hoặc PM

                const formattedTime = `${hours}:${minutes} ${ampm}`; // Định dạng đẹp

                return <span>{formattedTime}</span>;
            }
            return <span>N/A</span>;
        },
    },
    {
        accessorKey: "startDate",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title="Start learning"/>
        ),
        cell: ({row}) => {
            const date = new Date(row.getValue("startDate"));
            return date.toLocaleDateString("en-US", {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric",
            });
        },
    },
    {
        accessorKey: "endDate",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title="End learning"/>
        ),
        cell: ({row}) => {
            const date = new Date(row.getValue("endDate"));
            return date.toLocaleDateString("en-US", {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric",
            });
        },
    },
    {
        accessorKey: "createdDate",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title="Data created"/>
        ),
        cell: ({row}) => {
            const date = new Date(row.getValue("createdDate"));
            return date.toLocaleDateString("en-US", {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric",
            });
        },
    },
    {
        accessorKey: "type",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title="Type"/>
        ),
        cell: ({row}) => {
            const status = row.getValue("type") as CourseType;
            const statusText = CourseType[status];

            let badgeVariant:
                | "secondary"
                | "destructive"
                | "default"
                | "outline"
                | null = "default";

            switch (status) {
                case CourseType.Online:
                    badgeVariant = "outline";
                    break;
                case CourseType.Offline:
                    badgeVariant = "outline";
                    break;
                default:
                    badgeVariant = "default";
            }

            return <Badge variant={badgeVariant}>{statusText}</Badge>;
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id));
        },
    },
    {
        accessorKey: "status",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title="Status"/>
        ),
        cell: ({row}) => {
            const status = row.getValue("status") as CourseStatus;
            const statusText = CourseStatus[status];

            let badgeVariant:
                | "secondary"
                | "destructive"
                | "default"
                | "outline"
                | null = "default";

            switch (status) {
                case CourseStatus.Pending:
                    badgeVariant = "secondary";
                    break;
                case CourseStatus.Approved:
                    badgeVariant = "default";
                    break;
                case CourseStatus.Rejected:
                    badgeVariant = "destructive";
                    break;
                default:
                    badgeVariant = "default";
            }

            return <Badge variant={badgeVariant}>{statusText}</Badge>;
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id));
        },
    },
    {
        accessorKey: "isActive",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title="Is Active"/>
        ),
        cell: ({row}) => {
            const isDeleted = row.getValue("isActive") as boolean;
            if (!isDeleted) {
                return <Badge variant="default">Displaying</Badge>;
            }
            return <Badge variant="secondary">Not show</Badge>;
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id));
        },
    },
    {
        accessorKey: "isDeleted",
        header: ({column}) => <DataTableColumnHeader column={column} title=""/>,
        cell: ({row}) => {
            const isDeleted = row.getValue("isDeleted") as boolean;
            if (!isDeleted) {
                return (
                    <Image
                        src="https://firebasestorage.googleapis.com/v0/b/smart-thrive.appspot.com/o/Blog%2Fcheck.png?alt=media&token=1bdb7751-4bdc-4af1-b6e1-9b758df3a3d5"
                        width={500}
                        height={500}
                        alt="Gallery Icon"
                        className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0"
                    />
                );
            }
            return (
                <Image
                    src="https://firebasestorage.googleapis.com/v0/b/smart-thrive.appspot.com/o/Blog%2Funcheck.png?alt=media&token=3b2b94d3-1c59-4a96-b4c6-312033d868b1"
                    width={500}
                    height={500}
                    alt="Gallery Icon"
                    className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0"
                />
            );
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id));
        },
    },
    {
        id: "actions",
        cell: ({row}) => {
            return <Actions row={row}/>;
        },
    },
];
