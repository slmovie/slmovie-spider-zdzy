import { DBAddress } from '../mongodb/constans'
import mongoose, { Model } from 'mongoose'
import { log } from '../utils/log-utils'
import { IMovieDetail } from '../typing/detail-typing'
import { MovieSchema } from '../mongodb/detail-schema';
import { HomeSchema } from '../mongodb/home-schema'


const dbMovies = mongoose.createConnection(DBAddress + '/movies', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});
dbMovies.catch((error) => {
    log(error)
    process.exit(0)
});
const moviesModel = dbMovies.model('Movie', MovieSchema);
const homeModel = dbMovies.model('Home', HomeSchema)

function findOne(name: string) {
    return new Promise(async (resolve, reject) => {
        let movie: IMovieDetail | undefined
        const docs = await moviesModel.find({ name: new RegExp(name) })
        if (docs.length > 0) {
            for (let doc of docs) {
                const item = doc as unknown as IMovieDetail
                if (item.name == name) {
                    movie = item
                    break
                }
            }
        }
        if (movie) {
            resolve(movie)
        } else {
            reject()
        }
    })
}

// findOne("龙岭迷窟")
//     .then((result) => { log(result); process.exit(0) })
//     .catch(error => log(error))

function getMovies(names: string[]) {
    return new Promise(async (resolve, reject) => {
        const hotMovies: IMovieDetail[] = []
        for (let name of names) {
            try {
                const movie = await findOne(name)
                hotMovies.push(movie as unknown as IMovieDetail)
            } catch (error) {
                log(name + "can not find")
            }
        }
        resolve(hotMovies)
    })
}

export async function setHotMovies(names: string[]) {
    try {
        const hotMovies = await getMovies(names)
        const hot = { type: "0", movies: hotMovies }
        const oldHot = await homeModel.findOne({ type: hot.type })
        if (oldHot == null) {
            await homeModel.create(hot)
        } else {
            await homeModel.updateOne({ name: hot.type }, { $set: hot })
        }
    } catch (error) {
        log(error)
    }
    dbMovies.close()
    process.exit(0)
}

async function findNewMoviesByType(type: string) {
    try {
        const doc = await moviesModel.find({ type: type }).limit(10).sort({ addTime: -1 })
        log(doc)
    } catch (error) {
        log(error)
    }
}

const newMovieType = ["4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "19", "20", "21", "22"]

export function setNewMovies() {
    return new Promise(async (resolve, reject) => {
        try {
            for (let type of newMovieType) {
                const movies = await moviesModel.find({ type: type }).limit(15).sort({ addTime: -1 })
                let temp: IMovieDetail[] = []
                for (let movie of movies) {
                    if (!temp.find((item) => item.id == movie.id)) {
                        temp.push(movie as unknown as IMovieDetail)
                    }
                    if (temp.length >= 10) {
                        break
                    }
                }
                const data = { type: type, movies: temp }
                await homeModel.findOneAndUpdate({ type: type }, { $set: data }, { upsert: true, new: true, setDefaultsOnInsert: true })
                dbMovies.close()
                resolve()
            }
        } catch (error) {
            dbMovies.close()
            reject(error)
        }
    })
}

// moviesModel.find({ type: "6" }).limit(10).sort({ addTime: -1 }).then(result => { log(result) })

// setNewMovies().then(() => {
//     log("finish");
//     process.exit(0)
// }).catch(error => {
//     log(error)
//     process.exit(0)
// })
