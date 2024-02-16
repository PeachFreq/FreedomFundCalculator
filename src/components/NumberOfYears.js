import { useEffect, useState} from "react";

function NumberOfYears({ onValueChange }) {
    const [term, setTerm] = useState('5')

    useEffect(() => {
        onValueChange(term)
    }, []);

    function handleChange(event) {
        setTerm(event.target.value);
        onValueChange(event.target.value);
    }

    return (
        <div>
            <input
                type="range"
                id="years-slider"
                min="1"
                max="25"
                value={term}
                onChange={handleChange}
            />
            <br/>
            <label htmlFor="years-slider">Number of years: {term}</label>
        </div>
    )
}

export default NumberOfYears;