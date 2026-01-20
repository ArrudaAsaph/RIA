from rest_framework import viewsets, status, filters
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from rest_framework.views import APIView
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Sum, Count, Avg, Q
from django.utils import timezone
from datetime import datetime, timedelta
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.db import transaction
import json

from .models import Cliente, SistemaSolar, ProducaoMensal, Configuracao, Relatorio
from .serializers import (
    ClienteSerializer, ClienteCreateSerializer,
    SistemaSolarSerializer, ProducaoMensalSerializer,
    ConfiguracaoSerializer, ConfiguracaoUpdateSerializer,
    RelatorioSerializer, DashboardSerializer,
    RelatorioCidadeSerializer, RelatorioMensalSerializer,
    RelatorioTipoSistemaSerializer, UserSerializer,
    AlterarSenhaSerializer
)
from .filters import ClienteFilter, SistemaSolarFilter, ProducaoMensalFilter

# Cliente Views
class ClienteViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gerenciar clientes.
    """
    queryset = Cliente.objects.all()
    # permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = ClienteFilter
    search_fields = ['nome', 'email', 'telefone', 'endereco', 'cidade']
    ordering_fields = ['nome', 'criado_em', 'tamanho_sistema', 'custo_total']
    ordering = ['-criado_em']
    
    def get_serializer_class(self):
        if self.action == 'create':
            return ClienteCreateSerializer
        return ClienteSerializer
    
    @action(detail=False, methods=['get'])
    def dashboard(self, request):
        """
        Retorna estatísticas para o dashboard.
        """
        queryset = self.filter_queryset(self.get_queryset())
        
        total_clientes = queryset.count()
        clientes_ativos = queryset.filter(ativo=True).count()
        clientes_inativos = total_clientes - clientes_ativos
        
        capacidade_total = queryset.aggregate(
            total=Sum('tamanho_sistema')
        )['total'] or 0
        
        investimento_total = queryset.aggregate(
            total=Sum('custo_total')
        )['total'] or 0
        
        media_sistema = queryset.aggregate(
            media=Avg('tamanho_sistema')
        )['media'] or 0
        
        media_investimento = queryset.aggregate(
            media=Avg('custo_total')
        )['media'] or 0
        
        data = {
            'total_clientes': total_clientes,
            'clientes_ativos': clientes_ativos,
            'clientes_inativos': clientes_inativos,
            'capacidade_total': capacidade_total,
            'investimento_total': investimento_total,
            'media_sistema': media_sistema,
            'media_investimento': media_investimento,
        }
        
        serializer = DashboardSerializer(data)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def relatorio_cidades(self, request):
        """
        Retorna relatório agrupado por cidade.
        """
        queryset = self.filter_queryset(self.get_queryset())
        
        dados_cidades = queryset.values('cidade', 'estado').annotate(
            quantidade=Count('id'),
            capacidade=Sum('tamanho_sistema'),
            investimento=Sum('custo_total')
        ).order_by('-quantidade')
        
        serializer = RelatorioCidadeSerializer(dados_cidades, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def relatorio_mensal(self, request):
        """
        Retorna relatório mensal dos últimos 6 meses.
        """
        hoje = timezone.now()
        relatorio = []
        
        for i in range(5, -1, -1):
            data_ref = hoje - timedelta(days=30*i)
            mes = data_ref.month
            ano = data_ref.year
            
            # Busca clientes instalados neste mês/ano
            novos_clientes = Cliente.objects.filter(
                data_instalacao__year=ano,
                data_instalacao__month=mes
            ).count()
            
            # Busca clientes ativos até este mês
            clientes_ativos = Cliente.objects.filter(
                data_instalacao__lte=data_ref,
                ativo=True
            ).count()
            
            # Capacidade adicionada neste mês
            capacidade_adicionada = Cliente.objects.filter(
                data_instalacao__year=ano,
                data_instalacao__month=mes
            ).aggregate(total=Sum('tamanho_sistema'))['total'] or 0
            
            # Receita deste mês
            receita = Cliente.objects.filter(
                data_instalacao__year=ano,
                data_instalacao__month=mes
            ).aggregate(total=Sum('custo_total'))['total'] or 0
            
            relatorio.append({
                'mes': mes,
                'ano': ano,
                'novos_clientes': novos_clientes,
                'clientes_ativos': clientes_ativos,
                'capacidade_adicionada': capacidade_adicionada,
                'receita': receita,
            })
        
        serializer = RelatorioMensalSerializer(relatorio, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def por_tamanho_sistema(self, request):
        """
        Retorna quantidade de clientes por faixa de tamanho de sistema.
        """
        queryset = self.filter_queryset(self.get_queryset())
        
        categorias = [
            {'min': 0, 'max': 3, 'label': 'Pequeno (até 3 kW)'},
            {'min': 3.1, 'max': 7, 'label': 'Médio (3.1 a 7 kW)'},
            {'min': 7.1, 'max': 15, 'label': 'Grande (7.1 a 15 kW)'},
            {'min': 15.1, 'max': 1000, 'label': 'Industrial (acima de 15 kW)'},
        ]
        
        resultados = []
        for categoria in categorias:
            quantidade = queryset.filter(
                tamanho_sistema__gte=categoria['min'],
                tamanho_sistema__lte=categoria['max']
            ).count()
            resultados.append({
                'categoria': categoria['label'],
                'quantidade': quantidade
            })
        
        return Response(resultados)
    
    @action(detail=False, methods=['get'])
    def por_tipo_sistema(self, request):
        """
        Retorna relatório por tipo de sistema.
        """
        queryset = self.filter_queryset(self.get_queryset())
        
        tipos = queryset.values('tipo_sistema').annotate(
            quantidade=Count('id'),
            capacidade_total=Sum('tamanho_sistema'),
            investimento_total=Sum('custo_total'),
            investimento_medio=Avg('custo_total')
        ).order_by('-quantidade')
        
        serializer = RelatorioTipoSistemaSerializer(tipos, many=True)
        return Response(serializer.data)

# Sistema Solar Views
class SistemaSolarViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gerenciar sistemas solares.
    """
    queryset = SistemaSolar.objects.all()
    serializer_class = SistemaSolarSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_class = SistemaSolarFilter
    search_fields = ['modelo_inversor', 'modelo_painel']

# Producao Mensal Views
class ProducaoMensalViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gerenciar produções mensais.
    """
    queryset = ProducaoMensal.objects.all()
    serializer_class = ProducaoMensalSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend]
    filterset_class = ProducaoMensalFilter
    
    @action(detail=False, methods=['get'])
    def producao_anual(self, request):
        """
        Retorna produção anual agrupada por ano.
        """
        producao_anual = ProducaoMensal.objects.values('ano').annotate(
            total_producao=Sum('producao_kwh'),
            media_irradiacao=Avg('irradiacao_media'),
            quantidade_sistemas=Count('sistema', distinct=True)
        ).order_by('-ano')
        
        return Response(producao_anual)

# Configuração Views
class ConfiguracaoViewSet(viewsets.ViewSet):
    """
    ViewSet para gerenciar configurações do sistema.
    """
    permission_classes = [IsAuthenticated]
    
    def list(self, request):
        config = Configuracao.objects.first()
        if not config:
            config = Configuracao.objects.create()
        serializer = ConfiguracaoSerializer(config)
        return Response(serializer.data)
    
    def retrieve(self, request, pk=None):
        config = Configuracao.objects.first()
        if not config:
            return Response(
                {"detail": "Configuração não encontrada"},
                status=status.HTTP_404_NOT_FOUND
            )
        serializer = ConfiguracaoSerializer(config)
        return Response(serializer.data)
    
    def update(self, request, pk=None):
        config = Configuracao.objects.first()
        if not config:
            config = Configuracao.objects.create()
        
        serializer = ConfiguracaoUpdateSerializer(config, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'])
    def restaurar_padrao(self, request):
        """
        Restaura configurações para valores padrão.
        """
        config = Configuracao.objects.first()
        if not config:
            config = Configuracao.objects.create()
        
        config.nome_empresa = "Solar Energy Solutions"
        config.email_contato = "contato@solarenergy.com"
        config.telefone_contato = "(11) 99999-9999"
        config.endereco_empresa = "Av. Paulista, 1000 - São Paulo/SP"
        config.cnpj = "12.345.678/0001-99"
        config.taxa_juros = 1.5
        config.prazo_maximo = 60
        config.notificacoes_email = True
        config.notificacoes_sms = False
        config.relatorio_automatico = True
        config.tema_escuro = False
        config.save()
        
        serializer = ConfiguracaoSerializer(config)
        return Response(serializer.data)

# Relatório Views
class RelatorioViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gerenciar relatórios salvos.
    """
    queryset = Relatorio.objects.all()
    serializer_class = RelatorioSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['tipo', 'criado_por']
    
    def perform_create(self, serializer):
        serializer.save(criado_por=self.request.user)

# User Views
class UserViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gerenciar usuários.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['get'])
    def me(self, request):
        """
        Retorna informações do usuário atual.
        """
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'])
    def alterar_senha(self, request):
        """
        Altera a senha do usuário atual.
        """
        user = request.user
        serializer = AlterarSenhaSerializer(data=request.data)
        
        if serializer.is_valid():
            # Verifica senha atual
            if not user.check_password(serializer.validated_data['senha_atual']):
                return Response(
                    {"senha_atual": "Senha atual incorreta"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Altera a senha
            user.set_password(serializer.validated_data['nova_senha'])
            user.save()
            
            return Response({"detail": "Senha alterada com sucesso"})
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Autenticação Views
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    """
    Realiza logout do usuário.
    """
    request.session.flush()
    return Response({"detail": "Logout realizado com sucesso"})

# Exportação Views
class ExportarDadosView(APIView):
    """
    View para exportar dados em diferentes formatos.
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        tipo = request.query_params.get('tipo', 'clientes')
        formato = request.query_params.get('formato', 'json')
        
        if tipo == 'clientes':
            queryset = Cliente.objects.all()
            serializer = ClienteSerializer(queryset, many=True)
            dados = serializer.data
        elif tipo == 'sistemas':
            queryset = SistemaSolar.objects.all()
            serializer = SistemaSolarSerializer(queryset, many=True)
            dados = serializer.data
        elif tipo == 'producoes':
            queryset = ProducaoMensal.objects.all()
            serializer = ProducaoMensalSerializer(queryset, many=True)
            dados = serializer.data
        else:
            return Response(
                {"detail": "Tipo de dados não suportado"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if formato == 'json':
            return Response(dados)
        else:
            # Para outros formatos (CSV, Excel), implemente conforme necessário
            return Response(
                {"detail": "Formato não implementado"},
                status=status.HTTP_501_NOT_IMPLEMENTED
            )

# Estatísticas Views
class EstatisticasView(APIView):
    """
    View para retornar estatísticas gerais do sistema.
    """
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    def get(self, request):
        # Estatísticas de clientes
        total_clientes = Cliente.objects.count()
        clientes_ativos = Cliente.objects.filter(ativo=True).count()
        
        # Estatísticas de sistemas
        total_sistemas = SistemaSolar.objects.count()
        
        # Estatísticas de produção
        producao_total = ProducaoMensal.objects.aggregate(
            total=Sum('producao_kwh')
        )['total'] or 0
        
        # Estatísticas financeiras
        investimento_total = Cliente.objects.aggregate(
            total=Sum('custo_total')
        )['total'] or 0
        
        # Distribuição por estado
        estados = Cliente.objects.values('estado').annotate(
            quantidade=Count('id'),
            capacidade=Sum('tamanho_sistema')
        ).order_by('-quantidade')[:5]
        
        estatisticas = {
            'clientes': {
                'total': total_clientes,
                'ativos': clientes_ativos,
                'inativos': total_clientes - clientes_ativos,
            },
            'sistemas': {
                'total': total_sistemas,
            },
            'producao': {
                'total_kwh': producao_total,
            },
            'financeiro': {
                'investimento_total': investimento_total,
            },
            'top_estados': list(estados),
        }
        
        return Response(estatisticas)


# Adicionar no topo do arquivo
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny

# Adicionar estas views
@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    """
    Autenticação JWT personalizada.
    """
    username = request.data.get('username')
    password = request.data.get('password')
    
    user = authenticate(username=username, password=password)
    
    if user is not None:
        if user.is_active:
            refresh = RefreshToken.for_user(user)
            
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                }
            })
        else:
            return Response(
                {'detail': 'Conta desativada'},
                status=status.HTTP_400_BAD_REQUEST
            )
    else:
        return Response(
            {'detail': 'Credenciais inválidas'},
            status=status.HTTP_401_UNAUTHORIZED
        )

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    """
    Registro de novo usuário.
    """
    from django.contrib.auth.models import User
    
    username = request.data.get('username')
    password = request.data.get('password')
    email = request.data.get('email')
    first_name = request.data.get('first_name', '')
    last_name = request.data.get('last_name', '')
    
    if not username or not password:
        return Response(
            {'detail': 'Username e password são obrigatórios'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    if User.objects.filter(username=username).exists():
        return Response(
            {'detail': 'Username já existe'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    user = User.objects.create_user(
        username=username,
        password=password,
        email=email,
        first_name=first_name,
        last_name=last_name
    )
    
    refresh = RefreshToken.for_user(user)
    
    return Response({
        'refresh': str(refresh),
        'access': str(refresh.access_token),
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
        }
    }, status=status.HTTP_201_CREATED)

@api_view(['POST'])
def logout(request):
    """
    Logout - adicionar token à blacklist.
    """
    try:
        refresh_token = request.data.get('refresh')
        token = RefreshToken(refresh_token)
        token.blacklist()
        return Response({'detail': 'Logout realizado com sucesso'})
    except Exception as e:
        return Response(
            {'detail': 'Erro ao realizar logout'},
            status=status.HTTP_400_BAD_REQUEST
        )