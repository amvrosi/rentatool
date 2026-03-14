import { Link, usePage } from '@inertiajs/react';
import { ClipboardList, Layers, LayoutGrid, Package, Users, Wrench } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import type { NavItem } from '@/types';
import type { Auth, UserRole } from '@/types/auth';

const navItemsByRole: Record<UserRole, NavItem[]> = {
    customer: [
        {
            title: 'Dashboard',
            href: '/my/dashboard',
            icon: LayoutGrid,
        },
        {
            title: 'My Rentals',
            href: '/my/rentals',
            icon: ClipboardList,
        },
        {
            title: 'Browse Equipment',
            href: '/equipment',
            icon: Package,
        },
    ],
    admin: [
        {
            title: 'Dashboard',
            href: '/admin/dashboard',
            icon: LayoutGrid,
        },
        {
            title: 'Equipment',
            href: '/admin/equipment',
            icon: Wrench,
        },
        {
            title: 'Categories',
            href: '/admin/categories',
            icon: Layers,
        },
        {
            title: 'Rentals',
            href: '/admin/rentals',
            icon: ClipboardList,
        },
        {
            title: 'Users',
            href: '/admin/users',
            icon: Users,
        },
    ],
    operator: [
        {
            title: 'Dashboard',
            href: '/operator/dashboard',
            icon: LayoutGrid,
        },
        {
            title: 'My Assignments',
            href: '/operator/rentals',
            icon: ClipboardList,
        },
    ],
};

function getDashboardHref(role: UserRole): string {
    switch (role) {
        case 'admin':
            return '/admin/dashboard';
        case 'operator':
            return '/operator/dashboard';
        case 'customer':
        default:
            return '/my/dashboard';
    }
}

export function AppSidebar() {
    const { auth } = usePage<{ auth: Auth }>().props;
    const role = auth.user.role;
    const mainNavItems = navItemsByRole[role] ?? navItemsByRole.customer;

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
