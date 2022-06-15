const { default: mongoose } = require("mongoose");
const Review= require("./review");

const campgroundSchema = new mongoose.Schema({
    title: String,
    price: Number,
    description: String,
    location: String,
    image: String,
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
});

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