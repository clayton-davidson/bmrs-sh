"use client";

import { ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";
import { useMemo, useState, useCallback, JSX } from "react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { MenuItem } from "@/types/navigation/menu-item";
import Link from "next/link";

export function NavMain({ items }: { items: MenuItem[] }) {
  const pathname = usePathname();

  const { activeItems, initialOpenState } = useMemo(() => {
    const active = new Set<string>();
    const initialOpen: Record<string, boolean> = {};

    const isUrlActive = (url?: string): boolean => {
      if (!url) return false;
      if (url === "/" && pathname === "/") return true;
      if (url !== "/" && pathname.startsWith(url)) return true;
      return false;
    };

    const processItems = (menuItems: MenuItem[]): boolean => {
      let hasAnyActiveChild = false;

      menuItems.forEach((item) => {
        const itemActive = isUrlActive(item.url);

        if (itemActive) {
          active.add(item.url || item.label);
        }

        let hasActiveChild = false;

        if (item.children?.length) {
          hasActiveChild = processItems(item.children);
        }

        if (itemActive || hasActiveChild) {
          initialOpen[item.label] = true;
          hasAnyActiveChild = true;
        }
      });

      return hasAnyActiveChild;
    };

    processItems(items);

    return { activeItems: active, initialOpenState: initialOpen };
  }, [pathname, items]);

  const [openedMenus, setOpenedMenus] =
    useState<Record<string, boolean>>(initialOpenState);

  const toggleMenu = useCallback((label: string): void => {
    setOpenedMenus((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  }, []);

  const isActive = useCallback(
    (url?: string): boolean => {
      if (!url) return false;
      return activeItems.has(url);
    },
    [activeItems]
  );

  const MenuItemComponent = useCallback(
    ({ item }: { item: MenuItem }): JSX.Element => {
      const itemActive = isActive(item.url);
      const isOpen = openedMenus[item.label] || false;
      const hasChildren = item.children && item.children.length > 0;

      return (
        <Collapsible
          key={item.label}
          asChild
          open={isOpen}
          onOpenChange={() => toggleMenu(item.label)}
        >
          <SidebarMenuItem>
            {hasChildren ? (
              <CollapsibleTrigger asChild>
                <div className="flex items-center justify-between w-full cursor-pointer">
                  <SidebarMenuButton
                    tooltip={item.label}
                    data-active={itemActive ? "true" : "false"}
                    className="data-[active=true]:bg-accent data-[active=true]:text-accent-foreground flex-grow"
                  >
                    <span>{item.label}</span>
                  </SidebarMenuButton>

                  <SidebarMenuAction className={isOpen ? "rotate-90" : ""}>
                    <ChevronRight />
                    <span className="sr-only">Toggle</span>
                  </SidebarMenuAction>
                </div>
              </CollapsibleTrigger>
            ) : (
              <SidebarMenuButton
                asChild
                tooltip={item.label}
                data-active={itemActive ? "true" : "false"}
                className="data-[active=true]:bg-accent data-[active=true]:text-accent-foreground"
              >
                <Link href={item.url || "/"}>
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            )}

            {hasChildren && (
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.children?.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.label}>
                      <SidebarMenuSubButton
                        asChild
                        data-active={isActive(subItem.url) ? "true" : "false"}
                        className="data-[active=true]:bg-accent data-[active=true]:text-accent-foreground"
                      >
                        <Link href={subItem.url || "/"}>
                          <span className={"text-wrap"}>{subItem.label}</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            )}
          </SidebarMenuItem>
        </Collapsible>
      );
    },
    [isActive, openedMenus, toggleMenu]
  );

  return (
    <SidebarGroup className="flex-1 overflow-hidden">
      <ScrollArea className="h-full w-full">
        <div className="px-2">
          <SidebarMenu>
            {items.map((item) => (
              <MenuItemComponent key={item.label} item={item} />
            ))}
          </SidebarMenu>
        </div>
      </ScrollArea>
    </SidebarGroup>
  );
}
