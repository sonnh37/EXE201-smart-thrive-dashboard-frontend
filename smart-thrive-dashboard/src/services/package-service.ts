import { Const } from "@/lib/const";
import { Package } from "@/types/package";
import { PackageGetAllQuery } from "@/types/request/package-query";
import { BusinessResult } from "@/types/response/business-result";
import axios from "axios";

export const fetchPackages = (
  query: PackageGetAllQuery
): Promise<BusinessResult<PagedResponse<Package>>> => {

  const cleanedQuery: Record<string, any> = {};
    for (const key in query) {
        if (query[key as keyof PackageGetAllQuery] !== undefined && query[key as keyof PackageGetAllQuery] !== null) {
            cleanedQuery[key] = query[key as keyof PackageGetAllQuery];
        }
    }

  const params = new URLSearchParams(cleanedQuery as any).toString();
  return axios
    .get(`${Const.API_PACKAGE}?${params}`)
    .then((response) => {
      return response.data as BusinessResult<PagedResponse<Package>>;
    })
    .catch((error) => {
      console.error("Failed to fetch packages:", error);
      throw error;
    });
};

export const fetchPackage = (id: string): Promise<BusinessResult<Package>> => {
  return axios
    .get(`${Const.API_ORDER}/${id}`)
    .then((response) => {
      return response.data as BusinessResult<Package>;
    })
    .catch((error) => {
      console.error("Failed to fetch packages:", error);
      throw error;
    });
};
