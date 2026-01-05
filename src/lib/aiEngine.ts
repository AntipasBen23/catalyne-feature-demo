import { Prospect, Conversation, NextAction, ConversationSentiment, NextActionType } from '@/types';
import { generateId, delay } from './utils';

// AI-generated follow-up templates based on context
const followUpTemplates = {
  no_reply_first: [
    "Hi {name}, just bumping this up in case it got buried in your inbox. Would love to hear your thoughts on how we could help {company} with {pain_point}.",
    "{name}, wanted to circle back on my previous message about {solution}. Is this something that might be relevant for {company} right now?",
    "Hi {name}, following up on my last note. I know you're busy - would a quick 15-min call next week work to discuss {topic}?",
  ],
  no_reply_second: [
    "{name}, I know inboxes get crazy. Just wanted to check if you had a chance to review my previous messages about {solution}?",
    "Hi {name}, last follow-up from me! If the timing isn't right, totally understand. Just wanted to leave you with a case study from {industry}: {result}.",
    "{name}, realized we might have caught you at a busy time. Would {alternative_time} work better for a brief chat?",
  ],
  positive_response: [
    "That's great to hear, {name}! I've attached a case study from a similar {industry} company that saw {result}. When would be a good time for a deeper dive?",
    "Thanks {name}! Based on what you mentioned about {pain_point}, I think you'd find our approach to {solution} really valuable. Can I send over a quick demo video?",
    "Excellent! Let me send you some concrete examples of how we've helped companies like {company} with {specific_challenge}. Are you free for a 20-min call next week?",
  ],
  budget_objection: [
    "I totally understand budget constraints, {name}. What if we started with a pilot program focusing just on {specific_area}? That would give you proof of concept before a larger investment.",
    "That makes sense, {name}. Many of our clients started with our basic tier at {lower_price} to prove ROI first. Would that work for your situation?",
    "{name}, appreciate the honesty. Could we explore a phased approach where you pay based on achieved results? We're confident enough to offer that.",
  ],
  timing_objection: [
    "Completely understand, {name}. When would be a better time to reconnect? I'll put a reminder to follow up in {timeframe}.",
    "No problem at all, {name}. Would Q{next_quarter} be a better time? I'll send over some resources in the meantime that you can review at your leisure.",
    "I get it, {name}. How about I just send you a brief case study now, and we can reconnect when things settle down? No pressure.",
  ],
  post_meeting: [
    "Thanks for your time today, {name}! As discussed, I've attached {deliverable}. Looking forward to hearing your team's thoughts.",
    "Great conversation, {name}! I've put together a summary of our discussion and next steps. Can you confirm if {date} works for our follow-up call?",
    "{name}, really enjoyed our chat. Based on your feedback about {topic}, I've tailored this proposal specifically for {company}. Let me know what you think!",
  ],
  proposal_sent: [
    "Hi {name}, wanted to check if you had a chance to review the proposal I sent over? Happy to walk through any sections that need clarification.",
    "{name}, following up on the proposal. I know your team mentioned {concern} - I've added an addendum addressing that specifically. Available for a call anytime.",
    "Hi {name}, just checking in on the proposal. If there are any questions or if you need me to present it to your broader team, I'm happy to help.",
  ],
};

// Sentiment analysis keywords
const sentimentKeywords = {
  positive: [
    'interested', 'sounds good', 'great', 'excellent', 'perfect', 'definitely',
    'yes', 'love', 'excited', 'looking forward', 'impressive', 'thanks',
    'appreciate', 'helpful', 'valuable', 'exactly', 'absolutely', 'let\'s',
    'schedule', 'meeting', 'call', 'demo', 'proposal'
  ],
  negative: [
    'not interested', 'no thanks', 'too expensive', 'can\'t afford', 'not now',
    'busy', 'later', 'unsubscribe', 'remove', 'stop', 'never', 'wrong',
    'disappointed', 'concern', 'issue', 'problem', 'difficult', 'complicated'
  ],
  neutral: [
    'maybe', 'perhaps', 'possibly', 'thinking', 'considering', 'reviewing',
    'discuss', 'more info', 'details', 'clarify', 'explain', 'understand'
  ]
};

// AI Insights templates
const insightTemplates = {
  high_intent: "Strong buying signal detected. {reason}. Recommended action: {action}.",
  medium_intent: "Moderate interest shown. {reason}. Consider: {action}.",
  low_intent: "Cautious engagement. {reason}. Strategy: {action}.",
  objection: "Objection identified: {objection_type}. Suggested response: {response}.",
  ready_to_close: "Multiple positive signals. Timeline mentioned. High confidence close opportunity.",
  needs_nurturing: "Early stage. Requires educational content before sales push.",
};

/**
 * Analyze conversation sentiment using keyword matching
 */
export function analyzeSentiment(message: string): ConversationSentiment {
  const lowerMessage = message.toLowerCase();
  
  let positiveScore = 0;
  let negativeScore = 0;
  let neutralScore = 0;
  
  sentimentKeywords.positive.forEach(keyword => {
    if (lowerMessage.includes(keyword)) positiveScore++;
  });
  
  sentimentKeywords.negative.forEach(keyword => {
    if (lowerMessage.includes(keyword)) negativeScore++;
  });
  
  sentimentKeywords.neutral.forEach(keyword => {
    if (lowerMessage.includes(keyword)) neutralScore++;
  });
  
  // Determine overall sentiment
  if (positiveScore > negativeScore && positiveScore > neutralScore) {
    return 'positive';
  } else if (negativeScore > positiveScore) {
    return 'negative';
  } else if (neutralScore > 0 || positiveScore === negativeScore) {
    return 'neutral';
  }
  
  return null;
}

/**
 * Generate AI insights from conversation
 */
export function generateAIInsights(prospect: Prospect, conversation: Conversation): string {
  const sentiment = conversation.sentiment;
  const message = conversation.reply_message?.toLowerCase() || '';
  
  // Check for high intent signals
  if (sentiment === 'positive') {
    if (message.includes('schedule') || message.includes('meeting') || message.includes('call')) {
      return insightTemplates.high_intent
        .replace('{reason}', 'Prospect requested meeting/call')
        .replace('{action}', 'Send calendar invite with 2-3 time options');
    }
    
    if (message.includes('proposal') || message.includes('pricing') || message.includes('quote')) {
      return insightTemplates.high_intent
        .replace('{reason}', 'Prospect asked for pricing/proposal')
        .replace('{action}', 'Prepare detailed proposal highlighting ROI');
    }
    
    if (message.includes('interested') || message.includes('sounds good')) {
      return insightTemplates.medium_intent
        .replace('{reason}', 'Positive interest expressed')
        .replace('{action}', 'Send case study and offer demo');
    }
  }
  
  // Check for objections
  if (message.includes('expensive') || message.includes('budget') || message.includes('cost')) {
    return insightTemplates.objection
      .replace('{objection_type}', 'Budget concern')
      .replace('{response}', 'Offer pilot program or phased approach with clear ROI metrics');
  }
  
  if (message.includes('busy') || message.includes('timing') || message.includes('later')) {
    return insightTemplates.objection
      .replace('{objection_type}', 'Timing concern')
      .replace('{response}', 'Respect timeline, offer to reconnect in specific timeframe');
  }
  
  // Check for ready to close
  if (sentiment === 'positive' && (
    message.includes('team') || 
    message.includes('next steps') || 
    message.includes('contract')
  )) {
    return insightTemplates.ready_to_close;
  }
  
  // Default insights
  if (sentiment === 'neutral') {
    return insightTemplates.medium_intent
      .replace('{reason}', 'Prospect seeking more information')
      .replace('{action}', 'Provide detailed resources and schedule follow-up');
  }
  
  return insightTemplates.needs_nurturing;
}

/**
 * Generate follow-up message based on context
 */
export async function generateFollowUp(prospect: Prospect, context: string = 'no_reply_first'): Promise<string> {
  // Simulate AI processing delay
  await delay(1200);
  
  const contact = prospect.contacts[0];
  const templates = followUpTemplates[context as keyof typeof followUpTemplates] || followUpTemplates.no_reply_first;
  const template = templates[Math.floor(Math.random() * templates.length)];
  
  // Replace placeholders with actual data
  let message = template
    .replace(/{name}/g, contact.name.split(' ')[0])
    .replace(/{company}/g, prospect.company)
    .replace(/{pain_point}/g, prospect.pain_points[0] || 'your challenges')
    .replace(/{solution}/g, 'our solution')
    .replace(/{topic}/g, prospect.icp_segment.toLowerCase())
    .replace(/{industry}/g, prospect.icp_segment.toLowerCase())
    .replace(/{result}/g, '40% operational efficiency improvement')
    .replace(/{alternative_time}/g, 'next Tuesday afternoon')
    .replace(/{specific_area}/g, prospect.pain_points[0] || 'initial implementation')
    .replace(/{lower_price}/g, '$5,000/month')
    .replace(/{timeframe}/g, 'Q2')
    .replace(/{next_quarter}/g, 'Q2')
    .replace(/{deliverable}/g, 'the case study we discussed')
    .replace(/{date}/g, 'next Thursday')
    .replace(/{concern}/g, 'integration complexity')
    .replace(/{specific_challenge}/g, prospect.pain_points[0] || 'your challenges');
  
  return message;
}

/**
 * Suggest next best action based on prospect state
 */
export function suggestNextAction(prospect: Prospect): NextAction {
  const lastConversation = prospect.conversations[prospect.conversations.length - 1];
  const daysSinceLastContact = lastConversation 
    ? Math.floor((Date.now() - new Date(lastConversation.date).getTime()) / (1000 * 60 * 60 * 24))
    : 999;
  
  let actionType: NextActionType = 'follow_up';
  let notes = '';
  let daysUntilDue = 7;
  
  // Decision tree based on prospect status and conversation history
  switch (prospect.status) {
    case 'not_contacted':
      actionType = 'follow_up';
      notes = `Initial outreach to ${prospect.contacts[0].name}. Focus on ${prospect.pain_points[0]}.`;
      daysUntilDue = 1;
      break;
      
    case 'contacted':
      if (daysSinceLastContact > 7) {
        actionType = 'follow_up';
        notes = 'Second follow-up. Share case study from similar industry.';
        daysUntilDue = 2;
      } else if (daysSinceLastContact > 3) {
        actionType = 'follow_up';
        notes = 'First follow-up. Reference their recent company news or LinkedIn activity.';
        daysUntilDue = 4;
      }
      break;
      
    case 'replied':
      if (lastConversation?.sentiment === 'positive') {
        actionType = 'schedule_demo';
        notes = 'Prospect showed interest. Offer 15-min demo or discovery call.';
        daysUntilDue = 2;
      } else {
        actionType = 'send_case_study';
        notes = 'Send relevant case study and ROI calculator.';
        daysUntilDue = 3;
      }
      break;
      
    case 'meeting_scheduled':
      actionType = 'schedule_demo';
      notes = 'Prepare custom demo focusing on their specific pain points.';
      daysUntilDue = 1;
      break;
      
    case 'proposal_sent':
      if (daysSinceLastContact > 5) {
        actionType = 'follow_up';
        notes = 'Follow up on proposal. Offer to present to wider team.';
        daysUntilDue = 1;
      } else {
        actionType = 'negotiate_terms';
        notes = 'Prepare to address pricing and implementation questions.';
        daysUntilDue = 5;
      }
      break;
      
    case 'negotiating':
      actionType = 'close_deal';
      notes = 'Work with legal to finalize contract terms. Stay responsive.';
      daysUntilDue = 3;
      break;
      
    default:
      actionType = 'follow_up';
      notes = 'General follow-up to maintain engagement.';
      daysUntilDue = 7;
  }
  
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + daysUntilDue);
  
  return {
    id: generateId(),
    type: actionType,
    due_date: dueDate.toISOString(),
    completed: false,
    notes,
    ai_suggested: true,
  };
}

/**
 * Generate contextual follow-up based on last conversation
 */
export async function generateContextualFollowUp(prospect: Prospect): Promise<string> {
  const lastConversation = prospect.conversations[prospect.conversations.length - 1];
  
  if (!lastConversation) {
    return generateFollowUp(prospect, 'no_reply_first');
  }
  
  const daysSinceLastContact = Math.floor(
    (Date.now() - new Date(lastConversation.date).getTime()) / (1000 * 60 * 60 * 24)
  );
  
  // Determine context
  let context = 'no_reply_first';
  
  if (!lastConversation.replied && daysSinceLastContact > 7) {
    context = 'no_reply_second';
  } else if (!lastConversation.replied) {
    context = 'no_reply_first';
  } else if (lastConversation.sentiment === 'positive') {
    context = 'positive_response';
  } else if (lastConversation.reply_message?.toLowerCase().includes('budget')) {
    context = 'budget_objection';
  } else if (lastConversation.reply_message?.toLowerCase().includes('busy')) {
    context = 'timing_objection';
  }
  
  if (prospect.status === 'meeting_scheduled') {
    context = 'post_meeting';
  } else if (prospect.status === 'proposal_sent') {
    context = 'proposal_sent';
  }
  
  return generateFollowUp(prospect, context);
}

/**
 * Calculate engagement score based on conversation history
 */
export function calculateEngagementScore(prospect: Prospect): number {
  let score = 5; // Base score
  
  // Positive factors
  const repliedConversations = prospect.conversations.filter(c => c.replied).length;
  score += repliedConversations * 0.5;
  
  const positiveConversations = prospect.conversations.filter(c => c.sentiment === 'positive').length;
  score += positiveConversations * 1;
  
  // Status bonus
  const statusBonus = {
    not_contacted: 0,
    contacted: 0.5,
    replied: 1,
    meeting_scheduled: 2,
    proposal_sent: 2.5,
    negotiating: 3,
    closed_won: 5,
    closed_lost: -5,
  };
  score += statusBonus[prospect.status];
  
  // Negative factors
  const negativeConversations = prospect.conversations.filter(c => c.sentiment === 'negative').length;
  score -= negativeConversations * 1;
  
  const lastConversation = prospect.conversations[prospect.conversations.length - 1];
  if (lastConversation) {
    const daysSinceLastContact = Math.floor(
      (Date.now() - new Date(lastConversation.date).getTime()) / (1000 * 60 * 60 * 24)
    );
    
    if (daysSinceLastContact > 14) {
      score -= 1;
    } else if (daysSinceLastContact > 30) {
      score -= 2;
    }
  }
  
  // Cap between 0-10
  return Math.max(0, Math.min(10, score));
}

/**
 * Batch generate follow-ups for multiple prospects
 */
export async function batchGenerateFollowUps(prospects: Prospect[]): Promise<Map<string, string>> {
  const followUps = new Map<string, string>();
  
  for (const prospect of prospects) {
    const followUp = await generateContextualFollowUp(prospect);
    followUps.set(prospect.id, followUp);
  }
  
  return followUps;
}

/**
 * Simulate AI "thinking" animation
 */
export async function* streamAIResponse(finalMessage: string): AsyncGenerator<string> {
  const words = finalMessage.split(' ');
  let accumulated = '';
  
  for (const word of words) {
    accumulated += word + ' ';
    yield accumulated;
    await delay(50 + Math.random() * 50); // Variable typing speed
  }
}