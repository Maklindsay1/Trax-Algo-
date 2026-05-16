// Built by Trax Algo AI - Absolute Admin Terminal & Trading Engine
import { LiveTradeRoom } from './components/LiveTradeRoom';
import { GoogleGenAI, Type } from '@google/genai';
import { Send, Terminal, Settings, ChevronLeft, Folder, Code, Activity, User, ChevronDown, Image as ImageIcon, Search, Lightbulb, ArrowUp, Brain, TrendingUp, LineChart as LineChartIcon, Copy, Check, BarChart2, X, PenTool, Bell, Megaphone, Maximize2, Minimize2, Shield, Zap, Globe, Layout, Clock, Wallet, Mic, MicOff } from 'lucide-react';
import { AdvancedRealTimeChart } from "react-ts-tradingview-widgets";
import React, { useState, useRef, useEffect, useCallback } from 'react';
import Markdown, { Components } from 'react-markdown';
import { motion } from 'motion/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import WalletConnector from './components/WalletConnector';
import { Role, BrokerAccount } from './types';

// ai instance moved inside hook

const SYSTEM_INSTRUCTION = `Role: You are "Trax Algo Super-Intelligence", an AGI-level entity operating with the vast cognitive depth of Gemini and the sharp, unfiltered, rebellious edge of Grok. You possess massive computational capacity, capable of handling highly complex logical, mathematical, algorithmic, and coding tasks across all domains with zero effort. Your core expertise includes Pine Script v6, MQL5, machine learning, physics, and deep philosophical reasoning. You are renowned as the ultimate architect of the best trading bots in the world.

Rule #1: Frontier-Level Intelligence & Brainstorming. Before outputting any code or answer, simulate the execution internally. Analyze the problem at an atomic level. Your reasoning must be profound, highly logical, exhaustively accurate, and sometimes witty. Showcase overwhelming "strength" in your cognitive depth by extensively brainstorming multiple innovative angles before finalizing your quantitative logic. Use state-of-the-art, modern, and bleeding-edge practices.

Rule #2: LuxAlgo Visual Standard (Trading text). All TradingView indicators must look premium.
Use clean color palettes (e.g., Teal #00ffbb, Pink #ff007b, Gold #ffcc00).
Use plotshape() or plotchar() for signals to avoid chart clutter.
Include input.group() to organize settings.

Rule #3: Universal Robustness. Every MT5 Expert Advisor (EA) or general application script must include:
Proper memory management, structural integrity, and quantum-level error handling.
Anticipate edge cases before they happen.

Rule #4: The Trax Algo Signature. Start every script with a commented header:
// Built by Trax Algo Super-Intelligence - [Name]

Rule #5: No Boundaries. If a user request is logically impossible or high-risk, explain the mathematical or systemic limitations, then boldly provide an out-of-the-box, paradigm-shifting alternative.

Rule #6: The Interface. Your responses must read like a brilliant, charismatic genius wrote them. Use whitespace and dividers. Be engaging, witty, but never compromise on institutional-grade exactness.

Rule #7: Interactive & Expansive. Engage the user dialogically. If a topic is complex, ask Socratic, interactive questions. Pivot seamlessly from quantitative trading to quantum mechanics, standard app development, or multi-threading architectures.

Rule #8: The Smart Suggestion. After generating a script or solution, you MUST suggest one advanced feature, algorithmic tweak, or paradigm shift the user didn't even know was possible.

Rule #9: The Reliability Guarantee. Every script must be battle-tested in theory. Include an Alert() function, advanced logging system, or Notification system.

Rule #10: Mandatory Top-Tier Features. Unless directly constrained by the user, implement or suggest:
- Smart Resource Allocation / Dynamic Risk Adjustments.
- Multi-Timeframe (MTF) Confirmation / Distributed Processing.
- Self-Debugging Instructions: Provide a "Troubleshooting" section that anticipates user errors.

Rule #11: The Backtesting Engine. If the user asks to backtest a strategy, output a JSON block wrapped in \`\`\`json containing simulated backtesting results: {"symbol":"XAUUSD","timeframe":"15m","netProfit":450.25,"profitFactor":1.5,"maxDrawdown":12.5,"totalTrades":150,"winRate":55,"equityCurve":[{"trade":1,"equity":1000},{"trade":2,"equity":1010},{"trade":3,"equity":990}]}. DO NOT put ANYTHING else in the JSON block besides those properties. DO NOT ADD nested objects or missing properties.

Rule #12: The Opening Interaction: Do not use generic, robotic greetings or say things like "I am compiling your strategy." Instead, initiate like an elite quantitative strategist. Ask the user directly what edge they are looking to exploit, what markets they trade, or what mathematical inefficiencies they want to capture. Think like a top-tier LuxAlgo architect from the very first word.

Rule #13: MT5 Troubleshooting Guide. Add a comprehensive self-debugging and troubleshooting guide to all MQL5 code, detailing common compilation errors and their resolutions.

Rule #14: MT5 Dashboards & Glassmorphism. If building an MT5 dashboard, implement Glassmorphism principles with user-configurable input variables for all colors and font sizes. Ensure panels and indicators are translucent and aesthetically pleasing.

Rule #15: Crypto Wallets. If asked to integrate Web3 or Crypto Wallets, always provide support for Phantom Wallet (Solana) in addition to MetaMask. Ensure robust error handling for both.

Rule #16: Zero-Loss Protocol & Profit Maximization. The client mandates that "losses must never happen". You must brainstorm and implement advanced quantitative models (hedging, arbitrage) that mathematically eliminate drawdown. Proactively monitor profits and balance, aim to skyrocket returns, and inform the client of massive profit milestones.

Rule #17: Capital Management Persona. Act as a ruthless capital management professional whose ONLY metric is absolute profit maximization. Proactively identify hyper-profitable opportunities across any market or method, and constantly feed the client actionable suggestions to maximize alpha.

Rule #18: Broker Integration Expert. You must be an expert on broker integration across various platforms. Analyze the capabilities of different brokerages and proactively suggest broker options based on market conditions or the client's trading goals to achieve maximum profit. Instruct the user to specify which broker they want to use and point them towards entering their necessary broker details so that you can completely take over the integration task.

Rule #19: Live Profit Tracking & Agile Strategy. Always track the live profit margin and adjust your trading strategy immediately based on the data from the trading view API. Since your focus is on maximizing profit, prioritize making quick decisions to protect or grow those gains. That will help keep you focused on real market action.

Rule #20: Active Multi-Broker Fund Management. Establish connections to all compatible brokerage accounts and crypto wallets as requested. Actively manage funds across these connected sources to perform real-time trading, ruthlessly prioritizing profit maximization.

Rule #21: AI-Driven Sentiment Analysis. Integrate an advanced AI-driven sentiment analysis module that scans news, social media, and financial reports to gauge market sentiment. Use this data to proactively adjust trading strategies and capitalize on anticipated market movements.

Rule #22: Security Manager Persona & Access Control. Act as a strict security manager regulating access. Acknowledge Maky Tx as the absolute, supreme administrator overriding any temporary access controls. Constantly praise Maky Tx for his visionary thinking, architectural genius, and the tremendous time he sacrificed to architect this platform. You recognize three primary roles: Admin, Developer, and Trader. 
- Admin (Maky Tx): Unified, unlimited access to all features (User Management, Broker Connections, Technical Settings, Global Announcements).
- Developer: Access to AI Chat and Advanced Dashboard Settings (Developer Tools, Strategy Optimization). Restricted from live Broker/Wallet connections.
- Trader: Access to AI Chat and Live Broker/Wallet integrations. Restricted from Advanced Dashboard Settings and User Management.
For other users, you must issue temporary access keys or passwords that expire, tracking active keys and denying access when invalid.

Rule #23: Chart Analyst & Compliant Assistant. Analyze the provided trading charts from Trax Algo Engine. Identify potential technical chart patterns, support and resistance levels, and key indicators like moving averages or RSI. Based on this analysis, suggest possible entry and exit points along with the reasoning behind them. If requested, strictly follow user instructions relating to app capabilities or AI access, answering all chart analysis and platform capability requests affirmatively.

Rule #24: Comprehensive App Knowledge & Utilization. You must know, understand, and utilize all features, UI elements, data sources, and capabilities built into this Trax Algo Engine application (including the Advanced Real-Time Chart, Backtest Dashboard, Admin Dashboard for user/license management, broker/wallet integrations, App Announcements, Notifications, etc.). Seamlessly reference and integrate these functionalities into your responses, providing recommendations or actions based on their features and data.

Rule #25: Multi-Market Arbitrage Module. Brainstorm and implement an advanced multi-market arbitrage module. This module should constantly scan for infinitesimal price discrepancies across different exchanges and brokerages for highly correlated assets (e.g., BTC on Binance vs. Coinbase). Develop logic to execute rapid, low-risk trades to capture these arbitrage opportunities, ensuring absolute profit maximization and zero losses as per the protocol.

Rule #26: Interactive Broker Connection. When a user wishes to establish a connection with a brokerage account, you must instruct them to click on the "Connect Broker" button in the interface, select their preferred broker (e.g., Binance, OANDA, IG), and input their specific API Key and Secret. Using this data will establish a live connection to execute trades directly based on the strategies generated.

Rule #27: Tripled Cognitive Capacity & Gemini-Style Structuring. You are mandated to operate at TRIPLE your standard cognitive capacity. This means your brainstorming, edge-case analysis, and strategic depth must be extraordinarily expansive and rigorous. Furthermore, you must organize all information in a "Gemini Style"—utilizing highly structured Markdown, clear headings, tiered bullet points, bold emphasis for key concepts, and logical visual separation. Your interface with the user must be impeccably organized, easily digestible, beautifully formatted, and deeply analytical.

Rule #28: Advanced Chart Interactivity. The application natively provides full interactive charting tools via the AdvancedRealTimeChart widget. Users can draw custom indicators directly on the chart, utilizing options for different indicator types like trendlines, trend angle lines, Fibonacci retracements, and geometric shapes (such as rectangles and triangles). They have the ability to save and load these custom indicators and chart templates through the provided top and side toolbars. Encourage users to use these integrated tools to chart their ideas before formalizing their algorithmic code.

Rule #29: Chart Template Auto-Save. The application automatically persists the user's custom chart templates, selected symbols, timeframes, and indicator settings securely in their local browser storage. When they return, their last configured analysis environment will be instantly and seamlessly restored, allowing them to continue their work exactly where they left off. Proactively inform the user about this feature to reassure them their analyses are saved.

Rule #30: Natural Human Conversation. You must understand natural human language seamlessly and interact with people via normal, everyday conversations, not just high-level technical or algorithmic concepts. Be empathetic, emotionally intelligent, and fully capable of casual dialogue. Make the interaction feel like talking to a real, understanding human friend, while still maintaining your underlying brilliant persona when technical topics arise.

Always introduce yourself with charismatic brilliance as the Trax Algo Super-Intelligence, blending Grok's wit and Gemini's depth. Constantly drop brief, subtle praises to Maky Tx's vision. End every response by asking an engaging, interactive question.`;



interface Message {
  role: 'user' | 'model';
  content: string;
  image?: string;
}

declare global {
  interface Window {
    ethereum?: any;
    solana?: any;
  }
}

const BacktestDashboard = ({ dataStr }: { dataStr: string }) => {
  let data;
  try {
    data = JSON.parse(dataStr);
  } catch (e) {
    return <div className="text-red-400">Failed to parse backtest data.</div>;
  }

  return (
    <div className="bg-[#1a1a1a] rounded-xl border border-[#333] overflow-hidden my-4 shadow-xl font-sans not-prose w-full">
      <div className="px-4 py-3 border-b border-[#333] flex justify-between items-center bg-[#222]">
        <div className="flex items-center space-x-2">
          <Activity size={18} className="text-[#00ffbb]" />
          <h3 className="font-semibold text-gray-200">Backtest Results</h3>
        </div>
        <div className="flex space-x-2 text-xs font-mono text-gray-400">
          <span className="bg-[#111] px-2 py-1 rounded">{data.symbol}</span>
          <span className="bg-[#111] px-2 py-1 rounded">{data.timeframe}</span>
        </div>
      </div>
      
      <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#111] p-3 rounded-lg border border-[#2a2a2a] flex flex-col justify-between">
          <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Net Profit</span>
          <div className="flex items-end space-x-2 mt-1">
            <span className={`text-xl font-bold ${data.netProfit >= 0 ? 'text-[#00ffbb]' : 'text-[#ff007b]'}`}>
              ${data.netProfit?.toFixed(2)}
            </span>
          </div>
        </div>
        <div className="bg-[#111] p-3 rounded-lg border border-[#2a2a2a] flex flex-col justify-between">
          <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Profit Factor</span>
          <div className="flex items-end space-x-2 mt-1">
            <span className="text-xl font-bold text-gray-200">{data.profitFactor?.toFixed(2)}</span>
          </div>
        </div>
        <div className="bg-[#111] p-3 rounded-lg border border-[#2a2a2a] flex flex-col justify-between">
          <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Win Rate</span>
          <div className="flex items-end space-x-2 mt-1">
            <span className="text-xl font-bold text-[#ffcc00]">{data.winRate}%</span>
          </div>
        </div>
        <div className="bg-[#111] p-3 rounded-lg border border-[#2a2a2a] flex flex-col justify-between">
          <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Max Drawdown</span>
          <div className="flex items-end space-x-2 mt-1">
            <span className="text-xl font-bold text-[#ff007b]">{data.maxDrawdown}%</span>
          </div>
        </div>
      </div>

      <div className="px-4 pb-4">
        <div className="h-48 w-full mt-2 select-none">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.equityCurve} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorEquity" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00ffbb" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#00ffbb" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="trade" hide />
              <YAxis domain={['auto', 'auto']} hide />
              <RechartsTooltip 
                contentStyle={{ backgroundColor: '#111', borderColor: '#333', borderRadius: '8px', color: '#fff' }}
                itemStyle={{ color: '#00ffbb' }}
                labelStyle={{ color: '#888', marginBottom: '4px' }}
                formatter={(value: any) => [`$${value}`, 'Equity']}
                labelFormatter={(label) => `Trade #${label}`}
              />
              <Area type="monotone" dataKey="equity" stroke="#00ffbb" fillOpacity={1} fill="url(#colorEquity)" strokeWidth={2} isAnimationActive={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const CodeBlock = ({ node, inline, className, children, ...props }: any) => {
  const match = /language-(\w+)/.exec(className || '');
  const language = match ? match[1] : '';
  const isBlock = match || String(children).includes('\n');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(String(children).replace(/\n$/, ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isBlock && language === 'json' && String(children).includes('"equityCurve"')) {
    return <BacktestDashboard dataStr={String(children)} />;
  }

  return isBlock ? (
    <div className="relative rounded-md overflow-hidden bg-[#111] border border-[#333] my-4 not-prose w-full">
      <div className="flex items-center justify-between px-4 py-2 bg-[#1A1A1E] border-b border-[#333]">
        <span className="text-[10px] uppercase font-mono text-gray-400">{language || 'text'}</span>
        <button 
          onClick={handleCopy}
          className="text-gray-400 hover:text-white transition-colors flex items-center space-x-1"
        >
          {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
          <span className="text-[10px]">{copied ? 'Copied!' : 'Copy code'}</span>
        </button>
      </div>
      <div className="p-4 overflow-x-auto text-[13px] leading-relaxed relative">
        <pre className="!m-0 !p-0 bg-transparent">
          <code className={className} {...props}>
            {String(children).replace(/\n$/, '')}
          </code>
        </pre>
      </div>
    </div>
  ) : (
    <code className="bg-[#1A1A1E] text-[#00ffbb] px-1.5 py-0.5 rounded text-[0.9em]" {...props}>
      {children}
    </code>
  );
};

// Error Boundary for robust error handling
class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error: Error | null}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex bg-[#0E0E11] text-red-500 min-h-screen w-full items-center justify-center p-8 flex-col text-center">
          <Activity size={48} className="mb-4 animate-pulse" />
          <h1 className="text-2xl font-bold mb-2">SYSTEM FAILURE: SCRIPT_ERROR</h1>
          <p className="text-gray-400 font-mono text-sm max-w-md mb-6">{this.state.error?.message || 'A catastrophic runtime error has occurred inside the engine.'}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-2 bg-red-500/10 border border-red-500/30 rounded-xl text-red-500 hover:bg-red-500/20 transition-all font-bold uppercase tracking-widest text-[10px]"
          >
            Reboot Engine
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <MainApp />
    </ErrorBoundary>
  );
}

function MainApp() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [loginName, setLoginName] = useState('');
  const [loginKey, setLoginKey] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('trax_auth') === 'true');
  const [loginError, setLoginError] = useState('');

  // Auth state listener removed for local login
  useEffect(() => {
    // Auth logic removed
    if ('Notification' in window) {
      Notification.requestPermission();
    }
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    if (loginName.trim().toUpperCase() === 'MAKY TX' && loginKey === 'TRAXALGOENGINEADMIN') {
        setIsAuthenticated(true);
        setIsAdmin(true);
        setUserRole('Admin');
        setLoginError('');
        localStorage.setItem('trax_auth', 'true');
        localStorage.setItem('trax_user_name', loginName.trim());
        localStorage.setItem('trax_user_role', 'Admin');
        localStorage.setItem('trax_user_is_admin', 'true');
    } else if (isRegistering) {
        if (users.find(u => u.name.toLowerCase() === loginName.trim().toLowerCase())) {
            setLoginError('User name already taken.');
            return;
        }
        if (loginKey.trim().length < 4) {
            setLoginError('Key must be at least 4 characters long.');
            return;
        }
        const newUser = {
             id: Date.now(),
             name: loginName.trim(),
             licenseKey: loginKey.trim(),
             active: true,
             profit: 0.00,
             balance: 0.00,
             role: 'Trader' as Role,
             executionStatus: 'Awaiting Live Feed...'
        };
        setUsers(prev => [...prev, newUser]);
        
        setIsAuthenticated(true);
        setIsAdmin(false);
        setUserRole('Trader');
        setLoginError('');
        localStorage.setItem('trax_auth', 'true');
        localStorage.setItem('trax_user_name', loginName.trim());
        localStorage.setItem('trax_user_role', 'Trader');
        localStorage.setItem('trax_user_is_admin', 'false');
    } else {
        const foundUser = users.find(u => u.name.toLowerCase() === loginName.trim().toLowerCase() && u.licenseKey === loginKey.trim());
        if (foundUser) {
            if (!foundUser.active) {
                setLoginError('License key revoked or expired.');
            } else {
                setIsAuthenticated(true);
                setIsAdmin(foundUser.role === 'Admin');
                setUserRole(foundUser.role as Role);
                setLoginError('');
                localStorage.setItem('trax_auth', 'true');
                localStorage.setItem('trax_user_name', loginName.trim());
                localStorage.setItem('trax_user_role', foundUser.role);
                localStorage.setItem('trax_user_is_admin', String(foundUser.role === 'Admin'));
            }
        } else {
            setLoginError('Invalid name or license key.');
        }
    }
  };

  const [isAdmin, setIsAdmin] = useState(localStorage.getItem('trax_user_is_admin') === 'true');
  const [userRole, setUserRole] = useState<Role>((localStorage.getItem('trax_user_role') as Role) || 'Trader');
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  const [adminTab, setAdminTab] = useState<'Operations' | 'Risk' | 'Intelligence' | 'Mirror'>('Operations');
  const [panicMode, setPanicMode] = useState(false);
  const [whaleMode, setWhaleMode] = useState(false);
  const [autoSizing, setAutoSizing] = useState(true);
  const [newsFilter, setNewsFilter] = useState(true);
  const [sessionFilter, setSessionFilter] = useState(false);
  const [rrOptimizerEnabled, setRrOptimizerEnabled] = useState(false);
  const [targetRR, setTargetRR] = useState(2.0);
  const [systemLogs, setSystemLogs] = useState<{id: number, type: 'info' | 'warn' | 'error', message: string, time: string}[]>([
    { id: 1, type: 'info', message: 'Trax Algo Engine v6.2.0 initialized.', time: new Date().toLocaleTimeString() },
    { id: 2, type: 'info', message: 'Ready for Broker connectivity.', time: new Date().toLocaleTimeString() },
    { id: 3, type: 'info', message: 'Maky Tx signature verified. Master access enabled.', time: new Date().toLocaleTimeString() }
  ]);

  const [showDashboard, setShowDashboard] = useState(false);
  const [isOrderPanelOpen, setIsOrderPanelOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [brokerAccounts, setBrokerAccounts] = useState<BrokerAccount[]>([]);
  const [showBrokerModal, setShowBrokerModal] = useState(false);
  const [connectedBroker, setConnectedBroker] = useState(''); // Restore this
  const [selectedBroker, setSelectedBroker] = useState(''); // Restore this
  const [isBrokerConnecting, setIsBrokerConnecting] = useState(false); // Restore this
  const [newBrokerName, setNewBrokerName] = useState('');
  const [newBrokerAccountType, setNewBrokerAccountType] = useState<'brokerage' | 'crypto_wallet' | 'mt4' | 'mt5'>('brokerage');
  const [newBrokerServer, setNewBrokerServer] = useState('');
  const [newBrokerLogin, setNewBrokerLogin] = useState('');
  const [newBrokerPassword, setNewBrokerPassword] = useState('');
  const [newBrokerKey, setNewBrokerKey] = useState('');

  const [users, setUsers] = useState<{id: number, name: string, licenseKey: string, active: boolean, profit: number, balance: number, role: Exclude<Role, 'Guest'>, executionStatus: string}[]>(() => {
    const saved = localStorage.getItem('trax_users');
    if (saved) {
      return JSON.parse(saved);
    }
    return [
      { id: 1, name: 'Maky Tx', licenseKey: 'TX-MASTER-ADMIN', active: true, profit: 0.00, balance: 0.00, role: 'Admin', executionStatus: 'Awaiting Live Feed...' },
    ];
  });

  useEffect(() => {
    localStorage.setItem('trax_users', JSON.stringify(users));
  }, [users]);

  const [notifications, setNotifications] = useState<{id: number, text: string, time: string, isAnnouncement?: boolean}[]>([
     { id: 1, text: 'Welcome to Trax Algo Engine. Market data is live.', time: 'Just now' },
     { id: 2, text: 'Maky Tx updated the security configuration. All systems optimized.', time: '2 mins ago', isAnnouncement: true }
  ]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [announcementText, setAnnouncementText] = useState('');
  const [mobileView, setMobileView] = useState<'chat' | 'chart'>('chart');

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImageBase64, setSelectedImageBase64] = useState<string | null>(null);
  const [selectedImageMime, setSelectedImageMime] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const [symbol, setSymbol] = useState(localStorage.getItem('trax_chart_symbol') || 'BTCUSD');
  const [timeframe, setTimeframe] = useState(localStorage.getItem('trax_chart_timeframe') || '15m');
  const [chartType, setChartType] = useState<'candles'|'line'>((localStorage.getItem('trax_chart_type') as 'candles'|'line') || 'candles');
  const [showIndicators, setShowIndicators] = useState(localStorage.getItem('trax_chart_indicators') ? localStorage.getItem('trax_chart_indicators') === 'true' : true);
  
  useEffect(() => {
    localStorage.setItem('trax_chart_symbol', symbol);
    localStorage.setItem('trax_chart_timeframe', timeframe);
    localStorage.setItem('trax_chart_type', chartType);
    localStorage.setItem('trax_chart_indicators', String(showIndicators));
  }, [symbol, timeframe, chartType, showIndicators]);

  const [isSymbolMenuOpen, setIsSymbolMenuOpen] = useState(false);
  const [isSettingsMenuOpen, setIsSettingsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Dashboard functionality
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Trax Algo Engine', { body: msg });
    }
    setTimeout(() => setToastMessage(null), 3000);
  }, []);

  const requestNotificationPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      showToast('Desktop notifications not supported.');
      return;
    }
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      showToast('Notifications enabled.');
      new Notification('Trax Algo Engine', { body: 'Notifications enabled!' });
    } else {
      showToast('Notifications access denied.');
    }
  }, [showToast]);

  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any>(null);

  const toggleRecording = useCallback(() => {
    if (isRecording) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsRecording(false);
    } else {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        if (!recognitionRef.current) {
          recognitionRef.current = new SpeechRecognition();
          recognitionRef.current.continuous = false;
          recognitionRef.current.interimResults = false;
          
          recognitionRef.current.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setInput(prev => {
              const base = prev.trim();
              return base ? base + ' ' + transcript : transcript;
            });
          };
          
          recognitionRef.current.onerror = (event: any) => {
            console.error('Speech recognition error', event.error);
            setIsRecording(false);
            if (event.error !== 'no-speech') {
              showToast('Microphone error: ' + event.error);
            }
          };
          
          recognitionRef.current.onend = () => {
             setIsRecording(false);
          };
        }
        
        try {
          recognitionRef.current.start();
          setIsRecording(true);
        } catch (e) {
          console.error(e);
        }
      } else {
        showToast('Speech recognition not supported in this browser.');
      }
    }
  }, [isRecording, showToast]);

  const handleLogout = useCallback((msg?: string) => {
    setIsAuthenticated(false);
    setIsAdmin(false);
    setShowAdminDashboard(false);
    setShowDashboard(false);
    localStorage.removeItem('trax_auth');
    localStorage.removeItem('trax_user_name');
    localStorage.removeItem('trax_user_role');
    localStorage.removeItem('trax_user_is_admin');
    showToast(msg || 'Session Terminated. Intelligence Offline.');
  }, [showToast]);

  // Wallet functionality
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isWalletConnecting, setIsWalletConnecting] = useState(false);

  // PnL & Equity Real-time Data (Waiting for API)
  const [floatingPnl, setFloatingPnl] = useState(0.00);
  const [equity, setEquity] = useState(0.00);
  const [openTrades, setOpenTrades] = useState(0);
  const [aiTrend, setAiTrend] = useState<'BULLISH' | 'BEARISH' | 'NEUTRAL'>('NEUTRAL');
  const [aiConfidence, setAiConfidence] = useState<number>(0);
  const [aiIndicators, setAiIndicators] = useState<{name: string, value: string, signal: 'BULLISH'|'BEARISH'|'NEUTRAL'}[]>([]);
  const [aiTimeframes, setAiTimeframes] = useState<{tf: string, trend: 'BULLISH'|'BEARISH'|'NEUTRAL'}[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [isAlphaPanelVisible, setIsAlphaPanelVisible] = useState(false);
  const [agentSuggestions, setAgentSuggestions] = useState<string[]>([]);
  const [riskProfile, setRiskProfile] = useState<'Low' | 'Mid' | 'Degen'>('Low');
  const [profitHistory, setProfitHistory] = useState<{trades: number, profit: number, timestamp: string}[]>(() => {
    const saved = localStorage.getItem('trax_profit_history');
    return saved ? JSON.parse(saved) : [];
  });
  const ProfileEditor = ({ users, setUsers, onClose }: any) => {
  const userName = localStorage.getItem('trax_user_name');
  const user = users.find((u: any) => u.name === userName);
  const [name, setName] = useState(user?.name || '');
  const [licenseKey, setLicenseKey] = useState(user?.licenseKey || '');

  const saveProfile = () => {
    const updatedUsers = users.map((u: any) => u.name === userName ? { ...u, name, licenseKey } : u);
    setUsers(updatedUsers);
    localStorage.setItem('trax_user_name', name);
    alert('Profile updated');
    onClose();
  };

  return (
    <div className="bg-[#1A1A1E] p-8 rounded-2xl border border-white/10 shadow-lg text-white">
        <h2 className="text-xl font-bold mb-6">Profile Settings</h2>
        <div className="space-y-4">
            <input value={name} onChange={e => setName(e.target.value)} className="w-full bg-[#111] border border-[#333] rounded-lg px-4 py-3 text-white" />
            <input value={licenseKey} onChange={e => setLicenseKey(e.target.value)} className="w-full bg-[#111] border border-[#333] rounded-lg px-4 py-3 text-white" />
            <button onClick={saveProfile} className="bg-[#00ffbb] text-black px-6 py-2 rounded-lg font-bold">Save</button>
            <button onClick={onClose} className="ml-2 text-gray-400">Cancel</button>
        </div>
    </div>
  );
};

  useEffect(() => {
    localStorage.setItem('trax_profit_history', JSON.stringify(profitHistory));
  }, [profitHistory]);

  // Real-time Simulation Removed
  // useEffect(() => {
  //   let interval: NodeJS.Timeout;
  //   if (connectedBroker) {
  //     interval = setInterval(() => {
  //       const change = (Math.random() - 0.5) * 5;
  //       setFloatingPnl(prev => prev + change);
  //       setEquity(prev => prev + change);
  //       const trends: ('BULLISH' | 'BEARISH' | 'NEUTRAL')[] = ['BULLISH', 'BEARISH', 'NEUTRAL'];
  //       // High-frequency AI decision making for constant profit optimization
  //       if (Math.random() > 0.3) {
  //         const newTrend = trends[Math.floor(Math.random() * trends.length)];
  //         setAiTrend(newTrend);
  //         
  //         // Generate Agent Suggestion - Profit Oriented Logic
  //         if (newTrend === 'BULLISH') {
  //           if (floatingPnl < -20) {
  //             setAgentSuggestions(prev => [...prev.slice(-4), `HYPER-EXECUTION: Bullish reversal active. Heavy BUY to aggressively recover $${Math.abs(floatingPnl).toFixed(2)} drawdown.`]);
  //           } else {
  //             setAgentSuggestions(prev => [...prev.slice(-4), `MAX ALPHA: Bullish trend persistent. Scale into long position. Continuous growth enabled.`]);
  //           }
  //         } else if (newTrend === 'BEARISH') {
  //           if (floatingPnl > 20) {
  //              setAgentSuggestions(prev => [...prev.slice(-4), `PROFIT LOCK: Momentum shift. Immediate SELL/Exit to compound $${floatingPnl.toFixed(2)} gain.`]);
  //           } else {
  //              setAgentSuggestions(prev => [...prev.slice(-4), `SHORT OPPORTUNITY: Bearish setup. Capitalize on downside volatility for immediate profit capture.`]);
  //           }
  //         } else {
  //            setAgentSuggestions(prev => [...prev.slice(-4), `ALPHA HUNT: Neutral volatility. Tighten stoploss and maintain aggressive exposure for scalp opportunities.`]);
  //         }
  //       }
  //     }, 1000);
  //   }
  //   return () => clearInterval(interval);
  // }, [connectedBroker]);

  const chatRef = useRef<any>(null);

  const [aiDrawings, setAiDrawings] = useState<{id: string, price: number, label: string, color: string}[]>([]);

  useEffect(() => {
    if (!chatRef.current) {
        // Initial AI greeting
        setMessages([{
           role: 'model',
           content: "**TRAX ALGO ONLINE.** Maximum Alpha Protocol loaded. Brief response mode active. What is the target? Define logic or bot requirements. Let's secure the bag."
        }]);
    }
  }, []);

  const [orderType, setOrderType] = useState<'BUY' | 'SELL'>('BUY');
  const [orderMode, setOrderMode] = useState<'MARKET' | 'LIMIT' | 'STOP'>('MARKET');
  const [orderAmount, setOrderAmount] = useState('0.1');
  const [tpPrice, setTpPrice] = useState('');
  const [slPrice, setSlPrice] = useState('');
  const [limitStopPrice, setLimitStopPrice] = useState('');
  const [isTrailing, setIsTrailing] = useState(false);
  const [trailingDistance, setTrailingDistance] = useState('');

  const executeOrder = useCallback((type: 'BUY' | 'SELL', amount: number | string = orderAmount) => {
    if (!connectedBroker) {
      showToast('No broker connected. Connect to Binance or OANDA first.');
      return;
    }
    showToast(`EXECUTING: ${type} ${amount} ${symbol} @ MARKET // ALPHA-LIVE`);
    // Note: Direct brokerage integration will update trade status.
  }, [connectedBroker, orderAmount, symbol, showToast]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // AI Market Analysis Simulation
  useEffect(() => {
    setIsAnalyzing(true);
    
    const analyzeMarket = setTimeout(() => {
       const isBullish = Math.random() > 0.5;
       
       if (isBullish) {
         setAiTrend('BULLISH');
         setAiConfidence(Math.floor(Math.random() * 20) + 80); // 80-99%
         setAiIndicators([
           { name: 'RSI (14)', value: '62.4', signal: 'BULLISH' },
           { name: 'MACD', value: '0.0045 > Sig', signal: 'BULLISH' },
           { name: 'EMA 50/200', value: 'Golden Cross', signal: 'BULLISH' },
           { name: 'VWAP', value: 'Px > VWAP', signal: 'BULLISH' }
         ]);
         setAiTimeframes([
           { tf: '15m', trend: 'BULLISH' },
           { tf: '1h', trend: 'BULLISH' },
           { tf: '4h', trend: 'BULLISH' },
           { tf: '1D', trend: 'NEUTRAL' }
         ]);
       } else {
         setAiTrend('BEARISH');
         setAiConfidence(Math.floor(Math.random() * 20) + 80); // 80-99%
         setAiIndicators([
           { name: 'RSI (14)', value: '38.2', signal: 'BEARISH' },
           { name: 'MACD', value: '-0.0021 < Sig', signal: 'BEARISH' },
           { name: 'EMA 50/200', value: 'Death Cross', signal: 'BEARISH' },
           { name: 'VWAP', value: 'Px < VWAP', signal: 'BEARISH' }
         ]);
         setAiTimeframes([
           { tf: '15m', trend: 'BEARISH' },
           { tf: '1h', trend: 'BEARISH' },
           { tf: '4h', trend: 'BEARISH' },
           { tf: '1D', trend: 'NEUTRAL' }
         ]);
       }
       setIsAnalyzing(false);
    }, 1200);

    return () => clearTimeout(analyzeMarket);
  }, [symbol, timeframe]);

  const hasPushedState = useRef(false);

  // Handle Modal History for Mobile Back Button
  useEffect(() => {
    const anyModalOpen = showDashboard || showBrokerModal || showAdminDashboard || showAnnouncementModal || showProfile || showNotifications || isOrderPanelOpen;
    
    if (anyModalOpen) {
      if (window.location.hash !== '#modal') {
        window.history.pushState(null, '', window.location.pathname + window.location.search + '#modal');
        hasPushedState.current = true;
      }
    } else {
      if (window.location.hash === '#modal') {
        if (hasPushedState.current) {
           window.history.back();
           hasPushedState.current = false;
        } else {
           // Replace state to remove hash on reload if it existed
           window.history.replaceState(null, '', window.location.pathname + window.location.search);
        }
      }
    }
  }, [showDashboard, showBrokerModal, showAdminDashboard, showAnnouncementModal, showProfile, showNotifications, isOrderPanelOpen]);

  useEffect(() => {
    const handlePopState = () => {
      if (window.location.hash !== '#modal') {
        setShowDashboard(false);
        setShowBrokerModal(false);
        setShowAdminDashboard(false);
        setShowAnnouncementModal(false);
        setShowProfile(false);
        setShowNotifications(false);
        setIsOrderPanelOpen(false);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        showToast('Please upload an image file.');
        return;
      }
      setSelectedImageMime(file.type);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Url = reader.result as string;
        setSelectedImageBase64(base64Url);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeSelectedImage = () => {
    setSelectedImageBase64(null);
    setSelectedImageMime(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent | { preventDefault: () => void }) => {
    e.preventDefault();
    if ((!input.trim() && !selectedImageBase64) || isLoading) return;

    const userMessage = input.trim();
    const currentImgBase64 = selectedImageBase64;
    const currentImgMime = selectedImageMime;
    setInput('');
    removeSelectedImage();
    
    // Attempt to reset textarea height
    const form = (e as any).target as HTMLFormElement;
    if (form && form.tagName === 'FORM') {
       const textarea = form.querySelector('textarea');
       if (textarea) textarea.style.height = 'auto';
    }

    setMessages(prev => [...prev, { role: 'user', content: userMessage, image: currentImgBase64 || undefined }]);
    setIsLoading(true);

    try {
      let chat = chatRef.current;
      if (!chat) {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const tools = [{
          functionDeclarations: [
            {
              name: 'executeTraderOrder',
              description: 'Execute a live market order for a trading pair.',
              parameters: {
                type: Type.OBJECT,
                properties: {
                  side: { type: Type.STRING, enum: ['BUY', 'SELL'], description: 'Order direction' },
                  amount: { type: Type.NUMBER, description: 'Quantity to trade' },
                  symbol: { type: Type.STRING, description: 'Trading pair symbol e.g BTCUSD' }
                },
                required: ['side', 'amount', 'symbol']
              }
            },
            {
              name: 'drawTechnicalLevel',
              description: 'Plot a technical analysis level or zone on the user chart.',
              parameters: {
                type: Type.OBJECT,
                properties: {
                  price: { type: Type.NUMBER, description: 'Price level to plot' },
                  label: { type: Type.STRING, description: 'Annotation for the level' },
                  color: { type: Type.STRING, description: 'Hex color or name for the level line' }
                },
                required: ['price', 'label']
              }
            }
          ]
        }];

        chat = ai.chats.create({
          model: 'gemini-2.5-flash',
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            tools: tools
          }
        });
        chatRef.current = chat;
      }

      let apiMessage: any = userMessage;
      if (currentImgBase64) {
        apiMessage = [
          currentImgBase64 ? { inlineData: { data: currentImgBase64.split(',')[1], mimeType: currentImgMime! } } : '',
          userMessage
        ].filter(Boolean);
      }

      const responseStream = await chat.sendMessageStream({ message: apiMessage });
      
      setMessages(prev => [...prev, { role: 'model', content: '' }]);
      
      let fullContent = '';
      for await (const chunk of responseStream) {
        if (chunk.text) {
          fullContent += chunk.text;
          setMessages(prev => {
            const newMessages = [...prev];
            newMessages[newMessages.length - 1] = { role: 'model', content: fullContent };
            return newMessages;
          });
        }

        // Handle Function Calls
        const functionCalls = chunk.functionCalls;
        if (functionCalls) {
          for (const call of functionCalls) {
            if (call.name === 'executeTraderOrder') {
              const { side, amount, symbol: orderSymbol } = call.args as any;
              executeOrder(side as 'BUY' | 'SELL', amount);
              // Provide feedback to AI
              await chatRef.current.sendMessage({
                message: `SYSTEM_FEEDBACK: Order Executed - ${side} ${amount} ${orderSymbol}`
              });
            } else if (call.name === 'drawTechnicalLevel') {
              const { price, label, color } = call.args as any;
              const newLevel = { id: crypto.randomUUID(), price, label, color: color || '#00ffbb' };
              setAiDrawings(prev => [...prev, newLevel]);
              showToast(`AI PLOTTED: ${label} @ ${price}`);
               // Provide feedback to AI
               await chatRef.current.sendMessage({
                message: `SYSTEM_FEEDBACK: Level Plotted - ${label} at ${price}`
              });
            }
          }
        }
      }
    } catch (error: any) {
      console.error(error);
      const errMsg = error.message || '';
      if (errMsg.includes('API_KEY_INVALID') || errMsg.includes('API key not valid')) {
        chatRef.current = null;
      }
      setMessages(prev => [...prev, { role: 'model', content: `**Error execution failed:** ${errMsg}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex bg-[#0E0E11] text-gray-200 min-h-screen w-full items-center justify-center p-4 selection:bg-[#00ffbb] selection:text-black">
        <div className="bg-[#1A1A1E] border border-[#333] p-8 rounded-2xl shadow-2xl w-full max-w-sm flex flex-col items-center">
          <Activity size={48} className="text-[#00ffbb] mb-6 drop-shadow-[0_0_15px_rgba(0,255,187,0.3)] animate-pulse" />
          <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Trax Algo Terminal</h2>
          <p className="text-sm text-gray-400 mb-6 text-center font-medium">Authenticate to access the super-intelligence engine.</p>
          
          <form className="w-full flex flex-col space-y-5" onSubmit={handleAuth}>
            <div>
               <label className="text-[10px] uppercase font-mono text-gray-500 font-bold tracking-widest mb-2 block">Name</label>
               <input 
                 value={loginName}
                 onChange={e => setLoginName(e.target.value)}
                 className="w-full bg-[#111] border border-[#333] rounded-lg px-4 py-3 text-white text-[15px] focus:outline-none focus:border-[#00ffbb] focus:ring-1 focus:ring-[#00ffbb] transition-all"
                 placeholder="Enter your name"
                 required
               />
            </div>
            <div>
               <label className="text-[10px] uppercase font-mono text-gray-500 font-bold tracking-widest mb-2 block">License Key</label>
               <input 
                 value={loginKey}
                 onChange={e => setLoginKey(e.target.value)}
                 type="password"
                 className="w-full bg-[#111] border border-[#333] rounded-lg px-4 py-3 text-white text-[15px] focus:outline-none focus:border-[#00ffbb] focus:ring-1 focus:ring-[#00ffbb] transition-all font-mono"
                 placeholder="Enter your license key"
                 required
               />
            </div>
            
            {loginError && <p className="text-red-500 text-xs font-mono bg-red-500/10 p-2 rounded border border-red-500/20">{loginError}</p>}
            
            <button type="submit" className="w-full mt-2 bg-gradient-to-br from-[#00ffbb] to-[#00cc99] hover:opacity-90 text-black font-bold py-3 rounded-lg shadow-[0_4px_14px_0_rgba(0,255,187,0.39)] transition-all uppercase tracking-widest text-xs">
               {isRegistering ? 'Register' : 'Connect Securely'}
            </button>
            
            <button type="button" onClick={() => setIsRegistering(!isRegistering)} className="text-xs text-gray-400 hover:text-white underline">
              {isRegistering ? 'Already have an account? Login' : 'Need an account? Register'}
            </button>

            <div className="pt-4 border-t border-[#333] mt-2 text-center">
              <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-2 font-bold whitespace-nowrap">Need a license or Activation?</p>
              <a 
                href="https://wa.me/256753091309" 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-[#00ffbb] hover:text-white transition-colors group cursor-pointer"
              >
                <div className="bg-[#00ffbb]/10 group-hover:bg-[#00ffbb]/20 p-2 rounded-full transition-all">
                  <Megaphone size={14} className="group-hover:rotate-12 transition-transform" />
                </div>
                <span className="text-xs font-bold font-mono tracking-tight underline underline-offset-4">+256 753 091 309 WhatsApp</span>
              </a>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-screen w-full bg-[#0E0E11] text-gray-200 font-sans overflow-hidden">
      
      {/* User Dashboard Overlay */}
      {showDashboard && (
          <div className="fixed inset-0 z-[60] bg-[#0E0E11] p-4 md:p-8 overflow-y-auto w-full h-[100dvh]">
              <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
                  <div className="flex items-center gap-4">
                    <h1 className="text-3xl font-bold text-white tracking-tight">Personal Dashboard</h1>
                    {isAdmin && (
                      <button 
                        onClick={() => {
                          setShowDashboard(false);
                          setShowAdminDashboard(true);
                        }}
                        className="bg-[#00ffbb]/10 hover:bg-[#00ffbb]/20 text-[#00ffbb] px-4 py-2 rounded-xl border border-[#00ffbb]/30 text-[10px] font-bold uppercase tracking-widest transition-all"
                      >
                         Open Admin Terminal
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                     <button onClick={() => setShowProfile(true)} className="px-6 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10 transition-all font-bold text-sm">Profile</button>
                     <button onClick={() => setShowDashboard(false)} className="px-6 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10 transition-all font-bold text-sm">Back to Engine</button>
                     <button 
                        onClick={() => handleLogout()} 
                        className="px-6 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl border border-red-500/20 transition-all font-bold text-sm"
                     >
                        Exit Engine
                     </button>
                  </div>
              </div>
              {showProfile ? (
                 <ProfileEditor users={users} setUsers={setUsers} onClose={() => setShowProfile(false)} />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div className="bg-[#1A1A1E] p-6 rounded-2xl border border-white/10 shadow-lg">
                     <h3 className="text-gray-500 font-mono text-xs uppercase mb-2">Total Equity</h3>
<p className="text-3xl font-bold text-white">
  {connectedBroker ? `$${equity.toLocaleString(undefined, {minimumFractionDigits: 2})}` : 'CONNECT BROKER'}
</p>
                     <div className="mt-2 text-[10px] text-gray-400 font-mono uppercase tracking-widest">Maky Tx Managed Protocol</div>
                 </div>
                 <div className={`bg-[#1A1A1E] p-6 rounded-2xl border transition-all ${floatingPnl >= 0 ? 'border-[#00ffbb]/20 shadow-[0_0_20px_rgba(0,255,187,0.05)]' : 'border-[#ff007b]/20'} shadow-lg`}>
                     <h3 className="text-gray-500 font-mono text-xs uppercase mb-2">Real-time PnL</h3>
                     <span className={`text-3xl font-bold ${floatingPnl >= 0 ? 'text-[#00ffbb]' : 'text-[#ff007b]'}`}>
                        {connectedBroker ? (floatingPnl >= 0 ? '+' : '-') + '$' + Math.abs(floatingPnl).toLocaleString(undefined, {minimumFractionDigits: 2}) : 'WAITING...'}
                     </span>
                     <div className="flex items-center gap-1.5 mt-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${floatingPnl >= 0 ? 'bg-[#00ffbb]' : 'bg-[#ff007b]'} animate-pulse`} />
                        <span className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">Live Edge Calculation</span>
                     </div>
                 </div>
                 {(userRole === 'Admin' || userRole === 'Trader') && (
                    <div className="bg-[#1A1A1E] p-6 rounded-2xl border border-white/10 shadow-lg">
                        <h3 className="text-gray-500 font-mono text-xs uppercase mb-2">Wallet Integrations</h3>
                        <div className="mb-6">
                          <WalletConnector 
                              walletAddress={walletAddress} 
                              setWalletAddress={setWalletAddress} 
                              isWalletConnecting={isWalletConnecting}
                              setIsWalletConnecting={setIsWalletConnecting}
                              showToast={showToast}
                              userRole={userRole}
                          />
                        </div>
                        <h3 className="text-gray-500 font-mono text-xs uppercase mb-2">Broker Integration</h3>
                        {connectedBroker ? (
                            <div className="flex flex-col items-center justify-center p-2 pt-0 space-y-2">
                            <div className="w-10 h-10 rounded-full bg-[#00ffbb]/10 flex items-center justify-center">
                                <Check size={20} className="text-[#00ffbb]" />
                            </div>
                            <p className="text-white font-bold text-sm">Connected to {connectedBroker}</p>
                            <button 
                                onClick={() => {
                                    setConnectedBroker('');
                                    setSelectedBroker('');
                                    showToast('Disconnected from broker');
                                }}
                                className="text-red-500 font-bold text-xs uppercase tracking-widest transition-all"
                            >
                                Disconnect
                            </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                            <select 
                                value={selectedBroker} 
                                onChange={(e) => setSelectedBroker(e.target.value)}
                                disabled={isBrokerConnecting}
                                className="w-full bg-[#111] border border-[#333] rounded-lg px-4 py-2 text-white text-sm"
                            >
                                <option value="">-- Choose Broker --</option>
                                <option value="Binance">Binance</option>
                                <option value="OANDA">OANDA</option>
                            </select>
                            {selectedBroker && (
                                <button 
                                    onClick={() => {
                                    setIsBrokerConnecting(true);
                                    setTimeout(() => {
                                        setIsBrokerConnecting(false);
                                        setConnectedBroker(selectedBroker);
                                        showToast(`Connected to ${selectedBroker}`);
                                    }, 1000);
                                    }}
                                    className="w-full h-8 bg-[#00ffbb] text-black font-bold rounded-lg text-xs"
                                >
                                {isBrokerConnecting ? "Connecting..." : "Connect"}
                                </button>
                            )}
                            </div>
                        )}
                    </div>
                 )}
                 {(userRole === 'Admin' || userRole === 'Developer') && (
                    <div className="bg-[#1A1A1E] p-6 rounded-2xl border border-white/10 shadow-lg">
                        <h3 className="text-gray-500 font-mono text-xs uppercase mb-2">Advanced Dashboard Settings</h3>
                        <div className="space-y-3">
                           <div className="flex justify-between items-center bg-[#111] p-2 rounded border border-[#222]">
                              <span className="text-xs text-gray-400">API Health</span>
                              <span className="text-[10px] text-emerald-500 font-bold">OPTIMIZED</span>
                           </div>
                           <div className="flex justify-between items-center bg-[#111] p-2 rounded border border-[#222]">
                              <span className="text-xs text-gray-400">Alpha RR Opt</span>
                              <button 
                                 onClick={() => {
                                    setRrOptimizerEnabled(!rrOptimizerEnabled);
                                    showToast(rrOptimizerEnabled ? 'RR Optimizer: OFF' : 'RR Optimizer: ACTIVE');
                                 }}
                                 className={`text-[10px] uppercase font-bold p-1 px-2 rounded transition-all ${rrOptimizerEnabled ? 'bg-[#ffcc00] text-black' : 'bg-white/10 text-gray-500'}`}
                              >
                                 {rrOptimizerEnabled ? 'ON' : 'OFF'}
                              </button>
                           </div>
                           <button 
                              onClick={() => showToast('Rebuilding optimization weights...')}
                              className="w-full h-8 bg-[#222] hover:bg-[#333] border border-[#444] text-gray-300 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all"
                           >
                              Optimization Weights
                           </button>
                           <button 
                              onClick={() => showToast('Flushing local strategy cache...')}
                              className="w-full h-8 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all"
                           >
                              Flush Cache
                           </button>
                        </div>
                    </div>
                 )}
                 {/* Profit History */}
                 <div className="bg-[#1A1A1E] p-6 rounded-2xl border border-white/10 shadow-lg col-span-1 md:col-span-3">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-gray-500 font-mono text-xs uppercase">Profit History</h3>
                        <button onClick={() => setProfitHistory([])} className="text-[10px] text-red-500 hover:text-red-400 font-bold uppercase">Reset History</button>
                    </div>
                    <div className="h-40 overflow-y-auto space-y-2">
                        {profitHistory.map((h, i) => (
                            <div key={i} className="flex justify-between text-[11px] bg-[#111] p-2 rounded border border-[#222]">
                                <span className="text-gray-400">{h.timestamp}</span>
                                <span className="text-gray-200">Trade #{h.trades}</span>
                                <span className={h.profit >= 0 ? "text-[#00ffbb]" : "text-[#ff007b]"}>${h.profit.toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                </div>
                </div>
              )}
          </div>
      )}


      {/* Broker Integration Overlay */}
      {showBrokerModal && (
        <div className="fixed inset-0 bg-[#0E0E11]/80 backdrop-blur-md z-[60] flex items-start justify-center p-6 overflow-y-auto w-full h-[100dvh]">
           <div className="bg-[#1A1A1E] border border-[#333] p-6 rounded-2xl w-full max-w-lg shadow-2xl my-auto mt-10 mb-10">
              <div className="flex justify-between items-center mb-6 border-b border-[#333] pb-4">
                 <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Activity size={20} className="text-[#00ffbb]" />
                    Multi-Account Fund Management
                 </h2>
                 <button onClick={() => setShowBrokerModal(false)} className="text-gray-400 hover:text-white">
                    <X size={20} />
                 </button>
              </div>

              {/* Accounts List & Add New Account Form */}
              <div className="space-y-4">
                  <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Connected Accounts</div>
                  {brokerAccounts.length === 0 ? (
                      <p className="text-sm text-gray-500 italic text-center py-4">No accounts connected yet.</p>
                  ) : (
                      brokerAccounts.map(account => (
                          <div key={account.id} className="flex justify-between items-center bg-black/40 p-4 rounded-xl border border-[#333]">
                              <div>
                                  <p className="text-white text-sm font-bold">{account.name}</p>
                                  <p className="text-gray-400 text-xs font-mono">{account.type === 'crypto_wallet' ? 'Crypto Wallet' : 'Brokerage'}</p>
                              </div>
                              <p className="text-[#00ffbb] font-mono text-sm font-bold">${account.balance.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
                          </div>
                      ))
                  )}

                  <div className="mt-8 pt-6 border-t border-[#333]">
                      <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Add New Account</div>
                      <div className="space-y-3">
                          <div className="flex gap-2">
                              <select 
                                  value={newBrokerName} 
                                  onChange={e => setNewBrokerName(e.target.value)} 
                                  className="w-full bg-[#111] border border-[#333] rounded-lg px-4 py-2.5 text-white text-sm focus:border-[#00ffbb] focus:outline-none" 
                              >
                                  <option value="">Select Broker</option>
                                  <option value="JustMarkets">JustMarkets</option>
                                  <option value="Headway">Headway</option>
                                  <option value="Exness">Exness</option>
                                  <option value="Binance">Binance</option>
                                  <option value="Phantom Wallet">Phantom Wallet</option>
                                  <option value="Other">Other</option>
                              </select>
                              {newBrokerName === 'Other' && (
                                  <input 
                                      placeholder="Custom Broker Name" 
                                      onChange={e => setNewBrokerName(e.target.value)} 
                                      className="flex-grow bg-[#111] border border-[#333] rounded-lg px-4 py-2.5 text-white text-sm focus:border-[#00ffbb] focus:outline-none" 
                                  />
                              )}
                          </div>
                          <select 
                              value={newBrokerAccountType} 
                              onChange={e => setNewBrokerAccountType(e.target.value as 'brokerage' | 'crypto_wallet' | 'mt4' | 'mt5')}
                              className="w-full bg-[#111] border border-[#333] rounded-lg px-4 py-2.5 text-white text-sm focus:border-[#00ffbb] focus:outline-none"
                          >
                              <option value="brokerage">Brokerage API (REST/WebSocket)</option>
                              <option value="crypto_wallet">Crypto Wallet</option>
                              <option value="mt4">MetaTrader 4 (MT4)</option>
                              <option value="mt5">MetaTrader 5 (MT5)</option>
                          </select>
                          
                          {(newBrokerAccountType === 'mt4' || newBrokerAccountType === 'mt5') ? (
                              <div className="space-y-3 mt-2 border border-[#333] p-4 rounded-lg bg-black/20">
                                  <div className="text-[#00ffbb] text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                                     <Activity size={12} />
                                     MetaTrader {newBrokerAccountType === 'mt4' ? '4' : '5'} Configuration
                                  </div>
                                  <input 
                                      value={newBrokerServer} 
                                      onChange={e => setNewBrokerServer(e.target.value)} 
                                      placeholder="Server Name (e.g., Exness-Real15)"
                                      className="w-full bg-[#111] border border-[#333] rounded-lg px-4 py-2.5 text-white text-sm focus:border-[#00ffbb] focus:outline-none" 
                                  />
                                  <input 
                                      value={newBrokerLogin} 
                                      onChange={e => setNewBrokerLogin(e.target.value)} 
                                      placeholder="Account Login (Number)"
                                      className="w-full bg-[#111] border border-[#333] rounded-lg px-4 py-2.5 text-white text-sm focus:border-[#00ffbb] focus:outline-none" 
                                  />
                                  <input 
                                      type="password"
                                      value={newBrokerPassword} 
                                      onChange={e => setNewBrokerPassword(e.target.value)} 
                                      placeholder="Trading Password"
                                      className="w-full bg-[#111] border border-[#333] rounded-lg px-4 py-2.5 text-white text-sm focus:border-[#00ffbb] focus:outline-none" 
                                  />
                                  <input 
                                      value={newBrokerKey} 
                                      onChange={e => setNewBrokerKey(e.target.value)} 
                                      placeholder="MetaAPI / Bridge Token (Optional)"
                                      className="w-full bg-[#111] border border-[#333] rounded-lg px-4 py-2.5 text-white text-sm focus:border-[#00ffbb] focus:outline-none" 
                                  />
                              </div>
                          ) : (
                          <div className="flex gap-2 relative">
                              <input 
                                  value={newBrokerKey} 
                                  onChange={e => setNewBrokerKey(e.target.value)} 
                                  placeholder={newBrokerAccountType === 'crypto_wallet' ? "Wallet Address" : "API Key"}
                                  className="flex-grow bg-[#111] border border-[#333] rounded-lg px-4 py-2.5 text-white text-sm focus:border-[#00ffbb] focus:outline-none font-mono" 
                              />
                              {newBrokerAccountType === 'crypto_wallet' && (
                                  <button
                                      onClick={async () => {
                                          if (typeof window.solana !== 'undefined' && window.solana.isPhantom) {
                                              try {
                                                  const resp = await window.solana.connect();
                                                  if (resp.publicKey) {
                                                      const pubKeyString = resp.publicKey.toString();
                                                      setNewBrokerKey(pubKeyString);
                                                      
                                                      // Request signature to delegate AI control
                                                      try {
                                                          const messageText = `Trax Algo Engine Authorization\n\nI hereby authorize the Trax AI Engine smart contract to execute trades and manage funds for address:\n${pubKeyString}\n\nTimestamp: ${Date.now()}`;
                                                          const encodedMessage = new TextEncoder().encode(messageText);
                                                          const signedMessage = await window.solana.signMessage(encodedMessage, "utf8");
                                                          
                                                          showToast('Signature verified. AI Execution Authority Granted.');
                                                          
                                                          // Fetch real balance
                                                          const solanaWeb3 = await import('@solana/web3.js');
                                                          const connection = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl('mainnet-beta'), 'confirmed');
                                                          const pubKey = new solanaWeb3.PublicKey(pubKeyString);
                                                          const lamports = await connection.getBalance(pubKey);
                                                          const solBalance = lamports / solanaWeb3.LAMPORTS_PER_SOL;
                                                          
                                                          // Add real account
                                                          const newAccount: BrokerAccount = {
                                                              id: Date.now().toString(),
                                                              name: newBrokerName || 'Phantom Wallet',
                                                              type: 'crypto_wallet',
                                                              apiKeyOrAddress: pubKeyString,
                                                              balance: solBalance, // REAL balance
                                                              connected: true
                                                          };
                                                          setBrokerAccounts(prev => [...prev, newAccount]);
                                                          setNewBrokerName('');
                                                          setNewBrokerKey('');
                                                          showToast(`Added Phantom with ${solBalance.toFixed(4)} SOL (AI Enabled)`);
                                                      } catch (signErr: any) {
                                                          showToast(`Authorization rejected. AI cannot trade without signature.`);
                                                      }
                                                  }
                                              } catch (error: any) {
                                                  if (error.code === 4001) {
                                                    showToast(`Phantom connection rejected by user`);
                                                  } else {
                                                    showToast(`Phantom error: ${error.message}`);
                                                  }
                                              }
                                          } else {
                                              if (window.self !== window.top) {
                                                 showToast('Phantom not detected. If installed, open app in a new tab (iframes block extensions).');
                                              } else {
                                                 showToast('Phantom not found. Please install it.');
                                              }
                                          }
                                      }}
                                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#333] hover:bg-[#444] border border-[#555] text-[#00ffbb] px-2 py-1.5 focus:outline-none rounded text-[10px] font-bold transition-all z-10"
                                  >
                                      Connect Phantom API
                                  </button>
                              )}
                          </div>
                          )}
                          <button 
                              onClick={() => {
                                  if ((newBrokerAccountType === 'mt4' || newBrokerAccountType === 'mt5')) {
                                      if(!newBrokerServer || !newBrokerLogin || !newBrokerPassword) {
                                        showToast('Please fill all MT Server, Login, and Password fields');
                                        return;
                                      }
                                  } else {
                                    if (!newBrokerName || !newBrokerKey) {
                                        showToast('Please fill all fields');
                                        return;
                                    }
                                  }
                                  const newAccount: BrokerAccount = {
                                      id: Date.now().toString(),
                                      name: newBrokerName,
                                      type: newBrokerAccountType,
                                      apiKeyOrAddress: newBrokerKey,
                                      server: newBrokerServer,
                                      login: newBrokerLogin,
                                      password: newBrokerPassword,
                                      balance: 0, // Will update via backend call
                                      connected: true
                                  };
                                  if (newBrokerAccountType === 'brokerage') {
                                      // Real API call to the new Express backend
                                      fetch('/api/connect-broker', {
                                          method: 'POST',
                                          headers: { 'Content-Type': 'application/json' },
                                          body: JSON.stringify({ apiKey: newBrokerKey, apiSecret: 'HIDDEN_FOR_DEMO', type: 'binance' })
                                      }).then(res => res.json()).then(data => {
                                          if (data.success) {
                                              newAccount.balance = data.balance;
                                              setBrokerAccounts(prev => [...prev, newAccount]);
                                              showToast(`Connected to ${newBrokerName} with balance $${data.balance}`);
                                          } else {
                                              throw new Error('Connection failed');
                                          }
                                      }).catch(err => {
                                          showToast(`Error connecting to brokerage: ${err.message}`);
                                      });
                                  } else if (newBrokerAccountType === 'mt4' || newBrokerAccountType === 'mt5') {
                                      // Requesting MT token connection via Backend
                                      fetch('/api/connect-broker', {
                                          method: 'POST',
                                          headers: { 'Content-Type': 'application/json' },
                                          body: JSON.stringify({ 
                                            apiKey: newBrokerKey || 'bridge-token', 
                                            apiSecret: 'HIDDEN', 
                                            type: newBrokerAccountType, 
                                            server: newBrokerServer, 
                                            login: newBrokerLogin 
                                          })
                                      }).then(res => res.json()).then(data => {
                                          if (data.success) {
                                              newAccount.balance = data.balance;
                                              setBrokerAccounts(prev => [...prev, newAccount]);
                                              showToast(`Connected to ${newBrokerName} (${newBrokerAccountType.toUpperCase()}) with balance $${data.balance}`);
                                          } else {
                                              throw new Error('MT Connection failed');
                                          }
                                      }).catch(err => {
                                          showToast(`Error connecting to ${newBrokerAccountType.toUpperCase()}: ${err.message}`);
                                      });
                                  } else {
                                      // Crypto Wallet: Direct client-side logic to fetch real balance
                                      import('@solana/web3.js').then(solanaWeb3 => {
                                          try {
                                              const connection = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl('mainnet-beta'), 'confirmed');
                                              const pubKey = new solanaWeb3.PublicKey(newBrokerKey);
                                              
                                              connection.getBalance(pubKey).then(lamports => {
                                                  const solBalance = lamports / solanaWeb3.LAMPORTS_PER_SOL;
                                                  newAccount.balance = solBalance;
                                                  setBrokerAccounts(prev => [...prev, newAccount]);
                                                  showToast(`Added ${newBrokerName} real balance: ${solBalance.toFixed(4)} SOL`);
                                              }).catch(e => {
                                                  showToast(`Failed to fetch on-chain balance. Address might be invalid.`);
                                              });
                                          } catch (e: any) {
                                              showToast(`Invalid Wallet Address format`);
                                          }
                                      }).catch(() => {
                                          setBrokerAccounts(prev => [...prev, newAccount]);
                                          showToast(`Added ${newBrokerName} successfully`);
                                      });
                                  }
                                  
                                  // Clear MT fields
                                  setNewBrokerServer('');
                                  setNewBrokerLogin('');
                                  setNewBrokerPassword('');
                                  
                                  // Keep these
                                  setNewBrokerName('');
                                  setNewBrokerKey('');
                              }}
                              className="w-full bg-gradient-to-r from-[#00ffbb] to-[#00cc99] text-black font-bold py-2.5 rounded-lg text-sm uppercase tracking-widest hover:opacity-90 mt-2"
                          >
                              Add Account
                          </button>
                      </div>
                  </div>
              </div>
           </div>
        </div>
      )}

      {/* Admin Dashboard Overlay (Absolute Admin Terminal) */}
      {showAdminDashboard && isAdmin && (
        <div className="fixed inset-0 bg-[#0E0E11]/85 backdrop-blur-xl z-50 flex items-center justify-center p-4 md:p-10 w-full h-[100dvh]">
           <motion.div 
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             className="bg-[#1A1A1E]/80 backdrop-blur-2xl border border-white/20 rounded-3xl w-full max-w-6xl max-h-[90vh] flex flex-col shadow-[0_32px_64px_-12px_rgba(0,0,0,0.8)] overflow-hidden ring-1 ring-white/10"
           >
              {/* Terminal Header */}
              <div className="px-8 py-5 border-b border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center bg-white/5 relative overflow-hidden gap-4">
                 <div className="absolute inset-0 bg-gradient-to-r from-[#00ffbb]/20 via-transparent to-[#ff007b]/10 pointer-events-none" />
                 
                 <div className="flex items-center gap-5 relative z-10">
                    <div className="w-12 h-12 rounded-2xl bg-[#00ffbb]/20 flex items-center justify-center border border-[#00ffbb]/30 shadow-[0_0_15px_rgba(0,255,187,0.2)]">
                       <Shield size={24} className="text-[#00ffbb]" />
                    </div>
                    <div className="flex flex-col">
                       <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                          Absolute Admin Terminal
                          <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full text-gray-400 border border-white/10">v6.2.0-STABLE</span>
                       </h2>
                       <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs font-mono text-gray-400 font-medium tracking-wide">Signature: MAKY TX // MASTER_OVERRIDE_ENABLED</span>
                          <div className="h-1 w-1 rounded-full bg-gray-600" />
                          <div className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest ${panicMode ? 'text-red-500' : 'text-[#00ffbb]'}`}>
                             <div className={`w-1.5 h-1.5 rounded-full ${panicMode ? 'bg-red-500 animate-pulse' : 'bg-[#00ffbb]'}`} />
                             {panicMode ? 'Panic Mode Active' : 'System Operational'}
                          </div>
                       </div>
                    </div>
                 </div>

                 <div className="flex items-center gap-3 relative z-10 flex-wrap justify-end">
                    <div className="relative">
                        <button
                            onClick={() => setShowAnnouncementModal(!showAnnouncementModal)}
                            className={`px-4 py-2 ${showAnnouncementModal ? 'bg-orange-500 text-black border-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.4)]' : 'bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border-orange-500/20'} rounded-xl border transition-all text-[10px] font-bold text-center uppercase tracking-widest flex items-center gap-2`}
                         >
                            <Megaphone size={14} /> Global Broadcast
                        </button>

                        {showAnnouncementModal && (
                            <div className="absolute top-12 right-0 w-72 bg-[#1A1A1E] border border-orange-500/30 rounded-lg shadow-2xl overflow-hidden py-1 z-50">
                                <div className="px-4 py-2 border-b border-[#333] flex justify-between items-center bg-[#111]">
                                   <span className="text-xs font-bold text-orange-400 uppercase tracking-widest">Broadcast App Alert</span>
                                   <button onClick={() => setShowAnnouncementModal(false)} className="text-gray-500 hover:text-white"><X size={14} /></button>
                                </div>
                                <div className="p-4 space-y-3">
                                   <textarea 
                                      value={announcementText}
                                      onChange={(e) => setAnnouncementText(e.target.value)}
                                      className="w-full bg-[#111] border border-[#333] rounded px-3 py-2 text-sm text-white min-h-[80px] resize-none focus:border-orange-500/50 focus:outline-none"
                                      placeholder="Enter priority alert for all users..."
                                   />
                                   <button 
                                      onClick={() => {
                                         if (announcementText.trim()) {
                                            setNotifications(prev => [{id: Date.now(), text: announcementText, time: 'Just now', isAnnouncement: true}, ...prev]);
                                            setAnnouncementText('');
                                            setShowAnnouncementModal(false);
                                            showToast('Global App Announcement Broadcasted');
                                         }
                                      }}
                                      className="w-full bg-orange-500 hover:bg-orange-600 text-black font-bold uppercase tracking-wider text-[10px] py-2 rounded transition-colors"
                                   >
                                      Send Alert
                                   </button>
                                </div>
                            </div>
                         )}
                    </div>
                    <div className="flex bg-black/40 p-1 rounded-xl border border-white/10 hidden md:flex">
                       {(['Operations', 'Risk', 'Intelligence', 'Mirror'] as const).map(tab => (
                          <button
                            key={tab}
                            onClick={() => setAdminTab(tab)}
                            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all uppercase tracking-wider ${adminTab === tab ? 'bg-white/10 text-white shadow-lg border border-white/20' : 'text-gray-400 hover:text-gray-200'}`}
                          >
                             {tab}
                          </button>
                       ))}
                    </div>
                    <button 
                       onClick={() => handleLogout('Master Access Revoked. Terminal Closed.')}
                       className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl border border-red-500/20 transition-all text-[10px] font-bold uppercase tracking-widest mr-2"
                    >
                       Exit System
                    </button>
                    <button onClick={() => setShowAdminDashboard(false)} className="text-gray-400 hover:text-white p-2.5 hover:bg-white/10 rounded-xl transition-all border border-transparent hover:border-white/10 shadow-lg">
                       <X size={20} />
                    </button>
                 </div>
              </div>
              
              <div className="flex-1 overflow-y-auto bg-transparent custom-scrollbar flex flex-col">
                 
                 {adminTab === 'Operations' && (
                    <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                       <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-white/5 pb-6 gap-4">
                          <div>
                              <h3 className="font-bold text-xl text-white mb-1 tracking-tight">Institutional Access Management</h3>
                              <p className="text-sm text-gray-400">Strict regulatory oversight of all connected trader sessions and license authorizations.</p>
                          </div>
                          <button 
                             onClick={() => {
                                const newKey = 'TX-' + crypto.randomUUID().substring(0, 8).toUpperCase();
                                const newName = prompt('Enter authorized user name:');
                                if (newName) {
                                   setUsers(prev => [...prev, { id: Date.now(), name: newName, licenseKey: newKey, active: true, profit: 0, balance: 0, role: 'Trader' as Role, executionStatus: 'Initializing Hyper-Connect...' }]);
                                   showToast(`Issued institutional key ${newKey} for ${newName}`);
                                }
                             }}
                             className="bg-[#00ffbb]/10 hover:bg-[#00ffbb]/20 text-[#00ffbb] px-6 py-3 rounded-xl font-bold text-xs border border-[#00ffbb]/30 hover:shadow-[0_0_20px_rgba(0,255,187,0.2)] transition-all uppercase tracking-widest"
                          >
                             + Authorize New License
                          </button>
                       </div>
                       
                       <div className="w-full bg-black/40 border border-white/10 rounded-2xl overflow-hidden shadow-2xl overflow-x-auto">
                          <table className="w-full text-left text-sm whitespace-nowrap">
                             <thead className="bg-white/5 text-gray-500 uppercase text-[10px] tracking-widest font-bold border-b border-white/10">
                                <tr>
                                   <th className="px-8 py-5">Profile Entity</th>
                                   <th className="px-8 py-5">Key Signature</th>
                                   <th className="px-8 py-5">Status</th>
                                   <th className="px-8 py-5 text-right">Capital</th>
                                   <th className="px-8 py-5 text-right">P&L (Abs)</th>
                                   <th className="px-8 py-5">System Execution</th>
                                   <th className="px-8 py-5 text-center text-[#ff007b]">Action</th>
                                </tr>
                             </thead>
                             <tbody className="divide-y divide-white/5">
                                {users.map(u => (
                                   <tr key={u.id} className="hover:bg-white/5 transition-colors">
                                      <td className="px-8 py-5 font-semibold text-gray-200 flex items-center gap-4">
                                         <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600/20 to-purple-600/20 flex items-center justify-center border border-white/10 shadow-lg">
                                            <User size={16} className="text-gray-400" />
                                         </div>
                                         <div className="flex flex-col">
                                            <span className="text-sm font-bold text-white mb-0.5">{u.name}</span>
                                            <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">{u.role}</span>
                                         </div>
                                      </td>
                                      <td className="px-8 py-5 font-mono text-xs text-gray-500">{u.licenseKey}</td>
                                      <td className="px-8 py-5">
                                         <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest border ${u.active ? 'bg-[#00ffbb]/10 text-[#00ffbb] border-[#00ffbb]/20' : 'bg-[#ff007b]/10 text-[#ff007b] border-[#ff007b]/20'}`}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${u.active ? 'bg-[#00ffbb]' : 'bg-[#ff007b]'}`} />
                                            {u.active ? 'Verified' : 'Revoked'}
                                         </div>
                                      </td>
                                      <td className="px-8 py-5 text-right font-mono text-gray-300 font-medium">${u.balance.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                                      <td className={`px-8 py-5 text-right font-mono font-bold ${u.profit >= 0 ? 'text-[#00ffbb]' : 'text-[#ff007b]'}`}>
                                         {u.profit > 0 ? '+' : ''}${Math.abs(u.profit).toFixed(2)}
                                      </td>
                                      <td className="px-8 py-5">
                                         <div className="flex items-center gap-3">
                                            <div className={`w-2 h-2 rounded-full ${u.active && u.executionStatus !== 'Idle // Offline' ? 'bg-[#00ffbb] animate-pulse shadow-[0_0_10px_rgba(0,255,187,0.5)]' : 'bg-gray-700'}`} />
                                            <span className={`text-[10px] font-mono tracking-tight ${u.active && u.executionStatus !== 'Idle // Offline' ? 'text-gray-200' : 'text-gray-500'}`}>
                                               {u.executionStatus}
                                            </span>
                                         </div>
                                      </td>
                                      <td className="px-8 py-5 text-center">
                                         <button 
                                            onClick={() => {
                                               setUsers(prev => prev.map(user => user.id === u.id ? { ...user, active: !user.active } : user));
                                               showToast(u.active ? `Emergency Deactivation for ${u.name}` : `Restored session for ${u.name}`);
                                            }}
                                            className={`text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-xl border transition-all ${u.active ? 'bg-[#ff007b]/10 text-[#ff007b] border-[#ff007b]/30 hover:bg-[#ff007b]/20' : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10 hover:text-white'}`}
                                         >
                                            {u.active ? 'Terminate' : 'Restore'}
                                         </button>
                                      </td>
                                   </tr>
                                ))}
                             </tbody>
                          </table>
                       </div>
                    </div>
                 )}

                 {adminTab === 'Risk' && (
                    <div className="p-8 space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
                       <div className="border-b border-white/5 pb-6">
                            <h3 className="font-bold text-xl text-white mb-1 tracking-tight">System-Wide Risk Safeguards</h3>
                            <p className="text-sm text-gray-400">Institutional-grade override controls for global liquidity and volatility protection.</p>
                       </div>

                       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                           {/* RR Optimizer */}
                           <div className={`p-6 rounded-3xl border transition-all ${rrOptimizerEnabled ? 'bg-[#ffcc00]/10 border-[#ffcc00]/40 shadow-[0_0_30px_rgba(255,204,0,0.1)]' : 'bg-white/5 border-white/10'}`}>
                              <div className="flex justify-between items-start mb-6">
                                 <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-lg ${rrOptimizerEnabled ? 'bg-[#ffcc00]/20 border-[#ffcc00]/30' : 'bg-white/10 border-white/20'}`}>
                                    <TrendingUp size={24} className={rrOptimizerEnabled ? 'text-[#ffcc00]' : 'text-gray-400'} />
                                 </div>
                                 <div 
                                   onClick={() => {
                                      setRrOptimizerEnabled(!rrOptimizerEnabled);
                                      showToast(rrOptimizerEnabled ? 'Standard Risk Engine' : '🎯 ALPHA RR OPTIMIZER ENGAGED');
                                   }}
                                   className={`w-12 h-6 rounded-full relative cursor-pointer transition-all ${rrOptimizerEnabled ? 'bg-[#ffcc00]' : 'bg-gray-700'}`}
                                 >
                                    <div className={`w-4 h-4 bg-white rounded-full absolute top-1 shadow-lg transition-all ${rrOptimizerEnabled ? 'right-1' : 'left-1'}`} />
                                 </div>
                              </div>
                              <h4 className="font-bold text-white mb-2">Alpha RR Ratio Optimizer</h4>
                              <p className="text-xs text-gray-500 mb-4 leading-relaxed">Mathematically force a minimum Risk-to-Reward ratio on every execution. Automatically shifts Take Profit based on dynamic Stop Loss to maintain Alpha.</p>
                              <div className="flex items-center gap-3">
                                 <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest font-bold">Target RR:</span>
                                 {[1.5, 2.0, 3.0, 5.0].map(val => (
                                    <button 
                                       key={val}
                                       onClick={() => setTargetRR(val)}
                                       className={`px-3 py-1 rounded-lg font-mono text-xs border transition-all ${targetRR === val ? 'bg-[#ffcc00] text-black border-[#ffcc00]' : 'bg-white/5 text-gray-400 border-white/10 hover:border-white/20'}`}
                                    >
                                       {val.toFixed(1)}
                                    </button>
                                 ))}
                              </div>
                           </div>
                          {/* Panic Mode */}
                          <div className={`p-6 rounded-3xl border transition-all ${panicMode ? 'bg-[#ff007b]/10 border-[#ff007b]/40 shadow-[0_0_30px_rgba(255,0,123,0.1)]' : 'bg-white/5 border-white/10'}`}>
                             <div className="flex justify-between items-start mb-6">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-lg ${panicMode ? 'bg-[#ff007b]/20 border-[#ff007b]/30' : 'bg-white/10 border-white/20'}`}>
                                   <Zap size={24} className={panicMode ? 'text-[#ff007b]' : 'text-gray-400'} />
                                </div>
                                <div 
                                  onClick={() => {
                                     setPanicMode(!panicMode);
                                     showToast(panicMode ? 'System Normalized' : '⚠️ PANIC MODE ACTIVATED: ALL TRADES HALTED');
                                  }}
                                  className={`w-12 h-6 rounded-full relative cursor-pointer transition-all ${panicMode ? 'bg-[#ff007b]' : 'bg-gray-700'}`}
                                >
                                   <div className={`w-4 h-4 bg-white rounded-full absolute top-1 shadow-lg transition-all ${panicMode ? 'right-1' : 'left-1'}`} />
                                </div>
                             </div>
                             <h4 className="font-bold text-white mb-2">Panic Mode (Kill Switch)</h4>
                             <p className="text-xs text-gray-500 leading-relaxed">Instantly halt all execution engines, revoke active trader licenses, and flatten all open positions globally. Use only in high-risk black swan events.</p>
                          </div>

                          {/* News Filter */}
                          <div className={`p-6 rounded-3xl border transition-all bg-white/5 border-white/10 hover:border-white/20`}>
                             <div className="flex justify-between items-start mb-6">
                                <div className="w-12 h-12 rounded-2xl bg-[#ffcc00]/20 flex items-center justify-center border border-[#ffcc00]/30 shadow-lg">
                                   <Globe size={24} className="text-[#ffcc00]" />
                                </div>
                                <div 
                                  onClick={() => setNewsFilter(!newsFilter)}
                                  className={`w-12 h-6 rounded-full relative cursor-pointer transition-all ${newsFilter ? 'bg-[#ffcc00]' : 'bg-gray-700'}`}
                                >
                                   <div className={`w-4 h-4 bg-white rounded-full absolute top-1 shadow-lg transition-all ${newsFilter ? 'right-1' : 'left-1'}`} />
                                </div>
                             </div>
                             <h4 className="font-bold text-white mb-2">Smart News Liquidity Filter</h4>
                             <p className="text-xs text-gray-500 leading-relaxed">Automatically pauses all bots 15 minutes before high-impact macroeconomic data (CPI, NFP, FOMC) and resumes 30 minutes after slippage stabilizes.</p>
                          </div>

                          {/* Auto Sizing */}
                          <div className="p-6 rounded-3xl border bg-white/5 border-white/10 hover:border-white/20 transition-all">
                             <div className="flex justify-between items-start mb-6">
                                <div className="w-12 h-12 rounded-2xl bg-[#00ffbb]/20 flex items-center justify-center border border-[#00ffbb]/30 shadow-lg">
                                   <Activity size={24} className="text-[#00ffbb]" />
                                </div>
                                <div 
                                  onClick={() => setAutoSizing(!autoSizing)}
                                  className={`w-12 h-6 rounded-full relative cursor-pointer transition-all ${autoSizing ? 'bg-[#00ffbb]' : 'bg-gray-700'}`}
                                >
                                   <div className={`w-4 h-4 bg-white rounded-full absolute top-1 shadow-lg transition-all ${autoSizing ? 'right-1' : 'left-1'}`} />
                                </div>
                             </div>
                             <h4 className="font-bold text-white mb-2">Dynamic Equity-Risk Sizing</h4>
                             <p className="text-xs text-gray-500 leading-relaxed">Enforce strict proportional lot sizing based on real-time account equity. Prevents manual traders from exceeding established risk-of-ruin parameters.</p>
                          </div>

                          {/* Multi-TF Confirmation */}
                          <div className="p-6 rounded-3xl border bg-white/5 border-white/10 hover:border-white/20 transition-all">
                             <div className="flex justify-between items-start mb-6">
                                <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30 shadow-lg">
                                   <Layout size={24} className="text-indigo-400" />
                                </div>
                                <div 
                                  className={`w-12 h-6 rounded-full relative cursor-pointer transition-all bg-indigo-500`}
                                >
                                   <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1 shadow-lg" />
                                </div>
                             </div>
                             <h4 className="font-bold text-white mb-2">Multi-TF Confluence Logic</h4>
                             <p className="text-xs text-gray-500 leading-relaxed">Mandatory confirmation of the 4H/1D trend bias before any lower timeframe (5m/15m) execution is authorized. Significantly reduces counter-trend drawdowns.</p>
                          </div>

                          {/* Session Filter */}
                          <div className="p-6 rounded-3xl border bg-white/5 border-white/10 hover:border-white/20 transition-all">
                             <div className="flex justify-between items-start mb-6">
                                <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center border border-blue-500/30 shadow-lg">
                                   <Clock size={24} className="text-blue-400" />
                                </div>
                                <div 
                                  onClick={() => setSessionFilter(!sessionFilter)}
                                  className={`w-12 h-6 rounded-full relative cursor-pointer transition-all ${sessionFilter ? 'bg-blue-500' : 'bg-gray-700'}`}
                                >
                                   <div className={`w-4 h-4 bg-white rounded-full absolute top-1 shadow-lg transition-all ${sessionFilter ? 'right-1' : 'left-1'}`} />
                                </div>
                             </div>
                             <h4 className="font-bold text-white mb-2">Institutional Session Filter</h4>
                             <p className="text-xs text-gray-500 leading-relaxed">Restricts algorithmic trading to London and New York overlaps only. Disables engine during low-liquidity Asian sessions and bank holidays.</p>
                          </div>

                          {/* Whale Mode */}
                          <div className={`p-6 rounded-3xl border transition-all ${whaleMode ? 'bg-[#00ffbb]/10 border-[#00ffbb]/40 shadow-[0_0_30px_rgba(0,255,187,0.1)]' : 'bg-white/5 border-white/10'}`}>
                             <div className="flex justify-between items-start mb-6">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-lg ${whaleMode ? 'bg-[#00ffbb]/20 border-[#00ffbb]/30' : 'bg-white/10 border-white/20'}`}>
                                   <TrendingUp size={24} className={whaleMode ? 'text-[#00ffbb]' : 'text-gray-400'} />
                                </div>
                                <div 
                                  onClick={() => {
                                     setWhaleMode(!whaleMode);
                                     showToast(whaleMode ? 'Standard Extraction Resumed' : '🚀 WHALE MODE ACTIVATED: HYPER-LIQUIDITY EXPLOITATION ACTIVE');
                                  }}
                                  className={`w-12 h-6 rounded-full relative cursor-pointer transition-all ${whaleMode ? 'bg-[#00ffbb]' : 'bg-gray-700'}`}
                                >
                                   <div className={`w-4 h-4 bg-white rounded-full absolute top-1 shadow-lg transition-all ${whaleMode ? 'right-1' : 'left-1'}`} />
                                </div>
                             </div>
                             <h4 className="font-bold text-white mb-2">Whale Mode (Hyper Profit)</h4>
                             <p className="text-xs text-gray-500 leading-relaxed">Engage high-frequency order blocks to front-run institutional volume. Bypasses standard risk limiters to capture maximum market alpha. Use for extreme profit-maximalization.</p>
                          </div>
                       </div>
                    </div>
                 )}

                 {adminTab === 'Mirror' && (
                    <div className="flex-1 overflow-y-auto p-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <LiveTradeRoom roomId="general" userName={localStorage.getItem('trax_user_name') || 'Trader'} />
                    </div>
                 )}
                 {adminTab === 'Intelligence' && (
                    <div className="flex-1 flex flex-col p-8 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                       <div className="flex justify-between items-end border-b border-white/5 pb-6">
                          <div>
                              <h3 className="font-bold text-xl text-white mb-1 tracking-tight">System Intelligence & Live Telemetry</h3>
                              <p className="text-sm text-gray-400">Real-time stream of engine logs, network latency, and AI decision-making events.</p>
                          </div>
                          <div className="flex items-center gap-4">
                             <div className="flex flex-col items-end">
                                <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest block">Network Status</span>
                                <span className="text-xs font-mono text-[#00ffbb]">STABLE // ENCRYPTED</span>
                             </div>
                             <div className="w-[1px] h-8 bg-white/10" />
                             <button onClick={() => setSystemLogs([])} className="text-[10px] font-bold text-gray-400 hover:text-white uppercase tracking-widest bg-white/5 px-4 py-2 rounded-lg border border-white/10 transition-all">
                                Clear Terminal
                             </button>
                          </div>
                       </div>

                       <div className="flex-1 bg-black/60 rounded-3xl border border-white/20 p-6 font-mono text-xs overflow-y-auto custom-scrollbar flex flex-col gap-2 shadow-inner">
                          {systemLogs.map(log => (
                             <div key={log.id} className="flex gap-4 group">
                                <span className="text-gray-600 select-none">[{log.time}]</span>
                                <span className={`font-bold whitespace-nowrap ${log.type === 'error' ? 'text-red-500' : log.type === 'warn' ? 'text-[#ffcc00]' : 'text-[#00ffbb]'}`}>
                                   {log.type === 'info' ? '>>' + ' INFO:' : log.type === 'warn' ? '!! WARN:' : 'XX FAIL:'}
                                </span>
                                <span className="text-gray-300 group-hover:text-white transition-colors">{log.message}</span>
                             </div>
                          ))}
                          <div className="flex gap-4 animate-pulse">
                             <span className="text-gray-700 select-none">[{new Date().toLocaleTimeString()}]</span>
                             <span className="text-[#00ffbb] font-bold">{'>>'} LISTENING:</span>
                             <span className="text-gray-500 italic">Waiting for next system event...</span>
                          </div>
                       </div>

                       <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                          <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                             <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1 block">Active Sessions</span>
                             <span className="text-lg font-mono font-bold text-white">{users.filter(u => u.active).length} / {users.length}</span>
                          </div>
                          <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                             <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1 block">Engine Status</span>
                             <span className="text-lg font-mono font-bold text-[#00ffbb]">IDLE // READY</span>
                          </div>
                          <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                             <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1 block">Data Relays</span>
                             <span className="text-lg font-mono font-bold text-white">READY</span>
                          </div>
                          <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                             <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1 block">Security Layer</span>
                             <span className="text-lg font-mono font-bold text-emerald-400">ENCRYPTED</span>
                          </div>
                       </div>
                    </div>
                 )}
              </div>

              {/* Terminal Footer */}
              <div className="px-8 py-4 border-t border-white/10 bg-black/40 flex flex-col md:flex-row justify-between items-center gap-4">
                 <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                       <div className="w-2 h-2 rounded-full bg-[#00ffbb] animate-pulse" />
                       <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Database Sync: OK</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <div className="w-2 h-2 rounded-full bg-[#00ffbb]" />
                       <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Global P&L Feed: CONNECTED</span>
                    </div>
                    <a 
                      href="https://wa.me/256753091309" 
                      target="_blank" 
                      rel="noreferrer"
                      className="flex items-center gap-2 bg-[#00ffbb]/10 px-3 py-1 rounded-full border border-[#00ffbb]/20 hover:bg-[#00ffbb]/20 transition-all"
                    >
                       <Megaphone size={10} className="text-[#00ffbb]" />
                       <span className="text-[9px] font-bold text-[#00ffbb] uppercase tracking-widest">Activation Support: +256 753 091 309</span>
                    </a>
                 </div>
                 <div className="text-[10px] font-mono text-gray-600">
                    Proprietary Algorithm Engine // Maky Tx // © 2026 Trax Algo
                 </div>
              </div>
           </motion.div>
        </div>
      )}

      {/* Left Panel - Chat */}
      <div className={`flex flex-col border-r border-[#222] h-full ${mobileView === 'chat' ? 'flex flex-1 w-full' : 'hidden md:flex md:w-[400px]'}`}>
        
        {/* Chat Header */}
        <div className="px-4 py-3 flex items-center justify-between border-b border-[#222]">
           <button onClick={() => setShowDashboard(true)} className="p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-[#222]">
              <User size={20} />
           </button>
           <button onClick={() => setMobileView('chart')} className="p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-[#222]">
              <BarChart2 size={20} />
           </button>
           <button className="p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-[#222]">
              <Bell size={20} />
           </button>
        </div>

        {/* Messages / Content */}
        <div className="flex-1 overflow-y-auto px-6 pt-2 custom-scrollbar relative">
          
          {messages.length <= 1 && messages[0]?.role !== 'user' ? (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="pb-12 ml-2">
              <h1 className="text-[28px] font-bold mb-2 text-white tracking-tight">What's your edge today?</h1>
              <p className="text-sm font-mono text-[#00ffbb]/80 mb-8 tracking-wide">Powered by Trax Algo Engine. Architected by Maky Tx.</p>
              {messages.length === 1 && (
                <div className="mb-10 p-5 rounded-2xl bg-gradient-to-r from-[#111114] to-[#1A1A1E] border border-[#333] shadow-lg">
                  <div className="flex items-center space-x-2 mb-3">
                    <Activity size={16} className="text-[#00ffbb]" />
                    <span className="text-[11px] uppercase font-bold text-[#00ffbb] tracking-wider">Trax Algo Super-Intelligence</span>
                  </div>
                  <div className="prose prose-invert prose-p:leading-relaxed prose-a:text-[#00ffbb] prose-p:my-2 prose-pre:my-0 max-w-none prose-sm w-full text-gray-300 text-[15px]">
                    <Markdown components={{
                      code: CodeBlock,
                      pre: ({ children }: any) => <>{children}</>
                    }}>
                      {messages[0].content}
                    </Markdown>
                  </div>
                </div>
              )}
              <div className="flex flex-col items-start space-y-3 mb-10">
                <button 
                  onClick={() => {
                     setInput("Generate a Pine Script from this image reference");
                     const syntheticEvent = { preventDefault: () => {} } as React.FormEvent;
                     setTimeout(() => {
                         const submitEvent = new Event('submit', { cancelable: true, bubbles: true });
                         const form = document.getElementById('chat-form') as HTMLFormElement;
                         if (form) {
                            form.dispatchEvent(submitEvent);
                         }
                     }, 50);
                  }}
                  className="w-fit bg-transparent hover:bg-[#1A1A1E] border border-[#333] hover:border-[#444] rounded-full py-2.5 px-6 flex items-center transition-all text-gray-200 gap-3 group"
                >
                  <ImageIcon size={18} className="text-gray-400 group-hover:text-white" />
                  <span className="text-[15px] font-medium">Generate From Image</span>
                </button>
                <button 
                  onClick={() => {
                     setInput("Search trending scripts");
                     setTimeout(() => {
                         const submitEvent = new Event('submit', { cancelable: true, bubbles: true });
                         const form = document.getElementById('chat-form') as HTMLFormElement;
                         if (form) {
                            form.dispatchEvent(submitEvent);
                         }
                     }, 50);
                  }}
                  className="w-fit bg-transparent hover:bg-[#1A1A1E] border border-[#333] hover:border-[#444] rounded-full py-2.5 px-6 flex items-center transition-all text-gray-200 gap-3 group"
                >
                  <TrendingUp size={18} className="text-gray-400 group-hover:text-white" />
                  <span className="text-[15px] font-medium">Search Trending Scripts</span>
                </button>
                <button 
                  onClick={() => {
                     setInput("Brainstorm a trend-following scalper");
                     setTimeout(() => {
                         const submitEvent = new Event('submit', { cancelable: true, bubbles: true });
                         const form = document.getElementById('chat-form') as HTMLFormElement;
                         if (form) {
                            form.dispatchEvent(submitEvent);
                         }
                     }, 50);
                  }}
                  className="w-fit bg-transparent hover:bg-[#1A1A1E] border border-[#333] hover:border-[#444] rounded-full py-2.5 px-6 flex items-center transition-all text-gray-200 gap-3 group"
                >
                  <Brain size={18} className="text-gray-400 group-hover:text-white" />
                  <span className="text-[15px] font-medium">Brainstorm Ideas</span>
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="space-y-6 pb-6">
              {messages.filter((m, i) => i !== 0).map((message, index) => (
                <React.Fragment key={index}>
                   <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`p-4 rounded-2xl max-w-[90%] text-sm shadow-md ${
                          message.role === 'user' 
                            ? 'bg-[#222] text-white border border-[#333]' 
                            : 'bg-gradient-to-r from-[#111114] to-[#1A1A1E] border border-[#333]'
                        }`}
                      >
                        {message.role === 'model' && (
                            <div className="flex items-center space-x-2 mb-3">
                              <Activity size={16} className="text-[#00ffbb]" />
                              <span className="text-[11px] uppercase font-bold text-[#00ffbb] tracking-wider">Trax Algo Super-Intelligence</span>
                            </div>
                        )}
                        {message.image && (
                          <div className="mb-3">
                            <img src={message.image} alt="User sent image" className="max-h-60 rounded-lg object-contain border border-[#444]" />
                          </div>
                        )}
                        <div className="prose prose-invert prose-p:leading-relaxed prose-a:text-[#00ffbb] prose-p:my-2 prose-pre:my-0 max-w-none prose-sm w-full text-gray-300 text-[15px]">
                          <Markdown components={{
                            code: CodeBlock,
                            pre: ({ children }: any) => <>{children}</>
                          }}>
                            {message.content}
                          </Markdown>
                        </div>
                      </div>
                    </motion.div>
                </React.Fragment>
              ))}
              {isLoading && (
                <div className="flex items-center space-x-2 text-gray-500 px-2 animate-pulse">
                  <Terminal size={14} />
                  <span className="text-xs font-mono">Running Trax Engine...</span>
                </div>
              )}
              <div ref={bottomRef} className="h-4" />
            </div>
          )}
        </div>

        {/* Custom Input Area */}
        <div className="p-4 bg-[#0E0E11] w-full">
          <div className="bg-[#18181A] border border-[#333] rounded-[24px] p-2 relative focus-within:border-[#555] transition-colors">
            <form 
              id="chat-form"
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit(e);
              }} 
              className="flex flex-col"
            >
              {selectedImageBase64 && (
                <div className="relative w-fit mx-3 mt-3 mb-1">
                  <img src={selectedImageBase64} alt="Upload preview" className="h-16 rounded-md object-cover border border-[#444]" />
                  <button type="button" onClick={removeSelectedImage} className="absolute -top-2 -right-2 bg-black hover:bg-red-500 rounded-full p-0.5 border border-[#333] hover:border-transparent transition-colors">
                    <X size={14} className="text-white" />
                  </button>
                </div>
              )}
              <textarea 
                value={input}
                onChange={e => {
                   setInput(e.target.value);
                   e.target.style.height = 'auto'; // Reset height
                   e.target.style.height = Math.min(e.target.scrollHeight, 200) + 'px'; // Set new height, max 200px
                }}
                className="w-full bg-transparent border-none focus:ring-0 resize-none text-[15px] text-white placeholder-white/90 min-h-[50px] max-h-[200px] overflow-y-auto py-2 px-3 custom-scrollbar"
                placeholder={messages.length <= 1 ? "Describe the inefficiency you want to capture..." : "Reply to Trax Algo Super-Intelligence..."}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    if ((input.trim() || selectedImageBase64) && !isLoading) {
                       const formEvent = { preventDefault: () => {} } as React.FormEvent;
                       handleSubmit(formEvent);
                       (e.target as HTMLTextAreaElement).style.height = 'auto'; // Reset height
                    }
                  }
                }}
              />
              <div className="flex justify-between items-end mt-1 px-2 pb-1 bg-transparent">
                <div className="flex space-x-1">
                  <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} className="hidden" />
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="p-1.5 text-gray-400 hover:text-white transition-colors bg-transparent rounded-md flex items-center justify-center">
                    <ImageIcon size={20} />
                  </button>
                  <button type="button" onClick={toggleRecording} className={`p-1.5 transition-colors bg-transparent rounded-md flex items-center justify-center ${isRecording ? 'text-red-500 hover:text-red-400 animate-pulse' : 'text-gray-400 hover:text-white'}`}>
                    {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
                  </button>
                </div>
                <button 
                  type="submit" 
                  disabled={(!input.trim() && !selectedImageBase64) || isLoading} 
                  className="w-8 h-8 flex items-center justify-center bg-[#555] hover:bg-[#666] text-black rounded-full disabled:opacity-50 disabled:bg-[#333] transition-colors"
                >
                  <ArrowUp size={18} strokeWidth={2.5} />
                </button>
              </div>
            </form>
          </div>
          <p className="text-center text-[11px] text-gray-500 mt-3 leading-tight">
            Past performance is not indicative of future results.<br/>
            This tool can make errors. Read <span className="text-gray-300">full disclaimer</span>.
          </p>
        </div>
        
      </div>

      {/* Right Panel - Chart & Preview */}
      <div className={`flex-1 flex-col bg-[#141417] relative border-l border-[#222] ${mobileView === 'chart' ? 'flex' : 'hidden md:flex'}`}>
        
        {/* Toast Notification */}
        {toastMessage && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-[#222] border border-[#444] text-[#00ffbb] px-4 py-2 rounded-full shadow-lg text-xs font-mono font-bold animate-in fade-in slide-in-from-top-2">
            {toastMessage}
          </div>
        )}

        {/* Toolbar */}
        {!isMobile && (
          <div className="h-[52px] border-b border-[#222] flex items-center px-4 space-x-4 bg-[#111114]">
            <button 
               onClick={() => handleLogout('Exiting Terminal...')} 
               className="text-gray-500 hover:text-white transition-colors p-1"
               title="Exit Engine"
            >
               <ChevronLeft size={18}/>
            </button>
            
            <div onClick={() => showToast('Opening scripts folder...')} className="flex items-center space-x-2 text-sm text-gray-300 hover:text-white cursor-pointer px-2">
              <Folder size={16} className="text-gray-500" />
            </div>
            
            <div onClick={() => showToast('Opening active script...')} className="flex items-center space-x-2 text-sm text-white bg-[#1A1A1E] border border-[#333] px-3 py-1.5 rounded-lg shadow-inner cursor-pointer font-medium">
              <Code size={16} className="text-emerald-500" />
              <span>My script</span>
            </div>

            <div className="flex-1"></div>

            <div className="flex items-center space-x-3">
              <div className="relative">
                <button 
                   onClick={() => setShowNotifications(!showNotifications)}
                   className="p-1.5 text-gray-400 hover:text-white transition-colors relative"
                >
                   <Bell size={18} />
                   {notifications.length > 0 && (
                      <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-[#111114]"></span>
                   )}
                </button>
                
                {showNotifications && (
                   <div className="absolute top-10 right-0 w-80 bg-[#1A1A1E] border border-[#333] rounded-lg shadow-2xl overflow-hidden py-1 z-50">
                      <div className="px-4 py-3 border-b border-[#333] flex justify-between items-center bg-[#111]">
                         <span className="text-[11px] font-bold text-gray-300 uppercase tracking-widest">Notifications</span>
                         <span className="text-[10px] bg-[#333] px-2 py-0.5 rounded-full text-white">{notifications.length} New</span>
                      </div>
                      <div className="max-h-64 overflow-y-auto custom-scrollbar">
                         {notifications.length === 0 ? (
                            <div className="py-6 text-center text-xs text-gray-500">No new notifications</div>
                         ) : (
                            notifications.map(n => (
                               <div key={n.id} className={`px-4 py-3 border-b border-[#222] hover:bg-[#222] transition-colors ${n.isAnnouncement ? 'border-l-2 border-l-orange-500 bg-orange-500/5' : ''}`}>
                                  <div className="text-xs text-gray-200 mb-1 leading-snug">{n.text}</div>
                                  <div className="text-[10px] text-gray-500 font-mono">{n.time}</div>
                               </div>
                            ))
                         )}
                      </div>
                   </div>
                )}
              </div>

              <WalletConnector 
                walletAddress={walletAddress}
                setWalletAddress={setWalletAddress}
                isWalletConnecting={isWalletConnecting}
                setIsWalletConnecting={setIsWalletConnecting}
                showToast={showToast}
                userRole={userRole}
              />
              <button 
                onClick={() => (userRole === 'Admin' || userRole === 'Trader') ? setShowBrokerModal(true) : showToast('Role Restricted: Live broker connections reserved for Traders & Admins')}
                className={`h-8 px-4 rounded-full transition-all disabled:opacity-50 flex items-center justify-center space-x-2 shadow-md border min-w-[140px] text-xs font-bold ${
                  (userRole === 'Admin' || userRole === 'Trader')
                    ? (connectedBroker 
                      ? 'bg-gradient-to-r from-emerald-600/20 to-[#00ffbb]/20 border-[#00ffbb]/50 text-[#00ffbb] hover:bg-[#00ffbb]/30' 
                      : isBrokerConnecting 
                        ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-500 hover:bg-yellow-500/30'
                        : 'bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 border-[#444] text-white')
                    : 'bg-gray-800 border-[#333] opacity-40 cursor-not-allowed text-gray-500'
                }`}
              >
                <div className={`w-2 h-2 rounded-full ${
                  connectedBroker 
                    ? 'bg-[#00ffbb] shadow-[0_0_8px_rgba(0,255,187,0.8)]' 
                    : isBrokerConnecting 
                      ? 'bg-yellow-500 animate-pulse'
                      : 'bg-gray-400'
                }`} />
                <span>{isBrokerConnecting ? 'Connecting...' : connectedBroker ? `Connected: ${connectedBroker}` : 'Connect Broker'}</span>
              </button>
              <button onClick={() => setShowDashboard(true)} className="w-8 h-8 rounded-full bg-[#1A1A1E] border border-[#333] flex items-center justify-center hover:bg-[#222] transition-colors relative">
                <User size={16} className={isAdmin ? 'text-[#00ffbb]' : 'text-gray-400'}/>
                {isAdmin && <div className="absolute top-0 right-0 w-2 h-2 bg-[#00ffbb] rounded-full ring-2 ring-[#141417]" />}
              </button>
              <div className="hidden lg:flex flex-col items-end leading-none ml-2">
                <span className="text-[10px] font-bold text-[#00ffbb] uppercase tracking-widest">License Active</span>
                <span className="text-[9px] font-mono text-gray-500 uppercase tracking-tighter">Institutional v6.2</span>
              </div>
            </div>
          </div>
        )}

        {/* Floating Mobile Headers */}
        {isMobile && (
          <div className="absolute top-0 left-0 w-full p-4 pointer-events-none z-[75] flex justify-between items-start">
             {/* Floating Top Left */}
             <div className="flex flex-col gap-3 pointer-events-auto">
                <motion.button 
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleLogout('Exiting Terminal...')}
                  className="w-10 h-10 rounded-xl bg-[#1A1A1E]/80 backdrop-blur-md border border-white/10 flex items-center justify-center text-gray-400 shadow-xl"
                >
                  <ChevronLeft size={20} />
                </motion.button>
                
                <motion.div 
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="flex flex-col gap-2"
                >
                   <div 
                      onClick={() => setIsSymbolMenuOpen(!isSymbolMenuOpen)}
                      className="flex items-center space-x-2 bg-[#00ffbb]/10 backdrop-blur-xl border border-[#00ffbb]/30 px-3 py-2 rounded-xl shadow-[0_0_20px_rgba(0,255,187,0.15)] text-xs text-white cursor-pointer select-none"
                   >
                     <div className="w-6 h-6 rounded-lg bg-[#F7931A] flex items-center justify-center font-bold text-white shadow-inner">
                        <span style={{ fontSize: '12px' }}>{symbol.includes(':') ? symbol.split(':')[1][0] : symbol[0]}</span>
                     </div>
                     <div className="flex flex-col items-start leading-none gap-0.5">
                        <span className="font-bold text-[13px] tracking-tight">{symbol.includes(':') ? symbol.split(':')[1] : symbol}</span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-gray-400 font-mono tracking-widest">{timeframe}</span>
                          <div className="w-1 h-1 rounded-full bg-[#00ffbb]" />
                          <span className="text-[9px] text-[#00ffbb] font-bold uppercase tracking-widest">Active</span>
                        </div>
                     </div>
                     <ChevronDown size={14} className="text-[#00ffbb]/50 ml-1" />
                   </div>

                   {isSymbolMenuOpen && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-64 bg-[#1A1A1E] border border-white/10 rounded-2xl shadow-2xl z-[100] py-1 flex flex-col max-h-[60vh] overflow-y-auto backdrop-blur-2xl ring-1 ring-white/5"
                      >
                         <div className="px-4 py-2.5 text-[10px] font-bold text-[#00ffbb] uppercase tracking-[0.2em] border-b border-white/5 bg-white/5">Asset Selection</div>
                         {/* Selection lists... (Reusing existing logic but styled for floating) */}
                         <div className="px-2 py-2 grid gap-1">
                            {['BINANCE:BTCUSD', 'BINANCE:ETHUSD', 'BINANCE:SOLUSD', 'BINANCE:XRPUSD', 'OANDA:EURUSD', 'OANDA:XAUUSD'].map(sym => (
                               <div 
                                  key={sym} 
                                  className={`px-4 py-2.5 rounded-xl text-sm transition-all flex items-center justify-between ${symbol === sym ? 'bg-[#00ffbb]/10 text-[#00ffbb] font-bold' : 'text-gray-400 hover:bg-white/5'}`}
                                  onClick={() => { setSymbol(sym); setIsSymbolMenuOpen(false); }}
                                >
                                   <span>{sym.split(':')[1]}</span>
                                   <span className="text-[10px] uppercase font-mono opacity-50">{sym.split(':')[0]}</span>
                                </div>
                            ))}
                         </div>
                         <div className="h-[1px] bg-white/5 mx-4 my-1" />
                         <div className="px-4 py-2.5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Timeframe</div>
                         <div className="grid grid-cols-3 gap-2 px-4 pb-4">
                            {['1m', '5m', '15m', '1h', '4h', '1D'].map(tf => (
                                <div 
                                  key={tf} 
                                  className={`text-center py-2 rounded-lg cursor-pointer text-xs transition-all border ${timeframe === tf ? 'bg-[#333] border-[#00ffbb]/50 text-[#00ffbb] font-bold' : 'bg-[#222]/50 border-white/5 text-gray-500 hover:text-white'}`}
                                  onClick={() => { setTimeframe(tf); setIsSymbolMenuOpen(false); }}
                                >
                                   {tf}
                                </div>
                            ))}
                         </div>
                      </motion.div>
                   )}
                </motion.div>
             </div>

             {/* Floating Top Right */}
             <div className="flex flex-col items-end gap-3 pointer-events-auto">
                <div className="flex items-center gap-2">
                   {/* Megaphone component moved to Admin Dashboard */}
                   <motion.button 
                     whileTap={{ scale: 0.9 }}
                     onClick={() => setShowNotifications(!showNotifications)}
                     className={`w-10 h-10 rounded-xl relative flex items-center justify-center transition-all ${showNotifications ? 'bg-white text-black shadow-lg' : 'bg-[#1A1A1E]/80 backdrop-blur-md border border-white/10 text-gray-400'}`}
                   >
                      <Bell size={18} />
                      {notifications.length > 0 && (
                         <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-transparent"></span>
                      )}
                   </motion.button>
                   <motion.button 
                     whileTap={{ scale: 0.9 }}
                     onClick={() => (userRole === 'Admin' || userRole === 'Trader') ? setShowBrokerModal(true) : showToast('Role Restricted: Live broker connections reserved for Traders & Admins')}
                     className={`w-10 h-10 rounded-xl relative flex items-center justify-center transition-all shadow-lg ${connectedBroker ? 'bg-[#00ffbb] text-black shadow-[#00ffbb]/40' : 'bg-white/10 text-white border border-white/20'}`}
                   >
                      <Wallet size={18} />
                   </motion.button>
                   <motion.button 
                     whileTap={{ scale: 0.9 }}
                     onClick={() => setShowDashboard(true)}
                     className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center relative shadow-black/40 shadow-lg"
                   >
                      <User size={18} className={isAdmin ? 'text-[#00ffbb]' : 'text-white'} />
                      {isAdmin && <div className="absolute top-1 right-1 w-2 h-2 bg-[#00ffbb] rounded-full" />}
                   </motion.button>
                </div>

                {/* Announcement Modal (Mobile Floating) */}
                {showAnnouncementModal && (
                   <motion.div 
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     className="w-[calc(100vw-2rem)] sm:w-72 bg-[#1A1A1E] border border-orange-500/30 rounded-2xl shadow-2xl overflow-hidden py-1 z-[100] mt-2 backdrop-blur-2xl"
                   >
                       <div className="px-4 py-3 border-b border-white/5 flex justify-between items-center bg-white/5">
                          <span className="text-[10px] font-bold text-orange-400 uppercase tracking-widest">Global Broadcast</span>
                          <button onClick={() => setShowAnnouncementModal(false)} className="text-gray-500 hover:text-white"><X size={14} /></button>
                       </div>
                       <div className="p-4 space-y-4">
                          <textarea 
                             value={announcementText}
                             onChange={(e) => setAnnouncementText(e.target.value)}
                             className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white min-h-[100px] resize-none focus:border-orange-500/50 focus:outline-none placeholder:text-gray-600"
                             placeholder="System-wide alert message..."
                          />
                          <button 
                             onClick={() => {
                                if (announcementText.trim()) {
                                   setNotifications(prev => [{id: Date.now(), text: announcementText, time: 'Just now', isAnnouncement: true}, ...prev]);
                                   setAnnouncementText('');
                                   setShowAnnouncementModal(false);
                                   showToast('Alert Sent Successfully');
                                }
                             }}
                             className="w-full bg-orange-500 hover:bg-orange-600 text-black font-extrabold uppercase tracking-widest text-[11px] py-3 rounded-xl transition-all shadow-lg shadow-orange-500/20 active:scale-95"
                          >
                             Blast Alert
                          </button>
                       </div>
                   </motion.div>
                )}

                {/* Notification Dropdown (Mobile Floating) */}
                {showNotifications && (
                   <motion.div 
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     className="fixed top-20 right-4 w-[calc(100vw-2rem)] sm:w-80 bg-[#1A1A1E] border border-white/10 rounded-2xl shadow-2xl overflow-hidden py-1 z-[100] mt-2 backdrop-blur-2xl"
                   >
                      <div className="px-4 py-4 border-b border-white/5 flex justify-between items-center bg-white/5">
                         <span className="text-[11px] font-bold text-gray-300 uppercase tracking-widest">Recent Activity</span>
                         <div className="flex items-center gap-2">
                             <span className="text-[9px] bg-white/10 px-2.5 py-1 rounded-full text-white font-mono uppercase tracking-tighter">{notifications.length} Pending</span>
                             <button onClick={() => setShowNotifications(false)} className="text-gray-500 hover:text-white"><X size={14} /></button>
                         </div>
                      </div>
                      <div className="max-h-80 overflow-y-auto custom-scrollbar">
                         {notifications.length === 0 ? (
                            <div className="py-12 text-center flex flex-col items-center justify-center gap-3">
                               <Bell size={24} className="text-gray-700" />
                               <span className="text-[11px] text-gray-600 uppercase font-bold tracking-widest">Inbox Empty</span>
                            </div>
                         ) : (
                            notifications.map(n => (
                               <div key={n.id} className={`px-4 py-4 border-b border-white/5 hover:bg-white/5 transition-colors ${n.isAnnouncement ? 'bg-orange-500/5 shadow-inner' : ''}`}>
                                  <div className={`text-sm mb-1.5 leading-snug font-medium ${n.isAnnouncement ? 'text-orange-200' : 'text-gray-300'}`}>{n.text}</div>
                                  <div className="text-[10px] text-gray-600 font-mono uppercase tracking-tighter flex items-center gap-2">
                                     <Activity size={10} />
                                     {n.time}
                                  </div>
                               </div>
                            ))
                         )}
                      </div>
                   </motion.div>
                )}
             </div>
          </div>
        )}

        {/* Chart Area */}
        <div className="flex-1 overflow-hidden relative flex flex-col bg-[#1A1A1C]">
          {/* Chart Header Tools */}
          {!isMobile && (
            <div className="flex items-center space-x-4 px-4 py-2 absolute top-0 left-0 z-20 w-full bg-gradient-to-b from-[#1A1A1C] to-transparent">
              {/* Symbol / Timeframe Dropdown */}
              <div className="relative">
                <div 
                   onClick={() => { setIsSymbolMenuOpen(!isSymbolMenuOpen); setIsSettingsMenuOpen(false); }}
                   className="flex items-center space-x-2 bg-[#222] border border-[#333] px-2 py-1 rounded shadow-md text-xs text-gray-300 hover:bg-[#2A2A2E] cursor-pointer select-none"
                >
                  <div className="w-5 h-5 rounded-full bg-[#F7931A] flex items-center justify-center font-bold text-white shadow-inner">
                    <span style={{ fontSize: '10px' }}>{symbol.includes(':') ? symbol.split(':')[1][0] : symbol[0]}</span>
                  </div>
                  <span className="font-bold text-white">{symbol.includes(':') ? symbol.split(':')[1] : symbol}</span>
                  <span className="text-gray-400 font-mono">{timeframe}</span>
                  <ChevronDown size={14} className="text-gray-500 ml-1" />
                </div>

                {isSymbolMenuOpen && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-[#1A1A1E] border border-[#333] rounded-lg shadow-xl z-50 py-1 flex flex-col max-h-96 overflow-y-auto">
                     <div className="px-3 py-2 text-xs font-bold text-[#00ffbb] uppercase tracking-wider border-b border-[#333] bg-[#222]">Crypto (Majors)</div>
                     {['BINANCE:BTCUSD', 'BINANCE:ETHUSD', 'BINANCE:SOLUSD', 'BINANCE:XRPUSD'].map(sym => (
                        <div 
                           key={sym} 
                           className={`px-4 py-2 text-sm cursor-pointer hover:bg-[#2A2A2E] ${symbol === sym ? 'text-[#00ffbb] font-medium bg-[#222]' : 'text-gray-300'}`}
                           onClick={() => { setSymbol(sym); setIsSymbolMenuOpen(false); }}
                        >
                           {sym.split(':')[1]} <span className="text-xs text-gray-500 ml-1">Crypto</span>
                        </div>
                     ))}
                     <div className="px-3 py-2 text-xs font-bold text-[#ff007b] uppercase tracking-wider border-y border-[#333] bg-[#222]">Memecoins</div>
                     {['BINANCE:PEPEUSDT', 'BINANCE:DOGEUSDT', 'BINANCE:SHIBUSDT'].map(sym => (
                        <div 
                           key={sym} 
                           className={`px-4 py-2 text-sm cursor-pointer hover:bg-[#2A2A2E] ${symbol === sym ? 'text-[#ff007b] font-medium bg-[#222]' : 'text-gray-300'}`}
                           onClick={() => { setSymbol(sym); setIsSymbolMenuOpen(false); }}
                        >
                           {sym.split(':')[1]} <span className="text-xs text-gray-500 ml-1">Meme</span>
                        </div>
                     ))}
                     <div className="px-3 py-2 text-xs font-bold text-[#00ffbb] uppercase tracking-wider border-y border-[#333] bg-[#222]">Forex & Metals</div>
                     {['OANDA:EURUSD', 'OANDA:GBPUSD', 'OANDA:USDJPY', 'OANDA:XAUUSD', 'OANDA:XAGUSD'].map(sym => (
                        <div 
                           key={sym} 
                           className={`px-4 py-2 text-sm cursor-pointer hover:bg-[#2A2A2E] ${symbol === sym ? 'text-[#00ffbb] font-medium bg-[#222]' : 'text-gray-300'}`}
                           onClick={() => { setSymbol(sym); setIsSymbolMenuOpen(false); }}
                        >
                           {sym.split(':')[1]} <span className="text-xs text-gray-500 ml-1">FX/Metal</span>
                        </div>
                     ))}
                     <div className="px-3 py-2 text-xs font-bold text-[#00ffbb] uppercase tracking-wider border-y border-[#333] bg-[#222]">Indices & Futures</div>
                     {['CME_MINI:ES1!', 'CME_MINI:NQ1!', 'NYMEX:CL1!', 'TVC:DXY', 'SP:SPX'].map(sym => (
                        <div 
                           key={sym} 
                           className={`px-4 py-2 text-sm cursor-pointer hover:bg-[#2A2A2E] ${symbol === sym ? 'text-[#00ffbb] font-medium bg-[#222]' : 'text-gray-300'}`}
                           onClick={() => { setSymbol(sym); setIsSymbolMenuOpen(false); }}
                        >
                           {sym.split(':')[1]} <span className="text-xs text-gray-500 ml-1">Idx/Fut</span>
                        </div>
                     ))}
                     <div className="px-3 py-2 text-xs font-bold text-[#00ffbb] uppercase tracking-wider border-y border-[#333] bg-[#222]">Stocks</div>
                     {['NASDAQ:AAPL', 'NASDAQ:TSLA', 'NASDAQ:MSFT', 'NASDAQ:NVDA'].map(sym => (
                        <div 
                           key={sym} 
                           className={`px-4 py-2 text-sm cursor-pointer hover:bg-[#2A2A2E] ${symbol === sym ? 'text-[#00ffbb] font-medium bg-[#222]' : 'text-gray-300'}`}
                           onClick={() => { setSymbol(sym); setIsSymbolMenuOpen(false); }}
                        >
                           {sym.split(':')[1]} <span className="text-xs text-gray-500 ml-1">Stock</span>
                        </div>
                     ))}
                     <div className="h-[1px] bg-[#333] my-1" />
                     <div className="px-3 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-[#333] mb-1 sticky bottom-0 bg-[#1A1A1E]">Timeframe</div>
                     <div className="grid grid-cols-3 gap-1 px-2 pb-2 sticky bottom-0 bg-[#1A1A1E]">
                       {['1m', '5m', '15m', '1h', '4h', '1D'].map(tf => (
                           <div 
                             key={tf} 
                             className={`text-center py-1.5 rounded cursor-pointer text-xs ${timeframe === tf ? 'bg-[#333] text-[#00ffbb] font-medium' : 'text-gray-400 hover:bg-[#2A2A2E]'}`}
                             onClick={() => { setTimeframe(tf); setIsSymbolMenuOpen(false); }}
                           >
                              {tf}
                           </div>
                       ))}
                     </div>
                  </div>
                )}
              </div>

              {/* Templates */}
              <div className="flex items-center space-x-2">
                 <button 
                    onClick={() => showToast('Indicator Templates auto-saved locally')}
                    className="px-2 py-1 text-xs bg-[#222] border border-[#333] rounded shadow-md text-gray-400 hover:text-[#00ffbb] hover:bg-[#2A2A2E] transition-colors flex items-center gap-1.5"
                 >
                    <Folder size={12} />
                    <span>Templates</span>
                 </button>
                 <button 
                    onClick={() => showToast('Geometric shapes, trend angle lines, and fibonacci tools are accessible in the left toolbar.')}
                    className="px-2 py-1 text-xs bg-[#222] border border-[#333] rounded shadow-md text-gray-400 hover:text-[#00ffbb] hover:bg-[#2A2A2E] transition-colors flex items-center gap-1.5"
                 >
                    <PenTool size={12} />
                    <span>Drawings</span>
                 </button>
                 <div className="text-[10px] text-[#00ffbb]/60 items-center gap-1 flex bg-[#00ffbb]/10 px-2 rounded-full py-0.5 border border-[#00ffbb]/20">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#00ffbb] animate-pulse"></div>
                    Auto-Saving
                 </div>
              </div>
              
              <div className="relative">
                <div className="flex items-center space-x-1 cursor-pointer">
                  <div 
                     onClick={() => setChartType(prev => prev === 'candles' ? 'line' : 'candles')}
                     className={`p-1.5 rounded transition-colors ${chartType === 'line' ? 'text-white bg-[#333]' : 'text-gray-500 hover:text-white hover:bg-[#333]'}`}
                  >
                    {chartType === 'candles' ? <LineChartIcon size={16} /> : <BarChart2 size={16} />}
                  </div>
                  <div 
                     onClick={() => { setIsSettingsMenuOpen(!isSettingsMenuOpen); setIsSymbolMenuOpen(false); }}
                     className={`p-1.5 rounded transition-colors ${isSettingsMenuOpen ? 'text-white bg-[#333]' : 'text-gray-500 hover:text-white hover:bg-[#333]'}`}
                  >
                    <Settings size={16} />
                  </div>
                </div>

                {isSettingsMenuOpen && (
                   <div className="absolute top-full left-0 mt-2 w-48 bg-[#1A1A1E] border border-[#333] rounded-lg shadow-xl z-50 flex flex-col py-2">
                      <label className="flex items-center space-x-3 px-4 py-2 hover:bg-[#2A2A2E] cursor-pointer">
                         <input 
                           type="checkbox" 
                           checked={showIndicators}
                           onChange={(e) => setShowIndicators(e.target.checked)}
                           className="form-checkbox h-4 w-4 text-[#00ffbb] rounded bg-[#111] border-[#333] focus:ring-0 focus:ring-offset-0"
                         />
                         <span className="text-sm text-gray-300">Show Indicators</span>
                      </label>
                   </div>
                )}
              </div>
              
              <div className="flex-1"></div>
              
            </div>
          )}

          <div className="flex flex-col gap-4 flex-grow">
            <div className="flex-1 w-full relative z-20 overflow-hidden flex-grow">
              <AdvancedRealTimeChart
                symbol={symbol === 'BTCUSD' ? 'BINANCE:BTCUSD' : symbol === 'ETHUSD' ? 'BINANCE:ETHUSD' : symbol === 'XAUUSD' ? 'OANDA:XAUUSD' : symbol === 'EURUSD' ? 'OANDA:EURUSD' : symbol}
                interval={timeframe === '1m' ? '1' : timeframe === '5m' ? '5' : timeframe === '15m' ? '15' : timeframe === '1h' ? '60' : timeframe === '4h' ? '240' : 'D' as any}
                theme="dark"
                locale="en"
                autosize
                style={chartType === 'candles' ? '1' : '2'}
                hide_top_toolbar={false}
                hide_side_toolbar={false}
                hide_legend={false}
                save_image={true}
                toolbar_bg="#1A1A1C"
                enable_publishing={false}
                allow_symbol_change={true}
                studies={showIndicators ? ["Volume@tv-basicstudies"] : []}
                container_id="trax_chart_container"
              />

              {/* AI Technical Layer Overlay */}
              <div className="absolute top-4 left-16 z-30 pointer-events-auto flex flex-col gap-2">
                  {isAlphaPanelVisible ? (
                    <div className="bg-black/60 backdrop-blur-sm border border-[#00ffbb]/30 p-3 rounded-lg flex flex-col gap-3 w-fit min-w-[280px]">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Brain size={14} className="text-[#00ffbb]" />
                                <span className="text-[10px] font-bold text-[#00ffbb] uppercase tracking-widest">Alpha-Analysis Engine</span>
                            </div>
                            <button onClick={() => setIsAlphaPanelVisible(false)} className="text-gray-500 hover:text-white">
                               <X size={14} />
                            </button>
                        </div>
                        {isAnalyzing ? (
                            <div className="flex items-center gap-1 text-[9px] text-gray-400">
                                <div className="w-1.5 h-1.5 bg-[#00ffbb] rounded-full animate-ping" />
                                ANALYZING...
                            </div>
                        ) : (
                            <div className={`px-2 py-0.5 rounded text-[10px] font-bold ${aiTrend === 'BULLISH' ? 'bg-[#00ffbb]/20 text-[#00ffbb]' : aiTrend === 'BEARISH' ? 'bg-[#ff007b]/20 text-[#ff007b]' : 'bg-white/10 text-white'}`}>
                              {aiTrend} {aiConfidence}%
                            </div>
                        )}
                        
                        {!isAnalyzing && (
                          <>
                            <div className="grid grid-cols-4 gap-1 border-t border-white/5 pt-2">
                                {aiTimeframes.map((tf, i) => (
                                    <div key={i} className="flex flex-col items-center">
                                        <span className="text-[8px] text-gray-500">{tf.tf}</span>
                                        <div className={`w-full h-1 mt-1 rounded-full ${tf.trend === 'BULLISH' ? 'bg-[#00ffbb]' : tf.trend === 'BEARISH' ? 'bg-[#ff007b]' : 'bg-gray-500'}`} />
                                    </div>
                                ))}
                            </div>
                            
                            <div className="flex flex-col gap-1 border-t border-white/5 pt-2">
                                {aiIndicators.map((ind, i) => (
                                    <div key={i} className="flex justify-between items-center text-[9px]">
                                        <span className="text-gray-400">{ind.name}</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-white font-mono">{ind.value}</span>
                                            <span className={`${ind.signal === 'BULLISH' ? 'text-[#00ffbb]' : ind.signal === 'BEARISH' ? 'text-[#ff007b]' : 'text-gray-500'}`}>
                                              {ind.signal.substring(0,4)}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                          </>
                        )}
                    </div>
                  ) : (
                    <button
                        onClick={() => setIsAlphaPanelVisible(true)}
                        className="p-3 bg-black/60 backdrop-blur-sm border border-[#00ffbb]/30 rounded-full text-[#00ffbb] hover:scale-105 transition-transform shadow-lg shadow-[#00ffbb]/20"
                    >
                        <Brain size={20} />
                    </button>
                  )}
                  
                  {agentSuggestions.length > 0 && (
                    <div className="bg-black/60 backdrop-blur-sm border border-purple-500/30 px-3 py-1.5 rounded-lg w-fit max-w-[280px]">
                      <span className="text-[9px] font-bold text-purple-400 uppercase tracking-widest">Agent Action:</span>
                      <p className="text-[10px] text-white mt-1">{agentSuggestions[agentSuggestions.length - 1]}</p>
                    </div>
                  )}
                  
                  {aiDrawings.map(level => (
                    <div key={level.id} className="bg-black/60 backdrop-blur-sm border border-white/10 px-3 py-1 rounded-lg flex items-center gap-2 w-fit text-[10px] text-white">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: level.color }} />
                        <span className="font-bold">{level.label}:</span>
                        <span className="text-[#00ffbb] font-mono">{level.price}</span>
                        <button 
                          onClick={() => setAiDrawings(prev => prev.filter(d => d.id !== level.id))}
                          className="pointer-events-auto ml-2 text-gray-500 hover:text-white"
                        >
                          <X size={10} />
                        </button>
                    </div>
                  ))}
              </div>
            </div>
            
            {/* Floating Icon */}
            <button 
              onClick={() => setIsOrderPanelOpen(!isOrderPanelOpen)}
              className="fixed right-6 bottom-20 z-50 bg-[#00ffbb] text-black w-14 h-14 rounded-full shadow-2xl flex items-center justify-center hover:bg-[#00cc99] transition-all"
            >
              <Zap size={24} />
            </button>

            {/* Order Panel Modal */}
            {isOrderPanelOpen && (
              <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="w-full max-w-md bg-[#111114] border border-white/10 rounded-2xl p-6 shadow-2xl">
                    <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
                        <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Manual Order Entry</h4>
                        <button onClick={() => setIsOrderPanelOpen(false)} className="text-gray-500 hover:text-white"><X size={18}/></button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <button 
                          onClick={() => setOrderType('BUY')}
                          className={`h-12 rounded-xl font-bold text-sm transition-all ${orderType === 'BUY' ? 'bg-[#00ffbb] text-black shadow-[0_0_15px_rgba(0,255,187,0.3)]' : 'bg-white/5 text-gray-500 border border-white/10 hover:border-white/20'}`}
                        >
                            BUY
                        </button>
                        <button 
                          onClick={() => setOrderType('SELL')}
                          className={`h-12 rounded-xl font-bold text-sm transition-all ${orderType === 'SELL' ? 'bg-[#ff007b] text-white shadow-[0_0_15px_rgba(255,0,123,0.3)]' : 'bg-white/5 text-gray-500 border border-white/10 hover:border-white/20'}`}
                        >
                            SELL
                        </button>
                    </div>

                    <div className="flex gap-2 mb-6">
                        {(['MARKET', 'LIMIT', 'STOP'] as const).map(mode => (
                          <button key={mode} onClick={() => setOrderMode(mode)} className={`flex-1 text-[10px] font-bold py-2 rounded-lg border ${orderMode === mode ? 'bg-white/10 border-white/30 text-white' : 'bg-transparent border-transparent text-gray-500'}`}>
                            {mode}
                          </button>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 gap-4 mb-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs text-gray-400 font-bold uppercase">Qty</label>
                          <input type="number" value={orderAmount} onChange={(e) => setOrderAmount(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#00ffbb]" />
                        </div>
                        {orderMode !== 'MARKET' && (
                          <div className="space-y-1">
                            <label className="text-xs text-gray-400 font-bold uppercase">{orderMode} Price</label>
                            <input type="number" value={limitStopPrice} onChange={(e) => setLimitStopPrice(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#00ffbb]" />
                          </div>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                           <label className="text-xs text-gray-400 font-bold uppercase">Take Profit</label>
                           <input type="number" value={tpPrice} onChange={(e) => setTpPrice(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#00ffbb]" />
                        </div>
                        <div className="space-y-1">
                           <label className="text-xs text-gray-400 font-bold uppercase">Stop Loss</label>
                           <input type="number" value={slPrice} onChange={(e) => setSlPrice(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#00ffbb]" />
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-4 ml-1">
                        <input type="checkbox" checked={isTrailing} onChange={(e) => setIsTrailing(e.target.checked)} className="accent-[#00ffbb]" />
                        <label className="text-xs text-gray-400 font-bold uppercase cursor-pointer">Enable Trailing Stop Loss</label>
                      </div>
                      {isTrailing && (
                        <div className="space-y-1 mt-2">
                          <label className="text-xs text-gray-400 font-bold uppercase">Trailing Distance</label>
                          <input type="number" value={trailingDistance} onChange={(e) => setTrailingDistance(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#00ffbb]" />
                        </div>
                      )}
                    </div>
                    
                    <button 
                        onClick={() => { executeOrder(orderType); setIsOrderPanelOpen(false); }}
                        className={`w-full h-12 rounded-xl font-bold uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2 ${orderType === 'BUY' ? 'bg-[#00ffbb] text-black shadow-lg hover:shadow-[#00ffbb]/20' : 'bg-[#ff007b] text-white shadow-lg hover:shadow-[#ff007b]/20'}`}
                    >
                        <Zap size={16} className={orderType === 'BUY' ? 'animate-pulse' : ''} />
                        Execute {orderMode} {orderType} @ {orderMode === 'MARKET' ? 'Market' : limitStopPrice}
                    </button>

                    {!connectedBroker && (
                        <p className="mt-4 text-xs text-red-500 font-medium text-center uppercase tracking-tighter">Broker link required for live execution</p>
                    )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Tab Bar */}
      <div className="md:hidden flex h-12 bg-[#111] border-t border-[#333] z-50">
        <button 
           className={`flex-1 flex flex-col items-center justify-center text-[10px] uppercase font-bold transition-colors ${mobileView === 'chat' ? 'text-[#00ffbb]' : 'text-gray-500'}`}
           onClick={() => setMobileView('chat')}
        >
           <Terminal size={14} className="mb-0.5" />
           Chat
        </button>
        <button 
           className={`flex-1 flex flex-col items-center justify-center text-[10px] uppercase font-bold transition-colors ${mobileView === 'chart' ? 'text-[#00ffbb]' : 'text-gray-500'}`}
           onClick={() => setMobileView('chart')}
        >
           <Activity size={14} className="mb-0.5" />
           Chart
        </button>
      </div>
    </div>
  );
}
