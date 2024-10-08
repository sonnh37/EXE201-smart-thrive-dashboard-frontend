import axiosInstance from "@/lib/axios-instance";
import {cleanQueryParams} from "@/lib/clean-query-param";
import {Const} from "@/lib/const";
import {Order} from "@/types/order";
import {OrderGetAllQuery} from "@/types/queries/order-query";
import {BusinessResult} from "@/types/response/business-result";

const handleError = (error: any) => {
    console.error("API Order Error:", error);
    throw error;
};

export const fetchOrders = (
    query: OrderGetAllQuery
): Promise<BusinessResult<PagedResponse<Order>>> => {
    const cleanedQuery = cleanQueryParams(query);
    console.log("check_service_order_query", cleanedQuery.toString());

    return axiosInstance
        .get<BusinessResult<PagedResponse<Order>>>(`${Const.API_ORDER}?${cleanedQuery}`)
        .then((response) => {
            console.log("check_result", response.data)
            return response.data
        })
        .catch(handleError);
};

export const fetchOrder = (id: string): Promise<BusinessResult<Order>> => {
    return axiosInstance
        .get<BusinessResult<Order>>(`${Const.API_ORDER}/${id}`)
        .then((response) => response.data)
        .catch(handleError);
};

export const deleteOrder = (id: string): Promise<BusinessResult<null>> => {
    return axiosInstance
        .delete<BusinessResult<null>>(`${Const.API_ORDER}/${id}`)
        .then((response) => response.data)
        .catch(handleError);
};
