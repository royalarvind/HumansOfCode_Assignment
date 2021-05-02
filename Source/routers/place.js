const express = require('express')
const multer = require('multer')
const Place = require('../models/place')
const mongoose = require('mongoose')
const router = new express.Router()


const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an image'))
        }
        cb(undefined, true)
    }
})

// Create a new request 
router.post('/place', async (req, res)=>{
    const place = new Place({...req.body})
    console.log(place)
    //place.photo = req.file.buffer
    try {
        await place.save()
        res.status(201).send({status: place})
    } catch (e) {
        console.log(e)
        res.status(400).send(e)
    }
},(error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

router.post('/place/photo/:id',upload.single('photo'), async (req, res)=>{
    const place = await Place.findById(req.params.id)
    if (!place) {
        throw new Error()
    }
    place.photo = req.file.buffer
    await place.save()
    res.status(201).send({status: "successfully uploaded photo"})
    
},(error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

router.get('/place/photo/:id', async(req,res)=>{
    try {
        const place = await Place.findById(req.params.id)

        if (!place || !place.photo) {
            throw new Error()
        }
        res.set('Content-Type', 'image/jpg')
        res.send(place.photo)
    } catch (e) {
        res.status(404).send()
    }
})

// Get Aggregated places present in the database 
router.get('/places', async (req, res)=>{
    try {
        const places = await Place.find()
        if(!places){
            return res.status(404).send()
        }
        res.send(places)
    } catch (e) {
        res.status(500).send(e)
    }
})

//Update a Place using its id
router.patch('/place/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['Name', 'Longitude', 'Latitude', 'City', 'Country', 'timetovisit']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        const place = await Place.findOne({ _id: req.params.id})

        if (!place) {
            return res.status(404).send()
        }

        updates.forEach((update) => place[update] = req.body[update])
        await place.save()
        res.send(place)
    } catch (e) {
        res.status(400).send(e)
    }
})

//delete a place using its id
router.delete('/place/:id', async (req, res) => {
    try {
        const place = await Place.findOneAndDelete({ _id: req.params.id})

        if (!place) {
            res.status(404).send()
        }

        res.send(place)
    } catch (e) {
        res.status(500).send()
    }
})

router.delete('/place/photo/:id', async (req, res) => {
    const place = await Place.findOne({ _id: req.params.id})

    if (!place) {
            return res.status(404).send()
    }
    place.photo = undefined
    await place.save()
    res.send()
})

module.exports = router