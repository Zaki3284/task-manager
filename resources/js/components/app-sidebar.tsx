import { Link, usePage } from '@inertiajs/react';
import { CheckSquare, Folder, HelpCircle, LayoutGrid, Users, AlertCircle } from 'lucide-react';
import { NavFooter } from '@/components/nav-footer';
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
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';
import AppLogo from './app-logo';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useTranslation } from '@/hooks/useTranslation';

export function AppSidebar() {
    const { t } = useTranslation();
    const { auth } = usePage().props as {
        auth: {
            user: {
                role: 'Admin' | 'Developer' | 'Chef de projet';
            };
        };
    };

    const userRole = auth.user.role;
    const isAdmin = userRole === 'Admin';
    const isDeveloper = userRole === 'Developer';

    const getMainNavItems = (): NavItem[] => {
        const allItems: NavItem[] = [
            {
                title: t('dashboard'),
                href: dashboard(),
                icon: LayoutGrid,
            },
            { 
                title: t('projects'), 
                href: '/projects', 
                icon: Folder 
            },
            { 
                title: t('tasks'), 
                href: '/tasks', 
                icon: CheckSquare 
            },
            { 
                title: t('users'), 
                href: '/users', 
                icon: Users 
            },
        ];

        return allItems.filter((item) => {
            if (item.href === '/projects' && isDeveloper) return false;
            if (item.href === '/users' && !isAdmin) return false;
            return true;
        });
    };

    const footerNavItems: NavItem[] = [
        {
            title: t('report_problem'),
            href: '/report-problem', 
            icon: AlertCircle,
        },
        {
            title: t('help_center'),
            href: '/help-center', 
            icon: HelpCircle,
        },
    ];

    const mainNavItems = getMainNavItems();

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
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
                {/* Language Switcher */}
                <div className="px-2 py-2">
                    <LanguageSwitcher variant="dropdown" />
                </div>
                
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}