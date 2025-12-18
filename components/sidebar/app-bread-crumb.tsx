"use client";

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import React, { useEffect, useMemo } from "react";
import { useSidebar } from "../ui/sidebar";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cmsSidebarMenuItems } from "./menu-items";

export default function AppBreadCrumb() {
    const pathname = usePathname();

    const { dynamicBreadcrumb, setDynamicBreadcrumb } = useSidebar();

    const active = useMemo(() => {
        const menuItem = cmsSidebarMenuItems.find(group => group.menuItems
            .some(item => pathname.includes(`${item.url}`)))
            ?.menuItems?.find(item => pathname.includes(`${item.url}`))

        const item = menuItem?.items?.length
            ? (
                menuItem.items.find(item => {
                    return pathname === (`${menuItem.url}${!!item.url ? `/${item.url}` : ''}`)
                })
                || menuItem.items.find(item => {
                    return pathname.includes(`${menuItem.url}${!!item.url ? `/${item.url}` : ''}`)
                })
            )
            : undefined;

        return { menuItem, item };
    }, [pathname]);

    useEffect(() => {
        setDynamicBreadcrumb(prev => [
            ...prev.filter(breadcrumb => {
                return breadcrumb.url && pathname.includes(breadcrumb.url);
            })
        ])
    }, [pathname]);

    return (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbPage className="text-muted-foreground line-clamp-1">
                        {active.menuItem?.title}
                    </BreadcrumbPage>
                </BreadcrumbItem>
                {
                    active.item && <>
                        <BreadcrumbSeparator className="hidden md:block" />
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild className="line-clamp-1">
                                <Link href={`/${active.menuItem?.url}/${active.item?.url}`}>
                                    {active.item?.title}
                                </Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                    </>
                }
                {
                    dynamicBreadcrumb.map((item, index) => {
                        return (
                            <React.Fragment key={index}>
                                <BreadcrumbSeparator className="hidden md:block" />
                                <BreadcrumbItem key={index}>
                                    {
                                        item.isEdit ? (
                                            <BreadcrumbLink asChild>
                                                <Link href={`${item.url}`} className="line-clamp-1">
                                                    {item.label}
                                                </Link>
                                            </BreadcrumbLink>
                                        ) : (
                                            <BreadcrumbPage className="line-clamp-1">{item.label}</BreadcrumbPage>
                                        )
                                    }
                                </BreadcrumbItem>

                                {
                                    item.isEdit && (
                                        <>
                                            <BreadcrumbSeparator className="hidden md:block" />
                                            <BreadcrumbItem>
                                                <BreadcrumbPage>Edit</BreadcrumbPage>
                                            </BreadcrumbItem>
                                        </>
                                    )
                                }
                            </React.Fragment>
                        )
                    })
                }
            </BreadcrumbList>
        </Breadcrumb>
    )
}