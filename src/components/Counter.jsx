import React, {useState} from 'react';

const Counter = function () {
    const [counter, setCounter] = useState(0)

    function inc() {
        setCounter(counter + 1 )
    }

    function dec() {
        setCounter(counter - 1 )
    }

    return (
        <div>
            <h1>{counter}</h1>
            <button onClick={inc}>increment</button>
            <button onClick={dec}> decrement</button>
        </div>
    )
}

export default Counter