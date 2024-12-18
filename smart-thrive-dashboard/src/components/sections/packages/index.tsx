import {columns} from "./columns";

import {isActive_options, isDeleted_options, status_package_options,} from "@/components/common/filters";
import packageService from "@/services/package-service";

import {formPackageFilterAdvancedSchema} from "@/schemas/package-schema";
import {formFilterAdvanceds} from "./filter-advanced-form";
import {FilterEnum} from "@/types/filter-enum";
import {DataTable} from "@/components/common/data-table-generic/data-table";

export default function DataTablePackages() {
    const filterEnums: FilterEnum[] = [
        {columnId: "status", title: "Status", options: status_package_options},
        {
            columnId: "isActive",
            title: "Is Active",
            options: isActive_options,
        },
        {columnId: "isDeleted", title: "Is deleted", options: isDeleted_options},
    ];

    return (
        <DataTable
            deleteData={packageService.delete}
            columns={columns}
            fetchData={packageService.fetchAll}
            columnSearch="name"
            filterEnums={filterEnums}
            formSchema={formPackageFilterAdvancedSchema}
            formFilterAdvanceds={formFilterAdvanceds}
        />
    );
}
