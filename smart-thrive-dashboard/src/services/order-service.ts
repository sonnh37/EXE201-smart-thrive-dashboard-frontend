import { Const } from "@/lib/const";
import { Order } from "@/types/order";
import { OrderGetAllQuery } from "@/types/request/order-query";
import { BusinessResult } from "@/types/response/business-result";
import axios from "axios";

export const fetchOrders = (
  query: OrderGetAllQuery
): Promise<BusinessResult<PagedResponse<Order>>> => {

  const cleanedQuery: Record<string, any> = {};
    for (const key in query) {
        if (query[key as keyof OrderGetAllQuery] !== undefined && query[key as keyof OrderGetAllQuery] !== null) {
            cleanedQuery[key] = query[key as keyof OrderGetAllQuery];
        }
    }

  const params = new URLSearchParams(cleanedQuery as any).toString();
  return axios
    .get(`${Const.API_ORDER}?${params}`)
    .then((response) => {
      return response.data as BusinessResult<PagedResponse<Order>>;
    })
    .catch((error) => {
      console.error("Failed to fetch orders:", error);
      throw error;
    });
};

export const fetchOrder = (id: string): Promise<BusinessResult<Order>> => {
  return axios
    .get(`${Const.API_ORDER}/${id}`)
    .then((response) => {
      return response.data as BusinessResult<Order>;
    })
    .catch((error) => {
      console.error("Failed to fetch orders:", error);
      throw error;
    });
};
