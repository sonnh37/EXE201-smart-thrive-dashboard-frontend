"use client"
import {Navbar} from "@/components/layouts/navbar";
import {Const} from "@/lib/const";
import {motion} from "framer-motion";

interface ContentLayoutProps {
    title: string;
    children: React.ReactNode;
}

export function ContentLayout({title, children}: ContentLayoutProps) {
    return (
        <>
            <motion.header
                className="sticky top-0 z-10 w-full bg-background/95 shadow backdrop-blur supports-[backdrop-filter]:bg-background/80 dark:shadow-secondary"
                variants={Const.FADE_BOTTOM_ANIMATION_VARIANTS}
            >
                <Navbar title={title}/>
            </motion.header>
            <motion.div
                variants={Const.FADE_TOP_ANIMATION_VARIANTS}
                className="pt-8 pb-8 px-4 sm:px-8 supports-[backdrop-filter]:bg-background/80 dark:shadow-secondary"
            >
                {children}
            </motion.div>
        </>
    );
}
