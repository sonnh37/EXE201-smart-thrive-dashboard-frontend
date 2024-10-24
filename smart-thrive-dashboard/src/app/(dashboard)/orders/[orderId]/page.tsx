"use client";
import {Breadcrumbs} from "@/components/common/breadcrumb";
import {ContentLayout} from "@/components/common/content-layout";
import {Order} from "@/types/order";
import {useEffect, useState} from "react";
import {toast} from "sonner";
import orderService from "@/services/order-service";

export default function Page({params}: { params: { orderId: string } }) {
    const [order, setOrder] = useState<Order | null>(null);

    // Fetch order data when params.orderId changes
    useEffect(() => {
        const fetchData = async () => {
            const response = await orderService
                .fetchById(params.orderId);
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
                <OrderF initialData={order}/>
            </div>
        </ContentLayout>
    );
}
