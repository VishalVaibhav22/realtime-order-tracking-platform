import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3000";

let socket = null;

// calling this more than once for the same session must not create a second
// connection - React StrictMode runs effects twice in dev, and useOrderTracking
// attaches its listeners to whichever socket instance exists at that moment
function connectSocket(token) {
  if (socket) {
    return socket;
  }

  socket = io(SOCKET_URL, { auth: { token } });
  return socket;
}

function getSocket() {
  return socket;
}

function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

export { connectSocket, getSocket, disconnectSocket };
