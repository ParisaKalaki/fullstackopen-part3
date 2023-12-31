import mongoose from "mongoose";
import "dotenv/config";

mongoose.set("strictQuery", false);

const url = process.env.MONGODB_URI;

const connectToDatabase = async () => {
  try {
    console.log("connecting to", url);
    await mongoose.connect(url, {});
    console.log("connected to MongoDB");
  } catch (error) {
    console.log("error connecting to MongoDB:", error.message);
  }
};

connectToDatabase();

const personSchema = new mongoose.Schema({
  name: { type: String, minLength: 3, required: true },
  number: {
    type: String,
    minLength: 8,
    validate: {
      validator: function (v) {
        return /^\d{2,3}-\d+$/.test(v);
      },
    },
    required: true,
  },
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Person = mongoose.model("Person", personSchema);

export default Person;
