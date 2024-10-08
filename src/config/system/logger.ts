import { pino, Logger, stdSerializers } from "pino";
import getConfig from "../getConfig";

const getNewLogger = (): Logger => {
  const { appName, logLevel } = getConfig();

  const isDevelopment = process.env.NODE_ENV === "development";

  return pino({
    name: appName,
    level: logLevel,
    serializers: {
      error: stdSerializers.err,
    },
    ...(isDevelopment && {
      transport: {
        target: "pino-pretty",
        options: {
          colorize: true,
        },
      },
    }),
  });
};

export const getLogger = (): Logger => {
  return getNewLogger();
};
