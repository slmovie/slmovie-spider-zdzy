import { DBAddress } from '../mongodb/constans'
import mongoose, { Model } from 'mongoose'
import { log } from '../utils/log-utils'
import { IMovieDetail } from '../typing/detail-typing'
import { MovieSchema } from '../mongodb/detail-schema';
import { HomeSchema } from '../mongodb/home-schema'

const dbMovies = mongoose.createConnection(DBAddress + '/movies', {
    useNewUrlParser: true,
    useUnifiedTopology: true
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

async function setHotMovies(names: string[]) {
    try {
        const hotMovies = await getMovies(names)
        log(hotMovies)
        const hot = { name: "hot", movies: hotMovies }
        log(hot)
        await homeModel.create(hot)
    } catch (error) {
        log(error)
    }
    dbMovies.close()
    process.exit(0)
}

// setHotMovies(["龙岭迷窟", "我是余欢水"])