import React from 'react'

const OnlineUsers = (props) => {

  const handleSignOut = (e) => {
    e.preventDefault()
    
    props.socket.emit('leave room', props.user)

    props.setSignedIn(false)
  }

  return (
    <div className={props.signedIn ? "users online-users" : "users offline"}>
      <div className='top'></div>
      <ul className={props.signedIn ? "" : "offline"}>
        {props.users.map(user => {if(user.id !== 0){return <li key={user.id}><a >{user.name}</a></li>}})}</ul>
      {props.signedIn && <button onClick={handleSignOut}>Sign out</button>}
    </div>
  )
}

export default OnlineUsers