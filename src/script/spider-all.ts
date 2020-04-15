import { spiderPage } from "../spider";
import { Constant } from "../constant";
import { log } from "../utils/log-utils";
import { setNewMovies } from "../setting/home-hot"
spiderPage(Constant.Download, () => {
    log("Download spider finish")
    spiderPage(Constant.Online, () => {
        log("Online spider finish")
        setNewMovies().then(() => {
            log("update home page finish")
            process.exit(0)
        }).catch(error => {
            log(error)
            process.exit(0)
        })
    })
})
