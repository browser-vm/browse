"use client";

import React, { useRef, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Terminal as TerminalIcon, X, Minus, Square } from 'lucide-react';
interface TerminalProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  onClose?: () => void;
  minimizable?: boolean;
  maximizable?: boolean;
}
export function Terminal({
  title = 'terminal',
  children,
  className,
  onClose,
  minimizable = true,
  maximizable = true
}: TerminalProps) {
  const terminalRef = useRef<HTMLDivElement>(null);
  const [isMaximized, setIsMaximized] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  // Handle maximize toggle
  const handleMaximize = () => {
    setIsMaximized(!isMaximized);
    if (isMinimized) setIsMinimized(false);
  };

  // Handle minimize toggle
  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
    if (isMaximized) setIsMaximized(false);
  };

  // Handle close
  const handleClose = () => {
    if (onClose) onClose();
  };

  // Apply maximize styling
  useEffect(() => {
    if (!terminalRef.current) return;
    if (isMaximized) {
      terminalRef.current.style.position = 'fixed';
      terminalRef.current.style.top = '0';
      terminalRef.current.style.left = '0';
      terminalRef.current.style.width = '100%';
      terminalRef.current.style.height = '100%';
      terminalRef.current.style.borderRadius = '0';
      terminalRef.current.style.zIndex = '50';
    } else {
      terminalRef.current.style.position = '';
      terminalRef.current.style.top = '';
      terminalRef.current.style.left = '';
      terminalRef.current.style.width = '';
      terminalRef.current.style.height = '';
      terminalRef.current.style.borderRadius = '';
      terminalRef.current.style.zIndex = '';
    }
  }, [isMaximized]);
  return <div ref={terminalRef} className={cn('bg-gray-900 border border-purple-800/50 rounded-lg shadow-lg overflow-hidden flex flex-col', isMinimized && 'h-12 overflow-hidden', className)} data-unique-id="ec46f4d4-fe42-4ffa-83a5-0b11e8e12427" data-loc="64:9-64:191" data-file-name="components/terminal.tsx">
      {/* Terminal header */}
      <div className="flex items-center gap-2 p-2 bg-gray-950 border-b border-purple-900/50" data-unique-id="621eed2f-7775-4938-8281-297072e1f9e4" data-loc="66:6-66:93" data-file-name="components/terminal.tsx">
        <div className="flex items-center gap-2" data-unique-id="7dc42ddf-f7d3-4615-ad08-59b063eaa0d9" data-loc="67:8-67:49" data-file-name="components/terminal.tsx">
          <div className="h-3 w-3 rounded-full bg-red-500 cursor-pointer hover:bg-red-400" onClick={handleClose} data-unique-id="1b63e9de-e8a8-4450-9418-e7b3c7cb6c15" data-loc="68:10-68:113" data-file-name="components/terminal.tsx"></div>
          {minimizable && <div className="h-3 w-3 rounded-full bg-yellow-500 cursor-pointer hover:bg-yellow-400" onClick={handleMinimize} data-unique-id="6760c576-5946-48b4-a4a6-78f5386efa0c" data-loc="69:26-69:138" data-file-name="components/terminal.tsx"></div>}
          {maximizable && <div className="h-3 w-3 rounded-full bg-green-500 cursor-pointer hover:bg-green-400" onClick={handleMaximize} data-unique-id="45df7495-61d8-472b-8bf7-d208a817d74f" data-loc="70:26-70:136" data-file-name="components/terminal.tsx"></div>}
        </div>
        <div className="flex-grow flex items-center justify-center" data-unique-id="775e879a-d678-44ee-9944-43ca6fae5f1d" data-loc="72:8-72:68" data-file-name="components/terminal.tsx">
          <div className="flex items-center gap-2 text-gray-400 text-sm" data-unique-id="4938f579-5bad-43eb-ab0a-21298d11ef8a" data-loc="73:10-73:73" data-file-name="components/terminal.tsx">
            <TerminalIcon size={14} className="text-purple-500" />
            <span data-unique-id="830207eb-2a90-4819-bb5e-75a41d43c2f7" data-loc="75:12-75:18" data-file-name="components/terminal.tsx">ultraviolet ~ {title}</span>
          </div>
        </div>
        <div className="flex items-center gap-2" data-unique-id="875b1fef-b957-460e-801a-fc7fb47dbc24" data-loc="78:8-78:49" data-file-name="components/terminal.tsx">
          {minimizable && <Minus size={14} className="text-gray-400 hover:text-white cursor-pointer" onClick={handleMinimize} />}
          {maximizable && <Square size={14} className="text-gray-400 hover:text-white cursor-pointer" onClick={handleMaximize} />}
          {onClose && <X size={14} className="text-gray-400 hover:text-white cursor-pointer" onClick={handleClose} />}
        </div>
      </div>
      
      {/* Terminal content */}
      <div className={cn("flex-1 p-4 font-mono text-gray-200 overflow-auto", isMinimized && 'hidden')} data-unique-id="cf270ec4-e0e1-4480-8651-a7bb77bae592" data-loc="86:6-86:103" data-file-name="components/terminal.tsx">
        {children}
      </div>
    </div>;
}