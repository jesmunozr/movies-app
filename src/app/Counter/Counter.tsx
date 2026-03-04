import React from "react";

export interface CounterProps {
    /** The initial value of the counter */
    initialValue: number;
}

/** A simple counter component that allows incrementing and decrementing a value. */
const Counter = ({ initialValue }: CounterProps) => {
    const [count, setCount] = React.useState(initialValue);

    const counterContainer = React.createElement("div", null,
        React.createElement("h1", null, `Counter: ${count}`),
        React.createElement("button", { "data-cy": "increment-button", onClick: () => setCount(count + 1) }, "Increment"),
        React.createElement("button", { "data-cy": "decrement-button", onClick: () => setCount(count - 1) }, "Decrement")
    );

    return counterContainer;
};

export default Counter;