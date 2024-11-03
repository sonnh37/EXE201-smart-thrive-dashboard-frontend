  import { columns } from "./columns";
  import {
    isActive_options,
    isDeleted_options,
    status_course_options,
    type_course_options,
  } from "@/components/common/filters";
  import { DataTable } from "@/components/common/data-table-generic/data-table";
  import { formCourseFilterAdvancedSchema } from "@/schemas/course-schema";
  import courseService from "@/services/course-service";
  import { FilterEnum } from "@/types/filter-enum";
  import { useEffect, useState } from "react";
  import { CourseGetAllQuery } from "@/types/queries/course-query";
  import { Course } from "@/types/course";
  import { ColumnDef } from "@tanstack/react-table";
  import { useAppDispatch, useAppSelector } from "@/lib/hooks";
  import { setSelectedCourses } from "@/lib/slices/coursesSlice";
  import { Checkbox } from "@/components/ui/checkbox";
  import { PackageXCourseUpdateCommand } from "@/types/commands/package-command";

  interface DataTableCoursesProps {
    packageId?: string;
    onChange: (value: PackageXCourseUpdateCommand[]) => void;
    packageXCourses?: PackageXCourseUpdateCommand[];
  }

  export default function DataTableCourses({
    packageId,
    onChange,
    packageXCourses
  }: DataTableCoursesProps) {
    const dispatch = useAppDispatch();
  const reduxSelectedCourses = useAppSelector(
    (state) => state.courses.selectedCourses
  );

  const selectedCourses = packageXCourses
  ? [
      ...packageXCourses, // Lấy từ initialData
      ...reduxSelectedCourses.filter(
        (course) =>
          !packageXCourses.some(
            (initCourse: any) => initCourse.courseId === course.courseId
          )
      ),
    ]
  : reduxSelectedCourses;

  const [getQueryParams, setGetQueryParams] = useState<CourseGetAllQuery>();

    useEffect(() => {
      const defaultQueryParams: CourseGetAllQuery = {
        isPagination: true,
        // packageId: packageId,
      };
      setGetQueryParams(defaultQueryParams);
    }, [packageId]);

    const columns_: ColumnDef<Course>[] = [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) => {
              table.toggleAllPageRowsSelected(!!value);
              const allRows = table.getRowModel().rows;
              const allSelectedCourses = allRows.map((row) => row.original);
              const allSelectedPackageXCourses = allSelectedCourses.map(
                (course) => ({ courseId: course.id, packageId })
              );

              if (value) {
                dispatch(setSelectedCourses(allSelectedPackageXCourses));
                onChange(allSelectedPackageXCourses);
              } else {
                dispatch(setSelectedCourses([]));
                onChange([]);
              }
            }}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={selectedCourses.some(
              (course) => course.courseId === row.original.id
            )}
            onCheckedChange={(value) => {
              const updatedCourses = value
                ? [...selectedCourses, { courseId: row.original.id, packageId }]
                : selectedCourses.filter(
                    (course) => course.courseId !== row.original.id
                  );
        
              dispatch(setSelectedCourses(updatedCourses));
              onChange(updatedCourses);
            }}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      ...columns,
    ];

    useEffect(() => {
      console.log("check_selected", selectedCourses);
    }, [selectedCourses]);

    return (
      <DataTable
        deleteData={courseService.delete}
        columns={columns_}
        fetchData={courseService.fetchAll}
        columnSearch="name"
        defaultValues={getQueryParams}
        filterEnums={[
          { columnId: "status", title: "Status", options: status_course_options },
          { columnId: "type", title: "Type", options: type_course_options },
          { columnId: "isActive", title: "Is Active", options: isActive_options },
          {
            columnId: "isDeleted",
            title: "Is deleted",
            options: isDeleted_options,
          },
        ]}
        formSchema={formCourseFilterAdvancedSchema}
      />
    );
  }

