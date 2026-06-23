import pandas as pd

from prophet import Prophet


# REAL AI FORECASTING
def forecast_demand(history):

    try:

        # EMPTY HISTORY
        if len(history) == 0:

            return 0

        # CREATE DATAFRAME
        df = pd.DataFrame({

            "ds": pd.date_range(

                start="2025-01-01",

                periods=len(history),

                freq="D"
            ),

            "y": history,
        })

        # AI MODEL
        model = Prophet(

            daily_seasonality=True,

            yearly_seasonality=False,

            weekly_seasonality=True
        )

        # TRAIN MODEL
        model.fit(df)

        # FUTURE DAYS
        future = model.make_future_dataframe(

            periods=7
        )

        # PREDICT
        forecast = model.predict(
            future
        )

        # FINAL VALUE
        prediction = round(

            forecast["yhat"]
            .iloc[-1]
        )

        # SAFETY
        if prediction < 0:

            prediction = 0

        return int(prediction)

    except Exception as e:

        print(
            "AI FORECAST ERROR:",
            e
        )

        # FALLBACK
        avg = sum(history) / len(history)

        return int(round(avg))