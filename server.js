const express = require("express")
const app = express()
const PORT = process.env.PORT || 3001
const path = require ("path")
let db=require("./db/db.json")
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static("public"))
const fs = require('fs');

app.get("/notes", (req, res)=> {
   res.sendFile(path.join(__dirname, "./public/notes.html")) 
})

app.get("/api/notes", (req, res)=> {
    res.sendFile(path.join(__dirname, 'db/db.json'))
    console.info(`${req.method} request received to pull notes`);
})

app.post("/api/notes", (req, res)=> {
        const filePath = path.join(__dirname, 'db/db.json');
        fs.readFile(filePath, 'utf8', (err, data) => {
          if (err) {
            console.error(err);
            res.status(500).send('Error reading notes file');
            return;
          }
          const notes = JSON.parse(data);
      
          const newNote = { id: Date.now(), ...req.body };
          notes.push(newNote);
      
          const newData = JSON.stringify(notes, null, 2);
          fs.writeFile(filePath, newData, (err) => {
            if (err) {
              console.error(err);
              res.status(500).send('Error saving note');
              return;
            }
            res.status(201).json(newNote);
          });
        });
      });

app.get("*", (req, res)=> {
    res.sendFile(path.join(__dirname, "./public/index.html")) 
 })

app.listen(PORT, () => console.log(`listeningPORT ${PORT}`))