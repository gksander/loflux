import * as React from "react";
import produce, { Draft } from "immer";
import { SimpleEventEmitter } from "./SimpleEventEmitter";

type Store<
  S,
  A extends { [key: string]: (state: Draft<S>, payload: any) => void }
> = {
  dispatcher: <K extends keyof A>(fnName: K, payload: Parameters<A[K]>[1]) => S;
  getCurrentState: () => S;
  eventEmitter: SimpleEventEmitter<{
    actionName: keyof A;
    newState: S;
  }>;
};

/**
 * Create a store with initial state and actions
 * @param options
 */
export const createStore = <
  S extends any,
  A extends { [key: string]: (state: Draft<S>, payload?: any) => void }
>(options: {
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

/**
 * Extracting store data
 * @param selector
 */
export const useStoreData = <
  S extends any,
  A extends { [key: string]: (state: Draft<S>, payload?: any) => void },
  K extends keyof A,
  Se extends (state: S) => any
>(
  store: Store<S, A>,
  selector: Se,
): ReturnType<Se> => {
  const [s, setS] = React.useState(selector(store.getCurrentState()));

  React.useEffect(() => {
    const { unsubscribe } = store.eventEmitter.subscribe(({ newState }) => {
      const newValue = selector(newState);
      if (s !== newValue) {
        setS(newValue);
      }
    });

    return () => unsubscribe();
  });

  return s;
};

type Param2<F> = F extends (p1: any, p2: infer P2) => any ? P2 : never;

/**
 * Dispatching Actions!
 */
export const useActionDispatcher = <
  S extends any,
  A extends { [key: string]: (state: Draft<S>, payload?: any) => void },
  K extends keyof A
>(
  store: Store<S, A>,
  actionName: K,
): ((
  ...payload: Parameters<A[K]>[1] extends undefined ? [] : [Parameters<A[K]>[1]]
) => void) => {
  return React.useCallback((...payload) => {
    store.dispatcher(actionName, payload);
  }, []);
};

/**
 * Respond to an action
 */
export const useActionEffect = <
  S extends any,
  A extends { [key: string]: (state: Draft<S>, payload?: any) => void }
>(
  store: Store<S, A>,
  listenFor: keyof A,
  effect: (state?: S) => void,
) => {
  React.useEffect(() => {
    const { unsubscribe } = store.eventEmitter.subscribe(
      ({ actionName, newState }) => {
        if (actionName === listenFor) {
          effect(newState);
        }
      },
    );

    return () => unsubscribe();
  }, []);
};
