import FunnelWizard from '@/components/funnel-wizard/FunnelWizard';

export default function FunnelCreatorPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create Your Funnel</h1>
      <FunnelWizard />
    </div>
  );
}