const express = require('express');
const bodyParser = require('body-parser');
const uuid = require('uuid');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Models = require('./models.js');
const { check, validationResult } = require('express-validator');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 8080;
let allowedOrigins = ['http://localhost:1234'];
const longPrompts = Models.longPrompt;
const shortPrompts = Models.shortPrompt;
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) { // If a specific origin isn’t found on the list of allowed origins
      let message = "The CORS policy for this application doesn't allow access from origin " + origin;
      return callback(new Error(message), false);
    }
    return callback(null, true);
  }
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'));
app.use(morgan('common'));
let auth = require('./auth')(app);
const passport = require('passport');
require('./passport');

mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// Greeting message
app.get('/', (req, res) => {
  res.send("Hello");
});

// Get full list of long prompts
app.get('/longprompts', (req, res) => {
  longPrompts.find()
      .then((longPrompts) => {
        res.status(201).json(longPrompts);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
});

// Get a random long prompt
app.get('/random', (req, res) => {
  longPrompts.aggregate([{ $sample: { size: 1 } }])
      .then((random) => {
        res.status(201).json(random);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
});

// Get a short prompt based on the letters of the selected long prompt
app.get('/spL/:letters', (req, res) => {
  let promptResponse = {'hi': 'hello'}

  Array.from(req.params.letters).forEach((element) => {
    shortPrompts.aggregate([
      { $match: { Answer : { $regex : element } } },
      { $sample: { size: 1 } }
    ])
    .then((prompt) => {
      res.send(prompt)
      promptResponse[element] = prompt
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
  })

  res.status(201).json(promptResponse);
});

// Get full list of short prompts
app.get('/shortprompts', (req, res) => {
  shortPrompts.find()
      .then((shortPrompts) => {
        res.status(201).json(shortPrompts);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
});

// Add a new long prompt
app.post('/longprompt', async (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    await longPrompts.findOne({ longPrompt: req.body.longPrompt }) // Search to see if the long prompt already exists in the database
      .then((longPrompt) => {
        if (longPrompt) {
          //If the long prompt is found, send a response that it already exists
          return res.status(400).send(req.body.longPrompt + ' already exists');
        } else {
          longPrompts
            .create({
              longPrompt: req.body.longPrompt,
              Answer: req.body.Answer
            })
            .then((longPrompt) => { res.status(201).json(longPrompt) })
            .catch((error) => {
              console.error(error);
              res.status(500).send('Error: ' + error);
            });
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
      });
  });

// Add a new short prompt
app.post('/shortprompt', async (req, res) => {
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  await shortPrompts.findOne({ shortPrompt: req.body.shortPrompt }) // Search to see if the short prompt already exists in the database
    .then((shortPrompt) => {
      if (shortPrompt) {
        //If the short prompt is found, send a response that it already exists
        return res.status(400).send(req.body.shortPrompt + ' already exists');
      } else {
        shortPrompts
          .create({
            shortPrompt: req.body.shortPrompt,
            Answer: req.body.Answer
          })
          .then((shortPrompt) => { res.status(201).json(shortPrompt) })
          .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
          });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

// error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// listen for requests
app.listen(port, '0.0.0.0',() => {
  console.log('Listening on Port ' + port);
 });
