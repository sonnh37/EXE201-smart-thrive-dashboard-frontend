import { Const } from "@/lib/const";
import { Order } from "@/types/order";
import { OrderGetAllQuery } from "@/types/request/order-query";
import { BusinessResult } from "@/types/response/business-result";
import axios from "axios";
const cleanQueryParams = (query: OrderGetAllQuery) => {
  const cleanedQuery: Record<string, any> = {};
  
  for (const key in query) {
    const value = query[key as keyof OrderGetAllQuery];

    if (key === 'isDeleted') {
      if (Array.isArray(value)) {
        cleanedQuery[key] = value.filter(item => item !== null).map(item => item.toString());
      } else if (value !== undefined && value !== null) {
        cleanedQuery[key] = [value.toString()];
      }
    } else if (Array.isArray(value)) {
      const filteredArray = value.filter(item => item !== null);
      if (filteredArray.length > 0) {
        cleanedQuery[key] = filteredArray;
      }
    } else if (value !== undefined && value !== null) {
      cleanedQuery[key] = value;
    }
  }

  return cleanedQuery;
};
export const fetchOrders = (
  query: OrderGetAllQuery
): Promise<BusinessResult<PagedResponse<Order>>> => {
  const cleanedQuery = cleanQueryParams(query);
  const params = new URLSearchParams();

  for (const key in cleanedQuery) {
    const value = cleanedQuery[key];
    if (Array.isArray(value)) {
      value.forEach(val => {
        params.append(key, val);
      });
    } else {
      params.append(key, value.toString());
    }
  }

  console.log("check_params_ngokngeck", params.toString());

  return axios
    .get(`${Const.API_ORDER}?${params}`)
    .then((response) => {
      console.log("check_result", response.data);
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

export const deleteOrder = (id: string): Promise<BusinessResult<null>> => {
  return axios
    .delete(`${Const.API_ORDER}/${id}`)
    .then((response) => {
      return response.data as BusinessResult<null>;
    })
    .catch((error) => {
      console.error("Failed to delete order:", error);
      throw error;
    });
};
