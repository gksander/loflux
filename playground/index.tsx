import * as React from "react";
import ReactDOM from "react-dom";
import { createStore } from "../src";

export const App: React.FC = () => {
  return (
    <div>
      <Header />
      <ChangeYourName />
      <ChangeYourAge />
      <SomeOtherThing />
      <Footer />
    </div>
  );
};

const Header: React.FC = () => {
  const name = useProfileData((s) => s.name);
  const age = useProfileData((s) => s.age);

  console.log(name);

  return (
    <div>
      <h1>
        HEADER, name is {name}, age is {age}
      </h1>
      <div>
        <button onClick={() => dispatchProfileAction("triggerSomeAction")}>
          Do a thing!
        </button>
      </div>
    </div>
  );
};

/**
 * Changing name
 */
const ChangeYourName: React.FC = () => {
  const name = useProfileData((s) => s.name);

  return (
    <div>
      <h3>Change your name!</h3>
      <div>
        <input
          value={name}
          onChange={(e) => dispatchProfileAction("updateName", e.target.value)}
        />
      </div>
    </div>
  );
};

const ChangeYourAge: React.FC = () => {
  const age = useProfileData((s) => s.age);

  return (
    <div>
      <h3>Change your age!</h3>
      <input
        type="number"
        value={age}
        onChange={(e) => {
          dispatchProfileAction("updateAge", parseInt(e.target.value));
        }}
      />
    </div>
  );
};

const SomeOtherThing: React.FC = () => {
  const val = useSomeOtherData((s) => 2 * s);

  return (
    <div>
      Value is {val},{" "}
      <button onClick={() => dispatchOtherStoreAction("increment")}>
        Increment
      </button>{" "}
      <button onClick={() => dispatchOtherStoreAction("decrement")}>
        Decrement
      </button>
    </div>
  );
};

const Footer: React.FC = () => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  useRespondToProfileAction("triggerSomeAction", () => {
    setIsExpanded((v) => !v);
  });

  return <div>{isExpanded ? "Expanded!" : "Collapsed!"}</div>;
};

/**
 * Creating our store
 */
const {
  dispatch: dispatchProfileAction,
  useData: useProfileData,
  useActionResponse: useRespondToProfileAction,
} = createStore({
  initialState: { name: "Grant", age: 28 },
  actions: {
    updateName: (draft, name: string) => {
      draft.name = name;
    },
    updateAge: (draft, age: number) => {
      draft.age = age;
    },
    triggerSomeAction: (draft) => {
      draft.name = "Grant";
    },
  },
});

const {
  dispatch: dispatchOtherStoreAction,
  useData: useSomeOtherData,
} = createStore({
  initialState: 0,
  actions: {
    increment: (draft) => (draft += 1),
    decrement: (draft) => (draft -= 1),
  },
});

ReactDOM.render(<App />, document.getElementById("root"));
