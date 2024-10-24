import {columns} from "./columns";

import {isActive_options, isDeleted_options,} from "@/components/common/filters";
import blogService from "@/services/blog-service";

import {DataTable} from "@/components/common/data-table-generic/data-table";
import {formBlogFilterAdvancedSchema} from "@/schemas/blog-schema";
import {FilterEnum} from "@/types/filter-enum";
import {formFilterAdvanceds} from "./filter-advanced-form";

export default function DataTableBlogs() {
    const filterEnums: FilterEnum[] = [
        {
            columnId: "isActive",
            title: "Is Active",
            options: isActive_options,
        },
        {columnId: "isDeleted", title: "Is deleted", options: isDeleted_options},
    ];

    return (
        <DataTable
            deleteData={blogService.delete}
            columns={columns}
            fetchData={blogService.fetchAll}
            columnSearch="title"
            filterEnums={filterEnums}
            formSchema={formBlogFilterAdvancedSchema}
            formFilterAdvanceds={formFilterAdvanceds}
        />
    );
}
