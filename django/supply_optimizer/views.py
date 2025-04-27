from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import FileResponse
from rest_framework.parsers import MultiPartParser
from rest_framework.status import HTTP_200_OK, HTTP_500_INTERNAL_SERVER_ERROR, HTTP_400_BAD_REQUEST
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
import pandas, os
from PIL import Image, ImageFont, ImageDraw
import traceback
from supply_optimizer.optimizer.solver import ATMOSolver, daily_supply_optimization, get_daily_graphs_from_test_json
from atmo_platform.conf import AtmoConfiguration
#from django.shortcuts import render
from django.template.loader import render_to_string

class CreatePlansJSONView(APIView):
    @swagger_auto_schema(
        operation_summary="Δημιουργία πλάνων εφοδιασμού (JSON)",
        operation_description="Δημιουργεί ημερήσια πλάνα εφοδιασμού για τα ΑΤΜ που ορίζονται σε μορφή JSON.",
        tags=["Μοντέλο βελτιστοποίησης πλάνων εφοδιασμού"],
        responses={
            200: openapi.Response(
                description="Επιτυχής εκτέλεση",
                examples={
                    "application/json": {
                        "paths": {
                            "2024-01-12":{
                                "CIT1":["CIT1_BASE","NBGATM1"],
                                "CIT2":["CIT2_BASE","NBGATM2","NBGATM3"]
                            },
                            "2024-01-12":{
                                "CIT1":["CIT1_BASE","NBGATM5"],
                                "CIT2":["CIT2_BASE","NBGATM4","NBGATM2"]
                            }
                        }
                    }
                }
            ),
            400: "Δεν δόθηκαν δεδομένα ή το JSON έχει λάθος μορφή.",
            500: "Εσωτερικό σφάλμα εξυπηρετητή."
        },
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                "model":openapi.Schema(
                    type=openapi.TYPE_STRING,
                    description="Το όνομα του μοντέλου από τα ['approximation','greedy','ilp','genetic'].",
                    example="greedy"
                ),
                "data":openapi.Schema(
                    type=openapi.TYPE_ARRAY,
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
                    description="Παράδειγμα στοιχείων ATM για την δημιουργία των πλάνων εφοδιασμού.",
                    example=[
                            {"ATM": "NB717074", "date": "22/01/2024", "value": 0.3},
                            {"ATM": "NB717181", "date": "22/01/2024", "value": 0.4},
                            {"ATM": "NB869105", "date": "22/01/2024", "value": 0.2},
                            {"ATM": "NB717224", "date": "22/01/2024", "value": 0.4}
                        ]
                )
            },
            required=["model", "data"]
        )
    )
    def post(self, request, *args, **kwargs):
        try:
            in_data = request.data
            if not in_data:
                return Response(data={'error': f"No data provided."}, status=HTTP_400_BAD_REQUEST)
            dataset = in_data.get('data',None)
            if not dataset:
                return Response(data={'error': f"No dataset provided."}, status=HTTP_400_BAD_REQUEST)
            model = in_data.get('model',None)
            if not model:
                return Response(data={'error': f"No model provided."}, status=HTTP_400_BAD_REQUEST)
            
            try:
                daily_graphs = get_daily_graphs_from_test_json(dataset)
                try:
                    daily_optimized_solver:ATMOSolver = daily_supply_optimization(daily_graphs,model)
                    solution_texts = daily_optimized_solver.get_solution_text()
                    for day in solution_texts:
                        print(f"Paths for day {day}:")
                        for path in solution_texts[day]:
                            if type(solution_texts[day]).__name__ == 'dict':
                                print(solution_texts[day][path])
                            else:
                                print(path)
                    return Response(data={'paths':solution_texts,'costs':daily_optimized_solver.get_cost()['total']},status=HTTP_200_OK)
                except Exception as ex:
                    print(traceback.format_exc())
                    return Response(data={'error': f"Error during solving: {ex}"},status=HTTP_500_INTERNAL_SERVER_ERROR)
            except Exception as ex:
                print(traceback.format_exc())
                return Response(data={'error': f"Failed to convert data: {ex}"}, status=HTTP_400_BAD_REQUEST)
        except Exception as ex:
            print(traceback.format_exc())
            return Response(data={'error': f"Error on plan creation: {ex}"},status=HTTP_500_INTERNAL_SERVER_ERROR)
    
class CreatePlansCSVView(APIView):
    parser_classes = [MultiPartParser]

    @swagger_auto_schema(
        operation_summary="Δημιουργία πλάνων εφοδιασμού (CSV)",
        operation_description="Δημιουργεί ημερήσια πλάνα εφοδιασμού για τα ΑΤΜ που ορίζονται σε μορφή CSV.",
        tags=["Μοντέλο βελτιστοποίησης πλάνων εφοδιασμού"],
        responses={
            200: openapi.Response(
                description="Επιτυχής εκτέλεση",
                examples={
                    "application/json": {
                        "paths": {
                            "2024-01-12":{
                                "CIT1":["CIT1_BASE","NBGATM1"],
                                "CIT2":["CIT2_BASE","NBGATM2","NBGATM3"]
                            },
                            "2024-01-12":{
                                "CIT1":["CIT1_BASE","NBGATM5"],
                                "CIT2":["CIT2_BASE","NBGATM4","NBGATM2"]
                            }
                        }
                    }
                }
            ),
            400: "Δεν δόθηκαν δεδομένα ή το CSV έχει λάθος μορφή.",
            500: "Εσωτερικό σφάλμα εξυπηρετητή."
        },
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
            ),
            openapi.Parameter(
                name="model",
                in_=openapi.IN_FORM,
                type=openapi.TYPE_STRING,
                description=(
                    "Το όνομα του μοντέλου από τα ['approximation','greedy','ilp','genetic']"
                ),
                required=True,
            )
        ]
    )
    def post(self, request, *args, **kwargs):
        try:
            file_obj = request.FILES.get('file')
            dataset = None
            if not file_obj:
                return Response(data={'error': 'No file provided.'}, status=HTTP_400_BAD_REQUEST)
            try:
                dataset = pandas.read_csv(file_obj,sep=';',decimal='.')
            except Exception as ex:
                return Response(data={'error': f"Failed to parse CSV: {str(ex)}"}, status=HTTP_400_BAD_REQUEST)
            
            required_columns = {'ATM', 'date', 'value'}
            if not required_columns.issubset(dataset.columns):
                return Response(data={'error': f"CSV must contain columns: {required_columns}"}, status=HTTP_400_BAD_REQUEST)
            
            model = request.data.get('model', None)
            valid_models = {'approximation', 'greedy', 'ilp', 'genetic'}
            if not model or model not in valid_models:
                return Response(data={'error': f"Invalid or missing model. Must be one of: {valid_models}."},status=HTTP_400_BAD_REQUEST)
            
            try:
                daily_graphs = get_daily_graphs_from_test_json(dataset.to_dict(orient='records'))
                try:
                    daily_optimized_solver:ATMOSolver = daily_supply_optimization(daily_graphs,model)
                    solution_texts = daily_optimized_solver.get_solution_text()
                    for day in solution_texts:
                        print(f"Paths for day {day}:")
                        for path in solution_texts[day]:
                            if type(solution_texts[day]).__name__ == 'dict':
                                print(solution_texts[day][path])
                            else:
                                print(path)
                    return Response(data={'paths':solution_texts,'costs':daily_optimized_solver.get_cost()['total']},status=HTTP_200_OK)
                except Exception as ex:
                    print(traceback.format_exc())
                    return Response(data={'error': f"Error during solving: {ex}"},status=HTTP_500_INTERNAL_SERVER_ERROR)
            except Exception as ex:
                print(traceback.format_exc())
                return Response(data={'error': f"Failed to convert data: {ex}"}, status=HTTP_400_BAD_REQUEST)
        except Exception as ex:
            print(traceback.format_exc())
            return Response(data={'error': f"Error on plan creation: {ex}"},status=HTTP_500_INTERNAL_SERVER_ERROR)
        
class VisualizePlansCSVView(APIView):
    parser_classes = [MultiPartParser]

    @swagger_auto_schema(
        operation_summary="Οπτικοποίηση πλάνων εφοδιασμού (CSV)",
        operation_description="Οπτικοποιεί ημερήσια πλάνα εφοδιασμού για τα ΑΤΜ που ορίζονται σε μορφή CSV.",
        tags=["Μοντέλο βελτιστοποίησης πλάνων εφοδιασμού"],
        responses={
            200: openapi.Response(
                description="HTML σελίδα που οπτικοποιεί τα ημερήσια πλάνα εφοδιασμού για τα ΑΤΜ.",
                examples={
                    "text/html": "<!DOCTYPE html><html><head><title>Daily Routes</title></head><body>...</body></html>"
                }
            ),
            400: "Δεν δόθηκαν δεδομένα ή το CSV έχει λάθος μορφή.",
            500: "Εσωτερικό σφάλμα εξυπηρετητή."
        },
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
            ),
            openapi.Parameter(
                name="model",
                in_=openapi.IN_FORM,
                type=openapi.TYPE_STRING,
                description=(
                    "Το όνομα του μοντέλου από τα ['approximation','greedy','ilp','genetic']"
                ),
                required=True,
            )
        ]
    )
    def post(self, request, *args, **kwargs):
        try:
            file_obj = request.FILES.get('file')
            dataset = None
            if not file_obj:
                return Response(data={'error': 'No file provided.'}, status=HTTP_400_BAD_REQUEST)
            try:
                dataset = pandas.read_csv(file_obj,sep=';',decimal='.')
            except Exception as ex:
                return Response(data={'error': f"Failed to parse CSV: {str(ex)}"}, status=HTTP_400_BAD_REQUEST)
            
            required_columns = {'ATM', 'date', 'value'}
            if not required_columns.issubset(dataset.columns):
                return Response(data={'error': f"CSV must contain columns: {required_columns}"}, status=HTTP_400_BAD_REQUEST)
            
            model = request.data.get('model', None)
            valid_models = {'approximation', 'greedy', 'ilp', 'genetic'}
            if not model or model not in valid_models:
                return Response(data={'error': f"Invalid or missing model. Must be one of: {valid_models}."},status=HTTP_400_BAD_REQUEST)
            
            try:
                daily_graphs = get_daily_graphs_from_test_json(dataset.to_dict(orient='records'))
                try:
                    daily_optimized_solver:ATMOSolver = daily_supply_optimization(daily_graphs,model)
                    solution_texts = daily_optimized_solver.get_solution_text()
                    for day in solution_texts:
                        print(f"Paths for day {day}:")
                        for path in solution_texts[day]:
                            if type(solution_texts[day]).__name__ == 'dict':
                                print(solution_texts[day][path])
                            else:
                                print(path)
                    solution_visualizations = daily_optimized_solver.solved_visualizations
                    images_by_date = {}
                    for img_path in solution_visualizations:
                        filename_splits = os.path.basename(img_path).split("_")
                        date = filename_splits[-2]
                        name = f"{filename_splits[0]}"
                        image_info = {'name': name, 'url': f"http://localhost:8000/graphs/{os.path.basename(img_path)}"}
                        if date not in images_by_date:
                            images_by_date[date] = []
                        images_by_date[date].append(image_info)
                    context = {'images_by_date': images_by_date}
                    return Response(
                        data={
                            'html':render_to_string(template_name='daily_routes.html', context=context, request=request)
                        }
                    )
                except Exception as ex:
                    print(traceback.format_exc())
                    return Response(data={'error':f"Error during solving: {ex}"},status=HTTP_500_INTERNAL_SERVER_ERROR)
            except Exception as ex:
                print(traceback.format_exc())
                return Response(data={'error': f"Failed to convert data: {ex}"}, status=HTTP_400_BAD_REQUEST)
        except Exception as ex:
            print(traceback.format_exc())
            return Response(data={'error':f"Error on plan creation: {ex}"},status=HTTP_500_INTERNAL_SERVER_ERROR)
        
class VisualizePlansJSONView(APIView):
    @swagger_auto_schema(
        operation_summary="Οπτικοποίηση πλάνων εφοδιασμού (JSON)",
        operation_description="Οπτικοποιεί ημερήσια πλάνα εφοδιασμού για τα ΑΤΜ που ορίζονται σε μορφή JSON.",
        tags=["Μοντέλο βελτιστοποίησης πλάνων εφοδιασμού"],
        responses={
            200: openapi.Response(
                description="HTML σελίδα που οπτικοποιεί τα ημερήσια πλάνα εφοδιασμού για τα ΑΤΜ.",
                examples={
                    "text/html": "<!DOCTYPE html><html><head><title>Daily Routes</title></head><body>...</body></html>"
                }
            ),
            400: "Δεν δόθηκαν δεδομένα ή το JSON έχει λάθος μορφή.",
            500: "Εσωτερικό σφάλμα εξυπηρετητή."
        },
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                "model":openapi.Schema(
                    type=openapi.TYPE_STRING,
                    description="Το όνομα του μοντέλου από τα ['approximation','greedy','ilp','genetic'].",
                    example="greedy"
                ),
                "data":openapi.Schema(
                    type=openapi.TYPE_ARRAY,
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
                    description="Παράδειγμα στοιχείων ATM για την δημιουργία των πλάνων εφοδιασμού.",
                    example=[
                            {"ATM": "NB717074", "date": "22/01/2024", "value": 0.3},
                            {"ATM": "NB717181", "date": "22/01/2024", "value": 0.4},
                            {"ATM": "NB869105", "date": "22/01/2024", "value": 0.2},
                            {"ATM": "NB717224", "date": "22/01/2024", "value": 0.4}
                        ]
                )
            },
            required=["model", "data"]
        )
    )
    def post(self, request, *args, **kwargs):
        try:
            in_data = request.data
            if not in_data:
                return Response(data={'error': f"No data provided."}, status=HTTP_400_BAD_REQUEST)
            dataset = in_data.get('data',None)
            if not dataset:
                return Response(data={'error': f"No dataset provided."}, status=HTTP_400_BAD_REQUEST)
            model = in_data.get('model',None)
            if not model:
                return Response(data={'error': f"No model provided."}, status=HTTP_400_BAD_REQUEST)
            
            try:
                daily_graphs = get_daily_graphs_from_test_json(dataset)
                try:
                    daily_optimized_solver:ATMOSolver = daily_supply_optimization(daily_graphs,model)
                    solution_texts = daily_optimized_solver.get_solution_text()
                    for day in solution_texts:
                        print(f"Paths for day {day}:")
                        for path in solution_texts[day]:
                            if type(solution_texts[day]).__name__ == 'dict':
                                print(solution_texts[day][path])
                            else:
                                print(path)
                    solution_visualizations = daily_optimized_solver.solved_visualizations
                    images_by_date = {}
                    for img_path in solution_visualizations:
                        filename_splits = os.path.basename(img_path).split("_")
                        date = filename_splits[-2]
                        name = f"{filename_splits[0]}"
                        image_info = {'name': name, 'url': f"http://localhost:8000/graphs/{os.path.basename(img_path)}"}
                        if date not in images_by_date:
                            images_by_date[date] = []
                        images_by_date[date].append(image_info)
                    context = {'images_by_date': images_by_date}
                    return Response(
                        data={
                            'html':render_to_string(template_name='daily_routes.html', context=context, request=request)
                        }
                    )
                except Exception as ex:
                    print(traceback.format_exc())
                    return Response(data={'error':f"Error during solving: {ex}"},status=HTTP_500_INTERNAL_SERVER_ERROR)
            except Exception as ex:
                print(traceback.format_exc())
                return Response(data={'error': f"Failed to convert data: {ex}"}, status=HTTP_400_BAD_REQUEST)
        except Exception as ex:
            print(traceback.format_exc())
            return Response(data={'error':f"Error on plan creation: {ex}"},status=HTTP_500_INTERNAL_SERVER_ERROR)
        
class VisualizePlansPDFCSVView(APIView):
    parser_classes = [MultiPartParser]

    @swagger_auto_schema(
        operation_summary="Οπτικοποίηση πλάνων εφοδιασμού (CSV)",
        operation_description="Οπτικοποιεί ημερήσια πλάνα εφοδιασμού για τα ΑΤΜ που ορίζονται σε μορφή CSV.",
        tags=["Μοντέλο βελτιστοποίησης πλάνων εφοδιασμού"],
        responses={
            200: openapi.Response(
                description="PDF File",
                content={
                    'application/pdf': {}
                }
            ),
            400: "Δεν δόθηκαν δεδομένα ή το CSV έχει λάθος μορφή.",
            500: "Εσωτερικό σφάλμα εξυπηρετητή."
        },
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
            ),
            openapi.Parameter(
                name="model",
                in_=openapi.IN_FORM,
                type=openapi.TYPE_STRING,
                description=(
                    "Το όνομα του μοντέλου από τα ['approximation','greedy','ilp','genetic']"
                ),
                required=True,
            )
        ]
    )
    def post(self, request, *args, **kwargs):
        try:
            file_obj = request.FILES.get('file')
            dataset = None
            if not file_obj:
                return Response(data={'error': 'No file provided.'}, status=HTTP_400_BAD_REQUEST)
            try:
                dataset = pandas.read_csv(file_obj,sep=';',decimal='.')
            except Exception as ex:
                return Response(data={'error': f"Failed to parse CSV: {str(ex)}"}, status=HTTP_400_BAD_REQUEST)
            
            required_columns = {'ATM', 'date', 'value'}
            if not required_columns.issubset(dataset.columns):
                return Response(data={'error': f"CSV must contain columns: {required_columns}"}, status=HTTP_400_BAD_REQUEST)
            
            model = request.data.get('model', None)
            valid_models = {'approximation', 'greedy', 'ilp', 'genetic'}
            if not model or model not in valid_models:
                return Response(data={'error': f"Invalid or missing model. Must be one of: {valid_models}."},status=HTTP_400_BAD_REQUEST)
            
            try:
                daily_graphs = get_daily_graphs_from_test_json(dataset.to_dict(orient='records'))
                try:
                    daily_optimized_solver:ATMOSolver = daily_supply_optimization(daily_graphs,model)
                    solution_texts = daily_optimized_solver.get_solution_text()
                    for day in solution_texts:
                        print(f"Paths for day {day}:")
                        for path in solution_texts[day]:
                            if type(solution_texts[day]).__name__ == 'dict':
                                print(solution_texts[day][path])
                            else:
                                print(path)
                    solution_visualizations = daily_optimized_solver.solved_visualizations
                    images = []
                    page_size = (595, 842)
                    label_font_size = 200
                    try:
                        font = ImageFont.truetype("arial.ttf", label_font_size)
                    except IOError:
                        font = ImageFont.load_default()
                    for img_path in solution_visualizations:
                        image_name = os.path.basename(img_path)
                        with Image.open(img_path) as img:
                            img = img.convert('RGB') 
                            canvas = Image.new('RGB', page_size, (255, 255, 255))
                            draw = ImageDraw.Draw(canvas)
                            label_position = (10, 10)
                            draw.text(label_position, image_name, fill="black", font=font)
                            img_position = (
                                (page_size[0] - img.width) // 2,
                                label_position[1] + label_font_size + 10
                            )
                            canvas.paste(img, img_position)
                            images.append(img)
                    pdf_path = f"{AtmoConfiguration.results_conf['results_path']}/result_pdf.pdf"
                    if images:
                        images[0].save(
                            pdf_path,
                            save_all=True,
                            append_images=images[1:]
                        )
                    pdf_file = open(pdf_path, 'rb')
                    response = FileResponse(
                        pdf_file,
                        content_type='application/pdf'
                    ) 
                    response['Content-Disposition'] = f'inline; filename="{os.path.basename(pdf_path)}"'
                    return response
                except Exception as ex:
                    print(traceback.format_exc())
                    return Response(data={'error': f"Error during solving: {ex}"},status=HTTP_500_INTERNAL_SERVER_ERROR)
            except Exception as ex:
                print(traceback.format_exc())
                return Response(data={'error': f"Failed to convert data: {ex}"}, status=HTTP_400_BAD_REQUEST)
        except Exception as ex:
            print(traceback.format_exc())
            return Response(data={'error': f"Error on plan creation: {ex}"},status=HTTP_500_INTERNAL_SERVER_ERROR)