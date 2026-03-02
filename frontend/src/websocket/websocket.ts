export const createSocket = () => {
  const socket = new WebSocket(process.env.NEXT_PUBLIC_WS_URL as string);

  socket.onopen = () => {
    console.log("Connected to chat server");
  };

  socket.onmessage = (event) => {
    console.log("Message:", event.data);
  };

  socket.onerror = (error) => {
    console.error("WebSocket error:", error);
  };

  return socket;
};
