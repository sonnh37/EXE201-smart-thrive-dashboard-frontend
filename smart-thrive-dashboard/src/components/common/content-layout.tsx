import {Navbar} from "@/components/layouts/navbar";

interface ContentLayoutProps {
    title: string;
    children: React.ReactNode;
}

export function ContentLayout({title, children}: ContentLayoutProps) {
    return (
        <div>
            <Navbar title={title}/>
            <div className="pt-8 pb-8 px-4 sm:px-8 supports-[backdrop-filter]:bg-background/80 dark:shadow-secondary">{children}</div>
        </div>
    );
}
