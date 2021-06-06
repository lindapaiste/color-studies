import { LAB } from "../difference/types";

declare module "delta-e" {
  export default class DeltaE {
    getDeltaE76(lab1: LAB, lab2: LAB): number;

    getDeltaE94(lab1: LAB, lab2: LAB): number;

    getDeltaE00(lab1: LAB, lab2: LAB): number;
  }
}
