"use client";
import {Breadcrumbs} from "@/components/common/breadcrumb";
import {ContentLayout} from "@/components/common/content-layout";
import {OrderForm} from "@/components/sections/orders/create-update-form";
import {fetchOrder} from "@/services/order-service";
import {Order} from "@/types/order";
import {useEffect, useState} from "react";
import {toast} from "sonner";

export default function Page({params}: { params: { orderId: string } }) {
    const [order, setOrder] = useState<Order | null>(null);

    // Fetch order data when params.orderId changes
    useEffect(() => {
        const fetchData = async () => {
            const response = await fetchOrder(params.orderId);
            if (response.status !== 1) {
                return toast.error(response.message);
            }
            setOrder(response.data as Order); // Assuming response.data contains the order data
        };
        fetchData();
    }, [params.orderId]);

    const breadcrumbItems = [
        {title: 'Dashboard', link: '/'},
        {title: 'Order', link: '/orders'},
        {title: `${params.orderId}`, link: `/orders/${params.orderId}`}
    ];

    return (
        <ContentLayout title="Service">
            <div className="space-y-6">
                <Breadcrumbs items={breadcrumbItems}/>
                <OrderForm initialData={order}/>
            </div>
        </ContentLayout>
    );
}
