import { Draft } from "immer";
import { SimpleEventEmitter } from "./SimpleEventEmitter";

/**
 * List of actions for a given piece of state
 */
export type ActionList<S> = {
  [key: string]: (state: Draft<S>, payload?: any) => void;
};

/**
 * Store type
 */
export type Store<S, A extends ActionList<S>> = {
  dispatcher: <K extends keyof A>(fnName: K, payload: Parameters<A[K]>[1]) => S;
  getCurrentState: () => S;
  eventEmitter: SimpleEventEmitter<{
    actionName: keyof A;
    newState: S;
  }>;
};
