import { createStore } from "./createStore";
import { act, renderHook } from "@testing-library/react-hooks";
import { useStoreData } from "./useStoreData";
import { useActionDispatcher } from "./useActionDispatcher";

describe("useActionDispatcher", () => {
  it("should update store data", () => {
    // Setup
    const { store } = setup();
    const { result: nameData } = renderHook(() =>
      useStoreData(store, (s) => s.name),
    );
    const { result: ageData } = renderHook(() =>
      useStoreData(store, (s) => s.age),
    );
    const {
      result: { current: changeName },
    } = renderHook(() => useActionDispatcher(store, "changeName"));
    const {
      result: { current: changeAge },
    } = renderHook(() => useActionDispatcher(store, "changeAge"));

    // Changing name
    expect(nameData.current).toBe("Jane Doe");
    act(() => {
      changeName("Susan Duffy");
    });
    expect(nameData.current).toBe("Susan Duffy");

    // Changing age
    expect(ageData.current).toBe(32);
    act(() => {
      changeAge(47);
    });
    expect(ageData.current).toBe(47);
  });

  // TODO: Test re-rendering efficiency...
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
