import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { getNavigationForRole } from '@/lib/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  LayoutDashboard, Users, UserPlus, Banknote, ListOrdered,
  Stethoscope, FilePlus, Clock, FlaskConical, FileText, Wrench, Upload,
  Pill, Package, ShoppingCart, CreditCard, Receipt, FileEdit, Syringe,
  MessageSquare, Bed, TrendingUp, Wallet, ShoppingBag, BarChart3, FileBarChart,
  Calendar, CalendarDays, Mail, Building2, Settings2, ChevronLeft, ChevronRight,
  Menu, LogOut, Activity, HeartPulse
} from 'lucide-react';
import {userStore} from "../../store/store.jsx";
import {SheetHeader, SheetTitle} from "../ui/sheet.js";

const iconMap = {
  LayoutDashboard: <LayoutDashboard className="w-5 h-5" />,
  Users: <Users className="w-5 h-5" />,
  UserPlus: <UserPlus className="w-5 h-5" />,
  Banknote: <Banknote className="w-5 h-5" />,
  ListOrdered: <ListOrdered className="w-5 h-5" />,
  Stethoscope: <Stethoscope className="w-5 h-5" />,
  FilePlus: <FilePlus className="w-5 h-5" />,
  Clock: <Clock className="w-5 h-5" />,
  FlaskConical: <FlaskConical className="w-5 h-5" />,
  FileText: <FileText className="w-5 h-5" />,
  Wrench: <Wrench className="w-5 h-5" />,
  Upload: <Upload className="w-5 h-5" />,
  Pill: <Pill className="w-5 h-5" />,
  Package: <Package className="w-5 h-5" />,
  ShoppingCart: <ShoppingCart className="w-5 h-5" />,
  CreditCard: <CreditCard className="w-5 h-5" />,
  Receipt: <Receipt className="w-5 h-5" />,
  FileEdit: <FileEdit className="w-5 h-5" />,
  Syringe: <Syringe className="w-5 h-5" />,
  MessageSquare: <MessageSquare className="w-5 h-5" />,
  Bed: <Bed className="w-5 h-5" />,
  TrendingUp: <TrendingUp className="w-5 h-5" />,
  Wallet: <Wallet className="w-5 h-5" />,
  ShoppingBag: <ShoppingBag className="w-5 h-5" />,
  BarChart3: <BarChart3 className="w-5 h-5" />,
  FileBarChart: <FileBarChart className="w-5 h-5" />,
  Calendar: <Calendar className="w-5 h-5" />,
  CalendarDays: <CalendarDays className="w-5 h-5" />,
  Mail: <Mail className="w-5 h-5" />,
  Building2: <Building2 className="w-5 h-5" />,
  Settings2: <Settings2 className="w-5 h-5" />,
  Activity: <Activity className="w-5 h-5" />,
  HeartPulse: <HeartPulse className="w-5 h-5" />,
};


const SidebarContent = ({ collapsed, navLinks }) => {
  const { user, logout } = userStore();
  const location = useLocation();
  const navigate = useNavigate();

  if (!user) return null;

  //const navItems = getNavigationForRole(user.user_role);
  console.log(navLinks)

  return (
      <div className="flex flex-col  w-full h-full">
        {/* Logo */}
        <div className={cn(
            "flex items-center h-16 px-4 border-b",
            collapsed ? "justify-center" : "justify-between"
        )}>
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate(`/${user.user_role}`)}>
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
              <HeartPulse className="w-5 h-5 text-primary-foreground" />
            </div>
            {!collapsed && (
                <div className="flex flex-col">
                  <span className="font-bold text-lg leading-tight text-foreground">Hospitalise</span>
                  <span className="text-[10px] text-muted-foreground leading-tight">HMS v1.0</span>
                </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 py-2">
          <nav className="px-2 space-y-1">
            {navLinks?.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                  <button
                      key={item.path}
                      onClick={() => navigate(item.path)}
                      className={cn(
                          "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative",
                          isActive
                              ? "bg-primary/10 text-primary border-l-[3px] border-l-primary"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground border-l-[3px] border-l-transparent"
                      )}
                      title={collapsed ? item.label : undefined}
                  >
                <span className={cn(
                    "transition-colors",
                    isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                )}>
                  {iconMap[item.icon] || <Activity className="w-5 h-5" />}
                </span>
                    {!collapsed && <span className="truncate">{item.label}</span>}
                    {isActive && !collapsed && (
                        <div className="absolute right-2 w-1.5 h-1.5 rounded-full bg-primary" />
                    )}
                  </button>
              );
            })}
          </nav>
        </ScrollArea>

        <Separator />

        {/* Bottom Actions */}
        <div className="p-2 space-y-1">
          <button
              onClick={() => navigate('/settings')}
              className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-all",
                  collapsed && "justify-center"
              )}
              title={collapsed ? 'Settings' : undefined}
          >
            <Settings2 className="w-5 h-5" />
            {!collapsed && <span>Settings</span>}
          </button>
          <button
              onClick={logout}
              className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-all",
                  collapsed && "justify-center"
              )}
              title={collapsed ? 'Logout' : undefined}
          >
            <LogOut className="w-5 h-5" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </div>
  );
};

const Sidebar = ({ collapsed, onToggleCollapse, navLinks }) => {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  console.log(navLinks)

  return (
      <>
        {/* Mobile Toggle */}
        <div className="lg:hidden  fixed top-0 left-0 z-50 p-4">
          <Sheet open={mobileOpen}  onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-10 w-10">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72  p-0">

              <SidebarContent collapsed={collapsed} navLinks={navLinks} />
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop Sidebar */}
        <aside
            className={cn(
                "hidden lg:flex flex-col fixed top-0 left-0 h-full bg-card border-r z-40 transition-all duration-300",
                collapsed ? "w-16" : "w-64"
            )}
        >
          <SidebarContent collapsed={collapsed}
                          navLinks={navLinks}
          />
          <button
              onClick={onToggleCollapse}
              className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md hover:bg-primary/90 transition-colors z-50"
          >
            {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
          </button>
        </aside>
      </>
  );
};

export default Sidebar;
