import { ActionList, Store, Tail } from "./helperTypes";
import * as React from "react";

/**
 * Dispatching Actions!
 */
export const useActionDispatcher = <
  S extends any,
  A extends ActionList<S>,
  K extends keyof A
>(
  store: Store<S, A>,
  actionName: K,
): ((
  ...payload: Parameters<A[K]>[1] extends undefined
    ? []
    : Tail<Parameters<A[K]>>
) => void) => {
  return React.useCallback((...payload) => {
    store.dispatch(actionName, ...payload);
  }, []);
};
