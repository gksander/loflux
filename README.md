# Loflux

A sort-of-Flux-like state management library for React for creating stores that are:

- ✅ Flux-like (unidirectional data flow).
- ✅ Hook-based.
- ✅ Immutable via Immer.
- ✅ Fully type-safe.
- ✅ Not wrapped around your whole app.
- ✅ Render-efficient.

Check out [a live demo here](https://codesandbox.io/s/loflux-demo-2tcw9?file=/src/App.tsx)!

## Basic Example

Let's get you up and running with a simple example that illustrates how to use `loflux`.

### Install the library

Install from NPM:

```shell
# Using NPM
npm install loflux

# Or using Yarn
yarn add loflux
```

### Create a Store

Start by creating a store. Your store will be type-safe based on the initial state and actions.

```ts
import {createStore} from "loflux";

const profileStore = createStore({
	initialState: {name: "Jane Doe", age: 32},
	actions: {
		changeName: (draft, name: string) => {
			draft.name = name;
		},
		changeAge: (draft, age: number) => {
			draft.age = age;
		},
		requestDestroy: () => {
		}
	}
});
```

### Use Data from Your Store

Now, let's subscribe to some data that's in the store!

```tsx
import {useStoreData} from "loflux";
import profileStore from "...";

const NameDisplay = () => {
	const name = useStoreData(profileStore, s => s.name);
	return <h1>Hello, {name}!</h1>;
}
```

The second argument here is a _selector_ function used to pull out the data that you want. This component only
re-renders when the `name` value changes!

### Change Data in Your Store

Chances are, if you're using some sort of store, your data needs to change over time. Let's check that out.

```tsx
import {useStoreData, useActionDispatcher} from "loflux";
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

The `'changeName'` argument might look like a magic-string, but it's actually type-safe and based on the actions that
you provide. Changing that to `'foobar'` is going to really upset TypeScript.

Furthermore, the actual `changeName` function is also type-safe! Don't try passing a `number` to that bad boy.

### Subscribe to Actions

Sometimes you want to just respond to actions that pass through your store (e.g., pressing a button in one component
triggers some sort of action in some other component that's far away).

```tsx
import {useActionDispatcher, useActionEffect} from "loflux";
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

### The `createStore` function

The `createStore` function creates a store with a given state shape and set of actions that can be dispatched. The
signature is:

```ts
createStore(options: { initialState, actions });
```

with the following options:

| Options | Type | Required? | Description |
| --- | --- | --- | --- |
| `initialState` | `S extends any` | ✅ | Initial state for store. The type of this will _type_ the rest of your store. |
| `actions` | `{ [key: string]: (draft: Draft<S>, payload: any) => void; }` | ✅ | Map of actions that can be dispatched, and how they affect the store's state. Uses Immer.js, so `draft` can be acted on as if it was mutable. |

Here's a quick example:

```ts
import { createStore } from "loflux";

const profileStore = createStore({
	initialState: { name: "Jane Doe", age: 32 },
	actions: {
		changeName: (draft, name: string) => {
			draft.name = name;
		},
		changeAge: (draft, age: number) => {
			draft.age = age;
		},
		requestDestroy: () => {
		}
	}
});

```

### The `useStoreData` hook

The `useStoreData` hook is a way to extract/subscribe to store data. You provide a store and a _selector_ that selects that data in the store that you want to subscribe to, and the hook gives you back the selected data. Updates to that data trigger re-renders. The signature is:

```ts
useStoreData(store: Store, selector: (state: State) => any);
```

Here's a quick example:

```tsx
const profileStore = createStore({
	initialState: { name: "Jane Doe", age: 32 },
	actions: { ... }
});

const MyComponent = () => {
	const name = useStoreDate(profileStore, s => s.name);
	
	return <div>Hello, {name}!</div>;
}
```

### The `useActionDispatcher` hook

The `useActionDispatcher` hook is a way to dispatch actions to a store. You provide a store and the name of an action (from you action list provided in `createStore`), and the hook will return a function you can call to dispatch the specified action. The signature is:

```ts
useActionDispatcher(store: Store, actionName: string);
```

Here's a quick example:

```tsx
const profileStore = createStore({
	initialState: {name: "Jane Doe", age: 32},
	actions: {
		updateName: (draft, newName: string) => {
			draft.name = newName;
		}
	}
});

const MyComponent = () => {
	const updateName = useActionDispatcher( profileStore, "updateName");
	return <button onClick={() => updateName("Susan!")}>Change to Susan!</button>;
}
```


### The `useActionEffect` hook

The `useActionEffect` hook is a way to respond to actions that get dispatched. The signature is:

```ts
useActionEffect(store: Store, actionName: string, effect: (newState: State) => void);
```

Here's a quick example:

```tsx
const profileStore = createStore({
	initialState: {name: "Jane Doe", age: 32},
	actions: {
		updateName: (draft, newName: string) => {
			draft.name = newName;
		}
	}
});

const MyComponent = () => {
	useActionEffect(profileStore, "updateName", () => {
		console.log("updateName was fired! Do something cool.");
	});

	return <button onClick={() => updateName("Susan!")}>Change to Susan!</button>;
}
```
