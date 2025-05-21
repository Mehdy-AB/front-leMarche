'use client';

import { useEffect, useMemo, useState } from 'react';
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
import { CreateAdsFormValues } from '@/lib/validation/all.schema';
import { useFormContext } from 'react-hook-form';

export default function ImageDnD() {
  const { setValue, watch } = useFormContext<CreateAdsFormValues>();
  const formImages = watch('images'); // Get current form values
  
  const [files, setFiles] = useState<{id: string, file: File}[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  // Sync with form state
  useEffect(() => {
    if (formImages?.length > 0 && files.length === 0) {
      // Initialize from form if needed
      setFiles(Array.from(formImages).map(file => ({
        id: URL.createObjectURL(file as File),
        file: file as File
      })));
    }
  }, [formImages]);

  // Update form value on files change
  useEffect(() => {
    setValue('images', files.map(f => f.file) as unknown as FileList, {
      shouldValidate: true
    });
  }, [files]);

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

    const oldIndex = files.findIndex((file) => file.id === active.id);
    const newIndex = files.findIndex((file) => file.id === over.id);
    setFiles((prev) => arrayMove(prev, oldIndex, newIndex));
    setActiveId(null);
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles) return;
  
    const MAX_FILES = 10;
    const availableSlots = MAX_FILES - files.length;
    if (availableSlots <= 0) return;
  
    const newFiles = Array.from(selectedFiles)
      .slice(0, availableSlots)
      .map(file => ({
        id: URL.createObjectURL(file), // Better ID using object URL
        file
      }));
    
    setFiles(prev => [...prev, ...newFiles]);
    e.target.value = '';
  };  

  const handleDelete = (id: string) => {
    setFiles(prev => {
      const newFiles = prev.filter(f => f.id !== id);
      return newFiles;
    });
  };

  const sortableIds = useMemo(() => files.map(file => file.id), [files]);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={sortableIds} strategy={rectSortingStrategy}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-4 border-gray-300 p-4 border border-dashed rounded-xl">
          {files.map((file, idx) => (
            <SortableImage 
              key={file.id} 
              id={file.id} 
              src={URL.createObjectURL(file.file)} 
              first={idx === 0} 
              onDelete={() => handleDelete(file.id)} 
            />
          ))}

          {files.length < 10 && (
            <label className={`flex items-center justify-center border-2 border-dashed rounded-md cursor-pointer text-gray-500 hover:text-colorOne hover:border-colorOne/40 transition-all
              ${files.length === 0 ? 'col-span-5 py-8 flex-col' : 'h-20 sm:h-24 md:h-32'}`}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleUpload}
                className="hidden"
                multiple
              />
              <span className="text-sm px-2">
                {files.length === 0 ? (
                  <>
                    <span className="text-colorOne">Upload images</span>
                    <p className="text-xs text-gray-500 mt-1">3-10 images (JPG, PNG)</p>
                  </>
                ) : 'Add more'}
              </span>
            </label>
          )}
        </div>
      </SortableContext>

      <DragOverlay>
        {activeId && (
          <div className="w-40 h-40 relative shadow-lg rounded overflow-hidden ring-1 ring-blue-400">
            <Image
              src={
                (() => {
                  const fileObj = files.find(file => file.id === activeId)?.file;
                  return fileObj ? URL.createObjectURL(fileObj) : '';
                })()
              }
              alt="drag-overlay"
              fill
              className="object-cover"
              unoptimized 
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
  onDelete: () => void;
};

function SortableImage({ id, src, first, onDelete }: SortableImageProps) {
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
      className={`relative group w-full border border-gray-300 rounded h-20 sm:h-24 ${
        first ? 'md:h-80 md:col-span-2 md:row-span-2' : 'md:h-32'
      }`}
    > 
      <div className='absolute z-10 h-full rounded w-full top-0 left-0 group-hover:bg-black/40 transition-all duration-100 ease-in-out'/>
      <button 
        type="button"
        onClick={(e) => { e.stopPropagation(); onDelete(); }}
        className='absolute top-1 right-1 z-20 cursor-pointer opacity-0 group-hover:opacity-100 bg-red-400 rounded-full p-1 text-white transition-all duration-100 ease-in-out'
        aria-label="Delete image"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>
      </button>
      <div className="relative w-full h-full">
        <Image
          src={src}
          alt="Uploaded content"
          fill
          className="object-cover z-0"
          unoptimized // For local object URLs
        />
      </div>
    </div>
  );
}