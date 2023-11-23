import express, { response } from "express";
import morgan from "morgan";
import cors from "cors";

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];
const app = express();

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
app.use(cors());
// Middleware to parse JSON in the request body
app.use(express.json());

let number = persons.length;
let time = new Date("2020-01-01").toString();

const generateId = () => {
  const maxId = notes.length > 0 ? Math.max(...notes.map((n) => n.id)) : 0;
  return maxId + 1;
};

app.get("/info", (request, response) => {
  response.send(`<p>Phonebook has info for ${number} people</p>
            <p>${time}</p>`);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.get("/api/persons", (request, response) => {
  response.json(persons);
});
app.post("/api/persons", (request, response) => {
  const body = request.body;
  console.log(body);
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "name or number missing",
    });
  }
  if (persons.map((person) => person.name === body.name))
    return response.status(400).json({
      error: "name must be unique",
    });

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  };
  persons = persons.concat(note);
  response.json(note);
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
