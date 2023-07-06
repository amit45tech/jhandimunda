const mongoose = require('mongoose');

const gameDataSchema = new mongoose.Schema({
    gameID: {
        type:String,
        require:true,
    }, 
    currentRoundID: {
        type:String,
        require:true,
    },
    previousResults: [
        {
            Diamond:Number,
            Heart: Number,
            Club: Number,
            Spade: Number,
            King: Number,
            Flag: Number,
        }
    ]
});

gameDataSchema.set('timestamps', true);

const GameData = mongoose.model('gameData', gameDataSchema);
module.exports = GameData;