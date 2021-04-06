import React, {useState} from 'react'
import {useHistory} from 'react-router-dom'

const SigninPage = (props) => {

  const [name, setName] = useState('')
  const [error, setError] = useState(false)

  let history = useHistory()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if(name.length > 0){
      e.preventDefault()
      await fetch(`/messages/${name}`, {
        method: 'POST'
      })
      .then(response => response.json())
      .then(data => props.setUser(data.rows[0]))
      .then(() => {
        props.setSignedIn(true);
        history.push('/messages');
      })
      .catch(err => {
        setName('');
        setError(true);
        console.error(err);
      })
    }
  } 

  const handleChange = (e) => {
    if(name.length > 0 && !e.target.value){
      setName(e.target.value)
    }
    if(e.target.value){
      if(error){
        setError(false)
      }
      setName(e.target.value)
    }
  }


  return (
    <div className='main signin-page'>
      <form 
        className='signin-form'
        onSubmit={handleSubmit}  
      >
        <input 
          type="text" 
          name="username"
          className={error ? 'name-taken' : ''} 
          placeholder={error ? "Username Taken" : "Your name here"} 
          value={name} 
          onChange={handleChange}
        />
        <button>Log On!</button>
      </form>
    </div>
  )
}

export default SigninPage