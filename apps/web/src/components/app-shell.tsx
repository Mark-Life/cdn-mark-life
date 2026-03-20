import { useAuth } from "@workos-inc/authkit-react";
import { Avatar, AvatarFallback } from "@workspace/ui/components/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { Separator } from "@workspace/ui/components/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@workspace/ui/components/sidebar";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { TooltipProvider } from "@workspace/ui/components/tooltip";
import { useQuery } from "convex/react";
import {
  ChevronsUpDownIcon,
  FolderIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  UsersIcon,
} from "lucide-react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { api } from "../../../convex/convex/_generated/api";

const NAV_ITEMS = [
  { label: "Dashboard", icon: LayoutDashboardIcon, path: "/" },
  { label: "Files", icon: FolderIcon, path: "/files" },
  { label: "Accounts", icon: UsersIcon, path: "/accounts" },
] as const;

function getUserName(user: {
  firstName?: string | null;
  lastName?: string | null;
  email: string;
}) {
  const parts = [user.firstName, user.lastName].filter(Boolean);
  return parts.length > 0 ? parts.join(" ") : null;
}

function getInitials(user: {
  firstName?: string | null;
  lastName?: string | null;
  email: string;
}) {
  const name = getUserName(user);
  if (name) {
    return name
      .split(" ")
      .filter(Boolean)
      .map((n) => n.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }
  return user.email.charAt(0).toUpperCase();
}

function NavUser() {
  const { signOut } = useAuth();
  const user = useQuery(api.auth.getCurrentUser);

  if (!user) {
    return (
      <div className="flex items-center gap-2 p-2">
        <Skeleton className="size-7 rounded-full" />
        <div className="flex flex-1 flex-col gap-1">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-2.5 w-28" />
        </div>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton
          className="h-auto gap-2.5 py-1.5 data-[state=open]:bg-sidebar-accent"
          size="lg"
        >
          <Avatar size="sm">
            <AvatarFallback className="bg-primary/10 font-semibold text-[10px] text-primary">
              {getInitials(user)}
            </AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="truncate font-medium text-xs">
              {getUserName(user) || user.email}
            </span>
            {getUserName(user) && (
              <span className="truncate font-mono text-[10px] text-muted-foreground">
                {user.email}
              </span>
            )}
          </div>
          <ChevronsUpDownIcon className="ml-auto size-3.5 shrink-0 text-muted-foreground" />
        </SidebarMenuButton>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-56" side="top">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col gap-0.5">
            <span className="font-medium text-sm">
              {getUserName(user) || "User"}
            </span>
            <span className="font-mono text-[11px] text-muted-foreground">
              {user.email}
            </span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut()}>
          <LogOutIcon />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar collapsible="icon" variant="sidebar">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="lg" tooltip="CDN Mark Life">
              <Link to="/">
                <div className="flex size-7 items-center justify-center rounded-md bg-primary">
                  <span className="font-bold font-mono text-[9px] text-primary-foreground">
                    CDN
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-xs tracking-tight">
                    Mark Life
                  </span>
                  <span className="font-mono text-[9px] text-muted-foreground uppercase tracking-widest">
                    File Management
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV_ITEMS.map(({ label, icon: Icon, path }) => {
                const isActive =
                  path === "/"
                    ? location.pathname === "/"
                    : location.pathname.startsWith(path);

                return (
                  <SidebarMenuItem key={path}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={label}
                    >
                      <Link to={path}>
                        <Icon />
                        <span>{label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <NavUser />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}

function Header() {
  const location = useLocation();

  const currentPage = NAV_ITEMS.find((item) =>
    item.path === "/"
      ? location.pathname === "/"
      : location.pathname.startsWith(item.path)
  );

  return (
    <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator className="!h-4 mr-1" orientation="vertical" />
      <div className="flex items-center gap-1.5">
        <span className="font-medium text-sm">
          {currentPage?.label ?? "Dashboard"}
        </span>
      </div>
    </header>
  );
}

export function AppShell() {
  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <Header />
          <div className="flex-1 overflow-auto p-6">
            <Outlet />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
