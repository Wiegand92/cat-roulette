import React, {useState, useEffect} from 'react'
import { BrowserRouter, Switch, Route, useHistory } from "react-router-dom"
import {io} from 'socket.io-client'

import Messages from './Messages'
import OnlineUsers from './OnlineUsers'
import SigninPage from './SigninPage'

  const MainPage = () => {

  const [user, setUser] = useState({})

  const [signedIn, setSignedIn] = useState(false)

  const [socket, setSocket] = useState()

  const [ users, setUsers ] = useState([])


  // If the user has signed in, connect to socket
  useEffect(() => {
    if(signedIn){
      setSocket(io())
    } else {
      if(socket){
        setUsers([])
        socket.disconnect(socket)
      }
    }
  }, [signedIn])
  //Socket logic
  useEffect(() => {
    if(socket !== undefined){
      socket.userID = user.id
      console.log(socket.userID)
      socket.on('joined', (usersArray) => {
        setUsers(usersArray)
      })
      socket.on('leave', (usersArray) => {
        setUsers(usersArray)
      })
    }
  }, [socket])

  const MessageModule = () => (
    <Messages 
      socket={socket}
      user={user}
      signedIn={signedIn}
    />
  )

  const SigninModule = () => (
    <SigninPage 
      setUser={setUser} 
      setSignedIn={setSignedIn} 
    />
  )

  return (
    <BrowserRouter>
    <div className={signedIn ? 'main-page' : 'main-page offline'}>
      <h1 className='title'> CatRoulette </h1>
        <OnlineUsers 
          users={users}
          user={user}
          socket={socket}
          signedIn={signedIn}
          setSignedIn={setSignedIn} 
        />
        <Switch>
          <Route exact path='/' component={SigninModule}/>
          <Route path='/messages' component={MessageModule}/>
        </Switch>
    </div>
    </BrowserRouter>
  )
}

export default MainPage