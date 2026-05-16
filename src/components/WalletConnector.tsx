import React, { useState } from 'react';
import { motion } from 'motion/react';

interface WalletConnectorProps {
  walletAddress: string | null;
  setWalletAddress: (address: string | null) => void;
  isWalletConnecting: boolean;
  setIsWalletConnecting: (isConnecting: boolean) => void;
  showToast: (msg: string) => void;
  userRole: string;
}

const WalletConnector: React.FC<WalletConnectorProps> = ({
  walletAddress,
  setWalletAddress,
  isWalletConnecting,
  setIsWalletConnecting,
  showToast,
  userRole,
}) => {
  const [showWalletMenu, setShowWalletMenu] = useState(false);

  const connectWallet = async (type: 'metamask' | 'phantom', isReconnect = false) => {
    setShowWalletMenu(false);
    
    if (type === 'metamask') {
      if (typeof window.ethereum !== 'undefined') {
        try {
          setIsWalletConnecting(true);
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          if (accounts && accounts.length > 0) {
            setWalletAddress(accounts[0]);
            showToast(`MetaMask ${isReconnect ? 'reconnected' : 'connected'} successfully`);
          }
        } catch (error: any) {
          console.error("MetaMask connection error:", error);
          const errorMessage = `MetaMask ${error.code === 4001 ? 'Request rejected by user' : (error.message || 'unknown error')}`;
            showToast(errorMessage);
        } finally {
          setIsWalletConnecting(false);
        }
      } else {
        if (window.self !== window.top) {
           showToast('MetaMask is not detected. If you have it installed, try opening this app in a new tab.');
        } else {
           showToast('MetaMask is not installed. Please install it to use this app.');
        }
      }
    } else if (type === 'phantom') {
      if (typeof window.solana !== 'undefined' && window.solana.isPhantom) {
        try {
          setIsWalletConnecting(true);
          // Force disconnect before reconnecting to ensure fresh approval prompt
          if (isReconnect) {
            await window.solana.disconnect();
          }
          const resp = await window.solana.connect();
          if (resp.publicKey) {
            const pubKeyStr = resp.publicKey.toString();
            setWalletAddress(pubKeyStr);
            
            try {
              const messageText = `Trax Algo Engine Authorization\n\nI hereby authorize the Trax AI Engine smart contract to execute trades and manage funds for address:\n${pubKeyStr}\n\nTimestamp: ${Date.now()}`;
              const encodedMessage = new TextEncoder().encode(messageText);
              await window.solana.signMessage(encodedMessage, "utf8");
              showToast('Signature verified. AI Execution Authority Granted.');
            } catch (signErr: any) {
              showToast(`Authorization rejected. AI cannot trade without signature.`);
              setWalletAddress(null); // Revert if they refuse to sign
              return;
            }

            try {
              const solanaWeb3 = await import('@solana/web3.js');
              const connection = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl('mainnet-beta'), 'confirmed');
              const pubKey = new solanaWeb3.PublicKey(pubKeyStr);
              const lamports = await connection.getBalance(pubKey);
              const solBalance = lamports / solanaWeb3.LAMPORTS_PER_SOL;
              showToast(`Phantom Wallet verified. Real Balance: ${solBalance.toFixed(4)} SOL`);
            } catch (balanceError: any) {
              showToast(`Phantom Wallet connected. (Could not fetch on-chain balance)`);
            }
          }
        } catch (error: any) {
          console.error("Phantom connection error detailed:", error);
          let userFriendlyError = "Failed to connect to Phantom";
          if (error.code === 4001) {
            userFriendlyError = "Phantom connection rejected by user";
          } else if (error.message) {
             userFriendlyError = `Phantom error: ${error.message}`;
          }
           showToast(userFriendlyError);
        } finally {
          setIsWalletConnecting(false);
        }
      } else {
        if (window.self !== window.top) {
           showToast('Phantom wallet is not detected. Try opening this app in a new tab.');
        } else {
           showToast('Phantom wallet is not installed. Please install it to use this app.');
        }
      }
    }
  };

  const isRestricted = userRole === 'Developer';

  return (
    <div className="relative">
      <button 
        onClick={() => !walletAddress && !isRestricted ? setShowWalletMenu(!showWalletMenu) : (isRestricted ? showToast('Developers restricted from live wallet connection') : setShowWalletMenu(!showWalletMenu))}
        disabled={isWalletConnecting}
        className={`h-8 px-4 rounded-full text-white text-xs font-bold transition-all disabled:opacity-50 flex items-center justify-center shadow-md border min-w-[140px] ${
          !isRestricted
            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 border-[#444]'
            : 'bg-gray-800 border-[#333] opacity-40 cursor-not-allowed'
        }`}
      >
        {isWalletConnecting ? 'Connecting...' : walletAddress ? `${walletAddress.substring(0, 4)}...${walletAddress.substring(walletAddress.length - 4)}` : 'Connect Wallet'}
      </button>
      
      {showWalletMenu && !walletAddress && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-10 right-0 w-48 bg-[#1A1A1E] border border-[#333] rounded-xl shadow-2xl overflow-hidden py-1 z-50 ring-1 ring-white/5"
        >
           <div className="px-4 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest border-b border-white/5 mb-1">Select Wallet</div>
           <button 
             onClick={() => connectWallet('metamask')} 
             className="w-full text-left px-4 py-2.5 text-xs font-semibold hover:bg-[#2A2A2E] text-gray-200 transition-colors flex items-center justify-between group"
           >
             <span>MetaMask</span>
             <div className="w-2 h-2 rounded-full bg-orange-500 group-hover:shadow-[0_0_8px_rgba(249,115,22,0.6)]" />
           </button>
           <button 
             onClick={() => connectWallet('phantom')} 
             className="w-full text-left px-4 py-2.5 text-xs font-semibold hover:bg-[#2A2A2E] text-gray-200 transition-colors flex items-center justify-between group"
           >
             <span>Phantom Wallet</span>
             <div className="w-2 h-2 rounded-full bg-purple-500 group-hover:shadow-[0_0_8px_rgba(168,85,247,0.6)]" />
           </button>
        </motion.div>
      )}

      {showWalletMenu && walletAddress && (
         <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-10 right-0 w-44 bg-[#1A1A1E] border border-[#333] rounded-xl shadow-2xl overflow-hidden py-1 z-50 ring-1 ring-white/5"
        >
           <div className="px-4 py-2 text-[10px] font-bold text-[#00ffbb] uppercase tracking-widest border-b border-white/5 mb-1">Wallet Active</div>
           <button 
             onClick={() => {
               const type = window.solana?.isPhantom ? 'phantom' : 'metamask';
               connectWallet(type, true);
               setShowWalletMenu(false);
             }}
             className="w-full text-left px-4 py-2.5 text-xs font-semibold hover:bg-[#2A2A2E] text-gray-200 transition-colors"
           >
             Reconnect
           </button>
           <button 
             onClick={() => { setWalletAddress(null); setShowWalletMenu(false); showToast('Wallet disconnected'); }} 
             className="w-full text-left px-4 py-2.5 text-xs font-semibold hover:bg-red-500/10 text-red-400 transition-colors"
           >
             Disconnect
           </button>
        </motion.div>
      )}
    </div>
  );
};

export default WalletConnector;
