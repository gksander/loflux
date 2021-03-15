import { ActionList, Store } from "./helperTypes";
import * as React from "react";

/**
 * Respond to an action
 */
export const useActionEffect = <S extends any, A extends ActionList<S>>(
  store: Store<S, A>,
  listenFor: keyof A | (keyof A)[],
  effect: (state?: S) => void,
) => {
  React.useEffect(() => {
    const { unsubscribe } = store.eventEmitter.subscribe(
      ({ actionName, newState }) => {
        if (
          (Array.isArray(listenFor) && listenFor.includes(actionName)) ||
          (typeof listenFor === "string" && actionName === listenFor)
        ) {
          effect(newState);
        }
      },
    );

    return () => unsubscribe();
  }, []);
};
