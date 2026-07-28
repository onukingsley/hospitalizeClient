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



const PharmacyLayout = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    const navLink = [
        { label: 'Dashboard', path: '/pharmasist', icon: 'LayoutDashboard', roles: ['pharmasist'] },
        { label: 'Drug Dispensing', path: '/pharmacy/dispense', icon: 'Pill', roles: ['pharmasist'] },
        { label: 'Drug Stock', path: '/pharmacy/stock', icon: 'Package', roles: ['pharmasist'] },
        { label: 'Drug Requests', path: '/pharmacy/requests', icon: 'ShoppingCart', roles: ['pharmasist'] },
        { label: 'Patient Drug Sales', path: '/pharmacy/sales', icon: 'CreditCard', roles: ['pharmasist'] },
/*
        { label: 'All Drug Sales', path: '/pharmacy/all-sales', icon: 'Receipt', roles: ['pharmasist'] },
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

export default PharmacyLayout;
