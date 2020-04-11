import { spiderDay } from "../spider";
import { log } from "../utils/log-utils";

spiderDay().then(() => {
    log("Dayly spider finish")
    process.exit(0)
})