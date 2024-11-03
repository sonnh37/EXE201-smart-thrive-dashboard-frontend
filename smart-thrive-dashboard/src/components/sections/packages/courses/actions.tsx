"use client";

import { DeleteBaseEntitysDialog } from "@/components/common/data-table-generic/delete-dialog-generic";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import courseService from "@/services/course-service";
import { Course } from "@/types/course";
import { useQueryClient } from "@tanstack/react-query";
import { Row } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

interface ActionsProps {
  row: Row<Course>;
  onCourseSelect: (course: Course) => void; // Thêm thuộc tính để nhận hàm chọn khóa học
}

const Actions: React.FC<ActionsProps> = ({ row, onCourseSelect }) => {
  const model = row.original;
  const router = useRouter();
  const queryClient = useQueryClient();

  const handleSelectCourse = () => {
    onCourseSelect(model); // Gọi hàm onCourseSelect để cập nhật khóa học
  };

  const [showDeleteTaskDialog, setShowDeleteTaskDialog] = React.useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => navigator.clipboard.writeText(model.id)}
          >
            Copy model ID
          </DropdownMenuItem>
          {/*<DropdownMenuItem onClick={handleCoursesClick}>*/}
          {/*    View photos*/}
          {/*</DropdownMenuItem>*/}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSelectCourse}>
            Select
          </DropdownMenuItem>{" "}
          {/* Thêm hành động chọn khóa học */}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default Actions;
