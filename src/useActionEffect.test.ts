import { createStore } from "./createStore";
import { act, renderHook } from "@testing-library/react-hooks";
import { useActionDispatcher } from "./useActionDispatcher";
import { useActionEffect } from "./useActionEffect";

describe("useActionEffect", () => {
  it("should react to given action, passing new data to handler", () => {
    // Setup
    const store = setup();
    const {
      result: { current: changeName },
    } = renderHook(() => useActionDispatcher(store, "changeName"));

    // Rig up an effect
    const listener = jest.fn();
    renderHook(() => useActionEffect(store, "changeName", listener));

    act(() => {
      changeName("Susan Doe");
    });
    expect(listener).toHaveBeenLastCalledWith({ name: "Susan Doe", age: 32 });
  });

  it("should not respond to other actions", () => {
    // Setup
    const store = setup();
    const {
      result: { current: changeName },
    } = renderHook(() => useActionDispatcher(store, "changeName"));

    // Rig up an effect
    const listener = jest.fn();
    renderHook(() => useActionEffect(store, "changeAge", listener));

    act(() => {
      changeName("Susan Doe");
    });
    expect(listener).not.toHaveBeenCalled();
  });
});

const setup = () => {
  return createStore({
    initialState: { name: "Jane Doe", age: 32 },
    actions: {
      changeName: (draft, name: string) => {
        draft.name = name;
      },
      changeAge: (draft, age: number) => {
        draft.age = age;
      },
    },
  });
};
