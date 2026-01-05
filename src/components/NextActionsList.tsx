import React, { useState } from 'react';
import { Prospect, NextAction, NextActionType } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { 
  CheckCircle2,
  Circle,
  Plus,
  Calendar,
  AlertCircle,
  Sparkles,
  Clock,
  Send,
  FileText,
  Video,
  DollarSign,
  Target
} from 'lucide-react';
import {
  formatDate,
  formatShortDate,
  isOverdue,
  isDueSoon,
  generateId,
  cn
} from '@/lib/utils';
import { useProspectStore } from '@/store/useProspectStore';
import { suggestNextAction } from '@/lib/aiEngine';
import toast from 'react-hot-toast';

const ACTION_ICONS: Record<NextActionType, any> = {
  follow_up: Send,
  send_case_study: FileText,
  schedule_demo: Video,
  send_proposal: FileText,
  negotiate_terms: DollarSign,
  close_deal: Target,
};

export function NextActionsList({ prospect }: { prospect: Prospect }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAction, setNewAction] = useState({
    type: 'follow_up' as NextActionType,
    due_date: new Date().toISOString().split('T')[0],
    notes: ''
  });
  const { addNextAction, completeNextAction, updateNextAction } = useProspectStore();
  
  const handleAddAction = async () => {
    if (!newAction.notes.trim()) {
      toast.error('Please enter action notes');
      return;
    }
    
    const action: NextAction = {
      id: generateId(),
      type: newAction.type,
      due_date: new Date(newAction.due_date).toISOString(),
      completed: false,
      notes: newAction.notes,
      ai_suggested: false
    };
    
    await addNextAction(prospect.id, action);
    setShowAddForm(false);
    setNewAction({
      type: 'follow_up',
      due_date: new Date().toISOString().split('T')[0],
      notes: ''
    });
    toast.success('Action added');
  };
  
  const handleAISuggest = async () => {
    const suggestedAction = suggestNextAction(prospect);
    await addNextAction(prospect.id, suggestedAction);
    toast.success('AI suggested action added', {
      icon: '✨',
    });
  };
  
  const handleComplete = async (actionId: string) => {
    await completeNextAction(prospect.id, actionId);
    toast.success('Action completed');
  };
  
  const pendingActions = prospect.next_actions.filter(a => !a.completed);
  const completedActions = prospect.next_actions.filter(a => a.completed);
  
  return (
    <div className="space-y-4">
      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex-1"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Action
        </Button>
        <Button 
          onClick={handleAISuggest}
          variant="outline"
          className="flex-1 border-purple-300 text-purple-600 hover:bg-purple-50"
        >
          <Sparkles className="h-4 w-4 mr-2" />
          AI Suggest
        </Button>
      </div>
      
      {/* Add Action Form */}
      {showAddForm && (
        <Card className="border-cyan-200 bg-cyan-50/50">
          <CardContent className="p-4 space-y-3">
            <Select
              value={newAction.type}
              onChange={(e) => setNewAction({ ...newAction, type: e.target.value as NextActionType })}
            >
              <option value="follow_up">Follow Up</option>
              <option value="send_case_study">Send Case Study</option>
              <option value="schedule_demo">Schedule Demo</option>
              <option value="send_proposal">Send Proposal</option>
              <option value="negotiate_terms">Negotiate Terms</option>
              <option value="close_deal">Close Deal</option>
            </Select>
            
            <Input
              type="date"
              value={newAction.due_date}
              onChange={(e) => setNewAction({ ...newAction, due_date: e.target.value })}
            />
            
            <Textarea
              placeholder="Action notes and details..."
              value={newAction.notes}
              onChange={(e) => setNewAction({ ...newAction, notes: e.target.value })}
              rows={3}
            />
            
            <div className="flex gap-2">
              <Button onClick={handleAddAction} className="flex-1">
                Add Action
              </Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Pending Actions */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <Circle className="h-4 w-4" />
          Pending Actions ({pendingActions.length})
        </h3>
        
        {pendingActions.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <CheckCircle2 className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500">No pending actions</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {pendingActions
              .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())
              .map((action) => (
                <ActionCard
                  key={action.id}
                  action={action}
                  onComplete={() => handleComplete(action.id)}
                />
              ))}
          </div>
        )}
      </div>
      
      {/* Completed Actions */}
      {completedActions.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            Completed ({completedActions.length})
          </h3>
          
          <div className="space-y-3 opacity-60">
            {completedActions.slice(-5).reverse().map((action) => (
              <ActionCard
                key={action.id}
                action={action}
                onComplete={() => {}}
                completed
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ActionCard({ 
  action, 
  onComplete, 
  completed = false 
}: { 
  action: NextAction; 
  onComplete: () => void;
  completed?: boolean;
}) {
  const Icon = ACTION_ICONS[action.type];
  const overdue = !completed && isOverdue(action.due_date);
  const dueSoon = !completed && !overdue && isDueSoon(action.due_date);
  
  return (
    <Card className={cn(
      "transition-all",
      completed && "bg-gray-50",
      overdue && "border-red-300 bg-red-50/30",
      dueSoon && "border-yellow-300 bg-yellow-50/30"
    )}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {/* Checkbox */}
          <button
            onClick={onComplete}
            disabled={completed}
            className={cn(
              "flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition-colors mt-0.5",
              completed 
                ? "bg-green-500 border-green-500" 
                : "border-gray-300 hover:border-cyan-500"
            )}
          >
            {completed && <CheckCircle2 className="h-4 w-4 text-white" />}
          </button>
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <Icon className="h-4 w-4 text-gray-600" />
                <h4 className={cn(
                  "font-semibold text-sm",
                  completed ? "text-gray-500 line-through" : "text-gray-900"
                )}>
                  {action.type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                </h4>
              </div>
              
              {action.ai_suggested && !completed && (
                <div className="flex items-center gap-1 px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs font-medium">
                  <Sparkles className="h-3 w-3" />
                  AI
                </div>
              )}
            </div>
            
            <p className={cn(
              "text-sm mb-2",
              completed ? "text-gray-400" : "text-gray-700"
            )}>
              {action.notes}
            </p>
            
            <div className="flex items-center gap-2">
              <div className={cn(
                "flex items-center gap-1 px-2 py-1 rounded text-xs font-medium",
                overdue && "bg-red-100 text-red-700",
                dueSoon && "bg-yellow-100 text-yellow-700",
                !overdue && !dueSoon && "bg-gray-100 text-gray-600"
              )}>
                {overdue ? (
                  <AlertCircle className="h-3 w-3" />
                ) : (
                  <Calendar className="h-3 w-3" />
                )}
                <span>
                  {overdue && "Overdue: "}
                  {dueSoon && "Due soon: "}
                  {formatShortDate(action.due_date)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}