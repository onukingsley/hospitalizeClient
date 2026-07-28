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



const DoctorLayout = () => {
    const { isAuthenticated } = useAuth();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    const navLink = [
        { label: 'Dashboard', path: '/doctor', icon: 'LayoutDashboard', roles: ['doctor'] },
        { label: 'Patient Diagnosis', path: '/doctor/diagnosis', icon: 'Stethoscope', roles: ['doctor'] },
        { label: 'New Diagnosis', path: '/doctor/diagnosis/new', icon: 'FilePlus', roles: ['doctor'] },
        { label: 'Patient Consultation', path: '/doctor/consultation', icon: 'Clock', roles: ['doctor'] },
        { label: 'My Patients', path: '/doctor/patients', icon: 'Users', roles: ['doctor'] },
    ]

    return (
        <div className="min-h-screen bg-background">
            {/* Mobile Menu Overlay */}
            <div className="lg:hidden">
                <div className="h-full">
                    <Sidebar
                        collapsed={false}
                        onToggleCollapse={() => {}}
                        navLinks={navLink} />
                </div>
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
                    <div className="max-w-[90%] mx-auto animate-fade-in">
                        <Outlet/>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DoctorLayout;
