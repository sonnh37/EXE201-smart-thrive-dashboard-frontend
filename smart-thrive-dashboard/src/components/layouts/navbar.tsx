import {ModeToggle} from "@/components/common/mode-toggle";
import {UserNav} from "@/components/layouts/user-nav";
import {SheetMenu} from "@/components/common/sheet-menu";

interface NavbarProps {
    title: string;
}

export function Navbar({title}: NavbarProps) {
    return (
        <div className="mx-4 sm:mx-8 flex h-14 items-center">
            <div className="flex items-center space-x-4 lg:space-x-0">
                <SheetMenu/>
                <h1 className="font-bold">{title}</h1>
            </div>
            <div className="flex flex-1 items-center justify-end">
                <ModeToggle/>
                <UserNav/>
            </div>
        </div>
    );
}
