import * as React from "react";
import ReactDOM from "react-dom";
import { createStore } from "../src/createStore";
import { useActionDispatcher, useActionEffect, useStoreData } from "../src";

export const App: React.FC = () => {
  return (
    <div>
      <Header />
      <ChangeYourName />
      <ChangeYourAge />
      <Footer />
    </div>
  );
};

const Header: React.FC = () => {
  const name = useStoreData(profileStore, (s) => s.name);
  const age = useStoreData(profileStore, (s) => s.age);
  const triggerSomeAction = useActionDispatcher(
    profileStore,
    "triggerSomeAction",
  );

  console.log(name);

  return (
    <div>
      <h1>
        HEADER, name is {name}, age is {age}
      </h1>
      <div>
        <button onClick={() => triggerSomeAction()}>Do a thing!</button>
      </div>
    </div>
  );
};

/**
 * Changing name
 */
const ChangeYourName: React.FC = () => {
  const name = useStoreData(profileStore, (s) => s.name);
  const updateName = useActionDispatcher(profileStore, "updateName");

  return (
    <div>
      <h3>Change your name!</h3>
      <div>
        <input value={name} onChange={(e) => updateName(e.target.value)} />
      </div>
    </div>
  );
};

const ChangeYourAge: React.FC = () => {
  const age = useStoreData(profileStore, (s) => s.age);
  const updateAge = useActionDispatcher(profileStore, "updateAge");

  return (
    <div>
      <h3>Change your age!</h3>
      <input
        type="number"
        value={age}
        onChange={(e) => {
          updateAge(parseInt(e.target.value));
        }}
      />
    </div>
  );
};

const Footer: React.FC = () => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  useActionEffect(profileStore, "triggerSomeAction", () => {
    setIsExpanded((v) => !v);
  });

  return <div>{isExpanded ? "Expanded!" : "Collapsed!"}</div>;
};

/**
 * Creating our store
 */
const profileStore = createStore({
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

ReactDOM.render(<App />, document.getElementById("root"));
