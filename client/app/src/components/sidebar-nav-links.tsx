import { cn } from '@/lib/utils';
import { useSidebar } from '@/components/ui/sidebar';
import { NavLink, useLocation } from 'react-router-dom';
import Icon from './icon';
import type { SideBarItem } from './sliders/admin-slider';

interface NavLinkProps {
    item: SideBarItem
    className?: string
}


const SidebarNavLink: React.FC<NavLinkProps> = ({item, className }) => {
    const location = useLocation();
    const isActive = location.pathname === item.url || (item.url !== "/" && location.pathname.startsWith(`${item.url}/`));
    const { state } = useSidebar();
    const isCollapsed = state === "collapsed";

    return (
        <NavLink to={item.url} data-active={isActive} className={cn(className, "data-[active=true]:text-white data-[active=true]:bg-primary")}>
            <Icon name={item.icon as any} width={20} height={20} className="shrink-0" stroke='currentColor' />
            <span className={cn("truncate", isCollapsed && "hidden")}>{item.title}</span>
        </NavLink>
    )
}

export default SidebarNavLink