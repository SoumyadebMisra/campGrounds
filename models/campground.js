const { default: mongoose } = require("mongoose");
const Review= require("./review");


const imageSchema = new mongoose.Schema({
    url: String,
    filename: String
})

imageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('upload','upload/w_200');
})

const campgroundSchema = new mongoose.Schema({
    title: String,
    price: Number,
    description: String,
    location: String,
    geometry: {
        type: {
          type: String, 
          enum: ['Point'],
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
      },
    images: [imageSchema],
    author: {
        type: mongoose.Schema.Types.ObjectID,
        ref: 'user'
    },
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'review'
        }
    ]
},{
    toJSON: {virtuals: true}
});

campgroundSchema.virtual('properties.popUp').get(function(){
    return `<strong><a href="/campgrounds/${this._id}">${this.title}</a></strong><p>${this.location}</p>`;
})

campgroundSchema.post("findOneAndDelete",async (data)=>{
    if(data){
        await Review.deleteMany({
            id: {
                $in: data.reviews
            }
        })
    }
})

module.exports = mongoose.model('campGround',campgroundSchema);