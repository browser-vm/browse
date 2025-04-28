"use client";

import React from 'react';
import { cn } from '@/lib/utils';
interface LoadingAnimationProps {
  className?: string;
}
export function LoadingAnimation({
  className
}: LoadingAnimationProps) {
  return <div className={cn("flex justify-center items-center", className)} data-unique-id="3dfb7e72-cd42-4ae7-892b-52d0d63f296e" data-loc="11:9-11:76" data-file-name="components/loading-animation.tsx">
      <div className="relative h-12 w-12" data-unique-id="f96c3b64-a0b9-4c59-bc41-34fe10c974cb" data-loc="12:6-12:42" data-file-name="components/loading-animation.tsx">
        <div className="absolute top-0 left-0 right-0 bottom-0 border-4 border-purple-300/20 rounded-full" data-unique-id="5b8b5710-92e1-4d96-9f8f-b13f26f6ad86" data-loc="13:8-13:107" data-file-name="components/loading-animation.tsx"></div>
        <div className="absolute top-0 left-0 right-0 bottom-0 border-4 border-transparent border-t-purple-500 rounded-full animate-spin" data-unique-id="6e01aa72-d26f-4858-a97c-921d08927ed8" data-loc="14:8-14:138" data-file-name="components/loading-animation.tsx"></div>
      </div>
    </div>;
}
interface TextLoadingProps {
  text?: string;
  className?: string;
}
export function TextLoading({
  text = "Loading",
  className
}: TextLoadingProps) {
  return <div className={cn("flex items-center gap-2", className)} data-unique-id="73e57be8-bab1-4f07-a72f-92547de1fb4b" data-loc="26:9-26:67" data-file-name="components/loading-animation.tsx">
      <span className="text-purple-300" data-unique-id="7424bf6f-190d-4113-bf5e-a0bd722d6094" data-loc="27:6-27:40" data-file-name="components/loading-animation.tsx">{text}</span>
      <span className="inline-flex" data-unique-id="c9daa596-5299-4664-bac6-f6c2fb415075" data-loc="28:6-28:36" data-file-name="components/loading-animation.tsx">
        <span className="animate-pulse delay-0" data-unique-id="ef5fb985-9b0c-41e1-a5bf-793b0908a016" data-loc="29:8-29:48" data-file-name="components/loading-animation.tsx">.</span>
        <span className="animate-pulse delay-150" data-unique-id="0f4d9168-c2ad-401f-a1da-1181e1d75b1b" data-loc="30:8-30:50" data-file-name="components/loading-animation.tsx">.</span>
        <span className="animate-pulse delay-300" data-unique-id="481f45ad-1a38-4a00-93dd-23b401547338" data-loc="31:8-31:50" data-file-name="components/loading-animation.tsx">.</span>
      </span>
    </div>;
}