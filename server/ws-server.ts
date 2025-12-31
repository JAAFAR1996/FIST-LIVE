import { WebSocketServer, WebSocket } from "ws";
import { Server } from "http";
import { log } from "./index.js";

interface ExtWebSocket extends WebSocket {
    isAlive: boolean;
    userId?: string;
    isAdmin?: boolean;
}

export function setupWebSocket(server: Server) {
    const wss = new WebSocketServer({ server, path: "/ws" });

    wss.on("connection", (ws: ExtWebSocket, req) => {
        log("New WebSocket connection established", "ws");
        ws.isAlive = true;

        ws.on("pong", () => {
            ws.isAlive = true;
        });

        ws.on("message", async (data) => {
            try {
                const message = JSON.parse(data.toString());

                // Simple auto-reply logic for now to replace frontend-only logic
                if (message.type === 'message') {
                    log(`Received message: ${message.text}`, "ws");

                    // Here you would typically broadcast to admins or save to DB

                    // Simulate server response
                    setTimeout(() => {
                        if (ws.readyState === WebSocket.OPEN) {
                            ws.send(JSON.stringify({
                                type: 'message',
                                text: "مرحباً! لقد استلمنا رسالتك في الخادم وسيقوم أحد ممثلينا بالرد عليك قريباً. (تجريبي: اتصال WebSocket ناجح)",
                                sender: 'support',
                                timestamp: new Date().toISOString()
                            }));
                        }
                    }, 1000);
                }
            } catch (error) {
                log(`WebSocket error: ${error}`, "ws", "error");
            }
        });

        ws.on("close", () => {
            log("WebSocket connection closed", "ws");
        });
    });

    // Heartbeat to keep connections alive
    const interval = setInterval(() => {
        wss.clients.forEach((ws) => {
            const extWs = ws as ExtWebSocket;
            if (extWs.isAlive === false) return ws.terminate();

            extWs.isAlive = false;
            ws.ping();
        });
    }, 30000);

    wss.on("close", () => {
        clearInterval(interval);
    });

    return wss;
}
