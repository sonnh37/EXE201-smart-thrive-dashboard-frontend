import {LayoutGrid, Settings, Users} from "lucide-react";
import React from "react";
import {FcPackage} from "react-icons/fc";
import {Const} from "./const";
import {SiCoursera} from "react-icons/si";
import {LiaFileInvoiceDollarSolid} from "react-icons/lia";
import {TbBrandBlogger} from "react-icons/tb";
import {LuPackage2} from "react-icons/lu";

type Submenu = {
    href: string;
    label: string;
    active: boolean;
};

type Menu = {
    href: string;
    label: string;
    active: boolean;
    icon: React.ElementType; // React component type
    submenus: Submenu[];
};

type Group = {
    groupLabel: string;
    menus: Menu[];
};

export function getMenuList(pathname: string): Group[] {
    return [
        {
            groupLabel: "",
            menus: [
                {
                    href: "/",
                    label: "Dashboard",
                    active: pathname.includes("/"),
                    icon: LayoutGrid, // Component type
                    submenus: [],
                },
            ],
        },
        {
            groupLabel: "Management",
            menus: [
                {
                    href: "",
                    label: "Orders",
                    active: pathname.includes(Const.DASHBOARD_ORDER_URL),
                    icon: () => (
                        <LiaFileInvoiceDollarSolid
                            className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0"/>
                    ),
                    submenus: [
                        {
                            href: Const.DASHBOARD_ORDER_URL,
                            label: "All Orders",
                            active: pathname === Const.DASHBOARD_ORDER_URL,
                        },
                        {
                            href: Const.DASHBOARD_ORDER_NEW_URL,
                            label: "New Order",
                            active: pathname === Const.DASHBOARD_ORDER_NEW_URL,
                        },
                    ],
                },
                {
                    href: "",
                    label: "Packages",
                    active: pathname.includes(Const.DASHBOARD_PACKAGE_URL),
                    icon: () => (
                        <LuPackage2 className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0"/>),
                    submenus: [
                        {
                            href: Const.DASHBOARD_PACKAGE_URL,
                            label: "All Packages",
                            active: pathname === Const.DASHBOARD_PACKAGE_URL,
                        },
                        {
                            href: Const.DASHBOARD_PACKAGE_NEW_URL,
                            label: "New Package",
                            active: pathname === Const.DASHBOARD_PACKAGE_NEW_URL,
                        },
                    ],
                },
                {
                    href: "",
                    label: "Courses",
                    active: pathname.includes(Const.DASHBOARD_COURSE_URL),
                    icon: () => (
                        <SiCoursera className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0"/>
                    ),
                    submenus: [
                        {
                            href: Const.DASHBOARD_COURSE_URL,
                            label: "All Courses",
                            active: pathname === Const.DASHBOARD_COURSE_URL,
                        },
                        {
                            href: Const.DASHBOARD_COURSE_NEW_URL,
                            label: "New Course",
                            active: pathname === Const.DASHBOARD_COURSE_NEW_URL,
                        },
                    ],
                },
                {
                    href: "",
                    label: "Blogs",
                    active: pathname.includes(Const.DASHBOARD_BLOG_URL),
                    icon: () => (
                        <TbBrandBlogger className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0"/>
                    ),
                    submenus: [
                        {
                            href: Const.DASHBOARD_BLOG_URL,
                            label: "All Blogs",
                            active: pathname === Const.DASHBOARD_BLOG_URL,
                        },
                        {
                            href: Const.DASHBOARD_BLOG_NEW_URL,
                            label: "New Blog",
                            active: pathname === Const.DASHBOARD_BLOG_NEW_URL,
                        },
                    ],
                },
            ],
        },
        {
            groupLabel: "Settings",
            menus: [
                {
                    href: "/users",
                    label: "Users",
                    active: pathname.includes("/users"),
                    icon: Users, // Component type
                    submenus: [],
                },
                {
                    href: "/account",
                    label: "Account",
                    active: pathname.includes("/account"),
                    icon: Settings, // Component type
                    submenus: [],
                },
            ],
        },
    ];
}
