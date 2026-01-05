import { create } from 'zustand';
import { Prospect, ProspectStatus, Conversation, NextAction, ICPSegment } from '@/types';
import { db } from '@/lib/db';

interface ProspectStore {
  // State
  prospects: Prospect[];
  selectedProspect: Prospect | null;
  isLoading: boolean;
  searchQuery: string;
  filterStatus: ProspectStatus | 'all';
  filterSegment: ICPSegment | 'all';
  
  // Actions
  loadProspects: () => Promise<void>;
  setSelectedProspect: (prospect: Prospect | null) => void;
  updateProspectStatus: (id: string, status: ProspectStatus) => Promise<void>;
  addConversation: (prospectId: string, conversation: Conversation) => Promise<void>;
  updateConversation: (prospectId: string, conversationId: string, updates: Partial<Conversation>) => Promise<void>;
  addNextAction: (prospectId: string, action: NextAction) => Promise<void>;
  completeNextAction: (prospectId: string, actionId: string) => Promise<void>;
  updateNextAction: (prospectId: string, actionId: string, updates: Partial<NextAction>) => Promise<void>;
  setSearchQuery: (query: string) => void;
  setFilterStatus: (status: ProspectStatus | 'all') => void;
  setFilterSegment: (segment: ICPSegment | 'all') => void;
  deleteProspect: (id: string) => Promise<void>;
  
  // Computed
  getFilteredProspects: () => Prospect[];
  getProspectsByStatus: (status: ProspectStatus) => Prospect[];
}

export const useProspectStore = create<ProspectStore>((set, get) => ({
  // Initial state
  prospects: [],
  selectedProspect: null,
  isLoading: false,
  searchQuery: '',
  filterStatus: 'all',
  filterSegment: 'all',
  
  // Load all prospects from IndexedDB
  loadProspects: async () => {
    set({ isLoading: true });
    try {
      const prospects = await db.getAllProspects();
      set({ prospects, isLoading: false });
    } catch (error) {
      console.error('Failed to load prospects:', error);
      set({ isLoading: false });
    }
  },
  
  // Set selected prospect
  setSelectedProspect: (prospect) => {
    set({ selectedProspect: prospect });
  },
  
  // Update prospect status
  updateProspectStatus: async (id, status) => {
    set({ isLoading: true });
    try {
      await db.updateProspect(id, { status });
      const prospects = await db.getAllProspects();
      set({ prospects, isLoading: false });
      
      // Update selected prospect if it's the one being modified
      const { selectedProspect } = get();
      if (selectedProspect?.id === id) {
        const updated = prospects.find(p => p.id === id);
        set({ selectedProspect: updated || null });
      }
    } catch (error) {
      console.error('Failed to update prospect status:', error);
      set({ isLoading: false });
    }
  },
  
  // Add conversation to prospect
  addConversation: async (prospectId, conversation) => {
    try {
      await db.addConversation(prospectId, conversation);
      const prospects = await db.getAllProspects();
      set({ prospects });
      
      // Update selected prospect if it's the one being modified
      const { selectedProspect } = get();
      if (selectedProspect?.id === prospectId) {
        const updated = prospects.find(p => p.id === prospectId);
        set({ selectedProspect: updated || null });
      }
    } catch (error) {
      console.error('Failed to add conversation:', error);
    }
  },
  
  // Update conversation
  updateConversation: async (prospectId, conversationId, updates) => {
    try {
      await db.updateConversation(prospectId, conversationId, updates);
      const prospects = await db.getAllProspects();
      set({ prospects });
      
      // Update selected prospect if it's the one being modified
      const { selectedProspect } = get();
      if (selectedProspect?.id === prospectId) {
        const updated = prospects.find(p => p.id === prospectId);
        set({ selectedProspect: updated || null });
      }
    } catch (error) {
      console.error('Failed to update conversation:', error);
    }
  },
  
  // Add next action
  addNextAction: async (prospectId, action) => {
    try {
      await db.addNextAction(prospectId, action);
      const prospects = await db.getAllProspects();
      set({ prospects });
      
      // Update selected prospect if it's the one being modified
      const { selectedProspect } = get();
      if (selectedProspect?.id === prospectId) {
        const updated = prospects.find(p => p.id === prospectId);
        set({ selectedProspect: updated || null });
      }
    } catch (error) {
      console.error('Failed to add next action:', error);
    }
  },
  
  // Complete next action
  completeNextAction: async (prospectId, actionId) => {
    try {
      await db.completeNextAction(prospectId, actionId);
      const prospects = await db.getAllProspects();
      set({ prospects });
      
      // Update selected prospect if it's the one being modified
      const { selectedProspect } = get();
      if (selectedProspect?.id === prospectId) {
        const updated = prospects.find(p => p.id === prospectId);
        set({ selectedProspect: updated || null });
      }
    } catch (error) {
      console.error('Failed to complete action:', error);
    }
  },
  
  // Update next action
  updateNextAction: async (prospectId, actionId, updates) => {
    try {
      await db.updateNextAction(prospectId, actionId, updates);
      const prospects = await db.getAllProspects();
      set({ prospects });
      
      // Update selected prospect if it's the one being modified
      const { selectedProspect } = get();
      if (selectedProspect?.id === prospectId) {
        const updated = prospects.find(p => p.id === prospectId);
        set({ selectedProspect: updated || null });
      }
    } catch (error) {
      console.error('Failed to update action:', error);
    }
  },
  
  // Search and filter
  setSearchQuery: (query) => {
    set({ searchQuery: query });
  },
  
  setFilterStatus: (status) => {
    set({ filterStatus: status });
  },
  
  setFilterSegment: (segment) => {
    set({ filterSegment: segment });
  },
  
  // Delete prospect
  deleteProspect: async (id) => {
    try {
      await db.deleteProspect(id);
      const prospects = await db.getAllProspects();
      set({ prospects });
      
      // Clear selected prospect if it was deleted
      const { selectedProspect } = get();
      if (selectedProspect?.id === id) {
        set({ selectedProspect: null });
      }
    } catch (error) {
      console.error('Failed to delete prospect:', error);
    }
  },
  
  // Get filtered prospects based on search and filters
  getFilteredProspects: () => {
    const { prospects, searchQuery, filterStatus, filterSegment } = get();
    
    let filtered = [...prospects];
    
    // Apply status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(p => p.status === filterStatus);
    }
    
    // Apply segment filter
    if (filterSegment !== 'all') {
      filtered = filtered.filter(p => p.icp_segment === filterSegment);
    }
    
    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.company.toLowerCase().includes(query) ||
        p.contacts.some(c => 
          c.name.toLowerCase().includes(query) ||
          c.email.toLowerCase().includes(query)
        ) ||
        p.pain_points.some(point => point.toLowerCase().includes(query))
      );
    }
    
    // Sort by updated_at (most recent first)
    return filtered.sort((a, b) => 
      new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    );
  },
  
  // Get prospects by specific status
  getProspectsByStatus: (status) => {
    const { prospects } = get();
    return prospects.filter(p => p.status === status);
  },
}));