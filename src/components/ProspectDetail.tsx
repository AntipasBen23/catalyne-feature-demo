import React, { useState } from 'react';
import { Prospect, Conversation } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  Building2, 
  Globe, 
  Mail, 
  Linkedin, 
  Phone,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  Users,
  Target,
  X
} from 'lucide-react';
import {
  getStatusColor,
  getStatusLabel,
  getSegmentColor,
  formatCurrency,
  formatDate,
  formatRelativeDate,
  getSentimentIcon,
  getSentimentColor,
  getChannelIcon,
  getChannelLabel,
  getScoreBadgeColor,
  cn
} from '@/lib/utils';
import { useProspectStore } from '@/store/useProspectStore';
import { ConversationTimeline } from './ConversationTimeline';
import { NextActionsList } from './NextActionsList';
import { AIAssistant } from './AIAssistant';

interface ProspectDetailProps {
  prospect: Prospect;
  onClose: () => void;
}

export function ProspectDetail({ prospect, onClose }: ProspectDetailProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'conversations' | 'actions' | 'ai'>('overview');
  const { updateProspectStatus } = useProspectStore();
  
  const pendingActions = prospect.next_actions.filter(a => !a.completed);
  const overdueActions = pendingActions.filter(a => new Date(a.due_date) < new Date());
  
  const tabs = [
    { id: 'overview', label: 'Overview', icon: Building2 },
    { id: 'conversations', label: 'Conversations', icon: MessageSquare, badge: prospect.conversations.length },
    { id: 'actions', label: 'Actions', icon: CheckCircle2, badge: pendingActions.length },
    { id: 'ai', label: 'AI Assistant', icon: Sparkles },
  ];
  
  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                {prospect.company.substring(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-2xl font-bold text-gray-900 truncate">{prospect.company}</h2>
                <a 
                  href={prospect.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-cyan-600 hover:text-cyan-700 flex items-center gap-1"
                >
                  <Globe className="h-3 w-3" />
                  {prospect.website}
                </a>
              </div>
            </div>
            
            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              <Badge className={cn("border", getStatusColor(prospect.status))}>
                {getStatusLabel(prospect.status)}
              </Badge>
              <Badge className={cn("border", getSegmentColor(prospect.icp_segment))}>
                {prospect.icp_segment}
              </Badge>
              {prospect.deal_value && (
                <Badge className="border border-green-300 bg-green-50 text-green-700">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {formatCurrency(prospect.deal_value)}
                </Badge>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2 ml-4">
            {/* Overall Score */}
            <div className={cn(
              "flex flex-col items-center justify-center w-16 h-16 rounded-lg border-2",
              getScoreBadgeColor(prospect.overall_score)
            )}>
              <span className="text-2xl font-bold">{prospect.overall_score.toFixed(1)}</span>
              <span className="text-[10px] uppercase tracking-wide">Score</span>
            </div>
            
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        {/* Alerts */}
        {overdueActions.length > 0 && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span className="font-medium">{overdueActions.length} overdue action{overdueActions.length !== 1 ? 's' : ''}</span>
          </div>
        )}
        
        {/* Tabs */}
        <div className="flex gap-1 mt-4 border-b border-gray-200">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors",
                  activeTab === tab.id
                    ? "border-cyan-500 text-cyan-600"
                    : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
                )}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
                {tab.badge !== undefined && tab.badge > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {tab.badge}
                  </Badge>
                )}
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'overview' && <OverviewTab prospect={prospect} />}
        {activeTab === 'conversations' && <ConversationTimeline prospect={prospect} />}
        {activeTab === 'actions' && <NextActionsList prospect={prospect} />}
        {activeTab === 'ai' && <AIAssistant prospect={prospect} />}
      </div>
    </div>
  );
}

// Overview Tab Component
function OverviewTab({ prospect }: { prospect: Prospect }) {
  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Contacts</p>
                <p className="text-2xl font-bold text-gray-900">{prospect.contacts.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Conversations</p>
                <p className="text-2xl font-bold text-gray-900">{prospect.conversations.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Clock className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Days in Pipeline</p>
                <p className="text-2xl font-bold text-gray-900">{prospect.days_in_pipeline}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Qualification Scores */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-gray-700" />
            Qualification Scores
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ScoreBar 
            label="Decision Maker Accessibility" 
            score={prospect.decision_maker_accessibility} 
          />
          <ScoreBar 
            label="Budget Authority" 
            score={prospect.budget_authority} 
          />
          <ScoreBar 
            label="Strategic Fit" 
            score={prospect.strategic_fit} 
          />
        </CardContent>
      </Card>
      
      {/* Pain Points */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-gray-700" />
            Pain Points
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {prospect.pain_points.map((point, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="flex-shrink-0 w-1.5 h-1.5 bg-cyan-500 rounded-full mt-2" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      
      {/* Contacts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-gray-700" />
            Contacts ({prospect.contacts.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {prospect.contacts.map((contact) => (
            <div key={contact.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0 w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center text-cyan-700 font-semibold">
                {contact.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-semibold text-gray-900">{contact.name}</h4>
                  <div className={cn(
                    "px-2 py-1 rounded text-xs font-semibold",
                    getScoreBadgeColor(contact.engagement_score)
                  )}>
                    {contact.engagement_score.toFixed(1)}
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-2">{contact.role}</p>
                
                <div className="flex flex-wrap gap-2 mb-2">
                  <a 
                    href={`mailto:${contact.email}`}
                    className="flex items-center gap-1 text-xs text-gray-600 hover:text-cyan-600"
                  >
                    <Mail className="h-3 w-3" />
                    {contact.email}
                  </a>
                  <a 
                    href={`https://${contact.linkedin_url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-gray-600 hover:text-cyan-600"
                  >
                    <Linkedin className="h-3 w-3" />
                    LinkedIn
                  </a>
                </div>
                
                {contact.messaging_notes && (
                  <div className="text-xs text-gray-500 bg-white p-2 rounded border border-gray-200">
                    <span className="font-medium">Messaging notes:</span> {contact.messaging_notes}
                  </div>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
      
      {/* Notes */}
      {prospect.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{prospect.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Score Bar Component
function ScoreBar({ label, score }: { label: string; score: number }) {
  const percentage = (score / 10) * 100;
  const color = score >= 7 ? 'bg-green-500' : score >= 5 ? 'bg-yellow-500' : 'bg-red-500';
  
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm font-bold text-gray-900">{score.toFixed(1)} / 10</span>
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