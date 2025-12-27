"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface AvatarSelectorProps {
  value?: string;
  onChange: (avatar: string) => void;
  error?: string;
}

// Predefined avatars - using placeholder images or emoji-based avatars
const PREDEFINED_AVATARS = [
  { id: "avatar-1", url: "https://api.dicebear.com/7.x/avataaars/svg?seed=avatar1", label: "Operator 1" },
  { id: "avatar-2", url: "https://api.dicebear.com/7.x/avataaars/svg?seed=avatar2", label: "Operator 2" },
  { id: "avatar-3", url: "https://api.dicebear.com/7.x/avataaars/svg?seed=avatar3", label: "Operator 3" },
  { id: "avatar-4", url: "https://api.dicebear.com/7.x/avataaars/svg?seed=avatar4", label: "Operator 4" },
  { id: "avatar-5", url: "https://api.dicebear.com/7.x/avataaars/svg?seed=avatar5", label: "Operator 5" },
  { id: "avatar-6", url: "https://api.dicebear.com/7.x/avataaars/svg?seed=avatar6", label: "Operator 6" },
  { id: "avatar-7", url: "https://api.dicebear.com/7.x/avataaars/svg?seed=avatar7", label: "Operator 7" },
  { id: "avatar-8", url: "https://api.dicebear.com/7.x/avataaars/svg?seed=avatar8", label: "Operator 8" },
  { id: "avatar-9", url: "https://api.dicebear.com/7.x/avataaars/svg?seed=avatar9", label: "Operator 9" },
  { id: "avatar-10", url: "https://api.dicebear.com/7.x/avataaars/svg?seed=avatar10", label: "Operator 10" },
  { id: "avatar-11", url: "https://api.dicebear.com/7.x/avataaars/svg?seed=avatar11", label: "Operator 11" },
  { id: "avatar-12", url: "https://api.dicebear.com/7.x/avataaars/svg?seed=avatar12", label: "Operator 12" },
];

export function AvatarSelector({ value, onChange, error }: AvatarSelectorProps) {
  const [preview, setPreview] = useState<string | null>(value || null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarSelect = (avatarUrl: string) => {
    setPreview(avatarUrl);
    onChange(avatarUrl);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      // Error handling - could show toast
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      // Error handling - could show toast
      return;
    }

    setIsUploading(true);

    try {
      // Convert to base64 for preview and storage
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setPreview(base64String);
        onChange(base64String);
        setIsUploading(false);
      };
      reader.onerror = () => {
        setIsUploading(false);
        // Error handling
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("File upload error:", error);
      setIsUploading(false);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      {/* Selected Avatar Preview */}
      {preview && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center justify-center"
        >
          <div className="relative">
            <div className="w-32 h-32 rounded-full border-2 border-primary overflow-hidden bg-[#1a1a1a] flex items-center justify-center" style={{ boxShadow: "0 0 20px rgba(255, 0, 128, 0.3)" }}>
              {preview.startsWith("data:") ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={preview}
                  alt="Selected avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <Image
                  src={preview}
                  alt="Selected avatar"
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            {/* Corner decorations */}
            <div className="absolute -top-1 -left-1 w-3 h-3 border-l-2 border-t-2 border-primary"></div>
            <div className="absolute -top-1 -right-1 w-3 h-3 border-r-2 border-t-2 border-primary"></div>
            <div className="absolute -bottom-1 -left-1 w-3 h-3 border-l-2 border-b-2 border-primary"></div>
            <div className="absolute -bottom-1 -right-1 w-3 h-3 border-r-2 border-b-2 border-primary"></div>
          </div>
        </motion.div>
      )}

      {/* Upload Button */}
      <div className="flex justify-center">
        <button
          type="button"
          onClick={handleUploadClick}
          disabled={isUploading}
          className="px-6 py-3 border border-primary/50 text-primary font-mono text-xs uppercase tracking-wider hover:border-primary hover:bg-primary/10 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed relative"
        >
          {isUploading ? "UPLOADING..." : "UPLOAD CUSTOM AVATAR"}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>

      {/* Predefined Avatars Grid */}
      <div>
        <label className="block text-primary text-xs font-mono font-bold uppercase tracking-wider mb-4">
          SELECT OPERATOR AVATAR
        </label>
        <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-4 gap-3">
          {PREDEFINED_AVATARS.map((avatar) => (
            <motion.button
              key={avatar.id}
              type="button"
              onClick={() => handleAvatarSelect(avatar.url)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={`relative w-full aspect-square rounded-sm border-2 overflow-hidden transition-all ${
                preview === avatar.url
                  ? "border-primary bg-primary/20 shadow-[0_0_15px_rgba(255,0,128,0.5)]"
                  : "border-gray-700 hover:border-primary/50 bg-[#1a1a1a]"
              }`}
            >
              <Image
                src={avatar.url}
                alt={avatar.label}
                width={100}
                height={100}
                className="w-full h-full object-cover"
              />
              {preview === avatar.url && (
                <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Error Message */}
      <div className="min-h-[20px]">
        {error && (
          <p
            className="text-red-400 text-xs font-mono uppercase tracking-wider animate-pulse"
            style={{
              textShadow:
                "0 0 8px rgba(248, 113, 113, 0.8), 0 0 16px rgba(248, 113, 113, 0.4)",
            }}
          >
            ⚠ {error}
          </p>
        )}
      </div>
    </div>
  );
}

