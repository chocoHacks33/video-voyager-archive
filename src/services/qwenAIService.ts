
export interface WanAITaskStatus {
  status: 'pending' | 'processing' | 'completed' | 'failed';
  error?: string;
  progress?: number; // Added progress property to track generation percentage
}
