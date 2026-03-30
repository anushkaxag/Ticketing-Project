import nats from "node-nats-streaming";
import { TicketCreatedPublisher } from "./events/ticket-created-publisher";

console.clear();

// stan is an instance of nats or client to connect to nats server
// connect(clusterId, clientId, options)
const stan = nats.connect("ticketing", "abc", {
  url: "http://localhost:4222",
});

// When nats connects to client -> emits an connect event, which we listen for
// Event based approach
stan.on("connect", async () => {
  console.log("Publisher connected to NATS");

  const publisher = new TicketCreatedPublisher(stan);
  try {
    await publisher.publish({
      id: "123",
      title: "concert",
      price: 20,
    });
  } catch (err) {
    console.log(err);
  }

  // const data = JSON.stringify({
  //   id: "123",
  //   title: "concert",
  //   price: 20,
  // });

  // // publish(subject name, data, optional: callback function - invoked when data is published)
  // stan.publish("ticket:created", data, () => {
  //   console.log("Event Published");
  // });
});
