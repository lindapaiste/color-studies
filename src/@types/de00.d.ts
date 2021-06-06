import { LAB } from "../difference/types";

declare module "delta-e/src/de00" {
  export default class de00 {
    constructor(x1: LAB, x2: LAB);

    getDeltaE(): number;
  }
}
