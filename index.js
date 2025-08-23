const express = require('express')
const morgan = require('morgan')

const app = express()
//parsing json
app.use(express.json())

app.use(express.static('dist'))

morgan.token('data', (req, res) => JSON.stringify(req.body))

app.use(morgan((tokens, req, res) => {
    const base = [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms'
    ].join(' ')

    if (req.method === 'POST') {
        return `${base} ${tokens.data(req, res)}`
    }

    return base
}))

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

//return all the persons
app.get('/api/persons', (request, response) => {
    response.status(200).json(persons)
})

//info page
app.get('/info', (request, response) => {
    const time = new Date()

    response.send(`Phone has info for ${persons.length} people
        \n${time}`)
})

//single person
app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id
    const person = persons.find(p => p.id === id)

    if (!person) {
        res.status(404).json({error: "Person not found"})
    }

    res.status(200).json(person)
})

//delete one person
app.delete('/api/persons/:id', (req, res) => {
    const id = req.params.id

    persons = persons.filter(p => p.id !== id)

    res.status(200).end()
})

const generateId = () => {
    const maxId = Math.max(...persons.map(p => Number(p.id)))

    return String(maxId + 1)
}

//add new person
app.post('/api/persons', (req, res) => {
    const body = req.body

    if (!body.name) {
        res.status(404).json({error: 'name is missing'})
    } else if (!body.number) {
        res.status(404).json({error: 'number is missing'})
    } else if (persons.some(p => p.name === body.name)) {
        res.status(400).json({error: 'name must be unique'})
    }

    const person = {
        id: generateId(),
        name: body.name,
        number: body.number
    }

    persons.push(person)
    res.status(200).json(persons)
})

PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`)
})