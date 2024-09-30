import { useState } from 'react';
import { FunnelPage, FunnelData } from '@/lib/types/funnel';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface PageContentEditorProps {
  page: FunnelPage;
  funnelData: FunnelData;
  onSave: (updatedPage: FunnelPage) => void;
  onClose: () => void;
}

export function PageContentEditor({ page, funnelData, onSave, onClose }: PageContentEditorProps) {
  const [editedPage, setEditedPage] = useState<FunnelPage>(page);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedPage(prev => ({
      ...prev,
      content: {
        ...prev.content,
        [name]: value
      }
    }));
  };

  const handleSave = () => {
    onSave(editedPage);
    onClose();
  };

  const generateAIContent = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pageType: page.type,
          marketingDetails: funnelData.marketingDetails,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate content');
      }

      const content = await response.json();
      setEditedPage(prev => ({
        ...prev,
        content: {
          ...prev.content,
          ...content,
        },
      }));
      toast({
        title: "Content Generated",
        description: "AI-generated content has been added to the page.",
      });
    } catch (error) {
      console.error('Error generating content:', error);
      toast({
        title: "Error",
        description: "Failed to generate content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit {page.type} Page</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            name="title"
            value={editedPage.content.title || ''}
            onChange={handleInputChange}
            placeholder="Page Title"
          />
          <Textarea
            name="description"
            value={editedPage.content.description || ''}
            onChange={handleInputChange}
            placeholder="Page Description"
          />
          <Input
            name="cta"
            value={editedPage.content.cta || ''}
            onChange={handleInputChange}
            placeholder="Call to Action"
          />
          <Button onClick={generateAIContent} disabled={isGenerating}>
            {isGenerating ? 'Generating...' : 'Generate AI Content'}
          </Button>
        </div>
        <DialogFooter>
          <Button onClick={onClose} variant="outline">Cancel</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}