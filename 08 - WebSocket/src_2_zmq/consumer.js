const zmq = require("zeromq")
const sock = zmq.socket("pull")

sock.connect("tcp://127.0.0.1:3000")
console.log("Consumer connected to port 3000")

sock.on("message", (msg) => {
  console.log("data: %s", msg.toString())
})