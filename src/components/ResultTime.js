function ResultTime({ lengthOfTime }) {
    if (lengthOfTime !== "") {
        function formatTime(time) {
            const years = Math.floor(time);
            const yearRemainder = time % 1;

            if (yearRemainder < 0.0411) { // 15 days or less, ignore remainder
                return `${years} years`;
            } else if (yearRemainder > 0.958) { // 350 days or more, round up to next year
                return `${years + 1} years`;
            } else {
                const monthsFloat = yearRemainder * 12;
                const months = Math.floor(monthsFloat);
                const monthRemainder = monthsFloat % 1;

                if (monthRemainder < 0.5) { // If less than a half month round down
                    return `${years} years and ${months} months`;
                } else { // If more than a half month round up
                    return `${years} years and ${months + 1} months`;
                }
            }
        }

        return (
            <div>
                <p>You can buy your freedom in {formatTime(lengthOfTime)}.</p>
            </div>
        )
    }
}

export default ResultTime;