"use client";
import {ContentLayout} from "@/components/common/content-layout";
import {Breadcrumbs} from "@/components/common/breadcrumb";
import DataTablePackages from "@/components/sections/packages";

const breadcrumbItems = [
    {title: "Home", link: "/"},
    {title: "Packages", link: "/packages"},
];
export default function Page() {
    return (
        <ContentLayout title="Packages">
            <div className="space-y-6">
                <Breadcrumbs items={breadcrumbItems}/>
                <DataTablePackages/>
            </div>
        </ContentLayout>
    );
}
