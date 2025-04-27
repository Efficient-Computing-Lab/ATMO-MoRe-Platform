import datetime
import logging
import os
import random

import pandas as pd
from atmo_platform.conf import AtmoConfiguration
from cash_predictor.predictor.data_handler import DataHandler

from django.core.management import BaseCommand

LOGGER = logging.getLogger(__name__)

class Command(BaseCommand):

    def __init__(self):
        super().__init__()

    def add_arguments(self, parser):
        parser.add_argument(
            '--size',
            required=True,
            type=int,
            help='Size of test.')

    def handle(self, *args, **options):
        size = int(options['size'])
        atmomore_handler = DataHandler()
        codes = random.choices(atmomore_handler.atm_codes,k=size)
        today = datetime.date.today()
        records = []
        for code in codes:
            records.append({
                "ATM": code,
                "date": f"{today.day:02d}/{today.month:02d}/{today.year}",
                "value": random.randrange(15,80)/100.0
            })
        filepath = os.path.join(AtmoConfiguration.datastore_conf['datastore_path'],'test_csv.csv')
        pd.DataFrame.from_records(records).to_csv(filepath,sep=';',decimal='.',quotechar='"',index=False)