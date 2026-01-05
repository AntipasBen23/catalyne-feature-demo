import React from 'react';
import { ProspectStatus, Prospect } from '@/types';
import { useProspectStore } from '@/store/useProspectStore';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getStatusLabel, getSegmentColor, formatCurrency, cn } from '@/lib/utils';
import { Building2, TrendingUp } from 'lucide-react';

const KANBAN_STAGES: ProspectStatus[] = [
  'not_contacted',
  'contacted',
  'replied',
  'meeting_scheduled',
  'proposal_sent',
  'negotiating',
  'closed_won',
];

export function ProspectKanban() {
  const { getFilteredProspects, selectedProspect, setSelectedProspect, updateProspectStatus } = useProspectStore();
  const filteredProspects = getFilteredProspects();
  
  const handleDragStart = (e: React.DragEvent, prospect: Prospect) => {
    e.dataTransfer.setData('prospectId', prospect.id);
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };
  
  const handleDrop = (e: React.DragEvent, status: ProspectStatus) => {
    e.preventDefault();
    const prospectId = e.dataTransfer.getData('prospectId');
    if (prospectId) {
      updateProspectStatus(prospectId, status);
    }
  };
  
  return (
    <div className="h-full overflow-x-auto">
      <div className="flex gap-4 p-4 min-w-max h-full">
        {KANBAN_STAGES.map((status) => {
          const stageProspects = filteredProspects.filter(p => p.status === status);
          const stageValue = stageProspects.reduce((sum, p) => sum + (p.deal_value || 0), 0);
          
          return (
            <div
              key={status}
              className="flex-shrink-0 w-80 flex flex-col bg-gray-50 rounded-lg"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, status)}
            >
              {/* Column Header */}
              <div className="p-4 border-b border-gray-200 bg-white rounded-t-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{getStatusLabel(status)}</h3>
                  <Badge variant="secondary" className="text-xs">
                    {stageProspects.length}
                  </Badge>
                </div>
                {stageValue > 0 && (
                  <p className="text-sm text-gray-600">{formatCurrency(stageValue)}</p>
                )}
              </div>
              
              {/* Column Content */}
              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {stageProspects.map((prospect) => (
                  <Card
                    key={prospect.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, prospect)}
                    className={cn(
                      "cursor-grab active:cursor-grabbing transition-all hover:shadow-md",
                      selectedProspect?.id === prospect.id && "ring-2 ring-cyan-500"
                    )}
                    onClick={() => setSelectedProspect(prospect)}
                  >
                    <CardContent className="p-3">
                      {/* Company */}
                      <div className="flex items-start gap-2 mb-2">
                        <Building2 className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                        <div className="min-w-0 flex-1">
                          <h4 className="font-semibold text-sm text-gray-900 truncate">
                            {prospect.company}
                          </h4>
                          <p className="text-xs text-gray-500 truncate">{prospect.contacts[0].name}</p>
                        </div>
                      </div>
                      
                      {/* Segment Badge */}
                      <Badge className={cn("text-xs mb-2 border", getSegmentColor(prospect.icp_segment))}>
                        {prospect.icp_segment}
                      </Badge>
                      
                      {/* Deal Value */}
                      {prospect.deal_value && (
                        <div className="flex items-center gap-1 text-sm">
                          <TrendingUp className="h-3 w-3 text-green-600" />
                          <span className="font-semibold text-green-700 text-xs">
                            {formatCurrency(prospect.deal_value)}
                          </span>
                        </div>
                      )}
                      
                      {/* Score */}
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                        <span className="text-xs text-gray-500">Score</span>
                        <span className="text-xs font-semibold text-gray-700">
                          {prospect.overall_score.toFixed(1)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {stageProspects.length === 0 && (
                  <div className="text-center py-8 text-sm text-gray-400">
                    Drag prospects here
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}