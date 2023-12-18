const express = require('express');
const path = require('path');
const fs = require("fs")

const PORT = process.env.port || 3006;
const app = express();

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// The webpage loads the css and js files are from inside public folder
app.use(express.static('public'));

// GET Route for homepage
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

// GET Route for notes
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// GET Route for notes
app.get('/api/notes', (req, res) => {
  let myNotes = [
    {
        "title":"Test Title",
        "text":"Test text"
    }
  ]
  // TODO: myNotes should be read from db.json

  res.json(myNotes)
});

// POST Route for notes
app.post('/api/notes', (req, res) => {
  let title = req.body.title
  let text = req.body.text
  let newNote = {
    "title": title,
    "text": text
  }
  
  // TODO: Append {...} to db/db.json

  res.json(myNotes)
});

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// // GET Route for feedback page
// app.get('/feedback', (req, res) =>
//   res.sendFile(path.join(__dirname, '/public/pages/feedback.html'))
// );

// app.post('/api/diagnostics', (req, res) => {
//   // Log that a POST request was received
//   console.info(`${req.method} request received to submit feedback`);
// });

// app.get('/api/diagnostics', (req, res) => {
//   console.info(`${req.method} request received for feedback`);

//   readFromFile('./db/diagnostics/json').then((data) => res.json(JSON.parse(data)));
// });

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);
