import React, { useState } from 'react';
import { Prospect } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Sparkles, 
  Send, 
  Copy, 
  CheckCircle2,
  Lightbulb,
  MessageSquare,
  TrendingUp
} from 'lucide-react';
import { generateContextualFollowUp, calculateEngagementScore } from '@/lib/aiEngine';
import { LoadingSpinner } from '@/components/ui/loading';
import toast from 'react-hot-toast';
import { copyToClipboard } from '@/lib/utils';

export function AIAssistant({ prospect }: { prospect: Prospect }) {
  const [generatedFollowUp, setGeneratedFollowUp] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const engagementScore = calculateEngagementScore(prospect);
  
  const handleGenerateFollowUp = async () => {
    setIsGenerating(true);
    try {
      const followUp = await generateContextualFollowUp(prospect);
      setGeneratedFollowUp(followUp);
      toast.success('Follow-up generated!');
    } catch (error) {
      toast.error('Failed to generate follow-up');
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleCopy = async () => {
    const success = await copyToClipboard(generatedFollowUp);
    if (success) {
      setCopied(true);
      toast.success('Copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } else {
      toast.error('Failed to copy');
    }
  };
  
  const lastConversation = prospect.conversations[prospect.conversations.length - 1];
  const daysSinceLastContact = lastConversation 
    ? Math.floor((Date.now() - new Date(lastConversation.date).getTime()) / (1000 * 60 * 60 * 24))
    : 999;
  
  return (
    <div className="space-y-6">
      {/* AI Insights Card */}
      <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-900">
            <Sparkles className="h-5 w-5" />
            AI Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Engagement Score */}
          <div className="bg-white rounded-lg p-4 border border-purple-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Engagement Score</span>
              <span className="text-2xl font-bold text-purple-600">{engagementScore.toFixed(1)}/10</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 transition-all duration-500"
                style={{ width: `${(engagementScore / 10) * 100}%` }}
              />
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-lg p-3 border border-purple-200">
              <div className="flex items-center gap-2 mb-1">
                <MessageSquare className="h-4 w-4 text-purple-600" />
                <span className="text-xs text-gray-600">Conversations</span>
              </div>
              <p className="text-xl font-bold text-gray-900">{prospect.conversations.length}</p>
            </div>
            
            <div className="bg-white rounded-lg p-3 border border-purple-200">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="h-4 w-4 text-purple-600" />
                <span className="text-xs text-gray-600">Days Since Contact</span>
              </div>
              <p className="text-xl font-bold text-gray-900">{daysSinceLastContact}</p>
            </div>
          </div>
          
          {/* Recommendation */}
          <div className="bg-white rounded-lg p-4 border border-purple-200">
            <div className="flex items-start gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Recommendation</h4>
                <p className="text-sm text-gray-700">
                  {getRecommendation(prospect, daysSinceLastContact, engagementScore)}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Follow-up Generator */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            AI Follow-up Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={handleGenerateFollowUp}
            disabled={isGenerating}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Follow-up Message
              </>
            )}
          </Button>
          
          {generatedFollowUp && (
            <div className="space-y-3">
              <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-lg p-4 border border-cyan-200">
                <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
                  {generatedFollowUp}
                </p>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  onClick={handleCopy}
                  variant="outline"
                  className="flex-1"
                >
                  {copied ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy to Clipboard
                    </>
                  )}
                </Button>
                
                <Button 
                  onClick={handleGenerateFollowUp}
                  variant="outline"
                >
                  Regenerate
                </Button>
              </div>
              
              <p className="text-xs text-gray-500 text-center">
                💡 Tip: Personalize this message before sending
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Context Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">What AI Knows About This Prospect</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Company:</span>
            <span className="font-medium text-gray-900">{prospect.company}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Segment:</span>
            <span className="font-medium text-gray-900">{prospect.icp_segment}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Status:</span>
            <span className="font-medium text-gray-900">{prospect.status.replace('_', ' ')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Primary Contact:</span>
            <span className="font-medium text-gray-900">{prospect.contacts[0].name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Last Sentiment:</span>
            <span className="font-medium text-gray-900">
              {lastConversation?.sentiment || 'Unknown'}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function getRecommendation(prospect: Prospect, daysSinceContact: number, engagementScore: number): string {
  if (prospect.status === 'closed_won') {
    return "Deal is closed! Focus on successful implementation and identify expansion opportunities.";
  }
  
  if (prospect.status === 'negotiating') {
    return "Close to closing! Stay responsive and work with legal to finalize contract terms quickly.";
  }
  
  if (prospect.status === 'proposal_sent' && daysSinceContact > 5) {
    return "Follow up on the proposal. Offer to present to the wider team or address any questions.";
  }
  
  if (daysSinceContact > 14) {
    return "It's been a while since last contact. Send a gentle re-engagement message with new value (case study, industry news, etc.)";
  }
  
  if (engagementScore >= 8) {
    return "High engagement! This is a hot lead. Move quickly to schedule a demo or send a proposal.";
  }
  
  if (engagementScore >= 6) {
    return "Good engagement. Share a relevant case study and propose a discovery call to understand their needs better.";
  }
  
  if (!prospect.conversations.length) {
    return "No contact yet. Start with initial outreach focusing on their specific pain point: " + prospect.pain_points[0];
  }
  
  if (prospect.conversations.every(c => !c.replied)) {
    return "No replies yet. Try a different channel (e.g., LinkedIn if you've been emailing) or reference recent company news.";
  }
  
  return "Continue nurturing this relationship with valuable content and regular touchpoints.";
}