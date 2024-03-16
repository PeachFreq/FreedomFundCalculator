import React from 'react';
import Plot from './Plot';
import StartingValue from './StartingValue';
import ContributionFrequency from './ContributionFrequency';
import RateOfAppreciation from './RateOfAppreciation';
import ContributionAmount from './ContributionAmount';
import NumberOfYears from './NumberOfYears';
import ResultAmount from './ResultAmount';

function OptionA({ sendDataToFlask, imageSrc, futureValue, handleStartingValueChange, handleFrequencyChange, handleRateChange, handleContributionChange, handleTermChange }) {
    return (
        <div>
            <Plot plot={imageSrc}/>
            <br />
            <StartingValue onValueChange={handleStartingValueChange}/>
            <ContributionFrequency onValueChange={handleFrequencyChange}/>
            <RateOfAppreciation onValueChange={handleRateChange}/>
            <ContributionAmount onValueChange={handleContributionChange}/>
            <NumberOfYears onValueChange={handleTermChange}/>
            <button onClick={sendDataToFlask}>Send it</button>
            <ResultAmount futureValue={futureValue}/>
        </div>
    )
}

export default OptionA;