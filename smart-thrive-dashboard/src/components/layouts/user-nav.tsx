"use client";

import Link from "next/link";
import {LayoutGrid, LogOut, User as UserIcon} from "lucide-react";

import {Button} from "@/components/ui/button";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,} from "@/components/ui/tooltip";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {getTokenFromCookie, logout} from "@/lib/auth";
import {decodeToken, fetchUser} from "@/services/user-service";
import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import {User} from "@/types/user";

export function UserNav() {
    const router = useRouter();
    const [userInfo, setUserInfo] = useState<User | null>(null); // Sử dụng kiểu User
    const token = localStorage.getItem("token"); // Lấy token từ cookie

    useEffect(() => {
        if (!token) {
            router.push("/login");
            return;
        }

        // Decode token và sau đó fetch user info
        decodeToken(token)
            .then((response) => {
                // Kiểm tra nếu token hợp lệ
                if (response.status !== 1) {
                    throw new Error("Token không hợp lệ");
                }

                const decodedToken = response.data;

                // Fetch thông tin người dùng
                return fetchUser(decodedToken!.id);
            })
            .then((response_user) => {
                // Kiểm tra nếu thông tin người dùng được trả về
                if (response_user.status !== 1) {
                    throw new Error("Không tìm thấy người dùng");
                }

                // Cập nhật state với thông tin người dùng
                setUserInfo(response_user!.data!);
            })
            .catch((error) => {
                console.error("Error in fetching data:", error);
                router.push("/login"); // Điều hướng đến login nếu có lỗi
            });
    }, [token, router]);
    if (!userInfo) return null;
    return (
        <DropdownMenu>
            <TooltipProvider disableHoverableContent>
                <Tooltip delayDuration={100}>
                    <TooltipTrigger asChild>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="outline"
                                className="relative h-8 w-8 rounded-full"
                            >
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={userInfo.imageUrl} alt="Avatar"/>
                                    <AvatarFallback className="bg-transparent">
                                        {!userInfo.imageUrl
                                            ? userInfo.username?.charAt(0).toUpperCase()
                                            : userInfo.username}
                                    </AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">Profile</TooltipContent>
                </Tooltip>
            </TooltipProvider>

            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                            {userInfo.username}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                            {userInfo.email}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator/>
                <DropdownMenuGroup>
                    <DropdownMenuItem className="hover:cursor-pointer" asChild>
                        <Link href="/dashboard" className="flex items-center">
                            <LayoutGrid className="w-4 h-4 mr-3 text-muted-foreground"/>
                            Dashboard
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:cursor-pointer" asChild>
                        <Link href="/account" className="flex items-center">
                            <UserIcon className="w-4 h-4 mr-3 text-muted-foreground"/>
                            Account
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator/>
                <DropdownMenuItem
                    className="hover:cursor-pointer"
                    onClick={() => {
                        logout();
                        window.location.reload();
                    }}
                >
                    <LogOut className="w-4 h-4 mr-3 text-muted-foreground"/>
                    Sign out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
