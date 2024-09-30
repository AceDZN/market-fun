import { FunnelData } from '@/lib/types/funnel';

// This is a mock implementation. Replace with actual database calls in production.
export async function getFunnels(): Promise<FunnelData[]> {
  // Fetch funnels from your database
  return [
    {
      id: '1',
      name: 'Sample Funnel',
      description: 'This is a sample funnel',
      pages: [],
      flow: [],
      marketingDetails: {
        targetAudience: 'Sample audience',
        productDescription: 'Sample product',
        goals: ['Awareness'],
      },
    },
  ];
}

export async function getFunnelById(id: string): Promise<FunnelData | null> {
  const funnels = await getFunnels();
  return funnels.find(funnel => funnel.id === id) || null;
}