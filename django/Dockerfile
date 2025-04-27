FROM python:3.12
COPY cash_predictor/requirements.txt /atmo/cash_predictor/requirements.txt
RUN pip install -r /atmo/cash_predictor/requirements.txt
COPY supply_optimizer/requirements.txt /atmo/supply_optimizer/requirements.txt
RUN pip install -r /atmo/supply_optimizer/requirements.txt
COPY requirements.txt /atmo/requirements.txt
RUN pip install -r /atmo/requirements.txt