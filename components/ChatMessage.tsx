'use client';

import { Message } from '../app/types/chat';
import { formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GraduationCap, Volume2 } from "lucide-react";
import { cn } from "@/app/lib/utils/utils";
import { processMarkdownForDisplay } from '@/app/lib/utils/markdown';
import { useEffect, useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// Define API key with fallback
const ELEVENLABS_API_KEY = process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY || "sk_4b825d14dac76106384e339406ebdd92277bf44ae92b9520";

// Voice configuration - Cassidy with Eleven Multilingual v2
const VOICE_CONFIG = {
  voiceId: "56AoDkrOh6qfVPDXZ7Pt", // Cassidy
  modelId: "eleven_multilingual_v2", // Eleven Multilingual v2
  settings: {
    stability: 0.5,           // Medium stability
    similarity_boost: 0.75,   // High similarity
    style: 0.0,               // No style exaggeration
    speed: 0.8,               // Moderate speed
    use_speaker_boost: true   // Speaker boost enabled
  }
};

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const formattedTime = formatDistanceToNow(new Date(message.timestamp), { addSuffix: true });
  const [formattedContent, setFormattedContent] = useState<string>(message.content);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Process markdown when message changes
  useEffect(() => {
    if (!isUser && message.content) {
      setFormattedContent(processMarkdownForDisplay(message.content));
    } else {
      setFormattedContent(message.content);
    }
  }, [message.content, isUser]);

  // Initialize audio element
  useEffect(() => {
    if (typeof window !== "undefined") {
      audioRef.current = new Audio();
      audioRef.current.onended = () => setIsPlaying(false);
      
      return () => {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.src = "";
        }
      };
    }
  }, []);

  // Function to play text-to-speech
  const handlePlayVoice = async () => {
    // Toggle play/pause if already playing
    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }

    try {
      setIsPlaying(true);
      
      // Prepare text content (strip HTML and limit length)
      const cleanText = message.content.replace(/<[^>]*>?/gm, '');
      const truncatedText = cleanText.substring(0, 1000); // API limit
      
      // API call to Eleven Labs
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_CONFIG.voiceId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": ELEVENLABS_API_KEY,
        },
        body: JSON.stringify({
          text: truncatedText,
          model_id: VOICE_CONFIG.modelId,
          voice_settings: VOICE_CONFIG.settings
        }),
      });
      
      // Handle API errors
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Eleven Labs API Error:", {
          status: response.status,
          statusText: response.statusText,
          data: errorData
        });
        throw new Error(`Failed to convert text to speech: ${response.status} ${response.statusText}`);
      }
      
      // Create and play audio
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.play();
      }
    } catch (error) {
      console.error("Error playing voice:", error);
      toast.error(`Failed to play voice: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setIsPlaying(false);
    }
  };

  return (
    <div className={cn("flex w-full", isUser ? "justify-end" : "justify-start")}>
      {/* AI Avatar (shown only for non-user messages) */}
      {!isUser && (
        <Avatar className="h-8 w-8 mr-3 mt-1 flex-shrink-0">
          <AvatarImage src="/avatars/counselor.png" alt="7Edu Counselor" />
          <AvatarFallback className="bg-green-100 text-green-700">
            <GraduationCap className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      )}
      
      {/* Message Content */}
      <div
        className={cn(
          "max-w-[85%] rounded-xl relative",
          isUser ? "bg-green-600 text-white" : "bg-gray-50 text-gray-800 border border-gray-100"
        )}
      >
        {/* Message Text */}
        <div className={cn("px-4 py-3 text-sm", isUser ? "whitespace-pre-wrap" : "")}>
          {isUser ? (
            message.content
          ) : (
            <div dangerouslySetInnerHTML={{ __html: formattedContent }} />
          )}
        </div>
        
        {/* Message Footer with Timestamp and Controls */}
        <div className={cn(
          "text-xs px-4 pb-2 flex items-center justify-between",
          isUser ? "text-green-200" : "text-gray-500"
        )}>
          <span>{formattedTime}</span>
          
          {/* Voice Button (shown only for non-user messages) */}
          {!isUser && (
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-6 w-6 rounded-full p-1",
                  isPlaying ? "text-green-600" : "text-gray-500 hover:text-gray-700"
                )}
                onClick={handlePlayVoice}
                title={isPlaying ? "Stop" : "Play"}
              >
                <Volume2 className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
      </div>
      
      {/* User Avatar (shown only for user messages) */}
      {isUser && (
        <Avatar className="h-8 w-8 ml-3 mt-1 bg-green-600 flex-shrink-0">
          <AvatarFallback className="text-white text-sm font-medium">
            U
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
} 