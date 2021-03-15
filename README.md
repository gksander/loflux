# Loflux

A sort-of-Flux-like state management library for React for creating stores that are:

- ✅ Flux-like (unidirectional data flow).
- ✅ Hook-based
- ✅ Immutable.
- ✅ Fully type-safe.
- ✅ Not wrapped around your whole app.
- ✅ Render-efficient.

Check out a live demo here! (TODO: actually make this, LOL)

## Basic Example

Let's get you up and running with a simple example that illustrates how to use `loflux`.

### Create a Store

Start by creating a store. Your store will be type-safe based on the initial state and actions.

```ts
import { createStore } from "loflux";

const profileStore = createStore({
	initialState: {name: "Jane Doe", age: 32},
	actions: {
		changeName: (draft, name: string) => {
			draft.name = name;
		},
		changeAge: (draft, age: number) => {
			draft.age = age;
		},
    requestDestroy: () => {}
	}
});
```

### Use Data from Your Store

Now, let's subscribe to some data that's in the store!

```tsx
import { useStoreData } from "loflux";
import profileStore from "...";

const NameDisplay = () => {
	const name = useStoreData(profileStore, s => s.name);
	return <h1>Hello, {name}!</h1>;
}
```

The second argument here is a _selector_ function used to pull out the data that you want. This component only re-renders when the `name` value changes!

### Change Data in Your Store

Chances are, if you're using some sort of store, your data needs to change over time. Let's check that out.

```tsx
import { useStoreData, useActionDispatcher } from "loflux";
import profileStore from "...";

const NameInput = () => {
	const name = useStoreData(profileStore, s => s.name);
	const changeName = useActionDispatcher(profileStore, 'changeName');
	
	return (
		<input
      value={name}
      onChange={(e) => changeName(e.target.value)}
    />
  );
}
```

The `'changeName'` argument might look like a magic-string, but it's actually type-safe and based on the actions that you provide. Changing that to `'foobar'` is going to really upset TypeScript.

Furthermore, the actual `changeName` function is also type-safe! Don't try passing a `number` to that bad boy.

### Subscribe to Actions

Sometimes you want to just respond to actions that pass through your store (e.g., pressing a button in one component triggers some sort of action in some other component that's far away).

```tsx
import { useActionDispatcher, useActionEffect } from "loflux";
import profileStore from "...";

const DestructionButton = () => {
	const requestDestroy = useActionDispatcher(profileStore, 'requestDestroy');
	return <button onClick={() => requestDestroy()}>Try to destory</button>;
}

const OverlayModal = () => {
	const [showConf, setShowConf] = React.useState(false);
	
	useActionEffect(profileStore, 'requestDestroy', () => {
		setShowConf(true);
  });
	
	return showConf ? <div>Confirmation modal...</div> : null;
}
```

---

## API

### The `createStore` method

TODO:

### The `useStoreData` hook

TODO:

### The `useActionDispatcher` hook

TODO:

### The `useActionEffect` hook

TODO:
