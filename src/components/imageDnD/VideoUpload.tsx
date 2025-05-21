'use client';
import { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { CreateAdsFormValues } from '@/lib/validation/all.schema';
import Image from 'next/image';

export default function VideoUpload() {
  const { setValue, watch } = useFormContext<CreateAdsFormValues>();
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  
  // Initialize from form if editing existing ad
  useEffect(() => {
    const formVideo = watch('video');
    if (formVideo) {
      setVideoPreview(URL.createObjectURL(formVideo));
    }
  }, []);

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate video
    if (!file.type.startsWith('video/')) {
      alert('Please upload a video file (MP4, MOV, etc.)');
      return;
    }

    if (file.size > 100 * 1024 * 1024) { // 100MB limit
      alert('Video must be smaller than 100MB');
      return;
    }

    // Create preview
    setVideoPreview(URL.createObjectURL(file));
    setValue('video', file); // Set as single file, not array
  };

  const handleRemove = () => {
    if (videoPreview) {
      URL.revokeObjectURL(videoPreview);
    }
    setVideoPreview(null);
    setValue('video', undefined);
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        Video (Optional)

      </label>

      {videoPreview ? (
        <div className="relative group">
          {/* Video Preview */}
          <video
            src={videoPreview}
            controls
            className="w-full h-auto max-h-96 rounded-lg border border-gray-300"
          />
          
          {/* Remove Button */}
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition"
            aria-label="Remove video"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>

        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M7 4a4 4 0 016 0M4 8a4 4 0 018 0m-8 4h16m-2 4a4 4 0 01-4 4H8a4 4 0 01-4-4v-8a4 4 0 014-4h8a4 4 0 014 4v8z"
              />
            </svg>
            <p className="text-sm text-gray-500 mt-2">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500">MP4 or MOV, max 100MB</p>
          </div>
          <input
            type="file"
            accept="video/*"
            onChange={handleVideoChange}
            className="hidden"
          />
        </label>
      )}
    </div>
  );
}