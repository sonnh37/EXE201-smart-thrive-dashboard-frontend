"use client";

import { cn } from "@/lib/utils";
import { useStore } from "@/hooks/use-store";
import { Footer } from "@/components/layouts/footer";
import { Sidebar } from "@/components/layouts/sidebar";
import { useSidebarToggle } from "@/hooks/use-sidebar-toggle";
import { motion } from "framer-motion";
import { Const } from "@/lib/const";

export default function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sidebar = useStore(useSidebarToggle, (state) => state);

  if (!sidebar) return null;
  
  return (
    <>
      <motion.div
        className="grid"
        initial="hidden"
        animate="show"
        viewport={{ once: true }}
        variants={{
          hidden: {},
          show: {
            transition: {
              staggerChildren: 0.15,
            },
          },
        }}
      >
        <motion.div
          className="fixed z-50"
          variants={Const.FADE_RIGHT_ANIMATION_VARIANTS}
        >
          <Sidebar />
        </motion.div>
        <div>
          <main
            className={cn(
              "min-h-[calc(100vh_-_56px)] bg-zinc-50 dark:bg-zinc-900 transition-[margin-left] ease-in-out duration-300",
              sidebar?.isOpen === false ? "lg:ml-[90px]" : "lg:ml-72"
            )}
          >
            {children}
          </main>
          <footer
            className={cn(
              "transition-[margin-left] ease-in-out duration-300",
              sidebar?.isOpen === false ? "lg:ml-[90px]" : "lg:ml-72"
            )}
          >
            <Footer />
          </footer>
        </div>
      </motion.div>
    </>
  );
}
