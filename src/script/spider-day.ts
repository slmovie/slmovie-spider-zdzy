import { spiderDay } from "../spider";
import schedule from "node-schedule";
import { log } from "../utils/log-utils";
import { setNewMovies } from "../setting/home-hot";

schedule.scheduleJob('00 00 * * * *', () => {
    log("start schedul", true)
    spiderDay().then(() => {
        log("Dayly spider finish", true)
        setNewMovies().then(() => {
            log("update home page finish", true)
            process.exit(0)
        }).catch(error => {
            log(error)
            process.exit(0)
        })
    })
})

