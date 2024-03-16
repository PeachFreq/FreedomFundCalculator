import {useEffect, useState} from "react";

function RateOfAppreciation({ onValueChange }) {
    const [appreciationRate, setAppreciationRate] = useState("20");

    useEffect(() => {
        onValueChange(appreciationRate);
    }, []);

    function handleChange(event) {
        const newRate = event.target.value;
        setAppreciationRate(newRate);
        onValueChange(newRate);
    }

    return <div>
        <input
            type="radio"
            name="appreciationRate"
            value="6"
            id="rate6"
            checked={appreciationRate==="6"}
            onChange={handleChange}
        />
        <label htmlFor="rate6">6%</label>
        <input
            type="radio"
            name="appreciationRate"
            value="12"
            id="rate12"
            checked={appreciationRate==="12"}
            onChange={handleChange}
        />
        <label htmlFor="rate12">12%</label>
        <input
            type="radio"
            name="appreciationRate"
            value="20"
            id="rate20"
            checked={appreciationRate==="20"}
            onChange={handleChange}/>
        <label htmlFor="rate20">20%</label>
    </div>
}

export default RateOfAppreciation;