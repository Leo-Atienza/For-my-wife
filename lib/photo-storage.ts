import { File } from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import { supabase } from './supabase';
import { useAuthStore } from '@/stores/useAuthStore';
import { generateId } from './utils';

const BUCKET = 'couple-photos';
const PENDING_UPLOADS_KEY = 'photo-pending-uploads';
const MAX_IMAGE_DIMENSION = 1200;

interface PendingUpload {
  localUri: string;
  memoryId: string;
  subfolder: string;
  createdAt: string;
}

/**
 * Compress and resize an image before upload.
 * Ensures images are at most MAX_IMAGE_DIMENSION on their longest side.
 */
const compressImage = async (uri: string): Promise<string> => {
  try {
    const result = await manipulateAsync(
      uri,
      [{ resize: { width: MAX_IMAGE_DIMENSION } }],
      { compress: 0.7, format: SaveFormat.JPEG }
    );
    return result.uri;
  } catch {
    // If manipulation fails, return original
    return uri;
  }
};

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
    // Compress before upload
    const compressedUri = await compressImage(localUri);

    // Create a File instance from the compressed URI
    const file = new File(compressedUri);

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
 * Queue a failed photo upload for later retry.
 */
export const queuePendingUpload = async (
  localUri: string,
  memoryId: string,
  subfolder = 'memories'
): Promise<void> => {
  const pending = await loadPendingUploads();
  // Deduplicate by memoryId
  const filtered = pending.filter((p) => p.memoryId !== memoryId);
  filtered.push({
    localUri,
    memoryId,
    subfolder,
    createdAt: new Date().toISOString(),
  });
  await AsyncStorage.setItem(PENDING_UPLOADS_KEY, JSON.stringify(filtered));
};

const loadPendingUploads = async (): Promise<PendingUpload[]> => {
  const raw = await AsyncStorage.getItem(PENDING_UPLOADS_KEY);
  return raw ? JSON.parse(raw) : [];
};

/**
 * Retry all pending photo uploads. Called when connectivity returns.
 * Updates memory records with the cloud URL on success.
 */
export const flushPendingUploads = async (
  updateMemoryUri: (memoryId: string, newUri: string) => void
): Promise<void> => {
  const pending = await loadPendingUploads();
  if (pending.length === 0) return;

  const state = await NetInfo.fetch();
  if (!state.isConnected) return;

  const remaining: PendingUpload[] = [];

  for (const upload of pending) {
    const cloudUrl = await uploadPhoto(upload.localUri, upload.subfolder);
    if (cloudUrl) {
      updateMemoryUri(upload.memoryId, cloudUrl);
    } else {
      remaining.push(upload);
    }
  }

  await AsyncStorage.setItem(PENDING_UPLOADS_KEY, JSON.stringify(remaining));
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

const MIGRATION_KEY = 'photo-migration-complete';

/**
 * Migrate all local-URI memories to Supabase Storage.
 * Runs once — skipped if already completed or no local photos exist.
 * Updates each memory record with the cloud URL after successful upload.
 */
export const migratePhotosToCloud = async (
  memories: Array<{ id: string; imageUri: string }>,
  updateMemoryUri: (memoryId: string, newUri: string) => void,
): Promise<{ migrated: number; failed: number }> => {
  const spaceId = useAuthStore.getState().spaceId;
  if (!spaceId) return { migrated: 0, failed: 0 };

  // Check if migration already ran
  const done = await AsyncStorage.getItem(MIGRATION_KEY);
  if (done === 'true') return { migrated: 0, failed: 0 };

  const localMemories = memories.filter((m) => !isRemoteUrl(m.imageUri));
  if (localMemories.length === 0) {
    await AsyncStorage.setItem(MIGRATION_KEY, 'true');
    return { migrated: 0, failed: 0 };
  }

  let migrated = 0;
  let failed = 0;

  for (const memory of localMemories) {
    const cloudUrl = await uploadPhoto(memory.imageUri, 'memories');
    if (cloudUrl) {
      updateMemoryUri(memory.id, cloudUrl);
      migrated++;
    } else {
      // Queue for later retry
      await queuePendingUpload(memory.imageUri, memory.id, 'memories');
      failed++;
    }
  }

  // Only mark complete if all succeeded
  if (failed === 0) {
    await AsyncStorage.setItem(MIGRATION_KEY, 'true');
  }

  return { migrated, failed };
};
