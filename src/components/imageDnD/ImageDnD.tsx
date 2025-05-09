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

export default function ImageDnD({setImages}:{setImages:(images:string[])=>void}) {
  const [files, setFiles] = useState<{id:number,file:string}[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);
  useEffect(() => {
    if (files.length > 0) {
      setImages(files.map((file) => file.file));
    } else {
      setImages([]);
    }
  }
  , [files, setImages]);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as number);
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
    const MAX_SIZE_MB = 15;
    const availableSlots = MAX_FILES - files.length;
  
    let count = 0;
  
    for (const file of Array.from(selectedFiles)) {
      if (count >= availableSlots) break;
      if (file.size > MAX_SIZE_MB * 1024 * 1024) continue;
  
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1]; // ✅ remove MIME prefix
        setFiles(prev => [
          ...prev,
          {
            file: base64, // just the base64 string
            id: Date.now() + Math.floor(Math.random() * 1000),
          },
        ]);
      };
      reader.readAsDataURL(file);
      count++;
    }
  
    e.target.value = '';
  };  

  const sortableId = useMemo(() => {
    return files.map((file) => file.id);
  }
  , [files]);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={sortableId} strategy={rectSortingStrategy}>
        <div className="grid grid-cols-1 sm:grid-cols-2 items-center md:grid-cols-4 xl:grid-cols-5 gap-4 border-gray-300 p-4 border border-dashed rounded-xl">
          {files.map((file, idx) => (
            <SortableImage key={file.id} onDelete={()=>setFiles((prv)=>prv.filter(f=>f.id!==file.id))} id={file.id} src={file.file} first={idx === 0} />
          ))}

          {/* Upload Section */}
          {(files.length>0)?<>{files.length<9&&<label className="flex items-center h-20 sm:h-24 justify-center border-2 border-dashed border-gray-300 rounded-md md:h-32 cursor-pointer text-gray-500 hover:text-colorOne hover:border-colorOne/40 transition-all">
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
          </label>}</>:
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
              src={`data:image/png;base64,${files.find((file) => file.id === activeId)?.file|| ''}`}
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
  id: number;
  src: string;
  first: boolean;
  onDelete: () => void;
};

function SortableImage({ id, src, first, onDelete } : SortableImageProps) {
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
    <span onClick={(e)=>{onDelete()}} className='absolute top-1 right-1 z-20 cursor-pointer opacity-0 group-hover:opacity-100 bg-red-400 rounded group-hover:text-white transition-all duration-100 ease-in-out'>
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
    </span>
      <div className={`relative w-full h-full`}>
        <Image
          src={`data:image/png;base64,${src}`}
          alt="sortable"
          fill
          className="object-cover z-0"
        />
      </div>
    </div>
  );
}
