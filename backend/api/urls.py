from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views

router = DefaultRouter()
router.register(r'clientes', views.ClienteViewSet, basename='cliente')
router.register(r'sistemas', views.SistemaSolarViewSet, basename='sistema')
router.register(r'producoes', views.ProducaoMensalViewSet, basename='producao')
router.register(r'configuracoes', views.ConfiguracaoViewSet, basename='configuracao')
router.register(r'relatorios', views.RelatorioViewSet, basename='relatorio')
router.register(r'usuarios', views.UserViewSet, basename='usuario')

urlpatterns = [
    path('', include(router.urls)),
    
    # Autenticação JWT
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('login/', views.login, name='login'),
    path('register/', views.register, name='register'),
    path('logout/', views.logout, name='logout'),
    
    path('exportar/', views.ExportarDadosView.as_view(), name='exportar'),
    path('estatisticas/', views.EstatisticasView.as_view(), name='estatisticas'),
]