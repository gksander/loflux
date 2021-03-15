import { ActionList, Store } from "./helperTypes";
import * as React from "react";

/**
 * Extracting store data
 * @param selector
 */
export const useStoreData = <
  S extends any,
  A extends ActionList<S>,
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
