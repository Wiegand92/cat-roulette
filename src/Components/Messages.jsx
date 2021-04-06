import React, {useState, useEffect} from 'react'
import {useHistory} from 'react-router-dom'

const Messages = (props) => {

  const [messages, setMessages] = useState([])
  const history = useHistory()


  //Redirect to login page if not signed in or registered, else get all messages
  useEffect(async () => {
    if(!props.user || !props.signedIn){
      history.push('/')
    } else {
      await fetch('/messages/all')
      .then(response => response.json())
      .then(data => setMessages(data.rows))
      .catch(err => console.error(err))
    }
  }, [])

  //Listener effect to get new messages from the socket
  useEffect(() => {

    if(props.socket !== undefined){
      props.socket.on('message', (message) => {
        setMessages(prevState => [...prevState, message])
      });
    }
    return () => {
      if(props.socket !== undefined){
        props.socket.off('message')
      }
    }
  })


  // If you get a new message, scroll to the bottom of the page
  useEffect(()=> {
    const messageBox = document.querySelector('.message-box')
    messageBox.scroll({left: 0, top: messageBox.scrollHeight, behavior: 'smooth'})
  }, [messages])

  const handleSendMessage = (e) => {
    e.preventDefault()

    if(e.target.firstChild.value){
      const newMessage = { 
        content: e.target.firstChild.value,
        user_id: props.user.id
      }
      props.socket.emit('message', newMessage)
      e.target.firstChild.value = ''
    }
  }

  return (
    <div className='main main__messages'>
        <ul className='message-box'>
          {messages.length === 0 && <li>'No has said anything yet...'</li> }
          {messages.length > 0 && messages.map((msg) => {
            if(msg.sender === props.user.name){
              return (<li key={msg.id} className='message--self'>{msg.content}</li>)
            }else {
              return (<li key={msg.id} className='message'>{msg.sender}: {msg.content}</li>)
            }
          })}
        </ul>
        <form action="" onSubmit={handleSendMessage}>
          <input type="text"/>
        </form>
    </div>
  )

}

export default Messages