const zmq = require("zeromq")
const sock = zmq.socket("push")

sock.bindSync("tcp://127.0.0.1:3000")
console.log("Producer bound to port 3000")

let i = 1
setInterval(() => {
  const msg = `msg ${i++}`
  console.log(`sending ${msg}..`)
  sock.send(msg)
}, 1000)