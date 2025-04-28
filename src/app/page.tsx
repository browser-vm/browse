"use client";

import { useState, useEffect, useRef } from 'react';
import { TypeAnimation } from 'react-type-animation';
import { Terminal, Zap, Globe, Shield, Lock, Key } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useProxyService } from '@/lib/ultraviolet-service';

// Command history component
const CommandHistory = ({
  history
}: {
  history: {
    command: string;
    response: string;
  }[];
}) => {
  const historyRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (historyRef.current) {
      historyRef.current.scrollTop = historyRef.current.scrollHeight;
    }
  }, [history]);
  return <div ref={historyRef} className="flex flex-col gap-2 overflow-auto pb-4" style={{
    maxHeight: 'calc(100vh - 280px)'
  }} data-unique-id="38db3d93-3f7f-4e58-995a-ab05a8758190" data-loc="24:9-26:5" data-file-name="app/page.tsx">
      {history.map((item, index) => <div key={index} className="flex flex-col gap-1" data-unique-id="6074604c-7153-43e5-b4b0-ca90930688a7" data-loc="27:36-27:85" data-file-name="app/page.tsx">
          <div className="flex items-center gap-2" data-unique-id="7be65778-770a-400d-bd3a-43a3e79d4655" data-loc="28:10-28:51" data-file-name="app/page.tsx">
            <span className="text-purple-500" data-unique-id="b942dcc8-6a18-412c-97c9-31ab8078d99c" data-loc="29:12-29:46" data-file-name="app/page.tsx">λ</span>
            <span className="text-purple-200" data-unique-id="be1a4fa6-37eb-44de-b1f9-f89f49c8c091" data-loc="30:12-30:46" data-file-name="app/page.tsx">{item.command}</span>
          </div>
          <div className="pl-6 text-gray-300 font-mono text-sm" data-unique-id="9c4e6c5b-3a8b-4aec-9b5e-63d95866ac2b" data-loc="32:10-32:64" data-file-name="app/page.tsx">
            {item.response.split('\n').map((line, i) => <div key={i} data-unique-id="8f3b51cf-e6ee-4cb0-aa32-42dc6016ea6a" data-loc="33:56-33:69" data-file-name="app/page.tsx">{line || <br data-unique-id="223b0a7e-79bc-414e-ad57-7fec2f80fbbd" data-loc="33:78-33:84" data-file-name="app/page.tsx" />}</div>)}
          </div>
        </div>)}
    </div>;
};
export default function HomePage() {
  const [inputValue, setInputValue] = useState('');
  const [history, setHistory] = useState<{
    command: string;
    response: string;
  }[]>([]);
  const [url, setUrl] = useState('');
  const [isBrowsing, setIsBrowsing] = useState(false);
  const [greeting, setGreeting] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    securityLevel,
    setSecurityLevel
  } = useProxyService();

  // Set up initial greeting
  useEffect(() => {
    setTimeout(() => {
      setGreeting(false);
      setHistory([{
        command: 'help',
        response: 'Available commands:\n\n- browse [url] : Navigate to any website\n- about : Learn about this service\n- clear : Clear terminal history\n- help : Show this help message'
      }]);
    }, 7500);
  }, []);

  // Terminal click focuses the input
  const handleTerminalClick = () => {
    inputRef.current?.focus();
  };

  // Process command
  const handleCommand = (cmd: string) => {
    if (!cmd.trim()) return;
    const command = cmd.trim().toLowerCase();
    let response = '';
    if (command === 'clear') {
      setHistory([]);
      return;
    } else if (command === 'help') {
      response = 'Available commands:\n\n- browse [url] : Navigate to any website\n- about : Learn about this service\n- security [one-time|standard] : Set security level\n- clear : Clear terminal history\n- help : Show this help message';
    } else if (command === 'about') {
      response = 'Ultraviolet Web Proxy\n\nAn advanced web unblocker using the Ultraviolet proxy system. This service allows you to bypass internet restrictions and access blocked websites through a secure proxy connection.\n\nThis is a modern implementation of the Ultraviolet proxy with enhanced security features including one-time use URLs and comprehensive URL rewriting for seamless browsing.';
    } else if (command.startsWith('security')) {
      const securityOption = command.split(' ')[1]?.trim();
      if (securityOption === 'one-time') {
        setSecurityLevel('one-time');
        response = 'Security level set to ONE-TIME. Each proxy URL will expire after a single use for maximum security.';
      } else if (securityOption === 'standard') {
        setSecurityLevel('standard');
        response = 'Security level set to STANDARD. Proxy URLs will use basic encoding without one-time restrictions.';
      } else {
        response = `Current security level: ${securityLevel.toUpperCase()}\n\nAvailable options:\n- security one-time : Each URL can only be accessed once\n- security standard : URLs use basic encoding`;
      }
    } else if (command.startsWith('browse ')) {
      let inputUrl = command.substring(7).trim();
      if (!inputUrl.startsWith('http://') && !inputUrl.startsWith('https://')) {
        inputUrl = 'https://' + inputUrl;
      }
      setUrl(inputUrl);
      response = `Navigating to ${inputUrl}...`;

      // After a brief delay, switch to browsing mode
      setTimeout(() => setIsBrowsing(true), 1500);
    } else {
      response = `Command not recognized: "${command}"\nType "help" for available commands.`;
    }
    setHistory(prev => [...prev, {
      command: cmd,
      response
    }]);
    setInputValue('');
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleCommand(inputValue);
  };
  if (isBrowsing) {
    return <div className="flex flex-col h-screen w-full" data-unique-id="54a592f1-ccf9-403d-82f2-8eabb471f096" data-loc="118:11-118:58" data-file-name="app/page.tsx">
        <div className="bg-gray-900 p-2 flex items-center justify-between shadow-md" data-unique-id="784ce00f-b2af-47e2-9d73-6175146a1b53" data-loc="119:8-119:85" data-file-name="app/page.tsx">
          <div className="flex items-center gap-2" data-unique-id="a670a5aa-0f83-4adf-b522-45d02fcebc98" data-loc="120:10-120:51" data-file-name="app/page.tsx">
            <Globe className="text-white h-4 w-4" />
            <span className="text-white font-mono text-sm opacity-80" data-unique-id="a943ba46-9c9b-4cfc-9eb7-e1ca0a926557" data-loc="122:12-122:70" data-file-name="app/page.tsx">Browsing: {url}</span>
          </div>
          <button onClick={() => setIsBrowsing(false)} className="bg-gray-800 hover:bg-gray-700 text-white px-2 py-1 rounded font-mono text-xs" data-unique-id="5a0653a3-a97a-46bb-8021-cc58df0f1255" data-loc="124:10-124:144" data-file-name="app/page.tsx">
            Exit
          </button>
        </div>
        <iframe src={`/service/${btoa(url)}`} className="flex-grow w-full border-none" title="Proxied Content" sandbox="allow-forms allow-modals allow-orientation-lock allow-pointer-lock allow-popups allow-popups-to-escape-sandbox allow-presentation allow-same-origin allow-scripts" data-unique-id="310434c9-bbd6-4cf2-9092-5d4853e9fc0b" data-loc="128:8-128:285" data-file-name="app/page.tsx" />
      </div>;
  }
  return <div className="flex flex-col min-h-screen bg-black p-4 sm:p-6 md:p-8 font-mono text-gray-200" onClick={handleTerminalClick} data-unique-id="638b73a1-924d-49e9-ad69-1b6e9e853be3" data-loc="131:9-131:134" data-file-name="app/page.tsx">
      <div className="flex items-center justify-between mb-8" data-unique-id="6faaaebd-1547-4c68-97e3-ff21e86c9796" data-loc="132:6-132:62" data-file-name="app/page.tsx">
        <div className="flex items-center gap-3" data-unique-id="c413557b-eafe-4e5a-9dd7-561187426b52" data-loc="133:8-133:49" data-file-name="app/page.tsx">
          <Terminal className="text-purple-500 h-8 w-8" />
          <h1 className="text-2xl font-bold text-purple-400" data-unique-id="55ef6309-e9b1-4ff6-82d3-940894556c30" data-loc="135:10-135:61" data-file-name="app/page.tsx">UltraViolet Terminal</h1>
        </div>
        <div className="flex items-center gap-2" data-unique-id="e7e25f4e-38b0-48f0-a8a4-dada62713098" data-loc="137:8-137:49" data-file-name="app/page.tsx">
          <span className={cn("text-xs text-purple-300 bg-purple-900/50 px-2 py-1 rounded-full flex items-center gap-1", securityLevel === 'one-time' && "bg-purple-800/70 text-purple-100")} title="One-time URLs expire after a single use" data-unique-id="83070a05-b9b8-49f1-9bc6-5a6f1e22500b" data-loc="138:10-138:238" data-file-name="app/page.tsx">
            <Key size={12} className={cn("text-purple-400", securityLevel === 'one-time' && "text-purple-200")} />
            {securityLevel === 'one-time' ? 'One-Time URLs' : 'Standard Security'}
          </span>
          <span className="text-xs text-purple-300 bg-purple-900/50 px-2 py-1 rounded-full flex items-center gap-1" data-unique-id="42a3ddc5-5b52-4e45-88c1-c02bc53ff9c6" data-loc="142:10-142:116" data-file-name="app/page.tsx">
            <Shield size={12} className="text-purple-400" />
            Secure
          </span>
          <span className="text-xs text-purple-300 bg-purple-900/50 px-2 py-1 rounded-full flex items-center gap-1" data-unique-id="f9f23768-0488-4b38-a335-112d0b134648" data-loc="146:10-146:116" data-file-name="app/page.tsx">
            <Zap size={12} className="text-purple-400" />
            Fast
          </span>
          <span className="text-xs text-purple-300 bg-purple-900/50 px-2 py-1 rounded-full flex items-center gap-1" data-unique-id="9c5640aa-7007-4969-93ce-5d45bbb07c9e" data-loc="150:10-150:116" data-file-name="app/page.tsx">
            <Lock size={12} className="text-purple-400" />
            Private
          </span>
        </div>
      </div>
      
      <div className="flex-grow bg-gray-900/80 rounded-lg p-4 border border-purple-800/50 overflow-hidden shadow-lg flex flex-col" data-unique-id="f341f2fe-6428-4d6f-b043-505f91af7e2e" data-loc="157:6-157:131" data-file-name="app/page.tsx">
        {/* Terminal header */}
        <div className="flex items-center gap-2 pb-3 border-b border-purple-900/50" data-unique-id="e8e39374-304e-40db-8bc3-ce2c6674af42" data-loc="159:8-159:84" data-file-name="app/page.tsx">
          <div className="h-3 w-3 rounded-full bg-red-500" data-unique-id="9d681710-44aa-4192-9a0a-43a9ff2d852d" data-loc="160:10-160:59" data-file-name="app/page.tsx"></div>
          <div className="h-3 w-3 rounded-full bg-yellow-500" data-unique-id="b771e0de-ed91-4dfb-87d9-ca6dfcf128ba" data-loc="161:10-161:62" data-file-name="app/page.tsx"></div>
          <div className="h-3 w-3 rounded-full bg-green-500" data-unique-id="f1e34472-8f0e-4ed7-b54f-01def55dde43" data-loc="162:10-162:61" data-file-name="app/page.tsx"></div>
          <span className="ml-2 text-sm text-gray-400" data-unique-id="8f39a8d9-2f37-49bd-8a45-bd144c399a16" data-loc="163:10-163:55" data-file-name="app/page.tsx">ultraviolet-proxy ~ terminal</span>
        </div>
        
        {/* Terminal content */}
        <div className="flex-grow pt-4 pb-2" data-unique-id="4812a9fe-7b54-4f64-9645-4d984241a325" data-loc="167:8-167:45" data-file-name="app/page.tsx">
          {greeting ? <div className="flex flex-col gap-2" data-unique-id="91c3e9bb-60a9-4984-9e28-8805668f9a0f" data-loc="168:22-168:59" data-file-name="app/page.tsx">
              <TypeAnimation sequence={['Welcome to Ultraviolet Web Proxy', 1000, 'Initializing secure connection...', 1000, 'Loading proxy configuration...', 1000, 'System ready. Type "help" for available commands.', 1000]} wrapper="div" cursor={true} repeat={0} style={{
            fontSize: '1em',
            color: '#d8b4fe'
          }} />
            </div> : <CommandHistory history={history} />}
        </div>
        
        {/* Command input */}
        <form onSubmit={handleSubmit} className="flex items-center gap-2 pt-3 border-t border-purple-900/50" data-unique-id="194741a8-957d-4393-8ce6-f52262133188" data-loc="177:8-177:109" data-file-name="app/page.tsx">
          <span className="text-purple-500" data-unique-id="1d997f00-bdc6-4b89-8741-5b8261f173cd" data-loc="178:10-178:44" data-file-name="app/page.tsx">λ</span>
          <input ref={inputRef} type="text" value={inputValue} onChange={e => setInputValue(e.target.value)} className={cn("flex-grow bg-transparent border-none outline-none text-gray-200", "focus:ring-0 focus:outline-none placeholder-gray-500")} placeholder="Type a command..." autoFocus data-unique-id="b5ab6354-8a33-4fd7-b584-85f388ef27f7" data-loc="179:10-179:291" data-file-name="app/page.tsx" />
        </form>
      </div>
      
      <footer className="mt-6 text-center text-sm text-gray-500" data-unique-id="3cffcd5f-89e3-4048-8d47-8a88274424bc" data-loc="183:6-183:65" data-file-name="app/page.tsx">
        <p data-unique-id="c81a8abc-67b0-4b2a-a064-9a085133cb17" data-loc="184:8-184:11" data-file-name="app/page.tsx">Ultraviolet Web Proxy Terminal • Secure & Private Browsing</p>
        <p className="mt-1 text-xs" data-unique-id="9febee77-0dce-46c4-abc2-030f544f4a96" data-loc="185:8-185:36" data-file-name="app/page.tsx">This service is for educational purposes only</p>
      </footer>
    </div>;
}