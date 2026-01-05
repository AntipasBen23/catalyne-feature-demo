import React, { useState } from 'react';
import { Prospect, Conversation, ConversationChannel } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { 
  MessageSquare, 
  Plus, 
  Send,
  CheckCircle2,
  Clock
} from 'lucide-react';
import {
  formatDate,
  formatRelativeDate,
  getSentimentIcon,
  getSentimentColor,
  getChannelIcon,
  getChannelLabel,
  generateId,
  cn
} from '@/lib/utils';
import { useProspectStore } from '@/store/useProspectStore';
import { analyzeSentiment, generateAIInsights } from '@/lib/aiEngine';
import toast from 'react-hot-toast';

export function ConversationTimeline({ prospect }: { prospect: Prospect }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newConversation, setNewConversation] = useState({
    channel: 'email' as ConversationChannel,
    message: '',
    replied: false,
    reply_message: ''
  });
  const { addConversation } = useProspectStore();
  
const handleAddConversation = async () => {
  if (!newConversation.message.trim()) {
    toast.error('Please enter a message');
    return;
  }
  
  const sentiment = newConversation.replied 
    ? analyzeSentiment(newConversation.reply_message)
    : null;
  
  // Create a temporary conversation object for AI insights
  const tempConversation: Conversation = {
    id: generateId(),
    contact_id: prospect.contacts[0].id,
    date: new Date().toISOString(),
    channel: newConversation.channel,
    message: newConversation.message,
    replied: newConversation.replied,
    reply_message: newConversation.replied ? newConversation.reply_message : undefined,
    sentiment,
  };
  
  // Generate AI insights after the conversation object is created
  const aiInsights = newConversation.replied 
    ? generateAIInsights(prospect, tempConversation)
    : undefined;
  
  // Final conversation object with AI insights
  const conversation: Conversation = {
    ...tempConversation,
    ai_insights: aiInsights
  };
  
  await addConversation(prospect.id, conversation);
  setShowAddForm(false);
  setNewConversation({
    channel: 'email',
    message: '',
    replied: false,
    reply_message: ''
  });
  toast.success('Conversation added');
};
  
  return (
    <div className="space-y-4">
      {/* Add Conversation Button */}
      <Button 
        onClick={() => setShowAddForm(!showAddForm)}
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-2" />
        Log New Conversation
      </Button>
      
      {/* Add Conversation Form */}
      {showAddForm && (
        <Card className="border-cyan-200 bg-cyan-50/50">
          <CardContent className="p-4 space-y-3">
            <Select
              value={newConversation.channel}
              onChange={(e) => setNewConversation({ ...newConversation, channel: e.target.value as ConversationChannel })}
            >
              <option value="email">Email</option>
              <option value="linkedin">LinkedIn</option>
              <option value="phone">Phone</option>
              <option value="meeting">Meeting</option>
            </Select>
            
            <Textarea
              placeholder="Your message..."
              value={newConversation.message}
              onChange={(e) => setNewConversation({ ...newConversation, message: e.target.value })}
              rows={3}
            />
            
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="replied"
                checked={newConversation.replied}
                onChange={(e) => setNewConversation({ ...newConversation, replied: e.target.checked })}
                className="rounded border-gray-300 text-cyan-500 focus:ring-cyan-500"
              />
              <label htmlFor="replied" className="text-sm text-gray-700">
                They replied
              </label>
            </div>
            
            {newConversation.replied && (
              <Textarea
                placeholder="Their reply..."
                value={newConversation.reply_message}
                onChange={(e) => setNewConversation({ ...newConversation, reply_message: e.target.value })}
                rows={3}
              />
            )}
            
            <div className="flex gap-2">
              <Button onClick={handleAddConversation} className="flex-1">
                <Send className="h-4 w-4 mr-2" />
                Add Conversation
              </Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Timeline */}
      <div className="space-y-4">
        {prospect.conversations.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No conversations yet</h3>
            <p className="text-sm text-gray-500">Log your first conversation to start tracking engagement</p>
          </div>
        ) : (
          prospect.conversations.slice().reverse().map((conversation, index) => (
            <ConversationCard 
              key={conversation.id} 
              conversation={conversation}
              contact={prospect.contacts.find(c => c.id === conversation.contact_id)}
              isLatest={index === 0}
            />
          ))
        )}
      </div>
    </div>
  );
}

function ConversationCard({ 
  conversation, 
  contact,
  isLatest 
}: { 
  conversation: Conversation; 
  contact?: any;
  isLatest: boolean;
}) {
  return (
    <Card className={cn(
      "relative",
      isLatest && "border-cyan-200 bg-cyan-50/30"
    )}>
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{getChannelIcon(conversation.channel)}</span>
            <div>
              <p className="text-sm font-medium text-gray-900">
                {getChannelLabel(conversation.channel)}
              </p>
              <p className="text-xs text-gray-500">
                {formatRelativeDate(conversation.date)} • {formatDate(conversation.date)}
              </p>
            </div>
          </div>
          
          {conversation.replied ? (
            <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
              <CheckCircle2 className="h-3 w-3" />
              Replied
            </div>
          ) : (
            <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium">
              <Clock className="h-3 w-3" />
              Waiting
            </div>
          )}
        </div>
        
        {/* Contact */}
        {contact && (
          <div className="flex items-center gap-2 mb-3 text-xs text-gray-600">
            <span className="font-medium">To:</span>
            <span>{contact.name}</span>
            <span className="text-gray-400">({contact.role})</span>
          </div>
        )}
        
        {/* Message */}
        <div className="bg-white p-3 rounded border border-gray-200 mb-3">
          <p className="text-sm text-gray-700 whitespace-pre-wrap">{conversation.message}</p>
        </div>
        
        {/* Reply */}
        {conversation.replied && conversation.reply_message && (
          <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-3 rounded border border-cyan-200 mb-3">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-medium text-gray-600">Reply:</span>
              {conversation.sentiment && (
                <div className={cn(
                  "flex items-center gap-1 text-xs",
                  getSentimentColor(conversation.sentiment)
                )}>
                  <span>{getSentimentIcon(conversation.sentiment)}</span>
                  <span className="capitalize">{conversation.sentiment}</span>
                </div>
              )}
            </div>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{conversation.reply_message}</p>
          </div>
        )}
        
        {/* AI Insights */}
        {conversation.ai_insights && (
          <div className="bg-purple-50 p-3 rounded border border-purple-200 flex gap-2">
            <MessageSquare className="h-4 w-4 text-purple-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-medium text-purple-900 mb-1">AI Insights</p>
              <p className="text-xs text-purple-700">{conversation.ai_insights}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}