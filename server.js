const express = require("express");
const cors = require("cors");
const mongoose = require('mongoose');
const PORT = 8080;
const app = express();

// const corsOptions = {
//     origin: 'http://localhost:8080'
// }

app.use(cors());

// parse requests of content-type - application/json
app.use(express.json());

app.use(express.urlencoded({extended: true}));


//connect to database
const db = require("./app/models");
db.mongoose.connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=>{
    console.log("Conectado a base de datos!")
}).catch( err =>{
    console.log("El servidor no pudo conectarse a la base de datos", err);
    process.exit();
});

require("./app/routes/routes")(app);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

