import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./sidebar";
import { Suspense } from "react";
import AppBreadCrumb from "./app-bread-crumb";
import { ThemeToggleBtn } from "../theme-toggle";
import { Skeleton } from "../ui/skeleton";

type AppRootLayoutProps = {
    children: React.ReactNode,
}

export default async function SidebarLayout({ children }: AppRootLayoutProps) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 px-4">
                    <SidebarTrigger className="-ml-1" />
                    <AppBreadCrumb />
                    <div className="ml-auto flex items-center gap-4">
                        <ThemeToggleBtn />
                    </div>
                </header>
                <main className="h-full">
                    <Suspense fallback={<Skeleton className="h-full" />}>
                        {children}
                    </Suspense>
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}