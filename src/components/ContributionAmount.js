import {useState} from "react";

function ContributionAmount({ onValueChange }) {
    const [periodicContribution, setPeriodicContribution] = useState("");

    function updateAmount(event) {
        let newValue = event.target.value;

        // Limit the input to 8 characters
        if (newValue.length > 8) {
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
            setPeriodicContribution(newValue);
            onValueChange(newValue);
        }
    }

    function handleKeyDown(event) {
        if (event.key === 'Enter') {
            onValueChange(periodicContribution, 'enterPressed')
        }
    }

    return (
        <input
            type="text"
            placeholder="Amount (USD)"
            value={periodicContribution}
            onChange={updateAmount}
            onKeyDown={handleKeyDown}
        />
    );
}

export default ContributionAmount;