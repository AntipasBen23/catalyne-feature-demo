import React from 'react';
import { Prospect } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  getStatusColor, 
  getStatusLabel, 
  getSegmentColor,
  formatCurrency,
  formatRelativeDate,
  getScoreBadgeColor
} from '@/lib/utils';
import { 
  Building2, 
  Users, 
  TrendingUp, 
  Clock,
  AlertCircle,
  CheckCircle2,
  MessageSquare
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProspectCardProps {
  prospect: Prospect;
  onClick: () => void;
  isSelected?: boolean;
}

export function ProspectCard({ prospect, onClick, isSelected = false }: ProspectCardProps) {
  const latestConversation = prospect.conversations[prospect.conversations.length - 1];
  const pendingActions = prospect.next_actions.filter(a => !a.completed);
  const overdueActions = pendingActions.filter(a => new Date(a.due_date) < new Date());
  
  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all hover:shadow-md hover:border-cyan-400",
        isSelected && "border-cyan-500 shadow-md ring-2 ring-cyan-500/20"
      )}
      onClick={onClick}
    >
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Building2 className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <h3 className="font-semibold text-gray-900 truncate">{prospect.company}</h3>
            </div>
            <p className="text-xs text-gray-500 truncate">{prospect.website}</p>
          </div>
          
          {/* Overall Score */}
          <div className="flex-shrink-0 ml-2">
            <div className={cn(
              "flex items-center justify-center w-12 h-12 rounded-full border-2 font-bold text-sm",
              getScoreBadgeColor(prospect.overall_score)
            )}>
              {prospect.overall_score.toFixed(1)}
            </div>
          </div>
        </div>
        
        {/* Status and Segment Badges */}
        <div className="flex flex-wrap gap-2 mb-3">
          <Badge className={cn("text-xs border", getStatusColor(prospect.status))}>
            {getStatusLabel(prospect.status)}
          </Badge>
          <Badge className={cn("text-xs border", getSegmentColor(prospect.icp_segment))}>
            {prospect.icp_segment}
          </Badge>
        </div>
        
        {/* Key Metrics */}
        <div className="grid grid-cols-3 gap-2 mb-3 text-xs">
          <div className="flex items-center gap-1 text-gray-600">
            <Users className="h-3 w-3" />
            <span>{prospect.contacts.length} contact{prospect.contacts.length !== 1 ? 's' : ''}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-600">
            <MessageSquare className="h-3 w-3" />
            <span>{prospect.conversations.length} conv{prospect.conversations.length !== 1 ? 's' : ''}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-600">
            <Clock className="h-3 w-3" />
            <span>{prospect.days_in_pipeline}d</span>
          </div>
        </div>
        
        {/* Deal Value */}
        {prospect.deal_value && (
          <div className="flex items-center gap-1 mb-3 text-sm">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <span className="font-semibold text-green-700">{formatCurrency(prospect.deal_value)}</span>
          </div>
        )}
        
        {/* Latest Activity */}
        {latestConversation && (
          <div className="bg-gray-50 rounded-md p-2 mb-3">
            <p className="text-xs text-gray-500 mb-1">Latest activity</p>
            <p className="text-xs text-gray-700 line-clamp-2">{latestConversation.message}</p>
            <p className="text-xs text-gray-400 mt-1">{formatRelativeDate(latestConversation.date)}</p>
          </div>
        )}
        
        {/* Action Alerts */}
        {pendingActions.length > 0 && (
          <div className="flex items-center gap-2">
            {overdueActions.length > 0 ? (
              <div className="flex items-center gap-1 text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
                <AlertCircle className="h-3 w-3" />
                <span>{overdueActions.length} overdue</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-xs text-cyan-600 bg-cyan-50 px-2 py-1 rounded">
                <CheckCircle2 className="h-3 w-3" />
                <span>{pendingActions.length} action{pendingActions.length !== 1 ? 's' : ''} pending</span>
              </div>
            )}
          </div>
        )}
        
        {/* Primary Contact */}
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-700 font-semibold text-[10px]">
                {prospect.contacts[0].name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="min-w-0">
                <p className="font-medium text-gray-700 truncate">{prospect.contacts[0].name}</p>
                <p className="text-gray-500 truncate">{prospect.contacts[0].role}</p>
              </div>
            </div>
            <div className={cn(
              "flex-shrink-0 px-2 py-0.5 rounded text-[10px] font-semibold",
              getScoreBadgeColor(prospect.contacts[0].engagement_score)
            )}>
              {prospect.contacts[0].engagement_score.toFixed(1)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}