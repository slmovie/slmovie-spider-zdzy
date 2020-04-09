import { spiderToTarget } from "../spider";
import { Constant } from "../constant";
import { log } from "../utils/log-utils";

spiderToTarget(Constant.Download, 1).then(() => {
    log("Download spider finish")
    process.exit(0)
})