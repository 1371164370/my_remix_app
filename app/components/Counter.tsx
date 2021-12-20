import { useState } from "react"


export const Counter = ()=>{
    const [count, setCount] = useState(0)
    return <>
    {count}<button onClick={()=>{
        setCount(count+1)
    }}>click</button></>
}