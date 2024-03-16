import {useState} from "react";

function Utils({ onValueChange }) {
    const [utilAmount, setUtilAmount] = useState("");

    function updateAmount(event) {
        let newValue = event.target.value;

        // Limit the input to 4 characters
        if (newValue.length > 4) {
            return;
        }

        // Automatically prefix with a dollar sign if the first character is a numeral between 1-9
        if (/^[1-9]/.test(newValue)) {
            newValue = '$' + newValue;
        }

        if (/^\$?([1-9][0-9]*,?[0-9]*)?$/.test(newValue)) {
            setUtilAmount(newValue);
            onValueChange(newValue);
        }
    }


    return (
        <input
            type="text"
            placeholder="$0"
            value={utilAmount}
            onChange={updateAmount}
        />
    );
}

export default Utils;