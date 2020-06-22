const express                   = require('express'),
      app                       = express(),
      mongoose                  = require('mongoose');



const url =  process.env.MONGOURL || "mongodb://localhost/portfolio";  

// APP CONFIG

app.set('view engine', 'ejs');
app.use(express.static('public'));

// ROUTES

app.get('/', (req,res)=>{
    res.render('index')
})

app.listen(4000, ()=>{
    console.log('Server 4000 started')
})
