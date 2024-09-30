import { FunnelPage } from '@/lib/types/funnel';

interface PagePreviewProps {
  page: FunnelPage;
}

export function PagePreview({ page }: PagePreviewProps) {
  return (
    <div className="border p-4 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">{page.content.title}</h2>
      <p className="mb-4">{page.content.description}</p>
      <button className="bg-blue-500 text-white px-4 py-2 rounded">
        {page.content.cta}
      </button>
    </div>
  );
}