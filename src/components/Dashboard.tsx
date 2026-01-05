import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, 
  MessageSquare, 
  Calendar,
  CheckCircle2,
  TrendingUp,
  DollarSign,
  Target,
  AlertCircle,
  Zap
} from 'lucide-react';
import { useProspectStore } from '@/store/useProspectStore';
import { formatCurrency, formatPercentage, cn } from '@/lib/utils';
import { Prospect } from '@/types';

export function Dashboard() {
  const { prospects } = useProspectStore();
  
  // Calculate stats
  const stats = calculateStats(prospects);
  
  return (
    <div className="space-y-6 p-6">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Pipeline Dashboard
        </h1>
        <p className="text-gray-600">
          Track your prospects, conversations, and revenue opportunities
        </p>
      </div>
      
      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Prospects"
          value={stats.totalProspects}
          icon={Users}
          iconColor="text-blue-600"
          iconBg="bg-blue-100"
        />
        
        <MetricCard
          title="Active Conversations"
          value={stats.activeConversations}
          icon={MessageSquare}
          iconColor="text-purple-600"
          iconBg="bg-purple-100"
        />
        
        <MetricCard
          title="Meetings Scheduled"
          value={stats.meetingsScheduled}
          icon={Calendar}
          iconColor="text-orange-600"
          iconBg="bg-orange-100"
        />
        
        <MetricCard
          title="Deals Closed"
          value={stats.dealsClosed}
          icon={CheckCircle2}
          iconColor="text-green-600"
          iconBg="bg-green-100"
        />
      </div>
      
      {/* Revenue & Conversion */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-900">
              <DollarSign className="h-5 w-5" />
              Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Deal Value (Won)</p>
                <p className="text-3xl font-bold text-green-700">
                  {formatCurrency(stats.totalDealValue)}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-green-200">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Pipeline Value</p>
                  <p className="text-lg font-bold text-gray-900">
                    {formatCurrency(stats.pipelineValue)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Avg Deal Size</p>
                  <p className="text-lg font-bold text-gray-900">
                    {formatCurrency(stats.avgDealSize)}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-cyan-200 bg-gradient-to-br from-cyan-50 to-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-cyan-900">
              <Target className="h-5 w-5" />
              Conversion Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-600">Reply Rate</p>
                  <p className="text-2xl font-bold text-cyan-700">
                    {formatPercentage(stats.replyRate)}
                  </p>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all"
                    style={{ width: `${stats.replyRate}%` }}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-cyan-200">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Meeting Rate</p>
                  <p className="text-lg font-bold text-gray-900">
                    {formatPercentage(stats.meetingRate)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Close Rate</p>
                  <p className="text-lg font-bold text-gray-900">
                    {formatPercentage(stats.closeRate)}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Pipeline Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Pipeline Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <PipelineStage 
              label="Not Contacted" 
              count={stats.byStatus.not_contacted}
              total={stats.totalProspects}
              color="bg-gray-400"
            />
            <PipelineStage 
              label="Contacted" 
              count={stats.byStatus.contacted}
              total={stats.totalProspects}
              color="bg-blue-500"
            />
            <PipelineStage 
              label="Replied" 
              count={stats.byStatus.replied}
              total={stats.totalProspects}
              color="bg-cyan-500"
            />
            <PipelineStage 
              label="Meeting Scheduled" 
              count={stats.byStatus.meeting_scheduled}
              total={stats.totalProspects}
              color="bg-purple-500"
            />
            <PipelineStage 
              label="Proposal Sent" 
              count={stats.byStatus.proposal_sent}
              total={stats.totalProspects}
              color="bg-orange-500"
            />
            <PipelineStage 
              label="Negotiating" 
              count={stats.byStatus.negotiating}
              total={stats.totalProspects}
              color="bg-yellow-500"
            />
            <PipelineStage 
              label="Closed Won" 
              count={stats.byStatus.closed_won}
              total={stats.totalProspects}
              color="bg-green-500"
            />
          </div>
        </CardContent>
      </Card>
      
      {/* Action Items */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-yellow-200 bg-yellow-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-900">
              <AlertCircle className="h-5 w-5" />
              Needs Attention
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats.needsAttention.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">
                All caught up! 🎉
              </p>
            ) : (
              stats.needsAttention.slice(0, 5).map((item) => (
                <div key={item.id} className="flex items-start gap-3 p-3 bg-white rounded-lg border border-yellow-200">
                  <AlertCircle className="h-4 w-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{item.company}</p>
                    <p className="text-xs text-gray-600">{item.reason}</p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
        
        <Card className="border-green-200 bg-green-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-900">
              <Zap className="h-5 w-5" />
              Hot Prospects
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats.hotProspects.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">
                Keep engaging to build hot prospects
              </p>
            ) : (
              stats.hotProspects.slice(0, 5).map((prospect) => (
                <div key={prospect.id} className="flex items-start gap-3 p-3 bg-white rounded-lg border border-green-200">
                  <Zap className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{prospect.company}</p>
                    <p className="text-xs text-gray-600">Score: {prospect.overall_score.toFixed(1)}/10</p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Segment Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Segment Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(stats.bySegment).map(([segment, count]) => (
              <div key={segment} className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-900">{count}</p>
                <p className="text-xs text-gray-600 mt-1">{segment}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Metric Card Component
function MetricCard({ 
  title, 
  value, 
  icon: Icon, 
  iconColor, 
  iconBg 
}: { 
  title: string; 
  value: number | string; 
  icon: any; 
  iconColor: string; 
  iconBg: string;
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">{title}</p>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
          </div>
          <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center", iconBg)}>
            <Icon className={cn("h-6 w-6", iconColor)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Pipeline Stage Component
function PipelineStage({ 
  label, 
  count, 
  total, 
  color 
}: { 
  label: string; 
  count: number; 
  total: number; 
  color: string;
}) {
  const percentage = total > 0 ? (count / total) * 100 : 0;
  
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm font-bold text-gray-900">
          {count} ({percentage.toFixed(0)}%)
        </span>
      </div>
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={cn("h-full transition-all duration-300", color)}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

// Calculate statistics from prospects
function calculateStats(prospects: Prospect[]) {
  const totalProspects = prospects.length;
  const contacted = prospects.filter(p => p.status !== 'not_contacted').length;
  const replied = prospects.filter(p => 
    ['replied', 'meeting_scheduled', 'proposal_sent', 'negotiating', 'closed_won'].includes(p.status)
  ).length;
  const meetingsScheduled = prospects.filter(p => 
    ['meeting_scheduled', 'proposal_sent', 'negotiating', 'closed_won'].includes(p.status)
  ).length;
  const dealsClosed = prospects.filter(p => p.status === 'closed_won').length;
  
  const totalDealValue = prospects
    .filter(p => p.status === 'closed_won')
    .reduce((sum, p) => sum + (p.deal_value || 0), 0);
  
  const pipelineValue = prospects
    .filter(p => p.status !== 'closed_won' && p.status !== 'closed_lost')
    .reduce((sum, p) => sum + (p.deal_value || 0), 0);
  
  const avgDealSize = dealsClosed > 0 ? totalDealValue / dealsClosed : 0;
  
  const replyRate = contacted > 0 ? (replied / contacted) * 100 : 0;
  const meetingRate = contacted > 0 ? (meetingsScheduled / contacted) * 100 : 0;
  const closeRate = contacted > 0 ? (dealsClosed / contacted) * 100 : 0;
  
  const activeConversations = prospects.reduce((sum, p) => 
    sum + p.conversations.filter((c: any) => {
      const daysSince = Math.floor((Date.now() - new Date(c.date).getTime()) / (1000 * 60 * 60 * 24));
      return daysSince <= 7;
    }).length
  , 0);
  
  const byStatus = {
    not_contacted: prospects.filter(p => p.status === 'not_contacted').length,
    contacted: prospects.filter(p => p.status === 'contacted').length,
    replied: prospects.filter(p => p.status === 'replied').length,
    meeting_scheduled: prospects.filter(p => p.status === 'meeting_scheduled').length,
    proposal_sent: prospects.filter(p => p.status === 'proposal_sent').length,
    negotiating: prospects.filter(p => p.status === 'negotiating').length,
    closed_won: prospects.filter(p => p.status === 'closed_won').length,
  };
  
  const bySegment: Record<string, number> = prospects.reduce((acc: Record<string, number>, p) => {
  acc[p.icp_segment] = (acc[p.icp_segment] || 0) + 1;
  return acc;
}, {} as Record<string, number>);
  
  // Prospects that need attention
  const needsAttention = prospects
    .filter(p => {
      if (p.status === 'closed_won' || p.status === 'closed_lost') return false;
      
      const lastConversation = p.conversations[p.conversations.length - 1];
      if (!lastConversation) return true;
      
      const daysSinceContact = Math.floor((Date.now() - new Date(lastConversation.date).getTime()) / (1000 * 60 * 60 * 24));
      const hasOverdueActions = p.next_actions.some((a: any) => !a.completed && new Date(a.due_date) < new Date());
      
      return daysSinceContact > 7 || hasOverdueActions;
    })
    .map(p => {
      const lastConversation = p.conversations[p.conversations.length - 1];
      const daysSinceContact = lastConversation 
        ? Math.floor((Date.now() - new Date(lastConversation.date).getTime()) / (1000 * 60 * 60 * 24))
        : 999;
      
      let reason = '';
      if (!lastConversation) {
        reason = 'No contact yet';
      } else if (daysSinceContact > 14) {
        reason = `No contact for ${daysSinceContact} days`;
      } else if (daysSinceContact > 7) {
        reason = `Follow up needed (${daysSinceContact}d)`;
      } else {
        reason = 'Has overdue actions';
      }
      
      return { id: p.id, company: p.company, reason };
    });
  
  // Hot prospects
  const hotProspects = prospects
    .filter(p => 
      p.overall_score >= 8 && 
      ['replied', 'meeting_scheduled', 'proposal_sent', 'negotiating'].includes(p.status)
    )
    .sort((a, b) => b.overall_score - a.overall_score);
  
  return {
    totalProspects,
    activeConversations,
    meetingsScheduled,
    dealsClosed,
    totalDealValue,
    pipelineValue,
    avgDealSize,
    replyRate,
    meetingRate,
    closeRate,
    byStatus,
    bySegment,
    needsAttention,
    hotProspects,
  };
}