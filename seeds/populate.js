const mongoose = require('mongoose');
const helper = require('./seedHelpers');
const model = require('../models/campground')
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const geoCoder = mbxGeocoding({accessToken: 'LOL'});

mongoose.connect('mongodb://localhost:27017/yelp-campDB')

const faker = require('faker');

const populate = async ()=>{
    await model.deleteMany({});
    for (let i=0;i<50;i++){
        const campAddress = faker.address.streetAddress(true);
        const city = faker.address.city();
        const price = Math.floor(Math.random()*20000);
        const desc = faker.lorem.sentence(10);

        const geoData = await geoCoder.forwardGeocode({
            query: campAddress,
            limit: 1
          }).send()

        
        let camp = new model({
            title: `${city} Camp`,
            location: campAddress,
            price: price,
            geometry: geoData.body.features[0].geometry,
            images: [
                {
                    url:"https://res.cloudinary.com/dsivjwmzi/image/upload/v1655591181/YelpCamp/photo-1504280390367-361c6d9f38f4_n8qta2.jpg",
                    filename: "YelpCamp/photo-1504280390367-361c6d9f38f4_n8qta2"
                }
            ],
            author:"62aa2dff056f31ec9ce95e89",
            description : desc
        })
        await camp.save();
    }
}

populate();