import { io, Socket } from "socket.io-client";

// Connect to the server
const socket: Socket = io();

export const socketService = {
  socket,
  joinRoom: (room: string) => {
    socket.emit("join-room", room);
  },
  sendTradeSignal: (data: { room: string; symbol: string; signal: string; entry: number }) => {
    socket.emit("trade-signal", data);
  },
  onNewTrade: (callback: (trade: any) => void) => {
    socket.on("new-trade", callback);
  },
  offNewTrade: () => {
    socket.off("new-trade");
  }
};
