const zmq = require("zeromq")
const sock = zmq.socket("sub")

sock.connect("tcp://127.0.0.1:3000")
sock.subscribe("topic")

sock.on("message", (msg) => {
  console.log("data: %s", msg.toString())
})