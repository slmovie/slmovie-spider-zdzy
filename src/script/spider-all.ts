import { spiderAll } from "../spider";
import { Constant } from "../constant";
import { log } from "../utils/log-utils";

spiderAll(Constant.Download).then(() => {
    log("Download spider finish")
    spiderAll(Constant.Online).then(() => {
        log("Online spider finish")
        process.exit(0)
    })
})