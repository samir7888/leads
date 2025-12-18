import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { SidebarFooter, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar"
import { ChevronUp, LoaderCircle, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { useTransition } from "react"
import logoutAction from "@/lib/actions/logout.action"
import { ProfileAvatar } from "../ui/avatar"

export const AppSidebarFooter = () => {
    const router = useRouter();
    const { data } = useSession();
    const { open } = useSidebar();
    const [isPending, startTransition] = useTransition();

    const user = data?.user;

    const handleLogout = () => {
        startTransition(async () => {
            await logoutAction();
        })
    }

    return (
        <SidebarFooter>
            <SidebarMenu>
                <SidebarMenuItem>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <SidebarMenuButton className={cn("h-12", !open && "grid place-items-center rounded-full")}>
                                <ProfileAvatar
                                    src={user?.image ?? undefined}
                                    name={user?.name ?? ""}
                                    className={cn(!open ? "absolute size-8" : "size-10")}
                                />
                                {open && <span>{user?.name ?? ""}</span>}
                                {open && <ChevronUp className="ml-auto" />}
                            </SidebarMenuButton>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            side="top"
                            className={cn(open && "w-[--radix-popper-anchor-width]")}
                        >
                            <DropdownMenuLabel title={user?.email ?? ""} className="truncate">{user?.email ?? ""}</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => {
                                    router.push(`/profile`)
                                }}
                            >
                                <span>Profile</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <button
                                type="button"
                                onClick={() => {
                                    handleLogout();
                                }}
                                disabled={isPending}
                                className="text-left flex gap-2 items-center w-full px-2 py-1.5 text-sm hover:bg-secondary transition-colors select-none rounded-sm disabled:opacity-70"
                            >
                                {
                                    isPending
                                        ? <>
                                            <LoaderCircle className="h-4 w-4 animate-spin" />
                                            <span>Signing out...</span>
                                        </>
                                        : <span>Sign out <LogOut className="inline-block h-4 w-4 ml-2" /></span>
                                }
                            </button>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarFooter>
    )
}