import {columns} from "./columns";

import {
    isActive_options,
    isDeleted_options,
    status_course_options,
    type_course_options,
} from "@/components/common/filters";

import {formFilterAdvanceds} from "./filter-advanced-form";
import {FilterEnum} from "@/types/filter-enum";
import {DataTable} from "@/components/common/data-table-generic/data-table";
import {formCourseFilterAdvancedSchema} from "@/schemas/course-schema";
import {deleteCourse, fetchCourses} from "@/services/course-service";

export default function DataTableCourses() {
    const filterEnums: FilterEnum[] = [
        {columnId: "status", title: "Status", options: status_course_options},
        {
            columnId: "type",
            title: "Type",
            options: type_course_options,
        },
        {
            columnId: "isActive",
            title: "Is Active",
            options: isActive_options,
        },
        {columnId: "isDeleted", title: "Is deleted", options: isDeleted_options},
    ];

    return (
        <DataTable
            deleteData={deleteCourse}
            columns={columns}
            fetchData={fetchCourses}
            columnSearch="name"
            filterEnums={filterEnums}
            formSchema={formCourseFilterAdvancedSchema}
            formFilterAdvanceds={formFilterAdvanceds}
        />
    );
}
