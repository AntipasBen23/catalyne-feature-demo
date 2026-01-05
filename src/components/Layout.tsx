import React, { useState } from 'react';
import { useUIStore } from '@/store/useUIStore';
import { useProspectStore } from '@/store/useProspectStore';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  List, 
  KanbanSquare,
  Menu,
  X,
  Sparkles,
  Settings,
  HelpCircle,
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { sidebarOpen, toggleSidebar } = useUIStore();
  
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={toggleSidebar} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <TopBar onMenuClick={toggleSidebar} />
        
        {/* Content Area */}
        <main className="flex-1 overflow-auto bg-gray-50">
          {children}
        </main>
      </div>
      
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
}

// Sidebar Component
function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { currentView, setCurrentView } = useUIStore();
  const { prospects } = useProspectStore();
  
  const navItems = [
    { 
      id: 'dashboard' as const, 
      label: 'Dashboard', 
      icon: LayoutDashboard,
      badge: null
    },
    { 
      id: 'list' as const, 
      label: 'List View', 
      icon: List,
      badge: prospects.length
    },
    { 
      id: 'pipeline' as const, 
      label: 'Pipeline Board', 
      icon: KanbanSquare,
      badge: null
    },
  ];
  
  const handleNavClick = (view: typeof currentView) => {
    setCurrentView(view);
    // Close sidebar on mobile after selection
    if (window.innerWidth < 1024) {
      onClose();
    }
  };
  
  return (
    <aside className={cn(
      "fixed lg:static inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white transform transition-transform duration-300 ease-in-out flex flex-col",
      isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
    )}>
      {/* Header */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Catalyne</h1>
              <p className="text-xs text-gray-400">CoPilot</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={cn(
                "w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all",
                isActive 
                  ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/50" 
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              )}
            >
              <div className="flex items-center gap-3">
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </div>
              {item.badge !== null && (
                <span className={cn(
                  "px-2 py-0.5 rounded-full text-xs font-semibold",
                  isActive 
                    ? "bg-white text-cyan-600" 
                    : "bg-gray-700 text-gray-300"
                )}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
      
      {/* Footer */}
      <div className="p-4 border-t border-gray-700 space-y-1">
        <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-all">
          <Settings className="h-5 w-5" />
          <span className="font-medium">Settings</span>
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-all">
          <HelpCircle className="h-5 w-5" />
          <span className="font-medium">Help</span>
        </button>
      </div>
      
      {/* Branding */}
      <div className="p-4 border-t border-gray-700">
        <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-lg p-3">
          <p className="text-xs text-gray-400 mb-1">Built for</p>
          <p className="text-sm font-semibold text-cyan-400">Catalyne by Antipas</p>
          <p className="text-xs text-gray-500 mt-1">Demo Prototype</p>
        </div>
      </div>
    </aside>
  );
}

// Top Bar Component
function TopBar({ onMenuClick }: { onMenuClick: () => void }) {
  const { prospects } = useProspectStore();
  const { currentView } = useUIStore();
  
  const viewTitles = {
    dashboard: 'Dashboard',
    list: 'List View',
    pipeline: 'Pipeline Board',
    calendar: 'Calendar View',
  };
  
  const activePending = prospects.reduce((sum, p) => {
    return sum + p.next_actions.filter(a => !a.completed).length;
  }, 0);
  
  const overdueActions = prospects.reduce((sum, p) => {
    return sum + p.next_actions.filter(a => 
      !a.completed && new Date(a.due_date) < new Date()
    ).length;
  }, 0);
  
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <button 
            onClick={onMenuClick}
            className="lg:hidden text-gray-600 hover:text-gray-900"
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {viewTitles[currentView]}
            </h2>
            <p className="text-sm text-gray-500">
              {prospects.length} prospects • {activePending} pending actions
            </p>
          </div>
        </div>
        
        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Overdue Alert */}
          {overdueActions > 0 && (
            <div className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-red-700">
                {overdueActions} overdue
              </span>
            </div>
          )}
          
          {/* User Avatar */}
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
            A
          </div>
        </div>
      </div>
    </header>
  );
}