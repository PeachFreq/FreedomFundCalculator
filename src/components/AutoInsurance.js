import {useState} from "react";

function AutoInsurance({ onValueChange }) {
    const [autoInsuranceAmount, setAutoInsuranceAmount] = useState("");

    function updateAmount(event) {
        let newValue = event.target.value;

        // Limit the input to 5 characters
        if (newValue.length > 5) {
            return;
        }

        // Automatically prefix with a dollar sign if the first character is a numeral between 1-9
        if (/^[1-9]/.test(newValue)) {
            newValue = '$' + newValue;
        }

        // Remove any existing commas for consistency
        newValue = newValue.replace(/,/g, '');

        // Insert a comma as the 4th-to-last character for strings of length 5 or more
        if (newValue.length >= 5) {
            const position = newValue.length - 3;
            newValue = newValue.slice(0, position) + ',' + newValue.slice(position);
        }

        if (/^\$?([1-9][0-9]*,?[0-9]*)?$/.test(newValue)) {
            setAutoInsuranceAmount(newValue);
            onValueChange(newValue);
        }
    }


    return (
        <input
            type="text"
            placeholder="$0"
            value={autoInsuranceAmount}
            onChange={updateAmount}
        />
    );
}

export default AutoInsurance;