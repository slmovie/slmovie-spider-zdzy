import mongoose from 'mongoose'
import { MovieSchema } from './detail-schema'

export const HomeSchema = new mongoose.Schema({
    name: String,
    movies: [MovieSchema]
})