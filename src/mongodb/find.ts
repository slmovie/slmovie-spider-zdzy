import { DBAddress } from './constans'
import mongoose from 'mongoose'
import { log } from '../utils/log-utils'
import { MovieSchema } from './detail-schema'
import { IMovieDetail, IMovieFile } from '../typing/detail-typing'

const db = mongoose.createConnection(DBAddress + '/movies', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

db.catch((error) => {
    log("error" + error);
    process.exit(0);
});

const model = db.model('Movie', MovieSchema);
function findOne(id: number) {
    model.findOne({ id: id }, (error: any, doc: IMovieDetail) => {
        if (error) {
            log(error)
        } else {
            log(doc)
        }
        process.exit(0);
    })

}

interface ChangedMovie {
    m3u8Urls: IMovieFile[],
    onlineUrls: IMovieFile[],
    downloadUrls: IMovieFile[]
}


async function update(id: number) {
    let m3u8: IMovieFile[] = []
    let http: IMovieFile[] = []
    let downloadUrls: IMovieFile[] = []

    m3u8.push(
        {
            name: 'BD超清中字',
            url: 'http://iqiyi.zuidameiju.com/20200406/14393_cc3c3d63/index.m3u8'
        }
    )
    http.push(
        {
            name: 'BD超清中字',
            url: 'http://iqiyi.zuidameiju.com/share/7d95c1c55d84afc81845d9fb25c0cc0c'
        }
    )
    downloadUrls.push({
        name: 'BD超清中字',
        url: 'http://xiazai.vpszuida.com/20200407/26231_5b499fc9/盲证_超清.mp4'
    })
    try {
        const doc = await model.findOneAndUpdate(
            { id: id },
            { $set: { downloadUrls: downloadUrls, onlineUrls: { http: http, m3u8: m3u8 } } },
            { new: true }
        );
        log(doc)
    } catch (error) {
        log(error)
    }
    process.exit(0)
}

update(83306)
// findOne(83306)
