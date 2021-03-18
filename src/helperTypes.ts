import { Draft } from "immer";
import { SimpleEventEmitter } from "./SimpleEventEmitter";

/**
 * List of actions for a given piece of state
 */
export type ActionList<S> = {
  [key: string]: (state: Draft<S>, ...payload: any[]) => void;
};

type Dispatch<S, A extends ActionList<S>> = <K extends keyof A>(
  fnName: K,
  ...payload: Parameters<A[K]>[1] extends undefined
    ? []
    : Tail<Parameters<A[K]>>
) => S;

/**
 * Getting all but first types of an array
 */
export type Tail<T extends any[]> = ((...t: T) => void) extends (
  h: any,
  ...r: infer R
) => void
  ? R
  : never;

/**
 * Store type
 */
export type Store<S, A extends ActionList<S>> = {
  dispatch: Dispatch<S, A>;
  getCurrentState: () => S;
  eventEmitter: SimpleEventEmitter<{
    actionName: keyof A;
    newState: S;
  }>;
};
