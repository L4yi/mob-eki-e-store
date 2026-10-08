import React, { useState, useRef } from 'react';
import { api } from '../../lib/api';
import { UploadCloud, Image as ImageIcon, X, Loader2, Link2, Check } from 'lucide-react';

interface ImageUploadDropzoneProps {
  images: string[];
  onChange: (images: string[]) => void;
  folder?: string;
  maxFiles?: number;
}

export default function ImageUploadDropzone({
  images,
  onChange,
  folder = 'products',
  maxFiles = 5,
}: ImageUploadDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [customUrl, setCustomUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const processFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;

    if (images.length + fileArray.length > maxFiles) {
      setErrorMessage(`You can upload a maximum of ${maxFiles} images.`);
      return;
    }

    setErrorMessage(null);
    setUploading(true);
    const newUploadedUrls: string[] = [];

    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i];

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrorMessage(`"${file.name}" is not a supported image file.`);
        continue;
      }

      // Validate file size (10MB)
      if (file.size > 10 * 1024 * 1024) {
        setErrorMessage(`"${file.name}" exceeds the 10MB limit.`);
        continue;
      }

      try {
        setUploadProgress(`Uploading ${i + 1} of ${fileArray.length}...`);
        const result = await api.uploadImage(file, folder);
        newUploadedUrls.push(result.url);
      } catch (err: any) {
        console.error('Failed to upload file:', file.name, err);
        setErrorMessage(`Failed to upload "${file.name}": ${err.message}`);
      }
    }

    if (newUploadedUrls.length > 0) {
      onChange([...images, ...newUploadedUrls]);
    }

    setUploading(false);
    setUploadProgress(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await processFiles(e.dataTransfer.files);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await processFiles(e.target.files);
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    onChange(images.filter((_, idx) => idx !== indexToRemove));
  };

  const handleAddCustomUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUrl.trim()) return;

    if (images.length >= maxFiles) {
      setErrorMessage(`You can add a maximum of ${maxFiles} images.`);
      return;
    }

    onChange([...images, customUrl.trim()]);
    setCustomUrl('');
    setShowUrlInput(false);
    setErrorMessage(null);
  };

  return (
    <div className="space-y-3">
      {/* Upload Drop Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !uploading && fileInputRef.current?.click()}
        className={`relative border-2 border-dashed p-6 text-center cursor-pointer transition-all ${
          isDragging
            ? 'border-[#0B1F3A] bg-[#0B1F3A]/5 scale-[1.01]'
            : 'border-[#D1D5DB] hover:border-[#0B1F3A] bg-[#FAF8F5]'
        } ${uploading ? 'opacity-70 pointer-events-none' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center gap-2">
          {uploading ? (
            <>
              <Loader2 className="w-8 h-8 text-[#0B1F3A] animate-spin" />
              <p className="text-xs font-semibold text-[#0B1F3A]">{uploadProgress || 'Uploading image...'}</p>
              <p className="text-[11px] text-[#6B7280]">Uploading directly to Supabase Storage</p>
            </>
          ) : (
            <>
              <div className="w-10 h-10 rounded-full bg-white border border-[#E5E7EB] flex items-center justify-center shadow-xs">
                <UploadCloud className="w-5 h-5 text-[#0B1F3A]" />
              </div>
              <div>
                <p className="text-xs font-semibold text-[#0B1F3A]">
                  Click to upload or drag and drop image files
                </p>
                <p className="text-[11px] text-[#6B7280] mt-0.5">
                  PNG, JPG, WEBP, GIF, SVG up to 10MB (Supabase Storage CDN)
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs flex items-center justify-between">
          <span>{errorMessage}</span>
          <button onClick={() => setErrorMessage(null)} className="text-red-500 hover:text-red-700">
            <X size={14} />
          </button>
        </div>
      )}

      {/* URL Toggle Fallback */}
      <div className="flex items-center justify-between text-xs">
        <span className="text-[#6B7280]">
          {images.length} of {maxFiles} image{maxFiles > 1 ? 's' : ''} added
        </span>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="inline-flex items-center gap-1 text-[#164A7A] hover:text-[#0B1F3A] font-medium transition-colors"
        >
          <Link2 size={13} />
          {showUrlInput ? 'Hide URL input' : 'Paste Image URL instead'}
        </button>
      </div>

      {/* External URL Input Form */}
      {showUrlInput && (
        <form onSubmit={handleAddCustomUrl} className="flex gap-2">
          <input
            type="url"
            value={customUrl}
            onChange={(e) => setCustomUrl(e.target.value)}
            placeholder="https://images.unsplash.com/..."
            className="flex-1 border border-[#E5E7EB] px-3 py-1.5 text-xs bg-white outline-none focus:border-[#0B1F3A]"
          />
          <button
            type="submit"
            className="bg-[#0B1F3A] text-white px-3 py-1.5 text-xs font-semibold hover:bg-[#164A7A] transition-colors"
          >
            Add URL
          </button>
        </form>
      )}

      {/* Thumbnails Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 pt-1">
          {images.map((imgUrl, index) => (
            <div
              key={index}
              className="group relative aspect-square border border-[#E5E7EB] bg-white overflow-hidden shadow-2xs"
            >
              <img
                src={imgUrl}
                alt={`Product image ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&q=80';
                }}
              />

              {index === 0 && (
                <span className="absolute top-1 left-1 bg-[#0B1F3A] text-[#C9A227] text-[9px] font-bold px-1.5 py-0.5 uppercase tracking-wider shadow-xs">
                  Primary
                </span>
              )}

              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-xs hover:bg-red-700"
                title="Remove image"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
