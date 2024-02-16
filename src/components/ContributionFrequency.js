import {useEffect, useState} from "react";

function ContributionFrequency({ onValueChange }) {
    const [contributionFrequency, setContributionFrequency] = useState("biweekly");

    useEffect(() => {
        onValueChange(contributionFrequency);
    }, []);

    function updateContributionFrequency(event) {
        setContributionFrequency(event.target.value);
        onValueChange(event.target.value);
    }

    return <div>
        <select
            name="contributionFrequency"
            id="contributionFrequency-dropdown"
            value={contributionFrequency}
            onChange={updateContributionFrequency}>
            <option value="biweekly">Biweekly</option>
            <option value="semimonthly">Semimonthly</option>
            <option value="monthly">Monthly</option>
        </select>
    </div>
}

export default ContributionFrequency;