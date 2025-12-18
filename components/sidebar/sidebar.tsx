"use client"

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ChevronRight, LucideProps } from "lucide-react"
import { AppSidebarHeader } from "./sidebar-header"
import { AppSidebarFooter } from "./sidebar-footer"
import { ForwardRefExoticComponent, RefAttributes, useMemo } from "react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cmsSidebarMenuItems } from "./menu-items"
import { ScrollArea } from "../ui/scroll-area"

export type TSidebarMenuItem = {
    title: string,
    url: string,
    icon?: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>,
    items?: Omit<TSidebarMenuItem, "icon" | "items">[]
}

export type TGroupMenuItem = {
    groupLabel: string,
    menuItems: TSidebarMenuItem[]
}

export function AppSidebar() {
    return (
        <Sidebar variant="sidebar" collapsible="icon" className="pr-0">
            <AppSidebarHeader />
            <SidebarContent className="overflow-hidden">
                <ScrollArea className="max-h-full overflow-auto">
                    {
                        cmsSidebarMenuItems.map((item) => (
                            <SidebarGroup key={item.groupLabel}>
                                <SidebarGroupLabel>{item.groupLabel}</SidebarGroupLabel>
                                <SidebarMenu>
                                    {item.menuItems.map((item) => item.items?.length
                                        ? <CollapsibleMenuItem key={item.title} item={item} />
                                        : <NonCollapsibleMenuItem key={item.title} item={item} />
                                    )}
                                </SidebarMenu>
                            </SidebarGroup>
                        ))
                    }
                </ScrollArea>
            </SidebarContent>
            <AppSidebarFooter />
        </Sidebar>
    )
}

export function NonCollapsibleMenuItem({ item }: { item: TSidebarMenuItem }) {
    const pathname = usePathname();

    return (
        <SidebarMenuItem key={item.title}>
            <SidebarMenuButton asChild isActive={item.url === pathname}>
                <Link href={item.url}>
                    {
                        item.icon && <item.icon />
                    }
                    <span>{item.title}</span>
                </Link>
            </SidebarMenuButton>
        </SidebarMenuItem>
    )
}

export function CollapsibleMenuItem({ item }: { item: TSidebarMenuItem }) {
    const defaultOpen = useMemo<boolean>(() => {
        return !!item.items?.some((subItem) => `/${item.url}${!!subItem.url ? `/${subItem.url}` : ''}` === location.pathname)
    }, [location])

    return (
        <Collapsible
            key={item.title}
            asChild
            defaultOpen={defaultOpen}
            className="group/collapsible"
        >
            <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={item.title}>
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <SidebarMenuSub>
                        {item.items?.map((subItem) => {
                            const url = `/${item.url}${!!subItem.url ? `/${subItem.url}` : ''}`;
                            const isActive = url === location.pathname

                            return (
                                <SidebarMenuSubItem key={subItem.title}>
                                    <SidebarMenuSubButton asChild isActive={isActive}>
                                        <Link href={item.url + (!!subItem.url ? ('/' + subItem.url) : '')} className={cn(isActive && "font-medium")}>
                                            <span>{subItem.title}</span>
                                        </Link>
                                    </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                            )
                        })}
                    </SidebarMenuSub>
                </CollapsibleContent>
            </SidebarMenuItem>
        </Collapsible>
    )
}
