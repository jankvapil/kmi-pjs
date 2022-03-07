
const WebSocket = require('ws')
const server = new WebSocket.Server({ port: 8080 })

server.on('connection', socket => {
  socket.on('message', msg => {
    console.log(`Server received: ${msg}`)
    socket.send(`Server received ${msg}`)
  })
})
