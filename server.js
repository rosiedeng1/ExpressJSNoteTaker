// Imports all the necessary modules and libraries
const express = require('express');
const path = require('path');
const { readFromFile, readAndAppend } = require('./helper/fsUtils');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

const PORT = process.env.port || 3002;
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

  // Read and appended the new note to db.json file (wrotetofile), which was written in correspondence with fsUtils.js file
  readAndAppend(newNote, './db/db.json');
  readFromFile('./db/db.json').then((myNotes) => res.json(JSON.parse(myNotes)));
} else {
  res.err('Error in adding notes');
}
  
});

// DELETE Route for notes
app.delete('/api/notes/:id', (req, res) => {
  const id = req.params.id; // Get the ID from the request parameters

  // Reads all the notes from db.json file and then parses the JSON data
  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send('An error occurred while reading the file.');
    }

    // Parse the JSON
    let notes = JSON.parse(data);

    // Find the index of the note with the given ID
    const index = notes.findIndex(note => note.id === id);

    if (index !== -1) {
      // If the note was found, remove it from the array (removes note with given id property)
      notes.splice(index, 1);

      // Rewrite the updated JSON back to the db.json file
   fs.writeFile('./db/db.json', JSON.stringify(notes, null, 2), 'utf8', err => {
    if (err) {
      console.error(err);
      return res.status(500).send('An error occurred while writing to the file.');
    }

    res.status(200).send(`Note with id ${id} deleted.`);
  });
    } else {
      // If the note wasn't found, send a 404 status
      res.status(404).send(`Note with id ${id} not found.`);
    }
  })
  
});

// Executes the instance by listening for incoming connections 
app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);
