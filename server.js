const express = require('express');
const path = require('path');
const { readFromFile, readAndAppend } = require('../helper/fsUtils');

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

// GET Route for note taker page 
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

  readFromFile('./db/db.json').then((myNotes) => res.json(JSON.parse(myNotes)));
});

// POST Route for notes
app.post('/api/notes', (req, res) => {
  console.log(req.body);

  // let title = req.body.title
  // let text = req.body.text
  // let newNote = {
  //   "title": title,
  //   "text": text
  // }

  const { title, text } = req.body;

  if (req.body) {
    const newNote = {
      title,
      text,
    };

  readAndAppend(newNote, './db/db.json');
  res.json(myNotes)
} else {
  res.error('Error in adding notes');
}
  
});


app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);
