#Part of ATMO-MoRe ATM Supply Optimizer, a system that optimizes ATM resupply planning.
#Copyright (C) 2024  Evangelos Psomakelis
#
#This program is free software: you can redistribute it and/or modify
#it under the terms of the GNU Affero General Public License as published by
#the Free Software Foundation, either version 3 of the License, or
#any later version.
#
#This program is distributed in the hope that it will be useful,
#but WITHOUT ANY WARRANTY; without even the implied warranty of
#MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
#GNU Affero General Public License for more details.
#
#You should have received a copy of the GNU Affero General Public License
#along with this program.  If not, see <https://www.gnu.org/licenses/>.

import argparse
from cash_predictor.predictor.data_handler import DataHandler
from .solver import ATMOSolver, get_daily_graphs_from_test_csv, \
    daily_supply_optimization, get_daily_graphs_from_test_data_raw, \
    collect_supply_optimization_results, daily_supply_optimization_evaluation, \
    get_daily_graphs_from_test_data

parser=argparse.ArgumentParser()
parser.add_argument("command", choices=[
    'import_data', 
    'create_plans', 
    'evaluate',
    'evaluate_combined'
])
parser.add_argument("--datafile",nargs='?')
parser.add_argument("--model",nargs='?', choices=[
    'approximation', 
    'greedy', 
    'ilp',
    'genetic'
])
args=parser.parse_args()

if args.command == "import_data":
    try:
        dh = DataHandler()
        dh.atm_renew_data()
        print("Data loaded.")
    except Exception as ex:
        print(f"Error on data loading: {ex}")
elif args.command == "create_plans":
    if args.datafile:
        daily_graphs = {}
        try:
            daily_graphs = get_daily_graphs_from_test_csv(args.datafile)
        except Exception as ex:
            print(f"Error during daily graph creation: {ex}")
            exit(0)
        if args.model:
            try:
                daily_optimized_solver:ATMOSolver = daily_supply_optimization(daily_graphs,args.model)
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
elif args.command == "evaluate":
    daily_supply_graphs = get_daily_graphs_from_test_data_raw()
    daily_optimized_graphs = daily_supply_optimization_evaluation(daily_supply_graphs,args.model)
    collect_supply_optimization_results()
elif args.command == "evaluate_combined":
    daily_supply_graphs_original = get_daily_graphs_from_test_data_raw(evaluation=True)
    daily_optimized_graphs_original = daily_supply_optimization_evaluation(daily_supply_graphs_original,args.model,"original_")
    collect_supply_optimization_results("original_")
    daily_supply_graphs_predicted = get_daily_graphs_from_test_data(evaluation=True)
    daily_optimized_graphs_predicted = daily_supply_optimization_evaluation(daily_supply_graphs_predicted,args.model,"predicted_")
    collect_supply_optimization_results("predicted_")
