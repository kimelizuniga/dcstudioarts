const express                   = require('express'),
      app                       = express(),
      mongoose                  = require('mongoose');



const url =  process.env.MONGOURL || "mongodb://localhost/portfolio";  

mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }).then(() =>{
    console.log("Connected to Database!");
}).catch(err => {
    console.log("ERROR", err.message);
});

// APP CONFIG

app.set('view engine', 'ejs');
app.use(express.static('public'));

// ROUTES

app.get('/', (req,res)=>{
    res.render('index')
})

// PORT LISTEN

let port = process.env.PORT;
if (port == null || port == "") {
  port = 4000;
}

app.listen(port, () => {
    console.log("Server started " + port);
});