const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3001;

let notes = [
  {
    id: 1,
    content: "HTML is easy",
    important: true
  },
  {
    id: 2,
    content: "Browser can execute only JavaScript",
    important: false
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true
  }
];

app.use(cors());
app.use(express.json());
app.use(express.static('dist'));

const generatedId = () => {
    const maxId = notes.length > 0 
        ? Math.max(...notes.map(n => n.id))
        : 0;
    return maxId + 1;
}

const requestLogger = (request, response, next) => {
    console.log('Method: ',request.method);
    console.log('Path:',request.path);
    console.log('Body: ',request.body);
    console.log('---');
    next();
}

app.use(requestLogger);

app.post('/api/notes', (req, res) => {
    const body = req.body;

    if(!body.content){
        return res.status(400).json({
            error: 'content missing'
        })
    }

    const note = {
        content: body.content,
        important: Boolean(body.important) || false,
        id: generatedId()
    }
    
    notes = notes.concat(note);
    console.log(note);
    res.json(note);
})

app.get('/', (request, response) => {
    response.send('<h1>Hello World</h1>')
})

app.get('/api/notes/:id', (req, res) => {
    const id = Number(req.params.id);
    const note = notes.find(note => 
        console.log(note.id, typeof note.id , id, typeof id, note.id === id));
    
    console.log(note)
    if(note){
        res.json(note);    
    }else{
        res.status(404).end('Recurso no encontrado')
    }
    
})

app.delete('/api/notes/:id', (req, res) => {
    const id = Number(req.params.id);
    notes = notes.filter(note => note.id !== id);

    express.response.status(204).end('Recurso eliminado')
})

app.get('/api/notes', (request, response) => {
    response.json(notes)
});

const unknownEndpoint = (req, res) => {
    res.status(404).send({error: 'unknown endpoint'});
}

app.use(unknownEndpoint);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})

