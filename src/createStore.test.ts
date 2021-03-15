import { createStore } from "./createStore";
import { SimpleEventEmitter } from "./SimpleEventEmitter";

describe("createStore", () => {
  it("should create a store object with a dispatcher attached", () => {
    const store = setup();
    expect(store.dispatcher).toBeInstanceOf(Function);
  });

  it("should create a store object with an EventEmitter attached", () => {
    const store = setup();

    expect(store.eventEmitter).toBeInstanceOf(SimpleEventEmitter);
  });
});

const setup = () => {
  return createStore({
    initialState: { name: "Jane Doe" },
    actions: {
      changeName: (draft, name: string) => {
        draft.name = name;
      },
    },
  });
};
