import { createStore } from "./createStore";
import { renderHook } from "@testing-library/react-hooks";
import { useStoreData } from "./useStoreData";

describe("useStoreData", () => {
  it("should return store data via selector", () => {
    const { store } = setup();
    const { result: nameData } = renderHook(() =>
      useStoreData(store, (s) => s.name),
    );
    const { result: ageData } = renderHook(() =>
      useStoreData(store, (s) => s.age),
    );

    expect(nameData.current).toBe("Jane Doe");
    expect(ageData.current).toBe(32);
  });

  // TODO: Maybe setup more complex example, and show re-render efficiency
});

const setup = () => {
  return createStore({
    initialState: { name: "Jane Doe", age: 32 },
    actions: {
      changeName: (draft, name: string) => {
        draft.name = name;
      },
    },
  });
};
