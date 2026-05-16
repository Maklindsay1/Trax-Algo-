import React, { useState, useEffect } from 'react';
import { socketService } from '../services/socketService';
import { Users, Send, Zap } from 'lucide-react';

interface Trade {
  id: string;
  symbol: string;
  signal: string;
  entry: number;
  sender: string;
  timestamp: number;
}

export const LiveTradeRoom = ({ roomId, userName }: { roomId: string, userName: string }) => {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [signal, setSignal] = useState('');

  useEffect(() => {
    socketService.joinRoom(roomId);
    socketService.onNewTrade((trade: Trade) => {
      setTrades((prev) => [trade, ...prev].slice(0, 50)); // Keep last 50
    });

    return () => {
      socketService.offNewTrade();
    };
  }, [roomId]);

  const sendSignal = () => {
    if (!signal) return;
    socketService.sendTradeSignal({
      room: roomId,
      symbol: 'BTCUSD',
      signal: signal,
      entry: 95000, // Simulating entry
    });
    setSignal('');
  };

  return (
    <div className="bg-[#1A1A1E] border border-[#333] rounded-xl p-4 w-full h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <Users size={18} className="text-[#00ffbb]" />
        <h3 className="font-bold text-white uppercase tracking-widest text-xs">Trade Mirroring Room: {roomId}</h3>
      </div>
      
      <div className="flex-grow overflow-y-auto space-y-2 mb-4 scrollbar-thin">
        {trades.map((trade) => (
          <div key={trade.timestamp} className="bg-[#111] p-2 rounded flex justify-between items-center text-[10px]">
             <span className="font-mono text-gray-400">{trade.symbol}</span>
             <span className={`font-bold ${trade.signal === 'BUY' ? 'text-[#00ffbb]' : 'text-[#ff007b]'}`}>{trade.signal}</span>
             <span className="text-gray-500">{trade.sender.substring(0,5)}</span>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          value={signal}
          onChange={(e) => setSignal(e.target.value.toUpperCase())}
          placeholder="BUY/SELL"
          className="bg-[#111] border border-[#333] rounded px-2 py-1 text-white text-[10px] w-full"
        />
        <button onClick={sendSignal} className="bg-[#00ffbb] text-black px-3 rounded text-[10px] font-bold uppercase tracking-widest">
            <Zap size={14} />
        </button>
      </div>
    </div>
  );
};
