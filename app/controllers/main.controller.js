const db = require("../models");
const Records = db.records;


exports.getAll = (req, res) => {
    Records.find().then(data => {
        res.send(data);
    }).catch(err =>{
        res.status(500).send({
            message: err.message
        });
    });
}

exports.create = (req, res) => {

    if(!req.body.player1 || !req.body.player2 || !req.body.winner){
        res.status(400).send({message: "Contenido no puede ser vacio"});
        return;
    }
    
    const records = new Records({
        player1: req.body.player1,
        player2: req.body.player2,
        winner: req.body.winner
    });
    
    records.save(records).then(data =>{
        console.log("REGISTRO GUARDADO EN BASE DE DATOS", req.body);

        res.send(data);
    }).catch((err)=>{
        res.status(500).send({message: err.message});
    });

}