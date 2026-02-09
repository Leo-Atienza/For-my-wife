import { File } from 'expo-file-system';
import { supabase } from './supabase';
import { useAuthStore } from '@/stores/useAuthStore';
import { generateId } from './utils';

const BUCKET = 'couple-photos';

/**
 * Upload a local photo to Supabase Storage.
 * Returns the public URL on success, null on failure.
 */
export const uploadPhoto = async (
  localUri: string,
  subfolder = 'memories'
): Promise<string | null> => {
  const spaceId = useAuthStore.getState().spaceId;
  if (!spaceId) return null;

  try {
    // Create a File instance from the local URI
    const file = new File(localUri);

    // Read file as ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();

    // Determine file extension from URI
    const ext = localUri.split('.').pop()?.toLowerCase() ?? 'jpg';
    const fileName = `${generateId()}.${ext}`;
    const storagePath = `${spaceId}/${subfolder}/${fileName}`;

    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(storagePath, arrayBuffer, {
        contentType: `image/${ext === 'jpg' ? 'jpeg' : ext}`,
        upsert: false,
      });

    if (error) {
      console.error('Photo upload error:', error.message);
      return null;
    }

    // Get the public URL
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);
    return data.publicUrl;
  } catch (err) {
    console.error('Photo upload failed:', err);
    return null;
  }
};

/**
 * Delete a photo from Supabase Storage by its full URL or path.
 */
export const deletePhoto = async (urlOrPath: string): Promise<void> => {
  try {
    // Extract the storage path from the URL if it's a full URL
    let storagePath = urlOrPath;
    if (urlOrPath.startsWith('http')) {
      const parts = urlOrPath.split(`${BUCKET}/`);
      if (parts.length > 1) {
        storagePath = parts[1];
      }
    }

    const { error } = await supabase.storage.from(BUCKET).remove([storagePath]);
    if (error) {
      console.error('Photo delete error:', error.message);
    }
  } catch (err) {
    console.error('Photo delete failed:', err);
  }
};

/**
 * Check if a URI is a remote URL (already uploaded) or a local file.
 */
export const isRemoteUrl = (uri: string): boolean => {
  return uri.startsWith('http://') || uri.startsWith('https://');
};
