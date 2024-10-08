import { Container } from "inversify";
import "reflect-metadata";
import TYPES from "./types";
import { SectionControllerInterface } from "../controllers/section/SectionControllerInterface";
import SectionController from "../controllers/section/SectionController";
import { getLogger } from "./system/logger";
import { Logger } from "pino";

const container = new Container();
container.bind<Logger>(TYPES.Logger).toDynamicValue(() => {
  return getLogger();
});
container
  .bind<SectionControllerInterface>(TYPES.SectionControllerInterface)
  .to(SectionController);

export { container };
