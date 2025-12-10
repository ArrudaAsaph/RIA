import django_filters
from .models import Cliente, SistemaSolar, ProducaoMensal

class ClienteFilter(django_filters.FilterSet):
    nome = django_filters.CharFilter(lookup_expr='icontains')
    email = django_filters.CharFilter(lookup_expr='icontains')
    cidade = django_filters.CharFilter(lookup_expr='icontains')
    data_instalacao_min = django_filters.DateFilter(field_name='data_instalacao', lookup_expr='gte')
    data_instalacao_max = django_filters.DateFilter(field_name='data_instalacao', lookup_expr='lte')
    tamanho_sistema_min = django_filters.NumberFilter(field_name='tamanho_sistema', lookup_expr='gte')
    tamanho_sistema_max = django_filters.NumberFilter(field_name='tamanho_sistema', lookup_expr='lte')
    custo_total_min = django_filters.NumberFilter(field_name='custo_total', lookup_expr='gte')
    custo_total_max = django_filters.NumberFilter(field_name='custo_total', lookup_expr='lte')
    
    class Meta:
        model = Cliente
        fields = [
            'nome', 'email', 'telefone', 'cidade', 'estado', 'ativo', 'tipo_sistema',
            'data_instalacao_min', 'data_instalacao_max',
            'tamanho_sistema_min', 'tamanho_sistema_max',
            'custo_total_min', 'custo_total_max'
        ]

class SistemaSolarFilter(django_filters.FilterSet):
    marca_inversor = django_filters.CharFilter(lookup_expr='icontains')
    modelo_inversor = django_filters.CharFilter(lookup_expr='icontains')
    marca_painel = django_filters.CharFilter(lookup_expr='icontains')
    modelo_painel = django_filters.CharFilter(lookup_expr='icontains')
    
    class Meta:
        model = SistemaSolar
        fields = ['cliente', 'marca_inversor', 'marca_painel', 'orientacao']

class ProducaoMensalFilter(django_filters.FilterSet):
    ano = django_filters.NumberFilter()
    mes = django_filters.NumberFilter()
    producao_kwh_min = django_filters.NumberFilter(field_name='producao_kwh', lookup_expr='gte')
    producao_kwh_max = django_filters.NumberFilter(field_name='producao_kwh', lookup_expr='lte')
    
    class Meta:
        model = ProducaoMensal
        fields = ['sistema', 'ano', 'mes', 'producao_kwh_min', 'producao_kwh_max']