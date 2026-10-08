import { getSupabaseClient } from './supabaseClient';
import crypto from 'crypto';

export interface UploadOptions {
  fileData: string; // Base64 string (with or without data:image/...;base64, prefix)
  fileName: string;
  fileType?: string;
  folder?: string;
}

export interface UploadResult {
  url: string;
  fileName: string;
  fileKey: string;
  contentType: string;
  size: number;
}

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
]);

const EXTENSION_MIME_MAP: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  gif: 'image/gif',
  svg: 'image/svg+xml',
};

export async function uploadImageToStorage(options: UploadOptions): Promise<UploadResult> {
  const { fileData, fileName, folder = 'products' } = options;

  if (!fileData) {
    throw new Error('No file data provided');
  }

  // Parse Base64 and detect mime type
  let base64Content = fileData;
  let detectedMime = options.fileType;

  if (fileData.startsWith('data:')) {
    const matches = fileData.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (matches && matches.length === 3) {
      detectedMime = matches[1];
      base64Content = matches[2];
    }
  }

  const rawExt = (fileName.split('.').pop() || '').toLowerCase();
  const contentType = detectedMime || EXTENSION_MIME_MAP[rawExt] || 'image/jpeg';

  if (!ALLOWED_MIME_TYPES.has(contentType)) {
    throw new Error(`Unsupported image type: ${contentType}. Allowed types: JPEG, PNG, WebP, GIF, SVG.`);
  }

  const buffer = Buffer.from(base64Content, 'base64');
  if (buffer.length > 10 * 1024 * 1024) {
    throw new Error('Image file size exceeds maximum limit of 10MB');
  }

  // Sanitize filename
  const cleanName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_').toLowerCase();
  const fileExt = cleanName.includes('.') ? cleanName.split('.').pop() : 'jpg';
  const nameWithoutExt = cleanName.substring(0, cleanName.lastIndexOf('.')) || 'image';
  const uniqueId = crypto.randomBytes(4).toString('hex');
  const sanitizedPath = `${folder}/${Date.now()}-${uniqueId}-${nameWithoutExt}.${fileExt}`;

  const supabaseUrl = process.env.SUPABASE_URL || 'https://ktckstaltpbtogtbemee.supabase.co';
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

  let publicUrl: string | null = null;

  try {
    const { supabase, available } = getSupabaseClient();

    if (available && supabase) {
      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(sanitizedPath, buffer, {
          contentType,
          upsert: true,
        });

      if (!error) {
        publicUrl = `${supabaseUrl.replace(/\/$/, '')}/storage/v1/object/public/product-images/${sanitizedPath}`;
      } else {
        console.warn('[Supabase Storage] JS Client Upload warning:', error.message);
      }
    } else if (supabaseKey && !supabaseUrl.includes('placeholder')) {
      const uploadEndpoint = `${supabaseUrl.replace(/\/$/, '')}/storage/v1/object/product-images/${sanitizedPath}`;
      const headers: Record<string, string> = {
        'Content-Type': contentType,
        'Authorization': `Bearer ${supabaseKey}`,
      };

      const response = await fetch(uploadEndpoint, {
        method: 'POST',
        headers,
        body: buffer,
      });

      if (response.ok) {
        publicUrl = `${supabaseUrl.replace(/\/$/, '')}/storage/v1/object/public/product-images/${sanitizedPath}`;
      } else {
        console.warn('[Supabase Storage] HTTP Upload returned status:', response.status);
      }
    }
  } catch (err: any) {
    console.warn('[Supabase Storage] Network upload attempt error:', err.message);
  }

  // Fallback if remote storage upload failed or credentials pending: Use Data URI so images always work
  if (!publicUrl) {
    publicUrl = `data:${contentType};base64,${base64Content}`;
  }

  return {
    url: publicUrl,
    fileName: cleanName,
    fileKey: sanitizedPath,
    contentType,
    size: buffer.length,
  };
}
