"""
URL configuration for atmo_platform project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, re_path
from cash_predictor.views import ImportDataView, ApplyModelJSONView, EvaluateDeepModelsView, \
    EvaluateClassicModelsView, ApplyModelCSVView, ATMCodesView, ATMStatsView, SupplyTypesView, \
    SupplyTypesView, SupplyTypeStatsView, ATMDataView
from supply_optimizer.views import CreatePlansCSVView,CreatePlansJSONView, VisualizePlansCSVView, \
    VisualizePlansJSONView
#from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from django.conf import settings
from django.conf.urls.static import static
from atmo_platform.conf import AtmoConfiguration

schema_view = get_schema_view(
    openapi.Info(
        title="ATMO-MoRe Documentation",
        default_version='v1',
        description="Προδιαγραφές API του ATMO-MoRe",
        #terms_of_service="https://www.google.com/policies/terms/",
        contact=openapi.Contact(email="vpsomak@hua.gr"),
        license=openapi.License(name="AGPLV3 License"),
    ),
    public=True,
    #permission_classes=[permissions.AllowAny],
)

urlpatterns = [
    re_path(r'^swagger(?P<format>\.json|\.yaml)$', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    #path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    path('admin/', admin.site.urls),
    path('data_handler/refresh_data',
        ImportDataView.as_view(),
        name='data_handler_data_refresh'
    ),
    path('data_handler/atm_codes',
        ATMCodesView.as_view(),
        name='data_handler_atm_codes'
    ),
    path('data_handler/supply_types',
        SupplyTypesView.as_view(),
        name='data_handler_supply_types'
    ),
    path('data_handler/statistics/supply_types',
        SupplyTypeStatsView.as_view(),
        name='data_handler_supply_types_stats'
    ),
    path('data_handler/statistics/atm_codes',
        ATMStatsView.as_view(),
        name='data_handler_atm_codes_stats'
    ),
    path('data_handler/statistics/atm/<str:atm_code>/',
        ATMDataView.as_view(),
        name='data_handler_atm_stats'
    ),
    path('cash_predictor/apply_models_json',
        ApplyModelJSONView.as_view(),
        name='cash_predictor_apply_models_json'
    ),
    path('cash_predictor/apply_models_csv',
        ApplyModelCSVView.as_view(),
        name='cash_predictor_apply_models_csv'
    ),
    path('cash_predictor/evaluate_deep',
        EvaluateDeepModelsView.as_view(),
        name='cash_predictor_evaluate_deep'
    ),
    path('cash_predictor/evaluate_classic',
        EvaluateClassicModelsView.as_view(),
        name='cash_predictor_evaluate_classic'
    ),
    path('supply_optimizer/create_plans_json',
        CreatePlansJSONView.as_view(),
        name='optimizer_create_plans_json'
    ),
    path('supply_optimizer/create_plans_csv',
        CreatePlansCSVView.as_view(),
        name='optimizer_create_plans_csv'
    ),
    path('supply_optimizer/visualize_plans_csv',
        VisualizePlansCSVView.as_view(),
        name='optimizer_visualize_plans_csv'
    ),
    path('supply_optimizer/visualize_plans_json',
        VisualizePlansJSONView.as_view(),
        name='optimizer_visualize_plans_json'
    ),
]

urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
urlpatterns += static('/graphs/', document_root=AtmoConfiguration.results_conf['results_path']+'/graphs')