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


def calculate_future_value(initial_value, rate_annual, contribution_amount, contributions_per_year, term):
    rate_daily = pow(1 + rate_annual, 1 / 365) - 1
    n = 365 * term
    days_between_contributions = 14
    if contributions_per_year != 26:
        days_between_contributions = n / (contributions_per_year * term)
    values = [initial_value]

    account_value = initial_value
    next_contribution_day = days_between_contributions
    tolerance = 0.1  # A small tolerance to account for floating-point imprecision
    for day in range(1, n + 1):
        if day >= next_contribution_day - tolerance:
            account_value += contribution_amount  # Apply contribution to account
            values.append(round(account_value, 2)) # Append contribution to values array
            next_contribution_day += days_between_contributions
        account_value *= (1 + rate_daily)

    return values


def calculate_annual_expenses(rent, food, utils, auto, subs):
    return 12 * (rent + utils + auto + subs) + 52 * food


def calculate_time_to_goal(initial_value, rate_annual, contribution_amount, contributions_per_year, annual_expenses):
    goal = annual_expenses * 25
    rate_daily = pow(1 + rate_annual, 1 / 365) - 1
    days_between_contributions = 14
    if contributions_per_year != 26:
        days_between_contributions = 365 / contributions_per_year
    tolerance = 0.1  # A small tolerance to account for floating-point imprecision
    values = [initial_value]
    account_value = initial_value
    day_count = 0
    next_contribution_day = days_between_contributions

    while account_value < goal:
        day_count += 1
        if day_count >= next_contribution_day - tolerance:
            account_value += contribution_amount  # Apply contribution to account
            values.append(round(account_value, 2))  # Append contribution to values array
            next_contribution_day += days_between_contributions
        account_value *= (1 + rate_daily)

        if day_count >= 365 * 100:  # Break the loop if it runs for more than 100 years to prevent infinite loops
            break

    years_to_reach_value = day_count / 365
    return years_to_reach_value, values


@app.route('/generateA', methods=['POST'])
def calculate_future_value_route_handler():
    data = request.json
    initial_value = data['initialValue']
    # initial_value = int(data['initialValue'][1:].replace(',', ''))
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

    # Calculates the total number of paydays in the term
    def total_pay_periods(contributions_per_year, term):
        if contributions_per_year == 26:  # Bi-weekly
            # For a bi-weekly scenario, directly calculate based on days
            return term * 365 // 14
        else:
            # For monthly and semi-monthly, it's straightforward
            return contributions_per_year * term

    # Calculate the principal contributions over time
    principal_contributions = [initial_value + amount * i for i in range(total_pay_periods(contributions_per_year, term) + 1)]

    # Convert the example data into a Pandas DataFrame
    data = pd.DataFrame({
        'Time': range(0, total_pay_periods(contributions_per_year, term) + 1),
        'Account Value': calculate_future_value(initial_value, rate, amount, contributions_per_year, term),
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

    # Return the Base64 encoded image and final account value in the response
    return jsonify(image=f"data:image/png;base64,{img_base64}", finalAccountValue=final_account_value)


@app.route('/generateB', methods=['POST'])
def calculate_time_to_goal_route_handler():
    data = request.json
    initial_value = int(data['initialValue'])
    frequency = data['frequency']
    contributions_per_year = 0  # Initializing with default value of 0 contributions per year
    if frequency == "biweekly":
        contributions_per_year = 26
    elif frequency == "semimonthly":
        contributions_per_year = 24
    elif frequency == "monthly":
        contributions_per_year = 12
    rate = int(data['rate']) / 100
    amount = int(data['amount'])
    rent = int(data['rent'])
    food = int(data['food'])
    utils = int(data['utils'])
    auto = int(data['autoInsurance'])
    subs = int(data['subs'])

    #Calculate annual expenses
    annual_expenses = calculate_annual_expenses(rent, food, utils, auto, subs)

    # Destructure the return of the function call to calculate_time_to_goal
    time_to_goal, values = calculate_time_to_goal(initial_value, rate, amount, contributions_per_year, annual_expenses)

    # Calculates the total number of paydays in the term
    def total_pay_periods():
        if contributions_per_year == 26:  # Bi-weekly
            # For a bi-weekly scenario, directly calculate based on days
            return time_to_goal * 365 // 14
        else:
            # For monthly and semi-monthly, it's straightforward
            return round(time_to_goal * contributions_per_year)

    # Calculate the principal contributions over time
    # principal_contributions = [initial_value + amount * i for i in range(total_pay_periods(contributions_per_year, term) + 1)]

    # Print statements for testing purposes...
    print('Check start')
    print(len(values))
    print(total_pay_periods() + 1)
    print('Check fin')

    # Convert the example data into a Pandas DataFrame
    data = pd.DataFrame({
        'Time': range(0, total_pay_periods() + 1),
        'Account Value': values
        # 'Principal Contributions': principal_contributions
    })

    # Set the theme
    sns.set_theme()

    # Format the y-axis markings
    def currency_formatter(x, pos):
        return "${:,.0f}".format(x)

    # Create the plot
    plt.figure(figsize=(10, 6))
    sns.lineplot(data=data, x='Time', y='Account Value', color='b')
    # sns.lineplot(data=data, x='Time', y='Principal Contributions', color='hotpink', label='Principal Contributions')
    plt.grid(True)
    plt.title('Time to Freedom', fontdict={'fontsize': 16, 'fontweight': 'bold'})
    plt.xlabel('Years')
    plt.ylabel('Value in USD')
    plt.xlim(left=0, right=max(data['Time']))
    plt.xticks(ticks=[i * contributions_per_year for i in range(int(time_to_goal) + 1)], labels=[str(i) for i in range(int(time_to_goal) + 1)])
    plt.gca().yaxis.set_major_formatter(FuncFormatter(currency_formatter))

    # Save the plot to a temporary buffer
    buf = BytesIO()
    plt.savefig(buf, format='png')
    buf.seek(0)

    # Encode the image to Base64
    img_base64 = base64.b64encode(buf.getvalue()).decode('utf-8')

    # Optionally, clear the current figure to free memory
    plt.clf()

    # Return the Base64 encoded image and final account value in the response
    return jsonify(image=f"data:image/png;base64,{img_base64}", timeToGoal=time_to_goal)


if __name__ == '__main__':
    app.run(debug=True)