const zmq = require("zeromq")
const sock = new zmq.socket("pub")

sock.bindSync("tcp://127.0.0.1:3000")
console.log("Publisher bound to port 3000")

let i = 1
setInterval(() => {
  const msg = `msg ${i++}`
  console.log(`sending ${msg}..`)
  sock.send(`topic ${msg}`)
}, 1000)