import {cleanQueryParams} from "@/lib/clean-query-param";
import {Const} from "@/lib/const";
import {User} from "@/types/user";
import {BusinessResult} from "@/types/response/business-result";
import {LoginResponse} from "@/types/response/login-response";
import {UserGetAllQuery} from "@/types/queries/user-query";
import axiosInstance from "@/lib/axios-instance";

const handleError = (error: any) => {
    console.error("API User Error:", error);
    throw error;
};

export const fetchUsers = (
    query: UserGetAllQuery
): Promise<BusinessResult<PagedResponse<User>>> => {
    const cleanedQuery = cleanQueryParams(query);
    console.log("check_service_user_query", cleanedQuery.toString());

    return axiosInstance
        .get<BusinessResult<PagedResponse<User>>>(
            `${Const.API_USER}?${cleanedQuery}`
        )
        .then((response) => {
            console.log("check_result", response.data);
            return response.data;
        })
        .catch(handleError);
};

export const fetchUserByUsername = (
    username: string
): Promise<BusinessResult<User>> => {
    return axiosInstance
        .get<BusinessResult<User>>(`${Const.API_USER}/${username}`)
        .then((response) => response.data)
        .catch(handleError);
};

export const fetchUserByUsernameOrEmail = (
    keyword: string
): Promise<BusinessResult<User>> => {
    return axiosInstance
        .get<BusinessResult<User>>(`${Const.API_USER}/username-or-email`, {
            params: {key: keyword}
        })
        .then((response) => response.data)
        .catch(handleError);
};

export const login = (
    username: string,
    password: string
): Promise<BusinessResult<LoginResponse>> => {
    console.log("check_query", username + password);
    return axiosInstance
        .post<BusinessResult<LoginResponse>>(`${Const.API_USER}/login`, {
            usernameOrEmail: username,
            password: password,
        })
        .then((response) => response.data)
        .catch(handleError);
};

export const register = (
    user: User
): Promise<BusinessResult<LoginResponse>> => {
    return axiosInstance
        .post<BusinessResult<LoginResponse>>(`${Const.API_USER}/register`, user)
        .then((response) => response.data)
        .catch(handleError);
};

export const loginByGoogle = (
    token: string
): Promise<BusinessResult<LoginResponse>> => {
    return axiosInstance
        .post<BusinessResult<LoginResponse>>(`${Const.API_USER}/login-by-google`, {
            token: token,
        })
        .then((response) => response.data)
        .catch(handleError);
};

export const findAccountRegisteredByGoogle = (
    token: string
): Promise<BusinessResult<null>> => {
    return axiosInstance
        .post<BusinessResult<null>>(
            `${Const.API_USER}/find-account-registered-by-google`,
            {
                token: token,
            }
        )
        .then((response) => response.data)
        .catch(handleError);
};

export const registerByGoogle = (
    token: string,
    password: string
): Promise<BusinessResult<LoginResponse>> => {
    return axiosInstance
        .post<BusinessResult<LoginResponse>>(
            `${Const.API_USER}/register-by-google`,
            {
                token: token,
                password: password,
            }
        )
        .then((response) => response.data)
        .catch(handleError);
};

export const decodeToken = (
    token: string
): Promise<BusinessResult<DecodedToken>> => {
    return axiosInstance
        .post<BusinessResult<DecodedToken>>(`${Const.API_USER}/decode-token`, {
            token: token,
        })
        .then((response) => response.data)
        .catch(handleError);
};

export const fetchUser = (id: string): Promise<BusinessResult<User>> => {
    return axiosInstance
        .get<BusinessResult<User>>(`${Const.API_USER}/${id}`)
        .then((response) => response.data)
        .catch(handleError);
};

export const deleteUser = (id: string): Promise<BusinessResult<null>> => {
    return axiosInstance
        .delete<BusinessResult<null>>(`${Const.API_USER}/${id}`)
        .then((response) => response.data)
        .catch(handleError);
};
