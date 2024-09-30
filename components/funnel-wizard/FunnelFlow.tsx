'use client';

import React from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Button } from "@/components/ui/button";
import { FunnelPage } from '@/lib/types/funnel';

interface FunnelFlowProps {
  flow: string[];
  pages: FunnelPage[];
  updateFlow: (newFlow: string[]) => void;
  onEditPage: (pageId: string) => void;
}

interface DraggableItemProps {
  id: string;
  index: number;
  moveItem: (dragIndex: number, hoverIndex: number) => void;
  children: React.ReactNode;
}

const DraggableItem: React.FC<DraggableItemProps> = ({ id, index, moveItem, children }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'FUNNEL_PAGE',
    item: { id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'FUNNEL_PAGE',
    hover(item: { id: string; index: number }) {
      if (item.index === index) {
        return;
      }
      moveItem(item.index, index);
      item.index = index;
    },
  });

  return (
    <div ref={(node) => drag(drop(node))} style={{ opacity: isDragging ? 0.5 : 1 }}>
      {children}
    </div>
  );
};

export function FunnelFlow({ flow, pages, updateFlow, onEditPage }: FunnelFlowProps) {
  const moveItem = (dragIndex: number, hoverIndex: number) => {
    const newFlow = [...flow];
    const draggedItem = newFlow[dragIndex];
    newFlow.splice(dragIndex, 1);
    newFlow.splice(hoverIndex, 0, draggedItem);
    updateFlow(newFlow);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div>
        <h2 className="text-xl font-semibold">Funnel Flow</h2>
        <div className="space-y-2 min-h-[100px] border border-dashed border-gray-300 p-4 mt-2">
          {flow.map((pageId, index) => {
            const page = pages.find(p => p.id === pageId);
            if (!page) return null;
            return (
              <DraggableItem key={pageId} id={pageId} index={index} moveItem={moveItem}>
                <div className="flex items-center space-x-2 p-2 bg-gray-100 rounded">
                  <span>{index + 1}.</span>
                  <span>{page.type}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => onEditPage(pageId)}
                  >
                    Edit
                  </Button>
                </div>
              </DraggableItem>
            );
          })}
        </div>
      </div>
    </DndProvider>
  );
}