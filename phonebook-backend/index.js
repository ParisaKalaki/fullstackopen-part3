import express, { response } from "express";
import morgan from "morgan";
import cors from "cors";
import Person from "./models/person.js";
import "dotenv/config";

const app = express();
app.use(cors());
app.use(express.static("dist"));
app.use(express.json());

morgan.token("postData", (req) => {
  if (req.method === "POST" || req.method === "PUT") {
    return JSON.stringify(req.body);
  }
  return "";
});

// Use Morgan middleware with a custom log format
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :postData"
  )
);

let number = Person.length;
let time = new Date("2020-01-01").toString();

const generateId = async () => {
  const latestPerson = await Person.findOne().sort({ id: -1 }); // Find the person with the highest ID
  return latestPerson ? latestPerson.id + 1 : 1;
};

app.get("/info", (request, response) => {
  response.send(`<p>Phonebook has info for ${number} people</p>
            <p>${time}</p>`);
});

app.get("/api/persons", async (request, response) => {
  const persons = await Person.find({});
  response.json(persons);
});

app.get("/api/persons/:id", async (request, response, next) => {
  try {
    const person = await Person.findById(request.params.id);

    if (person) {
      response.json(person);
    } else {
      response.status(404).end();
    }
  } catch (error) {
    next(error);
  }
});

app.post("/api/persons", async (request, response, next) => {
  try {
    const body = request.body;
    const newPerson = new Person({
      name: body.name,
      number: body.number,
      id: generateId(),
    });
    const savedPerson = await newPerson.save();
    response.json(savedPerson);
  } catch (error) {
    next(error);
  }
});

app.put("/api/persons/:id", async (request, response, next) => {
  try {
    const { name, number } = request.body;
    const updatedPerson = await Person.findByIdAndUpdate(
      request.params.id,
      { name, number },
      { new: true, runValidators: true }
    );
    response.json(updatedPerson);
  } catch (error) {
    next(error);
  }
});

app.delete("/api/persons/:id", async (request, response, next) => {
  const id = request.params.id;
  const deletedPerson = await Person.findByIdAndDelete(id);

  if (deletedPerson) {
    response.status(204).end();
  } else {
    next(error);
  }
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

// this has to be the last loaded middleware.
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
