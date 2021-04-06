import React from 'react'
import {io} from 'socket.io-client'


const SocketContext = React.createContext() 
const SocketProvider = ({children}) => {
  

  return (
    <SocketContext.provider>{children}</SocketContext.provider>
  )
}

export default SocketProvider