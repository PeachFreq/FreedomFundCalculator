import './App.css';
import {useState} from "react";
import axios from "axios";
import ContributionFrequency from "./components/ContributionFrequency";
import RateOfAppreciation from "./components/RateOfAppreciation";
import ContributionAmount from "./components/ContributionAmount";
import NumberOfYears from "./components/NumberOfYears";
import ResultWindow from "./components/ResultWindow";
import Plot from "./components/Plot";

function App() {
    const [frequency, setFrequency] = useState('');
    const [rate, setRate] = useState('');
    const [amount, setAmount] = useState('');
    const [term, setTerm] = useState('');
    const [futureValue, setFutureValue] = useState('');
    const [imageSrc, setImageSrc] = useState('');

    function sendDataToFlask() {
        const data = {
            frequency: frequency,
            rate: rate,
            amount: amount,
            term: term
        };

        console.log(data);

        axios.post('http://127.0.0.1:5000/generate', data)
            .then(response => {
                console.log('Success:', response.data);
                setImageSrc(response.data.image);
                setFutureValue(response.data.finalAccountValue);
            })
            .catch(error => {
                console.error('Error:', error);
            });
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

    return (
    <div className="App">
        <div className="App-body">
            <h1>Freedom Fund Calculator</h1>
            <Plot
                plot={imageSrc}
            />
            <ContributionFrequency
                onValueChange={handleFrequencyChange}
            />
            <RateOfAppreciation
                onValueChange={handleRateChange}
            />
            <ContributionAmount
                onValueChange={handleContributionChange}
            />
            <NumberOfYears
                onValueChange={handleTermChange}
            />
            <button onClick={sendDataToFlask}>Send it</button>
            <ResultWindow
                futureValue={futureValue}
            />
        </div>
    </div>
  );
}

export default App;
