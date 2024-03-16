import './App.css';
import React, {useState} from "react";
import axios from "axios";
import OptionA from "./components/OptionA";
import OptionB from "./components/OptionB";

function App() {
    const [activeTab, setActiveTab] = useState('B');
    const [rentAmount, setRentAmount] = useState('$0');
    const [foodAmount, setFoodAmount] = useState('$0');
    const [utilAmount, setUtilAmount] = useState('$0');
    const [autoInsuranceAmount, setAutoInsuranceAmount] = useState('$0');
    const [subscriptionsAmount, setSubscriptionsAmount] = useState('$0');
    const [startingValue, setStartingValue] = useState('');
    const [frequency, setFrequency] = useState('');
    const [rate, setRate] = useState('');
    const [amount, setAmount] = useState('');
    const [term, setTerm] = useState('');
    const [futureValue, setFutureValue] = useState('');
    const [timeToGoal, setTimeToGoal] = useState('');
    const [imageSrc, setImageSrc] = useState('');

    function sendDataToFlask() {
        function stripFormatting(string) {
            return string.substring(1).replace(/,/g, '')
        }

        if (term !== '') {
            const data = {
                initialValue: stripFormatting(startingValue),
                frequency: frequency,
                rate: rate,
                amount: stripFormatting(amount),
                term: term
            };

            console.log(data);

            axios.post('http://127.0.0.1:5000/generateA', data)
                .then(response => {
                    console.log('Success:', response.data);
                    setImageSrc(response.data.image);
                    setFutureValue(response.data.finalAccountValue);
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        } else {
            const data = {
                rent: stripFormatting(rentAmount),
                food: stripFormatting(foodAmount),
                utils: stripFormatting(utilAmount),
                autoInsurance: stripFormatting(autoInsuranceAmount),
                subs: stripFormatting(subscriptionsAmount),
                initialValue: stripFormatting(startingValue),
                frequency: frequency,
                rate: rate,
                amount: stripFormatting(amount)
            };

            console.log(data);

            axios.post('http://127.0.0.1:5000/generateB', data)
                .then(response => {
                    console.log('Success:', response.data);
                    setImageSrc(response.data.image);
                    setTimeToGoal(response.data.timeToGoal);
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        }
    }
    function handleStartingValueChange(startingValue) {
        setStartingValue(startingValue);
        // setStartingValue(parseInt(startingValue.substring(1).replace(/,/g, ''), 10));
    }
    function handleFrequencyChange(frequency) {
        setFrequency(frequency);
    }
    function handleRateChange(rate) {
        setRate(rate);
    }
    function handleContributionChange(amount, signal) {
        setAmount(amount);
        if (signal === 'enterPressed') {
            sendDataToFlask()
        }
    }
    function handleTermChange(term) {
        setTerm(term);
    }
    function handleRentChange(rentAmount) {
        setRentAmount(rentAmount)
    }
    function handleFoodChange(foodAmount) {
        setFoodAmount(foodAmount)
    }
    function handleUtilChange(utilAmount) {
        setUtilAmount(utilAmount)
    }
    function handleAutoInsuranceChange(autoInsuranceAmount) {
        setAutoInsuranceAmount(autoInsuranceAmount)
    }
    function handleSubscriptionsChange(subscriptionsAmount) {
        setSubscriptionsAmount(subscriptionsAmount)
    }

    return (
        <div className="App">
            <div className="tab-buttons">
                <button onClick={() => setActiveTab('A')} className={activeTab === 'A' ? 'active' : ''}>Option A
                </button>
                <button onClick={() => setActiveTab('B')} className={activeTab === 'B' ? 'active' : ''}>Option B
                </button>
            </div>

            <div className="App-body">
                <h1>Freedom Fund Calculator</h1>
                {activeTab === 'A' ? (
                    <OptionA
                        sendDataToFlask={sendDataToFlask}
                        imageSrc={imageSrc}
                        futureValue={futureValue}
                        handleStartingValueChange={handleStartingValueChange}
                        handleFrequencyChange={handleFrequencyChange}
                        handleRateChange={handleRateChange}
                        handleContributionChange={handleContributionChange}
                        handleTermChange={handleTermChange}
                    />
                ) : (
                    <OptionB
                        sendDataToFlask={sendDataToFlask}
                        imageSrc={imageSrc}
                        handleRentChange={handleRentChange}
                        handleFoodChange={handleFoodChange}
                        handleUtilChange={handleUtilChange}
                        handleAutoInsuranceChange={handleAutoInsuranceChange}
                        handleSubscriptionsChange={handleSubscriptionsChange}
                        handleStartingValueChange={handleStartingValueChange}
                        handleFrequencyChange={handleFrequencyChange}
                        handleRateChange={handleRateChange}
                        handleContributionChange={handleContributionChange}
                        lengthOfTime={timeToGoal}
                    />
                )}
            </div>
        </div>
    );
}

export default App;
