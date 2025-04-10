
import { toast } from 'sonner';

// API key would typically be stored in environment variables
// This is a placeholder - in production, never expose API keys in client-side code
const QWEN_API_KEY = 'YOUR_QWEN_API_KEY'; 
const QWEN_API_ENDPOINT = 'https://api.qwen.ai/v1/video/generate';

// WAN AI API details - these are real endpoints and token
const WAN_AI_URL = "http://quickstart-deploy-20250410-g9hk.5158343315505498.ap-northeast-1.pai-eas.aliyuncs.com";
const WAN_AI_TOKEN = "MWFjNDk4NDlkYTRjOTFhOTY4NjE0NDE1ZWFiZWVhMjhjMDFkN2VhNw==";

export interface VideoGenerationOptions {
  prompt: string;
  text?: string;
  style?: string;
  duration?: number;
}

export interface VideoGenerationResponse {
  id: string;
  videoUrl: string;
  status: 'completed' | 'processing' | 'failed';
}

export interface VideoAnalysisResponse {
  description: string;
}

export interface WanAITaskStatus {
  status: 'pending' | 'processing' | 'completed' | 'failed';
  error?: string;
  progress?: number; // Tracks generation percentage
}

export class QwenAIService {
  /**
   * Generate a video using Qwen AI
   * Note: This is currently mocked since we don't have a real API key
   */
  static async generateVideo(options: VideoGenerationOptions): Promise<VideoGenerationResponse> {
    const { prompt, text, style = 'cinematic', duration = 5 } = options;
    
    try {
      console.log('Generating video with Qwen AI:', { prompt, text, style, duration });
      
      // For demo purposes - simulate API call with a timeout
      // In production, replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock response - in production, this would be the actual API response
      if (Math.random() < 0.9) { // 90% success rate for demo
        return {
          id: crypto.randomUUID(),
          videoUrl: '/stock-videos/video1.mp4', // Replace with actual video URL from API
          status: 'completed'
        };
      } else {
        throw new Error('Video generation failed');
      }
      
      // Real implementation would look something like this:
      /*
      const response = await fetch(QWEN_API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${QWEN_API_KEY}`
        },
        body: JSON.stringify({
          prompt,
          text,
          style,
          duration
        })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to generate video');
      }
      
      return await response.json();
      */
    } catch (error) {
      console.error('Error generating video:', error);
      toast.error('Video generation failed. Please try again.');
      throw error;
    }
  }
  
  /**
   * Get the status of a video generation task
   * Note: This is currently mocked
   */
  static async getVideoStatus(videoId: string): Promise<VideoGenerationResponse> {
    try {
      console.log('Checking video status for:', videoId);
      
      // For demo purposes - simulate API call with a timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock response - in production, this would be from the actual API
      return {
        id: videoId,
        videoUrl: '/stock-videos/video1.mp4',
        status: 'completed'
      };
      
      // Real implementation would look something like this:
      /*
      const response = await fetch(`${QWEN_API_ENDPOINT}/${videoId}`, {
        headers: {
          'Authorization': `Bearer ${QWEN_API_KEY}`
        }
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to check video status');
      }
      
      return await response.json();
      */
    } catch (error) {
      console.error('Error checking video status:', error);
      throw error;
    }
  }
  
  /**
   * Extract frames from a video file and return them as base64 strings
   * This is a client-side implementation that works in browsers
   */
  static async extractFramesFromVideo(videoFile: File, fps: number = 3): Promise<string[]> {
    console.log('Extracting frames from video:', videoFile.name);
    
    return new Promise((resolve, reject) => {
      const frames: string[] = [];
      const video = document.createElement('video');
      video.preload = 'metadata';
      
      // Create object URL for the video file
      const videoUrl = URL.createObjectURL(videoFile);
      video.src = videoUrl;

      video.onloadedmetadata = () => {
        const duration = video.duration;
        const totalFrames = Math.min(30, Math.floor(fps * duration)); // Cap at 30 frames to avoid API limits
        const frameInterval = duration / totalFrames;
        let currentTime = 0;
        let framesProcessed = 0;
        
        video.onseeked = () => {
          // Create a canvas to draw the video frame
          const canvas = document.createElement('canvas');
          canvas.width = 640; // Resize frame to save bandwidth
          canvas.height = 360;
          const ctx = canvas.getContext('2d');
          
          if (ctx) {
            // Draw the current frame to the canvas
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            
            // Convert the canvas to a base64 data URL
            const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
            frames.push(dataUrl);
          }
          
          framesProcessed++;
          
          if (framesProcessed < totalFrames) {
            // Move to the next frame
            currentTime += frameInterval;
            video.currentTime = currentTime;
          } else {
            // All frames processed, clean up and resolve
            URL.revokeObjectURL(videoUrl);
            resolve(frames);
          }
        };
        
        // Start seeking to the first frame
        video.currentTime = 0;
      };
      
      video.onerror = () => {
        URL.revokeObjectURL(videoUrl);
        reject(new Error('Error loading video'));
      };
    });
  }

  /**
   * Get a description of the video using Qwen VL model
   * This implements the actual API call to the Qwen VL model
   */
  static async getVideoDescription(frames: string[]): Promise<VideoAnalysisResponse> {
    try {
      console.log(`Analyzing ${frames.length} video frames to generate description`);
      
      // Format frames for API
      const encoded_images = frames.map(frame => frame);
      
      // For security in client-side applications, this should typically be done on a server
      // This implementation is for demonstration purposes only
      // Users will need to provide their own API key in a real implementation
      const apiKey = prompt("Please enter your Qwen API key to analyze the video:", "");
      
      if (!apiKey) {
        return {
          description: "API key not provided. Unable to analyze video."
        };
      }
      
      try {
        const response = await fetch("https://dashscope-intl.aliyuncs.com/compatible-mode/v1/chat/completions", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: "qwen-vl-plus",
            messages: [{
              role: "user",
              content: [
                {type: "text", text: "Given these video frames in order, describe the video descriptively."},
                ...encoded_images.map(frame => ({
                  type: "image_url",
                  image_url: {url: frame}
                }))
              ]
            }]
          })
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          console.error("API Error:", errorData);
          throw new Error(`Failed to analyze video frames: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("API Response:", data);
        
        return {
          description: data.choices[0].message.content || "No description was generated."
        };
      } catch (error) {
        console.error('Error calling Qwen VL API:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error analyzing video:', error);
      return {
        description: "Error analyzing video content: " + (error instanceof Error ? error.message : String(error))
      };
    }
  }
  
  /**
   * Start a video generation task with WAN AI and return the task ID
   * NOTE: This now has CORS protection enabled and will return a mock response
   * @param prompt The prompt to use for video generation
   * @param extractedText Text extracted from the original video
   * @returns Task ID for checking status
   */
  static async startWanAiVideoGeneration(prompt: string, extractedText: string): Promise<string> {
    console.log('Starting WAN AI video generation (CORS-safe mock):', { prompt, extractedText });
      
    try {
      // Display CORS information
      toast.info("WAN AI API requires server-side proxy to handle CORS. Using mock implementation for demo.");
      
      // Create a combined prompt using the extracted text
      const enhancedPrompt = extractedText ? 
        `${prompt} - Based on this context: ${extractedText}` : 
        prompt;
      
      // IMPORTANT: Real API call would look like this, but it fails due to CORS:
      /*
      const response = await fetch(`${WAN_AI_URL}/generate`, {
        method: 'POST',
        headers: {
          'Authorization': `${WAN_AI_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: enhancedPrompt,
          seed: Math.floor(Math.random() * 1000), // Random seed for variety
          neg_prompt: "low quality, blurry, distorted",
          infer_steps: 50,
          cfg_scale: 7.5,
          height: 720,
          width: 1280
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("WAN AI API Error:", response.status, errorText);
        throw new Error(`Failed to start video generation: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      const taskId = data.task_id;
      */
      
      // Instead, we'll create a mock task ID
      const taskId = `mock-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 5)}`;
      console.log("WAN AI Mock Task Created:", taskId);
      
      toast.info("WAN AI video generation started (mock). This would normally take up to 40 minutes in production.");
      return taskId;
    } catch (error) {
      console.error("Error starting WAN AI video generation:", error);
      toast.error("Failed to start WAN AI video generation due to CORS restrictions. Check console for details.");
      
      // Show more detailed error about CORS
      toast.error("Browser security prevents direct API calls to WAN AI. In production, use a server-side proxy.");
      
      throw error;
    }
  }
  
  /**
   * Check the status of a WAN AI video generation task
   * This is now a mocked implementation that simulates progress
   * @param taskId The task ID to check
   * @returns Status object with task status
   */
  static async checkWanAiTaskStatus(taskId: string): Promise<WanAITaskStatus> {
    console.log(`Checking WAN AI task status for mock task: ${taskId}`);
    
    try {
      // For mock implementation, we'll simulate progress based on time
      // Real implementation would call the WAN AI API
      
      if (taskId.startsWith('mock-')) {
        // Extract timestamp from mock ID to calculate elapsed time
        const mockTimestamp = parseInt(taskId.split('-')[1], 36);
        const elapsedSeconds = (Date.now() - mockTimestamp) / 1000;
        
        // Calculate progress based on elapsed time (faster for demo)
        // In mock mode, we'll complete in ~90 seconds instead of 40 minutes
        const mockTotalTime = 90; // seconds for demo
        const progress = Math.min(Math.floor((elapsedSeconds / mockTotalTime) * 100), 100);
        
        if (progress >= 100) {
          return { status: 'completed', progress: 100 };
        }
        
        return { 
          status: 'processing', 
          progress: progress
        };
      }
      
      // Real implementation would look like this, but fails due to CORS:
      /*
      const statusResponse = await fetch(`${WAN_AI_URL}/tasks/${taskId}/status`, {
        headers: {
          'Authorization': `${WAN_AI_TOKEN}`
        }
      });
      
      if (!statusResponse.ok) {
        const errorText = await statusResponse.text();
        console.error("WAN AI Status Error:", statusResponse.status, errorText);
        throw new Error(`Failed to check task status: ${statusResponse.status} ${statusResponse.statusText}`);
      }
      
      const statusData = await statusResponse.json();
      return { 
        status: statusData.status, 
        progress: statusData.progress || 0, 
        error: statusData.error 
      };
      */
      
      return { status: 'processing', progress: 50 };
    } catch (error) {
      console.error("Error checking WAN AI task status:", error);
      throw error;
    }
  }
  
  /**
   * Download the video from a completed WAN AI task
   * This is now a mocked implementation that returns a stock video
   * @param taskId The task ID for the completed video
   * @returns URL to the downloaded video
   */
  static async downloadWanAiVideo(taskId: string): Promise<string> {
    console.log(`Downloading WAN AI video for mock task: ${taskId}`);
    
    try {
      // For mock implementation, return a stock video
      toast.info("Using stock video for demo. In production, this would download from WAN AI API.");
      
      // Real implementation would look like this, but fails due to CORS:
      /*
      const videoResponse = await fetch(`${WAN_AI_URL}/tasks/${taskId}/video`, {
        headers: {
          'Authorization': `${WAN_AI_TOKEN}`
        }
      });
      
      if (!videoResponse.ok) {
        const errorText = await videoResponse.text();
        console.error("WAN AI Video Download Error:", videoResponse.status, errorText);
        throw new Error(`Failed to download video: ${videoResponse.status} ${videoResponse.statusText}`);
      }
      
      // Convert the response to a blob and create an object URL
      const videoBlob = await videoResponse.blob();
      const videoUrl = URL.createObjectURL(videoBlob);
      */
      
      // Return a stock video URL
      return '/stock-videos/video1.mp4';
    } catch (error) {
      console.error("Error downloading WAN AI video:", error);
      throw error;
    }
  }
}
