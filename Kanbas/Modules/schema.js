import mongoose from 'mongoose';

const moduleSchema = new mongoose.Schema({
    _id: String,
    name: String,
    description: String,
    course: String,
    lessons: [{
        name: String,
        description: String,
        module: String
    }]
}, {collection: 'modules'});

export default moduleSchema;