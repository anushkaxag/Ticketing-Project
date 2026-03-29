import nats, { Message } from "node-nats-streaming";
import { randomBytes } from "node:crypto";

console.clear();

const stan = nats.connect("ticketing", randomBytes(4).toString("hex"), {
  url: "http://localhost:4222",
});

stan.on("connect", () => {
  console.log("Listener connected to NATS");

  stan.on("close", () => {
    console.log("NATS connection closed!");
    process.exit();
  });

  // setManualAckMode(true): Manual ack required for incoming event
  const options = stan
    .subscriptionOptions()
    .setManualAckMode(true)
    .setDeliverAllAvailable()
    .setDurableName("accounting-service");

  // second argument is the name of the Queue Group current listener is joining
  const subscription = stan.subscribe(
    "ticket:created",
    "orders-service-queue-group",
  );

  subscription.on("message", (msg: Message) => {
    const data = msg.getData();
    if (typeof data === "string") {
      console.log(`Recieved event #${msg.getSequence()}, with data: ${data}`);
    }

    msg.ack();
  });
});

// Watches for interrupt or terminate signals
process.on("SIGINT", () => stan.close());
process.on("SIGTERM", () => stan.close());
