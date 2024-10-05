import { login } from "@/services/user-service";
import { toast } from "sonner";
import { jwtDecode } from "jwt-decode";
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
  // Xóa JWT từ cookie
  document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
  window.location.reload();
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


