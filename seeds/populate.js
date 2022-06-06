const mongoose = require('mongoose');
const helper = require('./seedHelpers');
const model = require('../models/campground')

mongoose.connect('mongodb://localhost:27017/yelp-campDB')

const faker = require('faker');

const populate = async ()=>{
    await model.deleteMany({});
    for (let i=0;i<50;i++){
        const campAddress = faker.address.streetAddress(true);
        const city = faker.address.city();
        const price = Math.floor(Math.random()*20000);
        const desc = faker.lorem.sentence(10);
        let camp = new model({
            title: `${city} Camp`,
            location: campAddress,
            price: price,
            image: 'http://source.unsplash.com/collection/484351',
            description : desc
        })
        await camp.save();
    }
}

populate();