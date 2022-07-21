// Bring in files
const fs = require('fs');
const express = require('express');
const { v4: uuidv4 } = require('uuid');

// Initialize newId to be the new unique id that is generated
const newId = uuidv4();

// Initialize app to hold value of express
const app = express();

// Port
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

// GET routes that get the html files
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, '/public/index.html'));
// });

// app.get('/', (req, res) => res.send('Navigate to /notes'));

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'))
});

app.post('/api/notes', (req, res) => {
    res.status(200).json(`${req.method} note received`);

    console.info(`${req.method} note received`);

    const { note } = req.body;

    if(note) {
        const newNote = {
            note,
            newId,
        };

        fs.readFile('./db/db.json', 'utf8', (err, data) => {
            // Error handling
            if (err) {
                console.error(err);
            } else {
                // Convert note to JSON object
                const parsedNote = JSON.parse(data);
    
                parsedNote.push(newNote);

                fs.writeFile('./db/db.json', 
                JSON.stringify(parsedNote),
                (writeErr) => 
                writeErr
                    ? console.error(writeErr)
                    : console.info('Succesfully added a new note!')
                );
            }
        });
        const response = {
            status: 'success',
            body: newNote,
          };
      
          console.log(response);
          res.status(201).json(response);
        } else {
            res.status(500).json('Error in posting review');
        }
});

app.listen(PORT, () => {
    console.log(`App listening at http://localhost:${PORT}`);
});
