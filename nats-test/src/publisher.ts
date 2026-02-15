import nats from "node-nats-streaming";

// stan is an instance of nats or client to connect to nats server
// connect(clusterId, clientId, options)
const stan = nats.connect("ticketing", "abc", {
  url: "http://localhost:4222",
});

// When nats connects to client -> emits an connect event, which we listen for
// Event based approach
stan.on("connect", () => {
  console.log("Publisher connected to NATS");
});
