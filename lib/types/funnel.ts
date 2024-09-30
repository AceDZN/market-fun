export interface FunnelPage {
  id: string;
  type: 'landing' | 'login' | 'questionnaire' | 'content' | 'checkout' | 'thankyou';
  content: {
    title?: string;
    description?: string;
    imageUrl?: string;
    questions?: Array<{ question: string; options: string[] }>;
  };
}

export interface FunnelData {
  id: string;
  name: string;
  description: string;
  pages: FunnelPage[];
  flow: string[];
  marketingDetails: {
    targetAudience: string;
    productDescription: string;
    goals: string[];
  };
}