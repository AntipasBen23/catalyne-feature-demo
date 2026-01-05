import React from 'react';
import { Prospect } from '@/types';
import { ProspectCard } from './ProspectCard';
import { useProspectStore } from '@/store/useProspectStore';
import { Search, Filter, SortAsc } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

export function ProspectList() {
  const { 
    getFilteredProspects, 
    selectedProspect, 
    setSelectedProspect,
    searchQuery,
    setSearchQuery,
    filterStatus,
    setFilterStatus,
    filterSegment,
    setFilterSegment
  } = useProspectStore();
  
  const filteredProspects = getFilteredProspects();
  
  return (
    <div className="flex flex-col h-full">
      {/* Search and Filters */}
      <div className="p-4 border-b border-gray-200 bg-white space-y-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search prospects, contacts, pain points..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        {/* Filters */}
        <div className="flex gap-2">
          <Select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="flex-1"
          >
            <option value="all">All Statuses</option>
            <option value="not_contacted">Not Contacted</option>
            <option value="contacted">Contacted</option>
            <option value="replied">Replied</option>
            <option value="meeting_scheduled">Meeting Scheduled</option>
            <option value="proposal_sent">Proposal Sent</option>
            <option value="negotiating">Negotiating</option>
            <option value="closed_won">Closed Won</option>
            <option value="closed_lost">Closed Lost</option>
          </Select>
          
          <Select 
            value={filterSegment} 
            onChange={(e) => setFilterSegment(e.target.value as any)}
            className="flex-1"
          >
            <option value="all">All Segments</option>
            <option value="Energy">Energy</option>
            <option value="Water">Water</option>
            <option value="Proptech">Proptech</option>
            <option value="Material Sciences">Material Sciences</option>
            <option value="Waste Valorization">Waste Valorization</option>
            <option value="Logistics & Supply Chain">Logistics & Supply Chain</option>
            <option value="Health & Hygiene">Health & Hygiene</option>
          </Select>
        </div>
        
        {/* Results Count */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>{filteredProspects.length} prospect{filteredProspects.length !== 1 ? 's' : ''}</span>
          {(searchQuery || filterStatus !== 'all' || filterSegment !== 'all') && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchQuery('');
                setFilterStatus('all');
                setFilterSegment('all');
              }}
              className="text-cyan-600 hover:text-cyan-700"
            >
              Clear filters
            </Button>
          )}
        </div>
      </div>
      
      {/* Prospect Cards */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredProspects.length === 0 ? (
          <div className="text-center py-12">
            <Filter className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No prospects found</h3>
            <p className="text-sm text-gray-500">Try adjusting your filters or search query</p>
          </div>
        ) : (
          filteredProspects.map((prospect) => (
            <ProspectCard
              key={prospect.id}
              prospect={prospect}
              onClick={() => setSelectedProspect(prospect)}
              isSelected={selectedProspect?.id === prospect.id}
            />
          ))
        )}
      </div>
    </div>
  );
}