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
  Clock,
  AlertCircle,
  Zap
} from 'lucide-react';
import { useProspectStore } from '@/store/useProspectStore';
import { formatCurrency, formatPercentage, cn } from '@/lib/utils';

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