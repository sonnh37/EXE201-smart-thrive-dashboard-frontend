import Link from "next/link";

import {cn} from "@/lib/utils";
import {useStore} from "@/hooks/use-store";
import {Button} from "@/components/ui/button";
import {Menu} from "@/components/common/menu";
import {useSidebarToggle} from "@/hooks/use-sidebar-toggle";
import {SidebarToggle} from "@/components/common/sidebar-toggle";
import Image from "next/image";
import {motion} from "framer-motion";
import {Const} from "@/lib/const";
import {useEffect} from "react";

export function Sidebar() {
    const sidebar = useStore(useSidebarToggle, (state) => state);
    const isMobile = window.innerWidth < 768; // Thay đổi 768 nếu cần

    useEffect(() => {
        if (isMobile && sidebar?.isOpen) {
            sidebar.setIsOpen(); // Đóng sidebar khi là mobile
        }
    }, [isMobile, sidebar?.isOpen]);
    if (!sidebar) return null;

    return (
        <motion.aside
            className={cn(
                "fixed top-0 left-0 z-20 h-screen transition-[width] ease-in-out duration-300",
                sidebar.isOpen ? "w-72" : "w-[90px] -translate-x-full"
            )}
            variants={Const.FADE_RIGHT_ANIMATION_VARIANTS}
        >
            <SidebarToggle isOpen={sidebar?.isOpen} setIsOpen={sidebar?.setIsOpen}/>
            <div className="relative h-full flex flex-col px-3 py-4 overflow-y-auto shadow-md dark:shadow-zinc-800">
                <Button
                    className={cn(
                        "transition-transform ease-in-out duration-300 mb-1",
                        sidebar?.isOpen === false ? "translate-x-1" : "translate-x-0"
                    )}
                    variant="link"
                    asChild
                >
                    <Link href="/" className="flex items-center gap-2">
                        <Image
                            src="/logo-exe.png"
                            width={50}
                            height={50}
                            alt="Gallery Icon"
                            className="rounded-full aspect-square object-cover bg-gradient-to-r from-indigo-500 to-sky-500 [box-shadow:1px_1px_20px_var(--tw-shadow-color)] shad shadow-blue-500"
                        />
                        <h1
                            className={cn(
                                "[text-shadow:1px_1px_20px_var(--tw-shadow-color)] shadow-blue-500 font-bold text-lg whitespace-nowrap transition-[transform,opacity,display] ease-in-out duration-300",
                                sidebar?.isOpen === false
                                    ? "-translate-x-96 opacity-0 hidden"
                                    : "translate-x-0 opacity-100"
                            )}
                        >
                            ST.Education
                        </h1>
                    </Link>
                </Button>
                <Menu isOpen={sidebar?.isOpen}/>
            </div>
        </motion.aside>
    );
}
