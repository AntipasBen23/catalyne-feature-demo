'use client';

import { useEffect, useState } from 'react';
import { Layout } from '@/components/Layout';
import { MainContent } from '@/components/MainContent';
import { LoadingOverlay } from '@/components/ui/loading';
import { db, initializeDatabase } from '@/lib/db';
import { mockProspects } from '@/data/mockProspects';
import { useProspectStore } from '@/store/useProspectStore';
import toast from 'react-hot-toast';

export default function Home() {
  const [isInitializing, setIsInitializing] = useState(true);
  const [initError, setInitError] = useState<string | null>(null);
  const { loadProspects } = useProspectStore();

  useEffect(() => {
    async function initialize() {
      try {
        // Check if browser supports IndexedDB
        if (!('indexedDB' in window)) {
          throw new Error('Browser does not support IndexedDB. Please use a modern browser.');
        }

        // Initialize database with mock data
        const success = await initializeDatabase(mockProspects);
        
        if (!success) {
          throw new Error('Failed to initialize database');
        }

        // Load prospects into store
        await loadProspects();

        // Success!
        setIsInitializing(false);
        toast.success('Welcome to Catalyne CoPilot! 🚀', {
          duration: 3000,
          icon: '✨',
        });

      } catch (error: any) {
        console.error('Initialization error:', error);
        setInitError(error.message || 'Failed to initialize application');
        setIsInitializing(false);
        toast.error('Failed to load application');
      }
    }

    initialize();
  }, [loadProspects]);

  // Show loading screen during initialization
  if (isInitializing) {
    return <LoadingOverlay message="Initializing Catalyne CoPilot..." />;
  }

  // Show error screen if initialization failed
  if (initError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Initialization Failed</h2>
          <p className="text-gray-600 mb-4">{initError}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  // Main application
  return (
    <Layout>
      <MainContent />
    </Layout>
  );
}