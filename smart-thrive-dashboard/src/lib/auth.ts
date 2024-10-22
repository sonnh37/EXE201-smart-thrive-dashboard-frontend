import {decodeToken, fetchUser, login} from "@/services/user-service";
import {toast} from "sonner";
import {BusinessResult} from "@/types/response/business-result";
import {LoginResponse} from "@/types/response/login-response";
import {User} from "@/types/user";
// utils/auth.ts
export const loginAuth = async (
    username: string,
    password: string
): Promise<boolean> => {
    try {
        const response = await login(username, password);

        if (response.status == 1) {
            const token = response.data?.token;
            toast.success(response.message);
            // Lưu JWT vào cookie với thuộc tính bảo mật
            localStorage.setItem("token", token!);
            document.cookie = `token=${token}; path=/; secure; samesite=strict;`;

            return true;
        } else {
            toast.error(response.message);
            return false;
        }
    } catch (error) {
        toast.error("Error during login: " + error);
        return false;
    }
};

export const loginAuthByGoogle = (
    response: BusinessResult<LoginResponse>,
): boolean => {
    try {

        if (response.status == 1) {
            const token = response.data?.token;
            toast.success(response.message);
            // Lưu JWT vào cookie với thuộc tính bảo mật
            localStorage.setItem("token", token!);
            document.cookie = `token=${token}; path=/; secure; samesite=strict;`;

            return true;
        } else {
            toast.error(response.message);
            return false;
        }
    } catch (error) {
        toast.error("Error during login: " + error);
        return false;
    }
};

export const logout = () => {
    // Xóa token khỏi localStorage
    localStorage.removeItem("token");
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    // window.location.reload();
};

export const getTokenFromCookie = (): string | null => {
    const name = "token=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(";");
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i].trim();
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return null;
};


export const getUserByToken = async (): Promise<User> => {
    const token: string | null = localStorage.getItem("token"); // Đảm bảo token có kiểu string | null
    const response = await decodeToken(token ?? "");
    // id user
    const id = response.data?.id;

    const _response = await fetchUser(id!);
    return _response.data!;
};

export const IsValidToken = async (token: string): Promise<boolean> => {
    let isTokenValid = true;
    if (token) {
        try {
            const response = await decodeToken(token);
            console.log("check_decoded_valid")
            const decoded = response.data;

            const currentTime = Date.now() / 1000; // Thời gian hiện tại tính bằng giây

            // Kiểm tra xem token đã hết hạn chưa
            if (decoded!.exp < currentTime) {
                isTokenValid = false;
            } else {
                isTokenValid = true;
            }
        } catch (error) {
            isTokenValid = false; // Nếu decode token bị lỗi, coi như token không hợp lệ
        }
    } else {
        isTokenValid = false;
    }

    return isTokenValid;
}




