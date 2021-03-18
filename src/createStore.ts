import produce from "immer";
import { SimpleEventEmitter } from "./SimpleEventEmitter";
import { ActionList, Store, Tail } from "./helperTypes";
import { useStoreData } from "./useStoreData";
import { useActionEffect } from "./useActionEffect";

/**
 * Create a store with initial state and actions
 */
export const createStore = <S extends any, A extends ActionList<S>>(options: {
  initialState: S;
  actions: A;
}) => {
  const { initialState, actions } = options;
  let currentState = produce(initialState, (_d) => {});
  const eventEmitter = new SimpleEventEmitter<{
    actionName: keyof A;
    newState: S;
  }>();

  /**
   * Dispatch method uses an action, creates new state, and emits new state
   */
  const dispatch = <K extends keyof A>(
    actionName: K,
    ...payload: Parameters<A[K]>[1] extends undefined
      ? []
      : Tail<Parameters<A[K]>>
  ) => {
    const newState = (() => {
      const f = actions[actionName];
      if (f) {
        return produce(currentState, (draft) => f(draft, ...payload));
      } else {
        return currentState;
      }
    })();

    currentState = newState;
    eventEmitter.emit({
      actionName,
      newState,
    });
    return newState;
  };

  /**
   * Method to pull current state (from anywhere)
   */
  const getCurrentState = () => currentState;

  /**
   * Build out the store
   */
  const store: Store<S, A> = {
    dispatch,
    getCurrentState,
    eventEmitter,
  };

  /**
   * Curry the useStoreData for simple access
   */
  const useData = <Se extends (state: S) => any>(selector: Se) =>
    useStoreData(store, selector);

  /**
   * A little currying for useActionResponse for easy access
   */
  const useActionResponse = (
    listenFor: keyof A | (keyof A)[],
    effect: (state?: S) => void,
  ) => useActionEffect(store, listenFor, effect);

  /**
   * Returning store, and utilities.
   */
  return { store, dispatch, useData, useActionResponse };
};
