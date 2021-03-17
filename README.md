# Loflux

A sort-of-Flux-like state management library for React for creating stores that are:

- ✅ Flux-like (unidirectional data flow).
- ✅ Hook-based.
- ✅ Immutable via Immer.
- ✅ Fully type-safe.
- ✅ Not wrapped around your whole app.
- ✅ Render-efficient.

Check out [a live demo here](https://codesandbox.io/s/loflux-demo-2tcw9?file=/src/App.tsx)! For a more dynamic example, check out [this live demo](https://codesandbox.io/s/loflux-points-2cynn?file=/src/Point.tsx).

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
import { createStore } from "loflux";

const { useData, dispatch, useActionResponse } = createStore({
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

### Use Data from Your Store

Now, let's subscribe to some data that's in the store!

```tsx
const { useData: useProfileData, ... } = createStore({ ... });

const NameDisplay = () => {
	const name = useProfileData((s) => s.name);
	return <h1>Hello, {name}!</h1>;
}
```

The argument to the `useData` hook here is a _selector_ function used to pull out the data that you want. This component only
re-renders when the `name` value changes!

### Change Data in Your Store

Chances are, if you're using some sort of store, your data needs to change over time. Let's check that out.

```tsx
const { useData: useProfileData, dispatch: dispatchProfileAction, ... } = createStore({ ... });

const NameInput = () => {
	const name = useProfileData((s) => s.name);

	return (
		<input
			value={name}
			onChange={(e) => dispatchProfileAction('changeName', e.target.value)}
		/>
	);
}
```

The `'changeName'` argument might look like a magic-string, but it's actually type-safe and based on the actions that
you provide. Changing that to `'foobar'` is going to really upset TypeScript.

Furthermore, the payload of that dispatched action is type-safe, too! Don't try to pass a `number` as the second argument if the action you're trying to dispatch isn't expecting it!

### Subscribe to Actions

Sometimes you want to just respond to actions that pass through your store (e.g., pressing a button in one component
triggers some sort of action in some other component that's far away).

```tsx
const { dispatch: dispatchProfileAction, useActionResponse: useRespondToProfileAction } = createStore({ ... });


const DestructionButton = () => {
	return <button onClick={() => dispatchProfileAction('requestDestroy')}>Try to destory</button>;
}

const OverlayModal = () => {
	const [showConf, setShowConf] = React.useState(false);

	useRespondToProfileAction('requestDestroy', () => {
		setShowConf(true);
	});

	return showConf ? <div>Confirmation modal...</div> : null;
}
```

---

## API

### The `createStore` function

The `createStore` function creates a store with a given state shape and set of actions that can be dispatched, and returns the store object (you likely don't need this) and some utility functions to access the store data and dispatch actions. The
signature is:

```ts
createStore = (options: { initialState, actions }) => ({ store, useData, dispatch, useActionResponse });
```

with the following options:

| Options | Type | Required? | Description |
| --- | --- | --- | --- |
| `initialState` | `S extends any` | ✅ | Initial state for store. The type of this will _type_ the rest of your store. |
| `actions` | `{ [key: string]: (draft: Draft<S>, payload: any) => void; }` | ✅ | Map of actions that can be dispatched, and how they affect the store's state. Uses Immer.js, so `draft` can be acted on as if it was mutable. |

Here's a quick example:

```ts
import { createStore } from "loflux";

const { store, useData, dispatch, useActionResponse } = createStore({
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

#### The `createStore().useData` hook

The `createStore` function will return a `useData` hook that you can use to access data. The signature for this hook is:

```tsx
createStore().useData = (selector: (state: State) => any) => ReturnType<typeof selector>;
```

Use this selector to pluck out the data that you need, or do any massaging you need. For advanced computed/derived values, consider using this in conjunction with `React.useMemo`.

#### The `createStore().dispatch` method

The `createStore` function will return a `dispatch` method that you can use to dispatch actions to the store. The signature for this hook is:

```tsx
createStore().dispatch = (actionName, payload) => void;
```

You pass in an action name as a string (corresponds to the actions you declared when creating the store), and a payload that matches the type of the second parameter of the declared action. 


#### The `createStore().useActionResponse` hook

The `createStore` function returns a `useActionResponse` hook that responds to specified actions that pass through the store. You indicate which action type(s) you want to listen for, and a callback to run when those actions occur.

### The `useStoreData` hook

You probably don't need this hook, `createStore().useData` is an easy-access pattern for this. The `useStoreData` hook is a way to extract/subscribe to store data from a particular store. You provide a store and a _selector_ that selects that data in the store that you want to subscribe to, and the hook gives you back the selected data. Updates to that data trigger re-renders. The signature is:

```ts
useStoreData(store: Store, selector: (state: State) => any);
```

Here's a quick example:

```tsx
const { store: profileStore } = createStore({
	initialState: { name: "Jane Doe", age: 32 },
	actions: { ... }
});

const MyComponent = () => {
	const name = useStoreDate(profileStore, s => s.name);
	
	return <div>Hello, {name}!</div>;
}
```

### The `useActionDispatcher` hook

You probably don't need this hook, `createStore().dispatch` is an easy-access pattern for this. The `useActionDispatcher` hook is a way to dispatch actions to a specified store. You provide a store and the name of an action (from you action list provided in `createStore`), and the hook will return a function you can call to dispatch the specified action. The signature is:

```ts
useActionDispatcher(store: Store, actionName: string);
```

Here's a quick example:

```tsx
const { store: profileStore } = createStore({
	initialState: {name: "Jane Doe", age: 32},
	actions: {
		updateName: (draft, newName: string) => {
			draft.name = newName;
		}
	}
});

const MyComponent = () => {
	const updateName = useActionDispatcher(profileStore, "updateName");
	return <button onClick={() => updateName("Susan!")}>Change to Susan!</button>;
}
```


### The `useActionEffect` hook

You probably don't need this hook, `createStore().useActionResponse` is an easy-access pattern for this. The `useActionEffect` hook is a way to respond to actions that get dispatched. The signature is:

```ts
useActionEffect(store: Store, actionName: string | string[], effect: (newState: State) => void);
```

Here's a quick example:

```tsx
const { store: profileStore } = createStore({
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
