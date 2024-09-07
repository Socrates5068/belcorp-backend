import {pino, Logger, stdSerializers} from "pino";
import getConfig from "../getConfig";


const getNewLogger = (): Logger => {
    const { appName, logLevel } = getConfig();
    return pino({
        name: appName,
        level: logLevel,
        serializers: {
            error: stdSerializers.err
        }
    });
};

export const getLogger = (): Logger => {
    return getNewLogger();
};
