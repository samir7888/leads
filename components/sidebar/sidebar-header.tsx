import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import Image from "next/image";
import Link from "next/link";

export function AppSidebarHeader() {
  const { open } = useSidebar();

  return (
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <section className="px-2">
            <Link href="/" className="flex items-center gap-4">
              <Image
                width={48}
                height={48}
                src={"/logo.png"}
                alt="Lead Track Logo"
                className="max-h-20 max-auto"
              />

              {open && (
                <section className="overflow-hidden">
                  <h1 className="font-semibold text-2xl leading-5 whitespace-nowrap">
                    <span className="text-primary">Lead Track</span>
                  </h1>
                </section>
              )}
            </Link>
          </section>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
  );
}
