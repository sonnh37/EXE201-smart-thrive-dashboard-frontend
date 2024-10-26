"use client";
import {Breadcrumbs} from "@/components/common/breadcrumb";
import {ContentLayout} from "@/components/common/content-layout";
import {Package} from "@/types/package";
import {useEffect, useState} from "react";
import {toast} from "sonner";
import packageService from "@/services/package-service";
import {PackageForm} from "@/components/sections/packages/create-update-form";

export default function Page({params}: { params: { packageId: string } }) {
    const [package_, setPackage] = useState<Package | null>(null);

    // Fetch package data when params.packageId changes
    useEffect(() => {
        const fetchData = async () => {
            const response = await packageService.fetchById(params.packageId);
            if (response.status !== 1) {
                return toast.error(response.message);
            }
            setPackage(response.data as Package); // Assuming response.data contains the package data
        };
        fetchData();
    }, [params.packageId]);

    const breadcrumbItems = [
        {title: 'Dashboard', link: '/'},
        {title: 'Packages', link: '/packages'},
        {title: `${params.packageId}`, link: `/packages/${params.packageId}`}
    ];

    return (
        <ContentLayout title="Service">
            <div className="space-y-6">
                <Breadcrumbs items={breadcrumbItems}/>
                <PackageForm initialData={package_}/>
            </div>
        </ContentLayout>
    );
}
