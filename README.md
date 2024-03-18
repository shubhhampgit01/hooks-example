
# useCallBack and useMemo Overview

Welcome to the guide on useCallback and useMemo hooks in React! This document aims to provide a clear understanding of these concepts and their practical use cases in React applications.

## What is useCallback and useMemo?
useCallback and useMemo are both hooks provided by React to optimize performance and manage state in functional components.

### useCallback
useCallback is a hook used to memoize functions. It returns a memoized version of the callback function that only changes if one of the dependencies has changed. This optimization is useful when passing callbacks to child components that rely on reference equality to prevent unnecessary renders.

### useMemo
useMemo is a hook used to memoize values. It memoizes the result of a function or computation and reuses the cached value until one of the dependencies changes. This optimization is helpful for expensive calculations or computations within a functional component.


## Why to use useMemo or useCallBack ?

Basically these hooks are used to improve performance of an app by preventing unnecessary re-renders , When a state value changes in a component, the entire component re-renders. However, sometimes functions within the component, which are not directly related to the changed state, also re-render unnecessarily which we dont want to do.

Consider a scenraio , you have a function whose values change rarely and it takes a considerable amount of time to execute and You may be passing this function to child components. Without using useCallback, whenever any other state value changes, this function will also re-render, causing the child components to render unnecessarily as well. This can lead to performance issues, especially in complex applications where many state variables are changing frequently, resulting in the re-rendering of the entire component each time.
 
So, To avoid this issue and prevent unnecessary re-renders of functions and child components, we utilize useCallback and useMemo effectively.






## Understanding the code


In this repository, the code has been divided into two sections: one with and one without the utilization of these hooks. We aim to observe the differences between not using these hooks versus using them effectively.

The code involves the creation of two state variables: `items` and `number`, which track the items added to an array and a numerical value, respectively.

we have utlized these state variables in two main functions 

```javascript
  const addItem = () => {
    setItems([...items, "item added"]);
  };

 // and

   const increment = () => {
    setNumber(number + 1);
  };

```

Regarding the `number` variable, we check whether it's even or odd and display it in our app. However, the critical point here is that while checking for even or odd, we've included a loop within the function, which takes some time to execute every time:


```javascript
 const isEven = () => {
    let i = 0;
    while (i < 2000000000) i++;
    return number % 2 == 0;
  };

```

thereafter, we are rendering a child componnt <Lists/> in which we are passing the `items` and `addItems` function  as props

Below is the code of child componnent

```javascript
import React from "react";

const Lists = ({ items, addItem }) => {
  console.log("list page");
  return (
    <div>
      <button onClick={addItem}>Add Item</button>
      <ul>
        {items.map((item, index) => (
          <li key={index}>
            {item}- {index + 1}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default React.memo(Lists);
```

In this component, we utilize the memo feature, which prevents re-rendering if none of the props have changed. This optimization helps to improve the overall performance of the application.







# Addressing the problem

## There are two main issues to address in this scenario:

### Delay in Execution: 
When attempting to increase the count of `number`, there's a noticeable delay due to the loop. However, even when adding items, we still experience this delay.

### Unnecessary Re-renders:
Despite using memo in the `Lists` component and not changing values in any props passed to it, it still re-renders every time.


while we are not dealing with `number` , the code still show a delay and the list Component is still re-rendering everytime

#### Why is that? and how can we fix these performance issues?



# Optimizations

### Fixing the Delay in Execution:
To fix the delay, consider  memoizing the `isEven` function using useMemo and set the dependency as `number`. This way, the heavy computation only runs when necessary and when only `number` variable will change and it will not cause delay issues for others so that when we try `addItems` , it will run smoothly and the `isEven` will not affect its performance unless `number` variable is  altered.

```javascript
const isEven = useMemo(() => {
    let i = 0;

    while (i < 2000000000) i++;
    return number % 2 == 0;
  }, [number]);

```

### Unnecessary Re-renders:
To prevent unnecessary re-renders of the Lists component, memoize the addItem function using useCallback and set the dependency as `items`. This ensures that the function reference remains the same across renders unless its dependencies change, preventing unnecessary re-renders of the Lists component.

```javascript
  const addItem = useCallback(() => {
   setItems([...items, "item added"]);
   }, [items]);

```

# Note
Whenever a state value changes in a component, a rerender occurs, and each time a rerender happens, the function within the component receives a new reference. This is why even though we used `memo` inside the `Lists` component, it did not prevent rerendering because it receives a new reference for the `addItem` function every time, thus causing the entire component to rerender.

When we use `useCallback` with `addItem`, the reference won't change unless the dependency is altered. Therefore, the `Lists` component always receives the same reference for `addItem`, and it will not rerender unnecessarily.


## What these hooks actually do to optimize our performance ?

When we use `useMemo`, it memoizes the result of a function or computation. This means that the calculated value is stored in memory, and on any rerenders, React compares this memoized value with the current value. If there's no change in the dependencies provided to `useMemo`, React will reuse the memoized value without recalculating it, thus preventing unnecessary computations and improving performance. However, if any of the dependencies have changed, React will recalculate the value, ensuring that it remains up-to-date.

Similarly, `useCallback` memoizes functions. It returns a memoized version of the function that only changes if any of its dependencies have changed. When a component re-renders, React checks whether the dependencies of the memoized function have changed. If they haven't, React returns the memoized function with the same reference as before, preventing unnecessary re-creation of the function. This optimization is particularly useful when passing callbacks to child components, as it helps avoid unnecessary re-renders of those components.


## When to use useMemo and when useCallBack ?

When dealing with a return value only, use useMemo. This hook is suitable for memoizing the result of a function or computation. It treats the return value as a value, which means you won't be able to pass any arguments to that function. Therefore, useMemo is ideal for situations where you need to memoize a computed value based on certain dependencies and don't require passing arguments to the memoized function.

On the other hand, use useCallback when dealing with more complex scenarios involving functions and components. This hook is beneficial for memoizing entire functions. It returns a memoized version of the function, which helps prevent unnecessary recreations of the function on each render. Unlike useMemo, useCallback allows you to pass arguments to the memoized function. Therefore, consider using useCallback when you need to memoize a function and  pass arguments to it if needed.






