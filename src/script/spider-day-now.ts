import { spiderDay } from "../spider";
import { log } from "../utils/log-utils";
import { setNewMovies } from "../setting/home-hot";

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