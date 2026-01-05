import React from 'react';
import { useUIStore } from '@/store/useUIStore';
import { useProspectStore } from '@/store/useProspectStore';
import { Dashboard } from './Dashboard';
import { ProspectList } from './ProspectList';
import { ProspectKanban } from './ProspectKanban';
import { ProspectDetail } from './ProspectDetail';

export function MainContent() {
  const { currentView } = useUIStore();
  const { selectedProspect, setSelectedProspect } = useProspectStore();
  
  return (
    <div className="flex h-full">
      {/* Primary Content Area */}
      <div className={cn(
        "transition-all duration-300",
        selectedProspect ? "w-1/2" : "w-full"
      )}>
        {currentView === 'dashboard' && <Dashboard />}
        {currentView === 'list' && <ProspectList />}
        {currentView === 'pipeline' && <ProspectKanban />}
      </div>
      
      {/* Detail Panel (Slide in from right) */}
      {selectedProspect && (
        <div className="w-1/2 border-l border-gray-200 bg-white animate-slide-in-right">
          <ProspectDetail 
            prospect={selectedProspect} 
            onClose={() => setSelectedProspect(null)}
          />
        </div>
      )}
    </div>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}