
// Create a mongoose Schema for a report
const mongoose = require('mongoose')

const PlaceSchema = mongoose.Schema({
    Name:{
        type: String,
    },
    Latitude:{
        type: Number,
    },
    Longitude:{
        type: Number,
    },
    City:{
        type: String,
    },
    Country:{
        type: String,
    },
    photo:{
        type: Buffer
    },
    timetovisit:[{
        TimePeriod:{
            type: String,
        }
    }]
})

const Place = mongoose.model('Place', PlaceSchema)

module.exports = Place