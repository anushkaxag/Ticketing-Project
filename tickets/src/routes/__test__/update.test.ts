import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { Ticket } from "../../models/ticket";

it("returns a 404 if the provided id does not exist", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", global.signin())
    .send({
      title: "adsfadf",
      price: 20,
    })
    .expect(404);
});

it("returns a 401 if the user is not authenticated", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: "adsfadf",
      price: 20,
    })
    .expect(401);
});

it("returns a 401 if the user does not own the ticket", async () => {
  //   const title = "dfsddfd";
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title: "fsfsdf",
      price: 30,
    });

  //   let tickets = await Ticket.find({});
  //   expect(tickets.length).toEqual(1);
  //   expect(tickets[0].price).toEqual(30);
  //   expect(tickets[0].title).toEqual(title);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", global.signin())
    .send({
      title: "fadsfha",
      price: 100,
    })
    .expect(401);
});

it("returns a 400 if the user provides an invalid title or price", async () => {
  const cookie = global.signin();

  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "fsfsdf",
      price: 30,
    });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "",
      price: 20,
    })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "fdfasd",
      price: -10,
    })
    .expect(400);
});

it("updates the ticket provided valid inputs", async () => {
  const cookie = global.signin();

  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "fsfsdf",
      price: 30,
    });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "new title",
      price: 100,
    })
    .expect(200);

  let tickets = await Ticket.find({});
  expect(tickets.length).toEqual(1);
  expect(tickets[0].title).toEqual("new title");
  expect(tickets[0].price).toEqual(100);
});
