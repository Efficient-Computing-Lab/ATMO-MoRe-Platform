from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser
from rest_framework.status import HTTP_200_OK, HTTP_500_INTERNAL_SERVER_ERROR, HTTP_400_BAD_REQUEST
from cash_predictor.predictor.data_handler import DataHandler, Preprocessor, Analyser
from cash_predictor.predictor.utils import json_to_supervised,pandas_to_supervised
from cash_predictor.predictor.load_predictor import ATMOPredictor
from cash_predictor.predictor.models import LinearModel
from cash_predictor.predictor.evaluator import evaluate_models_timelag, evaluate_lstm
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from atmo_platform.conf import AtmoConfiguration
import pandas, json, os
import traceback
#from pathlib import Path

class ImportDataView(APIView):
    @swagger_auto_schema(
        operation_summary="Ενημέρωση δεδομένων",
        operation_description="Εισάγει ή ενημερώνει τα δεδομένα της βάσης MongoDB από τα αρχεία.",
        tags=["Χειριστής δεδομένων"]
    )
    def post(self, request, *args, **kwargs):
        try:
            dh = DataHandler()
            results = dh.atm_renew_data()
            return Response(data=results,status=HTTP_200_OK)
        except Exception as ex:
            return Response(data={'error': f"Error on data loading: {ex}"},status=HTTP_500_INTERNAL_SERVER_ERROR)
        
class GenerateTestDataView(APIView):
    @swagger_auto_schema(
        operation_summary="Ενημέρωση δεδομένων",
        operation_description="Εισάγει ή ενημερώνει τα δεδομένα της βάσης MongoDB από τα αρχεία.",
        tags=["Χειριστής δεδομένων"]
    )
    def post(self, request, *args, **kwargs):
        try:
            dh = DataHandler()
            results = dh.generate_test_data(200)
            filepath = os.path.join(AtmoConfiguration.datastore_conf['datastore_path'],'test_csv.csv')
            pandas.DataFrame.from_records(results).to_csv(filepath,sep=';',decimal='.',quotechar='"',index=False)
            return Response(data=results,status=HTTP_200_OK)
        except Exception as ex:
            return Response(data={'error': f"Error on data loading: {ex}"},status=HTTP_500_INTERNAL_SERVER_ERROR)
    def get(self, request, *args, **kwargs):
        try:
            dh = DataHandler()
            results = dh.generate_test_data(200)
            return Response(data=results,status=HTTP_200_OK)
        except Exception as ex:
            print(traceback.format_exc())
            return Response(data={'error': f"Error on data loading: {ex}"},status=HTTP_500_INTERNAL_SERVER_ERROR)

class ATMCodesView(APIView):
    @swagger_auto_schema(
        operation_summary="Ανάγνωση κωδικών ΑΤΜ",
        operation_description="Επιστρέφει τους κωδικούς ΑΤΜ που υπάρχουν στα δεδομένα της βάσης MongoDB.",
        tags=["Χειριστής δεδομένων"]
    )
    def get(self, request, *args, **kwargs):
        try:
            dh = DataHandler()
            return Response(data=dh.atm_codes,status=HTTP_200_OK)
        except Exception as ex:
            return Response(data={'error': f"Error on data retrieval: {ex}"},status=HTTP_500_INTERNAL_SERVER_ERROR)
        
class SupplyTypesView(APIView):
    @swagger_auto_schema(
        operation_summary="Ανάγνωση είδους συμβάντων εφοδιασμού",
        operation_description="Επιστρέφει τα είδη συμβάντων εφοδιασμού που υπάρχουν στα δεδομένα της βάσης MongoDB.",
        tags=["Χειριστής δεδομένων"]
    )
    def get(self, request, *args, **kwargs):
        try:
            dh = DataHandler()
            return Response(data=dh.supply_types,status=HTTP_200_OK)
        except Exception as ex:
            return Response(data={'error': f"Error on data retrieval: {ex}"},status=HTTP_500_INTERNAL_SERVER_ERROR)
        
class SupplyTypeStatsView(APIView):
    @swagger_auto_schema(
        operation_summary="Ανάγνωση στατιστικών συμβάντων εφοδιασμού",
        operation_description="Επιστρέφει στατιστικά σχετικά με τα είδη συμβάντων εφοδιασμού που υπάρχουν στα δεδομένα της βάσης MongoDB.",
        tags=["Χειριστής δεδομένων"]
    )
    def get(self, request, *args, **kwargs):
        try:
            an = Analyser()
            return Response(data=json.loads(an.supply_type_statistics().sort_values(["total"]).to_json(index=False,orient="records")),status=HTTP_200_OK)
        except Exception as ex:
            return Response(data={'error': f"Error on data retrieval: {ex}"},status=HTTP_500_INTERNAL_SERVER_ERROR)
        
class ATMStatsView(APIView):
    @swagger_auto_schema(
        operation_summary="Ανάγνωση στατιστικών σχετικά με τα ΑΤΜ",
        operation_description="Επιστρέφει στατιστικά σχετικά με τα ΑΤΜ που υπάρχουν στα δεδομένα της βάσης MongoDB.",
        tags=["Χειριστής δεδομένων"]
    )
    def get(self, request, *args, **kwargs):
        try:
            an = Analyser()
            return Response(data=json.loads(an.timeseries_statistics().to_json(index=False,orient="records")),status=HTTP_200_OK)
        except Exception as ex:
            return Response(data={'error': f"Error on data retrieval: {ex}"},status=HTTP_500_INTERNAL_SERVER_ERROR)
        
class ATMDataView(APIView):
    @swagger_auto_schema(
        operation_summary="Ανάγνωση ιστορικών δεδομένων σχετικά με τα ΑΤΜ",
        operation_description="Επιστρέφει ιστορικά δεδομένα σχετικά με το επιλεγμένο ΑΤΜ από την βάση MongoDB.",
        tags=["Χειριστής δεδομένων"]
    )
    def get(self, request, atm_code, *args, **kwargs):
        try:
            an = Analyser()
            data = an.atm_statistics(atm_code)
            if data.empty:
                return Response(
                    data={
                        'error': f"Error on data retrieval: ATM code does not exist or does not have enough samples."
                    },
                    status=HTTP_400_BAD_REQUEST
                ) 
            return Response(
                data=json.loads(
                    data[["timestamp","value"]].to_json(index=False,orient="records")
                ),
                status=HTTP_200_OK
            )
        except Exception as ex:
            return Response(data={'error': f"Error on data retrieval: {ex}"},status=HTTP_500_INTERNAL_SERVER_ERROR)
        
class EvaluateClassicModelsView(APIView):
    @swagger_auto_schema(
        operation_summary="Αξιολόγηση κλασσικής μάθησης",
        operation_description="Αξιολογεί τα μοντέλα κλασσικής μηχανικής μάθησης.",
        tags=["Μοντέλο πρόβλεψης αποθέματος"]
    )
    def post(self, request, *args, **kwargs):
        try:
            resses = []
            errors = []
            evaluation_datasets = Preprocessor.initiate_evaluation_datasets()
            #Path(f"results").mkdir(parents=True, exist_ok=True)  
            for i in range(len(LinearModel.algorithms)):
                model = ''
                model = LinearModel.algorithms[i][0].__name__
                try:
                    print(f'----------------  RUN {i}: {model} -----------------')
                    res = evaluate_models_timelag(algorithm=i,**evaluation_datasets)
                    #res.to_csv(f"{AtmoConfiguration.results_conf['results_path']}/evaluation_results_class_{i}.csv",sep=";",decimal=",",encoding="utf8")
                    res['algorithm'] = model
                    resses.append(res)
                    print({'mean_accuracy':res['mean_accuracy'].mean(),'r2':res['r2'].mean(),'mean_absolute_error':res['mean_absolute_error'].mean()})
                except Exception as ex:
                    print(f"Model evaluation error: {ex}")
                    errors.append({'algorithm':model,'error':ex})
                    continue
            full_reses = pandas.concat(resses)
            #full_reses.to_csv(f"{AtmoConfiguration.results_conf['results_path']}/evaluation_results_full.csv",sep=";",decimal=",",encoding="utf8")
            return Response(data={'results':full_reses.to_dict(orient="records"),'errors':errors},status=HTTP_200_OK)
        except Exception as ex:
            return Response(data={'error': f"Error on data loading: {ex}"},status=HTTP_500_INTERNAL_SERVER_ERROR)

class EvaluateDeepModelsView(APIView):
    @swagger_auto_schema(
        operation_summary="Αξιολόγηση βαθειάς μάθησης",
        operation_description="Αξιολογεί τα μοντέλα βαθειάς μηχανικής μάθησης.",
        tags=["Μοντέλο πρόβλεψης αποθέματος"]
    )
    def post(self, request, *args, **kwargs):
        try:
            resses = []
            errors = []
            timeseries = Preprocessor.initiate_evaluation_datasets()
            #Path(f"results").mkdir(parents=True, exist_ok=True)  
            for i in range(1,7):
                try:
                    results = evaluate_lstm(timeseries,i)
                    #res = pandas.DataFrame.from_records(results)
                    #res.to_csv(f"{AtmoConfiguration.results_conf['results_path']}/evaluation_results_lstm_{i}.csv",sep=";",decimal=",",encoding="utf8")
                    resses.append(results)
                except ex:
                    errors.append(ex)
            return Response(data={'results':resses,'errors':errors},status=HTTP_200_OK)
        except Exception as ex:
            return Response(data={'error': f"Error on data loading: {ex}"},status=HTTP_500_INTERNAL_SERVER_ERROR)
        
class ApplyModelJSONView(APIView):
    @swagger_auto_schema(
        operation_summary="Εφαρμογή μοντέλων (JSON)",
        operation_description="Εφαρμόζει τα μοντέλα στα δεδομένα που εισάγονται ως JSON.",
        tags=["Μοντέλο πρόβλεψης αποθέματος"],
        responses={
            200: "Επιτυχής εκτέλεση",
            400: "Δεν δόθηκαν δεδομένα ή το JSON έχει λάθος μορφή.",
            500: "Εσωτερικό σφάλμα εξυπηρετητή."
        },
        request_body=openapi.Schema(
            type=openapi.TYPE_ARRAY,
            description="Παράδειγμα στοιχείων ημέρας για την εφαρμογή των μοντέλων.",
            items=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    "ATM": openapi.Schema(
                        type=openapi.TYPE_STRING,
                        description="Ο κωδικός του ΑΤΜ (π.χ., 'NB717074')."
                    ),
                    "date": openapi.Schema(
                        type=openapi.TYPE_STRING,
                        format=openapi.FORMAT_DATE,
                        description="Η ημερομηνία της εγγραφής σε μορφή 'dd/MM/yyyy'."
                    ),
                    "value": openapi.Schema(
                        type=openapi.TYPE_NUMBER,
                        description="Το ποσοστό πληρότητας του ΑΤΜ στο διάστημα [0.0,1.0]."
                    )
                },
                required=["ATM", "date", "value"]
            ),
            example=[
                {"ATM": "NB717074", "date": "22/01/2024", "value": 0.3},
                {"ATM": "NB717181", "date": "22/01/2024", "value": 0.4},
                {"ATM": "NB869105", "date": "22/01/2024", "value": 0.2},
                {"ATM": "NB717224", "date": "22/01/2024", "value": 0.4}
            ]
        )
    )
    def post(self, request, *args, **kwargs):
        current_state_data_raw = request.data
        current_state_dict = None
        if current_state_data_raw is None:
            return Response(data={'error':'No data provided.'},status=HTTP_400_BAD_REQUEST)
        else:
            try:
                current_state_dict = json_to_supervised(
                    current_state_data_raw,
                    converter=Preprocessor.test_to_supervised,
                    train_features=['day_of_week','day_of_month','month','workday','holiday','value']
                )
            except Exception as ex:
                return Response(data={'error':ex},status=HTTP_500_INTERNAL_SERVER_ERROR)
        predictor = ATMOPredictor(autotrain=True)
        common_atms = [atm for atm in current_state_dict if atm in predictor.atm_codes]
        atm_missing = [atm for atm in current_state_dict if atm not in common_atms]
        atm_index = 0
        atm_due = []
        atm_not_due = []
        for atm in common_atms:
            current_state = current_state_dict[atm]
            if predictor.is_atm_due(atm_code=atm,current_state=current_state):
                atm_due.append(atm)
            else:
                atm_not_due.append(atm)
            atm_index += 1
        return Response(data={'atm_due':atm_due,'atm_not_due':atm_not_due,'atm_missing':atm_missing},status=HTTP_200_OK)
    
class ApplyModelCSVView(APIView):
    parser_classes = [MultiPartParser]

    @swagger_auto_schema(
        operation_summary="Εφαρμογή μοντέλων (CSV)",
        operation_description="Εφαρμόζει τα μοντέλα στα δεδομένα που εισάγονται ως CSV.",
        tags=["Μοντέλο πρόβλεψης αποθέματος"],
        manual_parameters=[
            openapi.Parameter(
                name="file",
                in_=openapi.IN_FORM,
                type=openapi.TYPE_FILE,
                description=(
                    "Το αρχείο CSV με δεδομένα για εφαρμογή μοντέλων.\n\n"
                    "Παράδειγμα περιεχομένων αρχείου:\n\n"
                    "```csv\n"
                    '"ATM";"date";"value"\n'
                    '"NB717074";"22/1/2024";0.2\n'
                    '"NB869105";"22/1/2024";0.3\n'
                    '"NB439215";"22/1/2024";0.8\n'
                    "```"
                ),
                required=True,
            )
        ],
        responses={
            200: "Επιτυχής εκτέλεση",
            400: "Δεν δόθηκαν δεδομένα ή το CSV έχει λάθος μορφή.",
            500: "Εσωτερικό σφάλμα εξυπηρετητή."
        }
    )
    def post(self, request, *args, **kwargs):
        file_obj = request.FILES.get('file')
        data = None
        if not file_obj:
            return Response(data={'error': 'No file provided.'}, status=HTTP_400_BAD_REQUEST)
        try:
            data = pandas.read_csv(file_obj,sep=';',decimal='.')
        except Exception as ex:
            return Response(data={'error': f"Failed to parse CSV: {str(ex)}"}, status=HTTP_400_BAD_REQUEST)
        
        required_columns = {'ATM', 'date', 'value'}
        if not required_columns.issubset(data.columns):
            return Response(data={'error': f"CSV must contain columns: {required_columns}"}, status=HTTP_400_BAD_REQUEST)
    
        current_state_dict = None
        if data is None:
            return Response(data={'error':'No data provided.'},status=HTTP_400_BAD_REQUEST)
        else:
            try:
                current_state_dict = pandas_to_supervised(
                    data,
                    converter=Preprocessor.test_to_supervised,
                    train_features=['day_of_week','day_of_month','month','workday','holiday','value']
                )
            except Exception as ex:
                return Response(data={'error':ex},status=HTTP_500_INTERNAL_SERVER_ERROR)
        predictor = ATMOPredictor(autotrain=True)
        common_atms = [atm for atm in current_state_dict if atm in predictor.atm_codes]
        atm_missing = [atm for atm in current_state_dict if atm not in common_atms]
        atm_index = 0
        atm_due = []
        atm_not_due = []
        for atm in common_atms:
            current_state = current_state_dict[atm]
            if predictor.is_atm_due(atm_code=atm,current_state=current_state):
                atm_due.append(atm)
            else:
                atm_not_due.append(atm)
            atm_index += 1
        return Response(data={'atm_due':atm_due,'atm_not_due':atm_not_due,'atm_missing':atm_missing},status=HTTP_200_OK)