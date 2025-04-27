import os

class AtmoConfiguration():
    mongo_conf = {
        'host':os.environ.get('MONGO_HOST', 'ai-mongodb-module'),
        'port':int(os.environ.get('MONGO_PORT', '27017')),
        'username':os.environ.get('MONGO_USERNAME', 'atmomore'),
        'password':os.environ.get('MONGO_PASSWORD', 'Atmo-more'),
        'authSource':os.environ.get('MONGO_AUTH_DB', 'admin'),
        'authMechanism':'SCRAM-SHA-256',
    }
    datastore_conf = {
        'db':os.environ.get('MONGO_DATABASE', 'atmo_more'),
        'datastore_path':os.environ.get('DATASTORE_PATH', 'datastore'),
        'datastore_supply_path':os.environ.get('DATASTORE_SUPPLY_INFO', 'ΕΦΟΔΙΑΣΜΟΙ.xlsx'),
        'datastore_supply_test_path':os.environ.get('DATASTORE_SUPPLY_TEST_INFO', 'ΕΦΟΔΙΑΣΜΟΙ_test.xlsx'),
        'datastore_outage_path':os.environ.get('DATASTORE_OUTAGE_INFO', 'outage'),
    }
    results_conf = {
        'results_path':os.environ.get('RESULTS_PATH', 'results'),
    }