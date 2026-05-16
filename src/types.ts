export type Role = 'Admin' | 'Developer' | 'Trader' | 'Guest';

export type BrokerAccount = {
    id: string;
    name: string;
    type: 'brokerage' | 'crypto_wallet' | 'mt4' | 'mt5';
    apiKeyOrAddress: string;
    server?: string;
    login?: string;
    password?: string;
    balance: number;
    connected: boolean;
};
