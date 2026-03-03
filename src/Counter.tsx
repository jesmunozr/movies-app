import React from "react";

const Counter = ({ initialValue }: { initialValue: number }) => {
    let initialCounter = initialValue;
    const [count, setCount] = React.useState(initialCounter);

    const counterContainer = React.createElement("div", null,
        React.createElement("h1", null, `Counter: ${count}`),
        React.createElement("button", { "data-cy": "increment-button", onClick: () => setCount(count + 1) }, "Increment"),
        React.createElement("button", { "data-cy": "decrement-button", onClick: () => setCount(count - 1) }, "Decrement")
    );

    return counterContainer;
};

export default Counter;