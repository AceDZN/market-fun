'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FunnelData } from '@/lib/types/funnel';
import { Button } from "@/components/ui/button";

interface Template {
  id: string;
  name: string;
  description: string;
  thumbnailUrl: string;
}

interface TemplateSelectionProps {
  funnelData: FunnelData;
  onTemplateSelect: (templateId: string) => void;
}

export function TemplateSelection({ funnelData, onTemplateSelect }: TemplateSelectionProps) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTemplates() {
      try {
        const response = await fetch('/api/select-template', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(funnelData),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch templates');
        }

        const data = await response.json();
        setTemplates(data.templates);
      } catch (err) {
        setError('An error occurred while fetching templates');
      } finally {
        setLoading(false);
      }
    }

    fetchTemplates();
  }, [funnelData]);

  if (loading) return <div>Loading AI-suggested templates...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">AI-Suggested Templates</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template) => (
          <div
            key={template.id}
            className="border rounded-lg p-4 cursor-pointer hover:shadow-lg transition-shadow"
          >
            <Image
              src={template.thumbnailUrl}
              alt={template.name}
              width={300}
              height={200}
              className="w-full h-40 object-cover mb-2 rounded"
            />
            <h3 className="font-bold">{template.name}</h3>
            <p className="text-sm text-gray-600 mb-2">{template.description}</p>
            <Button onClick={() => onTemplateSelect(template.id)}>Select Template</Button>
          </div>
        ))}
      </div>
    </div>
  );
}