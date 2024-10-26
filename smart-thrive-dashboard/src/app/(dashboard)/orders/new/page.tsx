"use client";

import {Breadcrumbs} from "@/components/common/breadcrumb";
import {ContentLayout} from "@/components/common/content-layout";
import dynamic from "next/dynamic";

const OrderForm = dynamic(() => import("@/components/sections/orders/create-update-form").then((mod) => mod.OrderForm), {
    ssr: false
});

const breadcrumbItems = [
    {title: "Dashboard", link: "/"},
    {title: "Orders", link: "/orders"},
    {title: "New", link: "/orders/new"},
];

export default function Page() {
    return (
        <ContentLayout title="Album">
            <div className="space-y-6">
                <Breadcrumbs items={breadcrumbItems}/>
                <OrderForm initialData={null}/>
            </div>
        </ContentLayout>
    );
}
