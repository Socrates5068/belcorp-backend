import { Container } from "inversify";
import "reflect-metadata";
import { Logger } from "pino";
import TYPES from "./types";
import { getLogger } from "./system/logger";

const container = new Container();
container.bind<Logger>(TYPES.Logger).toDynamicValue(() => {
  return getLogger();
});

export { container };
