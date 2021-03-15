import produce from "immer";
import { SimpleEventEmitter } from "./SimpleEventEmitter";
import { ActionList, Store } from "./helperTypes";

/**
 * Create a store with initial state and actions
 */
export const createStore = <S extends any, A extends ActionList<S>>(options: {
  initialState: S;
  actions: A;
}): Store<S, A> => {
  const { initialState, actions } = options;
  let currentState = produce(initialState, (_d) => {});
  const eventEmitter = new SimpleEventEmitter<{
    actionName: keyof A;
    newState: S;
  }>();

  const dispatcher = <K extends keyof A, P extends Parameters<A[K]>[1]>(
    actionName: K,
    payload: P,
  ) => {
    const newState = (() => {
      const f = actions[actionName];
      if (f) {
        return produce(currentState, (draft) => f(draft, payload));
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

  const getCurrentState = () => currentState;

  return {
    dispatcher,
    getCurrentState,
    eventEmitter,
  };
};
