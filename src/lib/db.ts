import Dexie, { Table } from 'dexie';
import { Prospect, Contact, Conversation, NextAction } from '@/types';

export class CatalyneDB extends Dexie {
  prospects!: Table<Prospect>;
  
  constructor() {
    super('CatalyneDB');
    
    this.version(1).stores({
      prospects: 'id, company, icp_segment, status, overall_score, created_at, updated_at',
    });
  }
  
  // Initialize database with mock data if empty
  async initializeWithMockData(mockProspects: Prospect[]) {
    const count = await this.prospects.count();
    if (count === 0) {
      await this.prospects.bulkAdd(mockProspects);
      console.log('✅ Database initialized with', mockProspects.length, 'prospects');
    }
  }
  
  // Prospect CRUD operations
  async getAllProspects(): Promise<Prospect[]> {
    return await this.prospects.toArray();
  }
  
  async getProspectById(id: string): Promise<Prospect | undefined> {
    return await this.prospects.get(id);
  }
  
  async getProspectsByStatus(status: string): Promise<Prospect[]> {
    return await this.prospects.where('status').equals(status).toArray();
  }
  
  async getProspectsBySegment(segment: string): Promise<Prospect[]> {
    return await this.prospects.where('icp_segment').equals(segment).toArray();
  }
  
  async updateProspect(id: string, updates: Partial<Prospect>): Promise<void> {
    await this.prospects.update(id, {
      ...updates,
      updated_at: new Date().toISOString()
    });
  }
  
  async addProspect(prospect: Prospect): Promise<void> {
    await this.prospects.add(prospect);
  }
  
  async deleteProspect(id: string): Promise<void> {
    await this.prospects.delete(id);
  }
  
  // Conversation operations
  async addConversation(prospectId: string, conversation: Conversation): Promise<void> {
    const prospect = await this.getProspectById(prospectId);
    if (prospect) {
      const updatedConversations = [...prospect.conversations, conversation];
      await this.updateProspect(prospectId, {
        conversations: updatedConversations
      });
    }
  }
  
  async updateConversation(
    prospectId: string, 
    conversationId: string, 
    updates: Partial<Conversation>
  ): Promise<void> {
    const prospect = await this.getProspectById(prospectId);
    if (prospect) {
      const updatedConversations = prospect.conversations.map(conv =>
        conv.id === conversationId ? { ...conv, ...updates } : conv
      );
      await this.updateProspect(prospectId, {
        conversations: updatedConversations
      });
    }
  }
  
  // Next Action operations
  async addNextAction(prospectId: string, action: NextAction): Promise<void> {
    const prospect = await this.getProspectById(prospectId);
    if (prospect) {
      const updatedActions = [...prospect.next_actions, action];
      await this.updateProspect(prospectId, {
        next_actions: updatedActions
      });
    }
  }
  
  async updateNextAction(
    prospectId: string,
    actionId: string,
    updates: Partial<NextAction>
  ): Promise<void> {
    const prospect = await this.getProspectById(prospectId);
    if (prospect) {
      const updatedActions = prospect.next_actions.map(action =>
        action.id === actionId ? { ...action, ...updates } : action
      );
      await this.updateProspect(prospectId, {
        next_actions: updatedActions
      });
    }
  }
  
  async completeNextAction(prospectId: string, actionId: string): Promise<void> {
    await this.updateNextAction(prospectId, actionId, { completed: true });
  }
  
  // Search and filter operations
  async searchProspects(query: string): Promise<Prospect[]> {
    const allProspects = await this.getAllProspects();
    const lowerQuery = query.toLowerCase();
    
    return allProspects.filter(prospect =>
      prospect.company.toLowerCase().includes(lowerQuery) ||
      prospect.contacts.some(contact => 
        contact.name.toLowerCase().includes(lowerQuery) ||
        contact.email.toLowerCase().includes(lowerQuery)
      ) ||
      prospect.pain_points.some(point => 
        point.toLowerCase().includes(lowerQuery)
      )
    );
  }
  
  async getOverdueActions(): Promise<Array<{ prospect: Prospect; action: NextAction }>> {
    const allProspects = await this.getAllProspects();
    const now = new Date();
    const overdueItems: Array<{ prospect: Prospect; action: NextAction }> = [];
    
    allProspects.forEach(prospect => {
      prospect.next_actions.forEach(action => {
        if (!action.completed && new Date(action.due_date) < now) {
          overdueItems.push({ prospect, action });
        }
      });
    });
    
    return overdueItems;
  }
  
  async getUpcomingActions(days: number = 7): Promise<Array<{ prospect: Prospect; action: NextAction }>> {
    const allProspects = await this.getAllProspects();
    const now = new Date();
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);
    const upcomingItems: Array<{ prospect: Prospect; action: NextAction }> = [];
    
    allProspects.forEach(prospect => {
      prospect.next_actions.forEach(action => {
        const actionDate = new Date(action.due_date);
        if (!action.completed && actionDate >= now && actionDate <= futureDate) {
          upcomingItems.push({ prospect, action });
        }
      });
    });
    
    return upcomingItems.sort((a, b) => 
      new Date(a.action.due_date).getTime() - new Date(b.action.due_date).getTime()
    );
  }
  
  // Pipeline statistics
  async getPipelineStats() {
    const allProspects = await this.getAllProspects();
    
    const contacted = allProspects.filter(p => p.status !== 'not_contacted').length;
    const replied = allProspects.filter(p => 
      ['replied', 'meeting_scheduled', 'proposal_sent', 'negotiating', 'closed_won'].includes(p.status)
    ).length;
    const meetings = allProspects.filter(p => 
      ['meeting_scheduled', 'proposal_sent', 'negotiating', 'closed_won'].includes(p.status)
    ).length;
    const proposals = allProspects.filter(p => 
      ['proposal_sent', 'negotiating', 'closed_won'].includes(p.status)
    ).length;
    const closed = allProspects.filter(p => p.status === 'closed_won').length;
    const totalValue = allProspects
      .filter(p => p.status === 'closed_won')
      .reduce((sum, p) => sum + (p.deal_value || 0), 0);
    
    return {
      total_prospects: allProspects.length,
      contacted,
      replied,
      meetings_scheduled: meetings,
      proposals_sent: proposals,
      deals_closed: closed,
      total_deal_value: totalValue,
      conversion_rate: contacted > 0 ? (closed / contacted) * 100 : 0,
      average_deal_value: closed > 0 ? totalValue / closed : 0
    };
  }
  
  // Bulk operations
  async resetDatabase(): Promise<void> {
    await this.prospects.clear();
    console.log('🗑️ Database cleared');
  }
  
  async exportData(): Promise<string> {
    const allProspects = await this.getAllProspects();
    return JSON.stringify(allProspects, null, 2);
  }
  
  async importData(jsonData: string): Promise<void> {
    try {
      const prospects: Prospect[] = JSON.parse(jsonData);
      await this.prospects.bulkPut(prospects);
      console.log('✅ Data imported successfully');
    } catch (error) {
      console.error('❌ Import failed:', error);
      throw new Error('Failed to import data. Invalid JSON format.');
    }
  }
}

// Create singleton instance
export const db = new CatalyneDB();

// Helper to ensure DB is ready
export async function initializeDatabase(mockProspects: Prospect[]) {
  try {
    await db.open();
    await db.initializeWithMockData(mockProspects);
    return true;
  } catch (error) {
    console.error('Failed to initialize database:', error);
    return false;
  }
}