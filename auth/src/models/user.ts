import mongoose from "mongoose";
import { Password } from "../services/password";

// An interface that describes the properties
// that are required to create a new User
interface UserAttrs {
  email: string;
  password: string;
}

// An interface that describes the properites
// that a user Model has
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

// An interface that describes the properties
// that a User Document has
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

// Schema - All the properties than an user will have
const userSchema = new mongoose.Schema(
  {
    email: {
      // string - type of -> string in Typescript
      // String - build in string constructor in java script
      // When representing type of a propery in mongoose - String
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      // ret - direct changes to that object
      transform(doc, ret: any) {
        ret.id = ret._id.toString();
        delete ret._id;
        // remove property off the object
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);
// Middleware function implemented in mongoose
// When attempting to save document in db, execute the function
userSchema.pre("save", async function (done) {
  // Only hash password when user signs up for the first time
  // Or the password has been modified
  if (this.isModified("password")) {
    const hashed = await Password.toHash(this.get("password"));
    this.set("password", hashed);
  }
  done();
});
userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

// Feed this schema into Mongoose -> Mongoose is going to create new model
// model fucntion will return something of type UserModel
// <, > Allow us to customize the types of beig used inside
// a function, class or an interface
const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

export { User };
