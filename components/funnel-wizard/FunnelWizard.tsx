'use client';

import React, { useState } from 'react';
import { FunnelData, FunnelPage } from '@/lib/types/funnel';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FunnelFlow } from './FunnelFlow';
import { PageContentEditor } from './PageContentEditor';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/hooks/use-toast';
import { TemplateSelection } from './TemplateSelection';
import { PagePreview } from './PagePreview';

interface FunnelWizardProps {
  initialData?: FunnelData;
}

export default function FunnelWizard({ initialData }: FunnelWizardProps) {
  const [funnelData, setFunnelData] = useState<FunnelData>(
    initialData || {
      id: uuidv4(),
      name: '',
      description: '',
      pages: [],
      flow: [],
      marketingDetails: {
        targetAudience: '',
        productDescription: '',
        goals: [],
      },
    }
  );
  const [editingPageId, setEditingPageId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Partial<FunnelData>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [previewPageId, setPreviewPageId] = useState<string | null>(null);

  const addPage = (type: FunnelPage['type']) => {
    const newPage: FunnelPage = {
      id: uuidv4(),
      type,
      content: {},
    };
    setFunnelData(prev => ({
      ...prev,
      pages: [...prev.pages, newPage],
      flow: [...prev.flow, newPage.id],
    }));
  };

  const updateFlow = (newFlow: string[]) => {
    setFunnelData(prev => ({ ...prev, flow: newFlow }));
  };

  const handleEditPage = (pageId: string) => {
    setEditingPageId(pageId);
  };

  const handleSavePageContent = (updatedPage: FunnelPage) => {
    setFunnelData(prev => ({
      ...prev,
      pages: prev.pages.map(p => p.id === updatedPage.id ? updatedPage : p),
    }));
    setEditingPageId(null);
  };

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    // Here you would typically fetch the template details and update the funnel data
  };

  const { toast } = useToast();

  const validateForm = (): boolean => {
    const newErrors: Partial<FunnelData> = {};

    if (!funnelData.name) newErrors.name = "Funnel name is required";
    if (!funnelData.description) newErrors.description = "Funnel description is required";
    if (!funnelData.marketingDetails.targetAudience) newErrors.marketingDetails = { ...newErrors.marketingDetails, targetAudience: "Target audience is required" };
    if (!funnelData.marketingDetails.productDescription) newErrors.marketingDetails = { ...newErrors.marketingDetails, productDescription: "Product description is required" };
    if (funnelData.marketingDetails.goals.length === 0) newErrors.marketingDetails = { ...newErrors.marketingDetails, goals: "At least one goal must be selected" };
    if (funnelData.pages.length === 0) newErrors.pages = "At least one page must be added to the funnel";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const saveFunnel = async () => {
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch('/api/save-funnel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(funnelData),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Success",
          description: "Funnel saved successfully!",
        });
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Error saving funnel:', error);
      toast({
        title: "Error",
        description: "Failed to save funnel. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Remove the duplicate title */}
      
      {/* Basic Funnel Info */}
      <div>
        <Input
          placeholder="Funnel Name"
          value={funnelData.name}
          onChange={(e) => setFunnelData(prev => ({ ...prev, name: e.target.value }))}
        />
        <Textarea
          placeholder="Funnel Description"
          className="mt-2"
          value={funnelData.description}
          onChange={(e) => setFunnelData(prev => ({ ...prev, description: e.target.value }))}
        />
      </div>

      {/* Marketing Details */}
      <div>
        <h2 className="text-xl font-semibold">Marketing Details</h2>
        <Input
          placeholder="Target Audience"
          className="mt-2"
          value={funnelData.marketingDetails.targetAudience}
          onChange={(e) => setFunnelData(prev => ({ ...prev, marketingDetails: { ...prev.marketingDetails, targetAudience: e.target.value } }))}
        />
        <Textarea
          placeholder="Product Description"
          className="mt-2"
          value={funnelData.marketingDetails.productDescription}
          onChange={(e) => setFunnelData(prev => ({ ...prev, marketingDetails: { ...prev.marketingDetails, productDescription: e.target.value } }))}
        />
        <div className="mt-2">
          <h3 className="text-lg font-semibold">Goals</h3>
          {['Awareness', 'Lead Generation', 'Sales'].map(goal => (
            <label key={goal} className="flex items-center mt-1">
              <input
                type="checkbox"
                checked={funnelData.marketingDetails.goals.includes(goal)}
                onChange={(e) => {
                  const updatedGoals = e.target.checked
                    ? [...funnelData.marketingDetails.goals, goal]
                    : funnelData.marketingDetails.goals.filter(g => g !== goal);
                  setFunnelData(prev => ({ ...prev, marketingDetails: { ...prev.marketingDetails, goals: updatedGoals } }));
                }}
                className="mr-2"
              />
              {goal}
            </label>
          ))}
        </div>
      </div>

      {/* Template Selection */}
      {funnelData.marketingDetails.goals.length > 0 && (
        <TemplateSelection
          funnelData={funnelData}
          onTemplateSelect={handleTemplateSelect}
        />
      )}

      {/* Page Creation */}
      <div>
        <h2 className="text-xl font-semibold">Funnel Pages</h2>
        <div className="flex flex-wrap gap-2 mt-2">
          {['landing', 'login', 'questionnaire', 'content', 'checkout', 'thankyou'].map(pageType => (
            <Button key={pageType} onClick={() => addPage(pageType as FunnelPage['type'])}>
              Add {pageType.charAt(0).toUpperCase() + pageType.slice(1)} Page
            </Button>
          ))}
        </div>
      </div>

      {/* Funnel Flow */}
      {selectedTemplate && funnelData.flow.length > 0 && (
        <div>
          <FunnelFlow 
            flow={funnelData.flow} 
            pages={funnelData.pages} 
            updateFlow={updateFlow} 
            onEditPage={handleEditPage}
            onPreviewPage={setPreviewPageId}
          />
          {previewPageId && (
            <PagePreview page={funnelData.pages.find(p => p.id === previewPageId)!} />
          )}
        </div>
      )}

      {/* Display errors */}
      {Object.entries(errors).map(([key, value]) => (
        <p key={key} className="text-red-500">{value}</p>
      ))}

      {/* Save Funnel */}
      <Button onClick={saveFunnel} className="w-full" disabled={isSaving}>
        {isSaving ? 'Saving...' : 'Save Funnel'}
      </Button>

      {/* Page Content Editor Modal */}
      {editingPageId && (
        <PageContentEditor
          page={funnelData.pages.find(p => p.id === editingPageId)!}
          onSave={handleSavePageContent}
          onClose={() => setEditingPageId(null)}
        />
      )}
    </div>
  );
}