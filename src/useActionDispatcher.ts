import { ActionList, Store } from "./helperTypes";
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
  ...payload: Parameters<A[K]>[1] extends undefined ? [] : [Parameters<A[K]>[1]]
) => void) => {
  return React.useCallback((...payload) => {
    store.dispatch(actionName, payload[0]);
  }, []);
};
