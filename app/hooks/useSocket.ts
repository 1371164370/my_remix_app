import { useEffect, useState } from "react"
import { io } from "socket.io-client"
import { GomokuClientSocket, Nullable } from "../../types"

let _socket: Nullable<GomokuClientSocket> = null
export const useSocket = (jwt: string) => {
    const [socket, setSocket] = useState<Nullable<GomokuClientSocket>>(null)
    useEffect(() => {
        if (!_socket?.connected) {
            _socket = io('ws://localhost:4000', { auth: { token: jwt } }) as GomokuClientSocket
            _socket.on("connect", () => {
                setSocket(_socket);
            });
            _socket.on("disconnect", () => {
                setSocket(null);

            });
        } else {
            setSocket(_socket);
        }
    }, [])

    return socket
}