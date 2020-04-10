import mongoose from 'mongoose'

const movieFiles = new mongoose.Schema({
	name: String,
	url: String
});

export const MovieSchema = new mongoose.Schema({
	name: String,
	post: String,
	describe: String,
	year: String,
	location: String,
	type: String,
	actor: String,
	director: String,
	status: String,
	downloadUrls: [movieFiles],
	webUrls: [movieFiles],
	m3u8Urls: [movieFiles],
	id: String,
	addTime: String
});
