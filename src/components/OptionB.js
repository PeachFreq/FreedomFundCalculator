import React from "react";
import Rent from "./Rent";
import Food from "./Food";
import StartingValue from "./StartingValue";
import ContributionFrequency from "./ContributionFrequency";
import RateOfAppreciation from "./RateOfAppreciation";
import ContributionAmount from "./ContributionAmount";
import Utils from "./Utils";
import AutoInsurance from "./AutoInsurance";
import Subscriptions from "./Subscriptions";
import ResultTime from "./ResultTime";
import Plot from "./Plot";

function OptionB({ sendDataToFlask, imageSrc, lengthOfTime, handleStartingValueChange, handleFrequencyChange, handleRateChange, handleContributionChange, handleRentChange, handleFoodChange, handleUtilChange, handleAutoInsuranceChange, handleSubscriptionsChange }) {
    return (
        <div>
            <div className="input-container">
                <div className="input-group">
                    <p className="inline-element">Monthly rent:</p>
                    <Rent className="inline-element" onValueChange={handleRentChange}/>
                </div>
                <div className="input-group">
                    <p className="inline-element">Weekly food expense:</p>
                    <Food className="inline-element" onValueChange={handleFoodChange}/>
                </div>
                <div className="input-group">
                    <p className="inline-element">Monthly utilities:</p>
                    <Utils className="inline-element" onValueChange={handleUtilChange}/>
                </div>
                <div className="input-group">
                    <p className="inline-element">Monthly Auto Insurance:</p>
                    <AutoInsurance className="inline-element" onValueChange={handleAutoInsuranceChange}/>
                </div>
                <div className="input-group">
                    <p className="inline-element">Monthly Subscriptions:</p>
                    <Subscriptions className="inline-element" onValueChange={handleSubscriptionsChange}/>
                </div>
            </div>
            <br/>
            <Plot plot={imageSrc}/>
            <br/>
            <div>
                <div className="input-group-2">
                    <p className="inline-element">Starting Account Value:</p>
                    <StartingValue className="inline-element" onValueChange={handleStartingValueChange}/>
                </div>
                <div className="input-group-2">
                    <p className="inline-element">Payday Frequency:</p>
                    <ContributionFrequency className="inline-element" onValueChange={handleFrequencyChange}/>
                </div>
                <div className="input-group-2">
                    <p className="inline-element">Annual Rate of Growth:</p>
                    <RateOfAppreciation className="inline-element" onValueChange={handleRateChange}/>
                </div>
                <div className="input-group-2">
                    <p className="inline-element">Account Contribution Amount:</p>
                    <ContributionAmount className="inline-element" onValueChange={handleContributionChange}/>
                </div>
                <button onClick={sendDataToFlask}>Send it</button>
                <ResultTime lengthOfTime={lengthOfTime}/>
            </div>
        </div>
    )
}

export default OptionB;