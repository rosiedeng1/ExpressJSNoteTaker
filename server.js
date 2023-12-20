// Imports all the necessary modules and libraries
const express = require('express');
const path = require('path');
const { readFromFile, readAndAppend, deleteFile } = require('./helper/fsUtils');
const { v4: uuidv4 } = require('uuid');

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


// GET Route for notes, made promsie to read the fs file (retrieves the notes) which can be seen in db.json file
app.get('/api/notes', (req, res) => {

  readFromFile('./db/db.json').then((myNotes) => res.json(JSON.parse(myNotes)));
});

// POST Route for notes
app.post('/api/notes', (req, res) => {
  console.log(req.body);

  // Destructured title, and text, added newNote, which can be read in the dbjson file
  // Added id to display the saved notes
  const { title, text, id } = req.body;

  if (req.body) {
    const newNote = {
      title,
      text,
      id: uuidv4(),
    };

  // Appended the new note to db.json file, which was written in correspondence with fsUtils.js file
  readAndAppend(newNote, './db/db.json');
  readFromFile('./db/db.json').then((myNotes) => res.json(JSON.parse(myNotes)));
} else {
  res.err('Error in adding notes');
}
  
});

// DELETE /api/notes/:id should receive a query parameter that contains the id of a note to delete. To delete a note, you'll need to read all notes from the db.json file, remove the note with the given id property, and then rewrite the notes to the db.json file

// DELETE Route for notes (using fsUtils.js)
app.delete('api/notes/:id', (req,res) => {
  readFromFile('./db/db.json').then((myNotes) => res.json(JSON.parse(myNotes)));
  deleteFile(id);
  readAndAppend(newNote, './db/db.json');
  readFromFile('./db/db.json').then((myNotes) => res.json(JSON.parse(myNotes)));
})

// Executes the instance by listening for incoming connections 
app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);
