"use client";

import {Breadcrumbs} from "@/components/common/breadcrumb";
import {ContentLayout} from "@/components/common/content-layout";
import dynamic from "next/dynamic";

const PackageForm = dynamic(() => import("@/components/sections/packages/create-update-form").then((mod) => mod.PackageForm), {
    ssr: false
});

const breadcrumbItems = [
    {title: "Dashboard", link: "/"},
    {title: "Packages", link: "/packages"},
    {title: "New", link: "/packages/new"},
];

export default function Page() {
    return (
        <ContentLayout title="Package">
            <div className="space-y-6">
                <Breadcrumbs items={breadcrumbItems}/>
                <PackageForm initialData={null}/>
            </div>
        </ContentLayout>
    );
}
