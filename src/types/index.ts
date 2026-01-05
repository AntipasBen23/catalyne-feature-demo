// Core data types for Catalyne CoPilot

export type ProspectStatus = 
  | 'not_contacted' 
  | 'contacted' 
  | 'replied' 
  | 'meeting_scheduled' 
  | 'proposal_sent' 
  | 'negotiating' 
  | 'closed_won' 
  | 'closed_lost';

export type ICPSegment = 
  | 'Energy' 
  | 'Water' 
  | 'Proptech' 
  | 'Material Sciences' 
  | 'Waste Valorization' 
  | 'Logistics & Supply Chain' 
  | 'Health & Hygiene';

export type ConversationChannel = 'linkedin' | 'email' | 'phone' | 'meeting';

export type ConversationSentiment = 'positive' | 'neutral' | 'negative' | null;

export type NextActionType = 
  | 'follow_up' 
  | 'send_case_study' 
  | 'schedule_demo' 
  | 'send_proposal' 
  | 'negotiate_terms' 
  | 'close_deal';

export interface Contact {
  id: string;
  name: string;
  role: string;
  email: string;
  linkedin_url: string;
  engagement_score: number; // 0-10
  messaging_notes: string;
  last_contacted?: string;
}

export interface Conversation {
  id: string;
  contact_id: string;
  date: string;
  channel: ConversationChannel;
  message: string;
  replied: boolean;
  reply_message?: string;
  sentiment: ConversationSentiment;
  ai_insights?: string;
}

export interface NextAction {
  id: string;
  type: NextActionType;
  due_date: string;
  completed: boolean;
  notes: string;
  ai_suggested: boolean;
}

export interface Prospect {
  id: string;
  company: string;
  website: string;
  icp_segment: ICPSegment;
  status: ProspectStatus;
  pain_points: string[];
  decision_maker_accessibility: number; // 0-10
  budget_authority: number; // 0-10
  strategic_fit: number; // 0-10
  overall_score: number; // 0-10
  contacts: Contact[];
  conversations: Conversation[];
  next_actions: NextAction[];
  catalyne_dossier_url?: string;
  created_at: string;
  updated_at: string;
  days_in_pipeline: number;
  deal_value?: number;
  notes?: string;
}

export interface PipelineStats {
  total_prospects: number;
  contacted: number;
  replied: number;
  meetings_scheduled: number;
  proposals_sent: number;
  deals_closed: number;
  total_deal_value: number;
  average_response_time: number; // in days
  conversion_rate: number; // percentage
}

export interface ActivityFeedItem {
  id: string;
  type: 'conversation' | 'status_change' | 'action_completed' | 'ai_insight';
  prospect_id: string;
  prospect_name: string;
  message: string;
  timestamp: string;
  icon?: string;
}