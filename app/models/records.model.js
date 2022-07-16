module.exports = mongoose => {

    var schema = mongoose.Schema({
        player1: String,
        player2: String,
        winner: String
    },
    {timestamps: true});

    schema.method("toJSON", function(){
        const { __v, _id, ...object}  = this.toObject();
        object.id = _id;
        return object;
    });

    const Records = mongoose.model("records",schema);
    return Records;
}