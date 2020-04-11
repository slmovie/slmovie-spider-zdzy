import { spiderPage } from "../spider";
import { Constant } from "../constant";
import { log } from "../utils/log-utils";

spiderPage(Constant.Download, () => {
    log("Download spider finish")
    spiderPage(Constant.Online, () => {
        log("Online spider finish")
        process.exit(0)
    })
})
