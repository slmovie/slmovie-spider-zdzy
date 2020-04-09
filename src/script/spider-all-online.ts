import { spiderToTarget } from "../spider";
import { Constant } from "../constant";
import { log } from "../utils/log-utils";

spiderToTarget(Constant.Online, 1).then(() => {
    log("Online spider finish")
    process.exit(0)
})