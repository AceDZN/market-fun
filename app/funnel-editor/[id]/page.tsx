import { getFunnelById } from '@/lib/api/funnels';
import FunnelWizard from '@/components/funnel-wizard/FunnelWizard';

export default async function FunnelEditorPage({ params }: { params: { id: string } }) {
  const funnel = await getFunnelById(params.id);

  if (!funnel) {
    return <div>Funnel not found</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Funnel: {funnel.name}</h1>
      <FunnelWizard initialData={funnel} />
    </div>
  );
}