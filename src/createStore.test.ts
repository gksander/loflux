import { createStore } from "./createStore";
import { act, renderHook } from "@testing-library/react-hooks";

describe("createStore", () => {
  it("should create a store object and utility functions", () => {
    const { store, dispatch, useData, useActionResponse } = setup();

    expect(store).toBeTruthy();
    expect(dispatch).toBeInstanceOf(Function);
    expect(useData).toBeInstanceOf(Function);
    expect(useActionResponse).toBeInstanceOf(Function);
  });

  it("should expose useData hook that exposes data", () => {
    const { useData } = setup();

    const { result: nameData } = renderHook(() => useData((s) => s.name));
    const { result: ageData } = renderHook(() => useData((s) => s.age));

    expect(nameData.current).toBe("Jane Doe");
    expect(ageData.current).toBe(32);
  });

  it("should expose a dispatch function to dispatch actions", () => {
    const { dispatch, useData } = setup();
    const { result: nameData } = renderHook(() => useData((s) => s.name));
    const { result: ageData } = renderHook(() => useData((s) => s.age));

    expect(nameData.current).toBe("Jane Doe");
    act(() => {
      dispatch("changeName", "Susan");
    });
    expect(nameData.current).toBe("Susan");

    expect(ageData.current).toBe(32);
    act(() => {
      dispatch("changeAge", 73);
    });
    expect(ageData.current).toBe(73);
  });

  it("should expose a useActionResponse hook that responds to actions", () => {
    const { dispatch, useActionResponse } = setup();

    const listener = jest.fn();
    renderHook(() => useActionResponse("changeName", listener));

    act(() => {
      dispatch("changeName", "Susan Doe");
    });
    expect(listener).toHaveBeenCalled();
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
