import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { ProspectStatus, ConversationSentiment, ICPSegment } from "@/types";

// Tailwind class merger (for shadcn/ui compatibility)
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format currency
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Format date relative to now
export function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// Format date to readable string
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  });
}

// Format date to short form
export function formatShortDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  });
}

// Check if date is overdue
export function isOverdue(dateString: string): boolean {
  const date = new Date(dateString);
  const now = new Date();
  return date < now;
}

// Check if date is due soon (within 3 days)
export function isDueSoon(dateString: string): boolean {
  const date = new Date(dateString);
  const now = new Date();
  const threeDaysFromNow = new Date();
  threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
  
  return date >= now && date <= threeDaysFromNow;
}

// Get status color (for badges)
export function getStatusColor(status: ProspectStatus): string {
  const colors: Record<ProspectStatus, string> = {
    not_contacted: 'bg-gray-100 text-gray-700 border-gray-300',
    contacted: 'bg-blue-100 text-blue-700 border-blue-300',
    replied: 'bg-cyan-100 text-cyan-700 border-cyan-300',
    meeting_scheduled: 'bg-purple-100 text-purple-700 border-purple-300',
    proposal_sent: 'bg-orange-100 text-orange-700 border-orange-300',
    negotiating: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    closed_won: 'bg-green-100 text-green-700 border-green-300',
    closed_lost: 'bg-red-100 text-red-700 border-red-300',
  };
  
  return colors[status] || 'bg-gray-100 text-gray-700 border-gray-300';
}

// Get status label (human-readable)
export function getStatusLabel(status: ProspectStatus): string {
  const labels: Record<ProspectStatus, string> = {
    not_contacted: 'Not Contacted',
    contacted: 'Contacted',
    replied: 'Replied',
    meeting_scheduled: 'Meeting Scheduled',
    proposal_sent: 'Proposal Sent',
    negotiating: 'Negotiating',
    closed_won: 'Closed Won',
    closed_lost: 'Closed Lost',
  };
  
  return labels[status] || status;
}

// Get sentiment color
export function getSentimentColor(sentiment: ConversationSentiment): string {
  if (!sentiment) return 'text-gray-400';
  
  const colors: Record<string, string> = {
    positive: 'text-green-600',
    neutral: 'text-gray-600',
    negative: 'text-red-600',
  };
  
  return colors[sentiment] || 'text-gray-400';
}

// Get sentiment icon
export function getSentimentIcon(sentiment: ConversationSentiment): string {
  if (!sentiment) return '○';
  
  const icons: Record<string, string> = {
    positive: '😊',
    neutral: '😐',
    negative: '😟',
  };
  
  return icons[sentiment] || '○';
}

// Get ICP segment color
export function getSegmentColor(segment: ICPSegment): string {
  const colors: Record<ICPSegment, string> = {
    'Energy': 'bg-yellow-100 text-yellow-700 border-yellow-300',
    'Water': 'bg-blue-100 text-blue-700 border-blue-300',
    'Proptech': 'bg-purple-100 text-purple-700 border-purple-300',
    'Material Sciences': 'bg-pink-100 text-pink-700 border-pink-300',
    'Waste Valorization': 'bg-green-100 text-green-700 border-green-300',
    'Logistics & Supply Chain': 'bg-orange-100 text-orange-700 border-orange-300',
    'Health & Hygiene': 'bg-red-100 text-red-700 border-red-300',
  };
  
  return colors[segment] || 'bg-gray-100 text-gray-700 border-gray-300';
}

// Calculate days between dates
export function daysBetween(dateString1: string, dateString2: string): number {
  const date1 = new Date(dateString1);
  const date2 = new Date(dateString2);
  const diffTime = Math.abs(date2.getTime() - date1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// Generate unique ID
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Truncate text
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

// Get initials from name
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
}

// Calculate score color (0-10 scale)
export function getScoreColor(score: number): string {
  if (score >= 8) return 'text-green-600';
  if (score >= 6) return 'text-yellow-600';
  if (score >= 4) return 'text-orange-600';
  return 'text-red-600';
}

// Calculate score badge color
export function getScoreBadgeColor(score: number): string {
  if (score >= 8) return 'bg-green-100 text-green-700 border-green-300';
  if (score >= 6) return 'bg-yellow-100 text-yellow-700 border-yellow-300';
  if (score >= 4) return 'bg-orange-100 text-orange-700 border-orange-300';
  return 'bg-red-100 text-red-700 border-red-300';
}

// Sort prospects by various criteria
export function sortProspects<T extends { overall_score: number; updated_at: string; company: string }>(
  prospects: T[],
  sortBy: 'score' | 'recent' | 'alphabetical'
): T[] {
  const sorted = [...prospects];
  
  switch (sortBy) {
    case 'score':
      return sorted.sort((a, b) => b.overall_score - a.overall_score);
    case 'recent':
      return sorted.sort((a, b) => 
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      );
    case 'alphabetical':
      return sorted.sort((a, b) => a.company.localeCompare(b.company));
    default:
      return sorted;
  }
}

// Delay utility (for simulating async operations)
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Generate fake loading delay (300-800ms)
export function simulateLoading(): Promise<void> {
  const ms = Math.random() * 500 + 300;
  return delay(ms);
}

// Parse email from string
export function extractEmail(text: string): string | null {
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  const match = text.match(emailRegex);
  return match ? match[0] : null;
}

// Validate email
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

// Get channel icon
export function getChannelIcon(channel: string): string {
  const icons: Record<string, string> = {
    linkedin: '💼',
    email: '📧',
    phone: '📞',
    meeting: '🤝',
  };
  
  return icons[channel] || '💬';
}

// Get channel label
export function getChannelLabel(channel: string): string {
  const labels: Record<string, string> = {
    linkedin: 'LinkedIn',
    email: 'Email',
    phone: 'Phone',
    meeting: 'Meeting',
  };
  
  return labels[channel] || channel;
}

// Format percentage
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

// Calculate conversion rate
export function calculateConversionRate(converted: number, total: number): number {
  if (total === 0) return 0;
  return (converted / total) * 100;
}

// Group items by date
export function groupByDate<T extends { date: string }>(items: T[]): Record<string, T[]> {
  return items.reduce((acc, item) => {
    const date = formatDate(item.date);
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(item);
    return acc;
  }, {} as Record<string, T[]>);
}

// Debounce function
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Check if browser supports IndexedDB
export function supportsIndexedDB(): boolean {
  try {
    return 'indexedDB' in window;
  } catch {
    return false;
  }
}

// Copy to clipboard
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}