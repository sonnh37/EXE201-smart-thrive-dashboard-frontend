import { LayoutGrid, Settings, Users } from "lucide-react";
import React from "react";
import { LiaFileInvoiceDollarSolid } from "react-icons/lia";
import { LuPackage2 } from "react-icons/lu";
import { SiCoursera } from "react-icons/si";
import { TbBrandBlogger } from "react-icons/tb";
import { Const } from "./const";
import Image from "next/image";

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
          active: pathname == "/",
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
          active: pathname.includes(Const.URL_ORDER),
          icon: () => (
            <Image
              src="/invoice.png"
              width={500}
              height={500}
              alt="Gallery Icon"
              className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0"
            />
            // <LiaFileInvoiceDollarSolid className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
          ),
          submenus: [
            {
              href: Const.URL_ORDER,
              label: "All Orders",
              active: pathname === Const.URL_ORDER,
            },
            {
              href: Const.URL_ORDER_NEW,
              label: "New Order",
              active: pathname === Const.URL_ORDER_NEW,
            },
          ],
        },
        {
          href: "",
          label: "Packages",
          active: pathname.includes(Const.URL_PACKAGE),
          icon: () => (
            <Image
            src="/package.png"
            width={500}
            height={500}
            alt="Gallery Icon"
            className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0"
          />
          ),
          submenus: [
            {
              href: Const.URL_PACKAGE,
              label: "All Packages",
              active: pathname === Const.URL_PACKAGE,
            },
            {
              href: Const.URL_PACKAGE_NEW,
              label: "New Package",
              active: pathname === Const.URL_PACKAGE_NEW,
            },
          ],
        },
        {
          href: "",
          label: "Courses",
          active: pathname.includes(Const.URL_COURSE),
          icon: () => (
            <Image
            src="/course.png"
            width={500}
            height={500}
            alt="Gallery Icon"
            className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0"
          />
        ),
          submenus: [
            {
              href: Const.URL_COURSE,
              label: "All Courses",
              active: pathname === Const.URL_COURSE,
            },
            {
              href: Const.URL_COURSE_NEW,
              label: "New Course",
              active: pathname === Const.URL_COURSE_NEW,
            },
          ],
        },
        {
          href: "",
          label: "Blogs",
          active: pathname.includes(Const.URL_BLOG),
          icon: () => (
            <Image
            src="/blog.png"
            width={500}
            height={500}
            alt="Gallery Icon"
            className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0"
          />),
          submenus: [
            {
              href: Const.URL_BLOG,
              label: "All Blogs",
              active: pathname === Const.URL_BLOG,
            },
            {
              href: Const.URL_BLOG_NEW,
              label: "New Blog",
              active: pathname === Const.URL_BLOG_NEW,
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
