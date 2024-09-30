import { getFunnels } from '@/lib/api/funnels';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function FunnelsPage() {
  const funnels = await getFunnels();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Funnels</h1>
      <div className="grid gap-4">
        {funnels.map((funnel) => (
          <div key={funnel.id} className="border p-4 rounded-lg">
            <h2 className="text-xl font-semibold">{funnel.name}</h2>
            <p className="text-gray-600">{funnel.description}</p>
            <div className="mt-2">
              <Link href={`/funnel-editor/${funnel.id}`}>
                <Button variant="outline">Edit</Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <Link href="/funnel-creator">
          <Button>Create New Funnel</Button>
        </Link>
      </div>
    </div>
  );
}