import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { Outlet } from 'react-router-dom';



const AccountingLayout = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    const navLink = [
        { label: 'Dashboard', path: '/accountant', icon: 'LayoutDashboard', roles: ['accountant'] },
        { label: 'Payment Management', path: '/finance/payments', icon: 'Banknote', roles: ['accountant'] },
        { label: 'P&L Analysis', path: '/finance/pl-analysis', icon: 'TrendingUp', roles: ['accountant'] },
        { label: 'Settlements', path: '/finance/settlement', icon: 'TrendingUp', roles: ['accountant'] },
        { label: 'Patient Enrollment', path: '/finance/enrollment', icon: 'TrendingUp', roles: ['accountant'] },
        { label: 'Patient Invoice', path: '/finance/invoice', icon: 'FileText', roles: ['accountant'] },
        /*{ label: 'Salary & Allowances', path: '/finance/salary', icon: 'Wallet', roles: ['accountant'] },
        { label: 'Stock Purchases', path: '/finance/purchases', icon: 'ShoppingBag', roles: ['accountant'] },
        { label: 'General Reports', path: '/finance/reports', icon: 'BarChart3', roles: ['accountant'] },
        { label: 'Billing', path: '/finance/billing', icon: 'FileText', roles: ['accountant'] },
*/
    ]

    return (
        <div className="min-h-screen bg-background">
            {/* Mobile Menu Overlay */}
            <div className="lg:hidden">
                <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                    <SheetTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="fixed top-4 left-4 z-50"
                        >
                            <Menu className="h-5 w-5" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-72 p-0">
                        <div className="h-full">
                            <Sidebar collapsed={false} onToggleCollapse={() => {}} />
                        </div>
                    </SheetContent>
                </Sheet>
            </div>

            {/* Desktop Sidebar */}
            <div className="hidden lg:block">
                <Sidebar
                    collapsed={sidebarCollapsed}
                    onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
                    navLinks={navLink}
                />
            </div>

            {/* Main Content Area */}
            <div
                className={cn(
                    "transition-all duration-300 min-h-screen flex flex-col",
                    sidebarCollapsed ? "lg:ml-16" : "lg:ml-64"
                )}
            >
                <TopBar onMenuClick={() => setMobileOpen(true)} />
                <main className="flex-1 p-4 lg:p-6 overflow-auto">
                    <div className="max-w-7xl mx-auto animate-fade-in">
                        <Outlet/>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AccountingLayout;
