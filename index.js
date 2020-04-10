const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

app.set('view engine', 'ejs'); //Using template engines with Express

app.use(bodyParser.urlencoded({ extended: false }));

// Connect to MongoDB
mongoose
  .connect(
    'mongodb://mongo:27017/docker-node-mongo-blog',
    { useNewUrlParser: true }
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

const Item = require('./models/Item');

app.get('/', (req, res) => {
  Item.find()
    .then(items => res.render('index', { items }))
    .catch(err => res.status(404).json({ msg: 'No items found' }));
});

app.post('/post/add', (req, res) => { 
  const newItem = new Item({
    name: req.body.name,
    likes: false
  });
  
  newItem.save().then(() => res.redirect('/'));
});

app.post('/post/delete', (req, res) => { 
 
  Item.remove( {_id: req.body.item}, 
    (err) => {
      if (!err) {
        res.status(200);
        res.redirect('/');
      }
      else {
        res.status(400);
        res.send(err);
      }
  });
  
});

app.post('/post/like', (req, res) => { 

  Item.updateOne( {_id: req.body.item},

    {$set:{likes: true}}, (err) => {

      if (!err) {
        res.status(200);
        res.redirect('/');
      }
      else {
        res.status(400);
        res.send(err);
      }
});

});


app.post('/post/edit', (req, res) => { 


  Item.updateOne( {_id: req.body.item},

    {$set:{name: req.body.name}}, (err) => {

      if (!err) {
        res.status(200);
        res.redirect('/');
      }
      else {
        res.status(400);
        res.send(err);
      }
});

  

});


const port = 3000; 

app.listen(port, () => console.log('Server running...'));
