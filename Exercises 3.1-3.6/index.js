const express = require('express')
const app = express()
app.use(express.json())

const morgan = require('morgan')

const morganPOSTData = morgan.token('data', (req) => JSON.stringify(req.body))

app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data', { skip: (req) =>
    req.method !== 'POST'}));

    let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
    const now = new Date()

    response.send(`
        <div>
            <div>Phonebook has info for ${persons.length} people</div>
            <div>${now.toString()}</div>
        </div>
    `)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(p => p.id === id)

    if (!person) {
        return response.status(404).json(`{error: No person with id ${id}}`)
    }

    response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(p => p.id !== id)

    response.status(204).end()
})

const generateId = () => {
    const maxId = persons.length > 0
        ? Math.max(...persons.map(p => Number(p.id)))
        : 0

    return String(maxId + 1)
}

app.post('/api/persons', (request, response) => {
    const body = request.body
    console.log(body)

    if (!body) {
        response.status(400).json({error: 'request body not defined'})
    }

    if (!body.name) {
        return response.status(400).json({error: 'name missing'})
    } else if (!body.number) {
        return response
        .status(400).json({error: 'number missing'})
    } else if (persons.find(p => p.name === body.name)) {
        return response.status(400).json({error: 'name must be unique'})
    }

    const person = {
        id: generateId(),
        name: body.name,
        number: body.number
    }

    persons = persons.concat(person)

    response.status(200).json(person)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
})