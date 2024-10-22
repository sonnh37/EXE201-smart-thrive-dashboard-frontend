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

export const IsValidToken = (token: string): Promise<boolean> => {
    if (!token) {
        return Promise.resolve(false); // Nếu không có token, trả về false ngay lập tức
    }

    return decodeToken(token)
        .then(response => {
            const decoded = response.data;
            const currentTime = Date.now() / 1000; // Thời gian hiện tại tính bằng giây

            // Kiểm tra xem token đã hết hạn chưa
            return decoded!.exp >= currentTime; // Trả về true nếu token còn hiệu lực
        })
        .catch(error => {
            return false; // Nếu decode token bị lỗi, trả về false
        });
};

function isTokenExpired(token: string) {
    if (!token) return true; // Nếu không có token, coi như đã hết hạn
  
    const payload = JSON.parse(atob(token.split('.')[1])); // Giải mã phần payload của JWT
    const expirationTime = payload.exp * 1000; // Chuyển đổi thời gian hết hạn sang milliseconds
  
    return Date.now() > expirationTime; // So sánh với thời gian hiện tại
  }



