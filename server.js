const express = require('express')
const app = express()
const cors = require('cors')

// Start an http server to instantiate socket with
const http = require('http')
const server = http.Server(app)

// Start socket with the server
const io = require('socket.io')(server)

// Set PORT for server
const PORT = process.env.PORT || 4200

//MIDDLEWARE//
app.use(cors())
app.use(express.json())

//DATABASE//
const db = require('./server/db')

// Serve all files from the public folder to all requests
app.use(express.static(__dirname + '/public'))

// Endpoint to request all messages on login
app.get('/messages/all', async (req, res) => {
  await db.query(`
    SELECT users.name AS sender, messages.content AS content, messages.id AS id
    FROM users, messages, users_messages
    WHERE users.id = users_messages.user_id AND
    messages.id = users_messages.message_id
  `)
  .then(response => {
    return res.json(response);
  })
  .catch(err => {
    console.error(err)
  })
})

// Otherwise every file gets served index.html
app.get('*', (req, res) => {
  res.sendFile(__dirname + '/public/index.html')
})

// Endpoint to 'Login'
app.post('/messages/:username', async (req, res) => {
  const {username} = req.params
  await db.query(`INSERT INTO users (name) VALUES($1) RETURNING *`, [username])
  .then(response => res.json(response))
  .catch(err => {
    console.error(err)
    res.redirect('/')
  })
})

//Socket logic (extract?)
io.on('connection', async (socket) => {
  console.log(`someone has connected`);
    
  await db.query(`SELECT * FROM users`)
  .then(response => {
    const userArray = response.rows
    io.emit('joined', userArray)
  })

  socket.on('message', async (msg) => {
    let message;

    //Insert message, then assign the return value to message so we can grab id
    await db.query(`INSERT INTO messages (content) VALUES ($1) RETURNING *`, [msg.content])
    .then(response => {
      message = response.rows[0]
    })
    .catch(err => console.error(err))

    //Insert relationship into the users_messages table
    await db.query(`INSERT INTO users_messages(user_id, message_id) VALUES ($1, $2) RETURNING *`, [msg.user_id, message.id])
    .catch(err => console.error(err))

    //Grab the message back from database and emit
    await db.query(`
      SELECT users.name AS sender, messages.content AS content, messages.id AS id
      FROM users, messages, users_messages
      WHERE users.id = $1 AND
      messages.id = $2
      GROUP BY sender, content, messages.id
    `, [msg.user_id, message.id])
    .then(response => {
      const newMessage = response.rows[0]
      io.emit('message', newMessage)
    })
    .catch(err => console.error(err))
  })
  
  socket.on('leave room', async (user) => {
    //Delete the user from the users table
    await db.query(`DELETE FROM users WHERE id=$1`, [user.id])
    //This sends the remaining users to anyone online
    await db.query(`SELECT * FROM users`)
    .then(response => {
      const userArray = response.rows
      io.emit('leave', userArray)
    })
    .catch(err => console.error(err))
  })

  socket.on('disconnecting', (reason) => {
    console.log(socket)
  })

  socket.on('disconnect', () => {
    console.log(`a user has disconnected`)
  })
})

server.listen(PORT, () => {
  console.log(`Server listening at ${PORT}`)
})