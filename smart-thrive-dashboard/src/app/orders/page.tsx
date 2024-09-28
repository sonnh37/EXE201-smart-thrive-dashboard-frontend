"use client";
import {ContentLayout} from "@/components/common/content-layout";
import {Breadcrumbs} from "@/components/common/breadcrumb";
import DataTableOrders from "@/components/sections/orders";

const breadcrumbItems = [
    {title: "Dashboard", link: "/"},
    {title: "Orders", link: "/orders"},
];
export default function Page() {
    return (
        <ContentLayout title="Orders">
            <div className="space-y-6">
                <Breadcrumbs items={breadcrumbItems}/>
                <DataTableOrders/>
            </div>
        </ContentLayout>
    );
}
