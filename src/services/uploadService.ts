import { getToken } from './authService';

// Use environment variables if available, otherwise fallback to localhost
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
const API_URL = `${BASE_URL}/api`;

export interface UploadHistoryItem {
  id: number;
  action: string;
  metadata?: string;
  timestamp: string;
}

export interface UserUpload {
  id: number;
  fileName: string;
  filePath: string;
  fileType: string;
  fileSize: number;
  mimeType: string;
  description?: string;
  uploadedAt: string;
  history?: UploadHistoryItem[];
  // These will be added after fetching from the server
  isRecyclable?: boolean;
  name?: string;
  imageUrl?: string;
  videoUrl?: string;
  date?: Date;
  points?: number;
}

// Helper to handle API responses
async function handleResponse(response: Response) {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || response.statusText || `Error ${response.status}`);
  }
  try {
    return await response.json();
  } catch (e) {
    // If the response can't be parsed as JSON, return a simpler object
    return { success: true, message: 'Operation successful but no JSON returned' };
  }
}

// Fetcher function with retry logic
async function fetchWithRetry(url: string, options: RequestInit, retries = 2): Promise<Response> {
  try {
    return await fetch(url, options);
  } catch (err) {
    if (retries <= 0) throw err;
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
    return fetchWithRetry(url, options, retries - 1);
  }
}

// Get authentication headers
function getAuthHeaders() {
  const token = getToken();
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
}

// Upload a file (image or video)
export async function uploadFile(file: File, description?: string): Promise<UserUpload> {
  const token = getToken();
  if (!token) throw new Error('Authentication required');

  const formData = new FormData();
  formData.append('file', file);
  if (description) formData.append('description', description);

  const response = await fetchWithRetry(`${API_URL}/uploads`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  }, 2); // Retry up to 2 times

  return handleResponse(response);
}

// Get all user uploads
export async function getUserUploads(): Promise<UserUpload[]> {
  const response = await fetchWithRetry(`${API_URL}/uploads`, {
    headers: getAuthHeaders()
  }, 2); // Retry up to 2 times

  const uploads = await handleResponse(response);
  
  // Transform uploads to match the history item format expected by the UI
  return uploads.map((upload: UserUpload) => {
    // Determine if it's an image or video
    const isImage = upload.fileType === 'IMAGE';
    
    // Create the full URL to access the file
    const fileUrl = `${BASE_URL}/uploads/${upload.filePath}`;
    
    // Extract recyclability and item name from metadata if available
    let isRecyclable = Math.random() > 0.3; // Default random for now, should come from analysis
    let name = upload.fileName;
    let points = isRecyclable ? Math.floor(Math.random() * 30) + 10 : 0;
    
    // Try to extract data from the most recent history item with analysis data
    if (upload.history && upload.history.length > 0) {
      const analysisItem = upload.history.find(h => h.action === 'analyzed' && h.metadata);
      if (analysisItem && analysisItem.metadata) {
        try {
          const metaData = JSON.parse(analysisItem.metadata);
          if (metaData.isRecyclable !== undefined) {
            isRecyclable = metaData.isRecyclable;
          }
          if (metaData.itemName) {
            name = metaData.itemName;
          }
          if (metaData.points) {
            points = metaData.points;
          }
        } catch (e) {
          console.error('Error parsing metadata:', e);
        }
      }
    }
    
    return {
      ...upload,
      id: String(upload.id),  // Convert to string for compatibility
      name: name,
      isRecyclable,
      date: new Date(upload.uploadedAt),
      imageUrl: isImage ? fileUrl : undefined,
      videoUrl: !isImage ? fileUrl : undefined,
      points: points
    };
  });
}

// Get a single upload with history
export async function getUploadWithHistory(uploadId: number): Promise<UserUpload> {
  const response = await fetchWithRetry(`${API_URL}/uploads/${uploadId}`, {
    headers: getAuthHeaders()
  }, 1); // Retry once
  
  return handleResponse(response);
}

// Record an action in upload history
export async function recordHistory(
  uploadId: number,
  action: string,
  metadata?: Record<string, any>
): Promise<UploadHistoryItem> {
  const response = await fetchWithRetry(`${API_URL}/uploads/${uploadId}/history`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ action, metadata })
  }, 1); // Retry once
  
  return handleResponse(response);
}

// Delete an upload
export async function deleteUpload(uploadId: number): Promise<void> {
  const response = await fetchWithRetry(`${API_URL}/uploads/${uploadId}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  }, 1); // Retry once
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || response.statusText);
  }
}
