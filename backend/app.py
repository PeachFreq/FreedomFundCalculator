from flask import Flask, request, jsonify
import matplotlib
matplotlib.use('Agg')  # Set the backend before importing pyplot
from math import pow
from flask_cors import CORS
import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd
from matplotlib.ticker import FuncFormatter
import base64
from io import BytesIO

app = Flask(__name__)
CORS(app)


def calculate_future_value(rate_annual, amount, contributions_per_year, term):
    rate_daily = pow(1 + rate_annual, 1 / 365) - 1
    n = 365 * term
    days_between_contributions = n / (contributions_per_year * term)
    values = [0]

    account_value = 0
    next_contribution_day = days_between_contributions
    tolerance = 0.1  # A small tolerance to account for floating-point imprecision
    for day in range(1, n + 1):
        if day >= next_contribution_day - tolerance:
            account_value += amount  # Apply contribution to account
            values.append(round(account_value, 2))
            next_contribution_day += days_between_contributions
        account_value *= (1 + rate_daily)

    return values


@app.route('/generate', methods=['POST'])
def generate():
    data = request.json
    frequency = data['frequency']
    contributions_per_year = 0  # Initializing with default value of 0 contributions per year
    if frequency == "biweekly":
        contributions_per_year = 26
    elif frequency == "semimonthly":
        contributions_per_year = 24
    elif frequency == "monthly":
        contributions_per_year = 12
    rate = int(data['rate']) / 100
    amount = int(data['amount'][1:].replace(',', ''))
    term = int(data['term'])

    # Calculate the principal contributions over time
    principal_contributions = [amount * i for i in range(term * contributions_per_year + 1)]

    # Convert the example data into a Pandas DataFrame
    data = pd.DataFrame({
        'Time': range(0, term * contributions_per_year + 1),
        'Account Value': calculate_future_value(rate, amount, contributions_per_year, term),
        'Principal Contributions': principal_contributions
    })

    # Extract the final Account Value
    final_account_value = data['Account Value'].iloc[-1]

    # Set the theme
    sns.set_theme()

    # Format the y-axis markings
    def currency_formatter(x, pos):
        return "${:,.0f}".format(x)

    # Create the plot
    plt.figure(figsize=(10, 6))
    sns.lineplot(data=data, x='Time', y='Account Value', color='b', label='Investment Growth')
    sns.lineplot(data=data, x='Time', y='Principal Contributions', color='hotpink', label='Principal Contributions')
    plt.grid(True)
    plt.title('Investment Growth Over Time')
    plt.xlabel('Year')
    plt.ylabel('Value in USD')
    plt.xticks(ticks=[i * contributions_per_year for i in range(term + 1)], labels=range(term + 1))
    plt.gca().yaxis.set_major_formatter(FuncFormatter(currency_formatter))

    # Save the plot to a temporary buffer
    buf = BytesIO()
    plt.savefig(buf, format='png')
    buf.seek(0)

    # Encode the image to Base64
    img_base64 = base64.b64encode(buf.getvalue()).decode('utf-8')

    # Optionally, clear the current figure to free memory
    plt.clf()

    # Return the Base64 encoded image as part of the response
    return jsonify(image=f"data:image/png;base64,{img_base64}", finalAccountValue=final_account_value)


if __name__ == '__main__':
    app.run(debug=True)