import logging

from cash_predictor.predictor.data_handler import DataHandler
from supply_optimizer.optimizer.solver import (
    ATMOSolver, collect_supply_optimization_results, daily_supply_optimization,
    daily_supply_optimization_evaluation, get_daily_graphs_from_test_csv,
    get_daily_graphs_from_test_data, get_daily_graphs_from_test_data_raw)

from django.core.management import BaseCommand

LOGGER = logging.getLogger(__name__)

class Command(BaseCommand):

    def __init__(self):
        super().__init__()

    def add_arguments(self, parser):
        parser.add_argument(
            '--command',
            choices=[
                'import_data', 
                'create_plans', 
                'evaluate',
                'evaluate_combined'
            ],
            required=True,
            type=str,
            help='Action to execute.'
        )
        parser.add_argument(
            "--datafile",
            required=False,
            type=str,
            help='Datafile path for evaluation.'

        )
        parser.add_argument(
            "--model", 
            choices=[
                'approximation', 
                'greedy', 
                'ilp',
                'genetic'
            ],
            required=True,
            type=str,
            help='Model to use.'
        )

    def handle(self, *args, **options):
        command = str(options['command'])
        datafile = str(options['datafile'])
        model = str(options['model'])
        if command == "import_data":
            try:
                dh = DataHandler()
                dh.atm_renew_data()
                print("Data loaded.")
            except Exception as ex:
                print(f"Error on data loading: {ex}")
        elif command == "create_plans":
            if datafile:
                daily_graphs = {}
                try:
                    daily_graphs = get_daily_graphs_from_test_csv(datafile)
                except Exception as ex:
                    print(f"Error during daily graph creation: {ex}")
                    exit(0)
                if model:
                    try:
                        daily_optimized_solver:ATMOSolver = daily_supply_optimization(daily_graphs,model)
                        solution_texts = daily_optimized_solver.get_solution_text()
                        for day in solution_texts:
                            print(f"Paths for day {day}:")
                            for path in solution_texts[day]:
                                print(path)
                        daily_optimized_solver.visualize()
                    except Exception as ex:
                        print(f"Error during solving: {ex}")
                        exit(0)
                else:
                    print("Model not specified. Please specify a valid model using the --model argument.")
            else:
                print("Datafile not provided. Please provide a valid --datafile argument.")
        elif command == "evaluate":
            daily_supply_graphs = get_daily_graphs_from_test_data_raw()
            daily_supply_optimization_evaluation(daily_supply_graphs,model)
            collect_supply_optimization_results()
        elif command == "evaluate_combined":
            daily_supply_graphs_original = get_daily_graphs_from_test_data_raw(evaluation=True)
            daily_supply_optimization_evaluation(daily_supply_graphs_original,model,custom_label="original_")
            if not model:
                collect_supply_optimization_results(custom_label="original_")
            daily_supply_graphs_predicted = get_daily_graphs_from_test_data(evaluation=True)
            daily_supply_optimization_evaluation(daily_supply_graphs_predicted,model,custom_label="predicted_")
            if not model:
                collect_supply_optimization_results(custom_label="predicted_")
