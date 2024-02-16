function ResultWindow({ futureValue }) {
    if (futureValue !== "") {
        function formatCurrency(amount) {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }).format(amount);
        }

        return (
            <div>
                <p>Future value of account: {formatCurrency(futureValue)}</p>
            </div>
        )
    }
}

export default ResultWindow;