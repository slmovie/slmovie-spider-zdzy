import { spiderDay } from "../spider";
import schedule from "node-schedule";
import { log } from "../utils/log-utils";
import { setNewMovies } from "../setting/home-hot";

schedule.scheduleJob('* * 5 * *', () => {
    spiderDay().then(() => {
        log("Dayly spider finish")
        setNewMovies().then(() => {
            log("update home page finish")
            process.exit(0)
        }).catch(error => {
            log(error)
            process.exit(0)
        })
    })
})
