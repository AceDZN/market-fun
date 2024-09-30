import { FunnelData } from '@/lib/types/funnel';

const mockTemplates = [
  {
    id: '1',
    name: 'E-commerce Product Launch',
    description: 'Perfect for introducing new products to the market',
    thumbnailUrl: '/templates/ecommerce-product-launch.jpg',
  },
  {
    id: '2',
    name: 'Lead Generation Webinar',
    description: 'Ideal for capturing leads through educational content',
    thumbnailUrl: '/templates/lead-generation-webinar.jpg',
  },
  {
    id: '3',
    name: 'SaaS Free Trial',
    description: 'Designed to convert visitors into free trial users',
    thumbnailUrl: '/templates/saas-free-trial.jpg',
  },
];

export async function selectBestTemplates(funnelData: FunnelData) {
  // In a real implementation, this function would use AI to select the best templates
  // based on the funnelData. For now, we'll return all mock templates.
  return mockTemplates;
}