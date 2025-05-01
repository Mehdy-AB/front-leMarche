'use client';

import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  DragStartEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Image from 'next/image';

export default function ImageDnD() {
  const [files, setFiles] = useState<string[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) {
      setActiveId(null);
      return;
    }

    const oldIndex = files.findIndex((file) => file === active.id);
    const newIndex = files.findIndex((file) => file === over.id);
    setFiles((prev) => arrayMove(prev, oldIndex, newIndex));
    setActiveId(null);
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    for(const file of Array.from(files)) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setFiles((prev) => [...prev, reader.result as string]);
        }
      };
      reader.readAsDataURL(file);
    }
    e.target.value = ''; 
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={files} strategy={rectSortingStrategy}>
        <div className="grid grid-cols-1 sm:grid-cols-2 items-center md:grid-cols-4 xl:grid-cols-5 gap-4 border-gray-300 p-4 border border-dashed rounded-xl">
          {files.map((file, idx) => (
            <SortableImage key={file} id={file} src={file} first={idx === 0} />
          ))}

          {/* Upload Section */}
          {files.length>0?<label className="flex items-center h-20 sm:h-24 justify-center border-2 border-dashed border-gray-300 rounded-md md:h-32 cursor-pointer text-gray-500 hover:text-colorOne hover:border-colorOne/40 transition-all">
            <input
              type="file"
              accept="image/*"
              onChange={handleUpload}
              className="hidden"
              multiple
            />
            <span className=" text-sm text-center px-2">
              Click to add new
            </span>
          </label>:
          <>
          <div className="flex flex-col items-center justify-center col-span-5">
            <input type="file" accept="image/*" multiple onChange={handleUpload} className="hidden" id="photos" />
            <label htmlFor="photos" className="cursor-pointer text-sm text-colorOne">Upload new</label>
            <p className="text-xs text-gray-500 mt-1">Jusqu'à 10 images. JPG, PNG.</p>
            </div>
          </>
          }
        </div>
      </SortableContext>

      <DragOverlay>
        {activeId && (
          <div className="w-40 h-40 relative shadow-lg rounded overflow-hidden ring-1 ring-blue-400">
            <Image
              src={activeId}
              alt="drag-overlay"
              fill
              className="object-cover"
            />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}

type SortableImageProps = {
  id: string;
  src: string;
  first: boolean;
};

function SortableImage({ id, src, first }: SortableImageProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    cursor: 'grab',
    gridColumn: first ? 'span 2' : undefined,
    gridRow: first ? 'span 2' : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`relative group w-full border border-gray-300 rounded h-20 py-4 sm:h-24 ${first ? 'md:h-80 md:col-span-2 md:row-span-2' : 'md:h-32'}`}
    > 
    <div className=' absolute z-10 h-full rounded w-full top-0 left-0 group-hover:bg-black/40 transition-all duration-100 ease-in-out'/>
      <div className={`relative w-full h-full`}>
        <Image
          src={src}
          alt="sortable"
          fill
          className="object-cover z-0"
        />
      </div>
    </div>
  );
}
