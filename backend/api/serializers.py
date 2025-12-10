from rest_framework import serializers
from .models import Cliente, SistemaSolar, ProducaoMensal, Configuracao, Relatorio
from django.contrib.auth.models import User
import uuid

# Cliente Serializers
class ClienteSerializer(serializers.ModelSerializer):
    endereco_completo = serializers.CharField(read_only=True)
    
    class Meta:
        model = Cliente
        fields = '__all__'
        read_only_fields = ['id', 'criado_em', 'atualizado_em']
    
    def validate_tamanho_sistema(self, value):
        if value <= 0:
            raise serializers.ValidationError("O tamanho do sistema deve ser maior que zero")
        return value
    
    def validate_custo_total(self, value):
        if value < 0:
            raise serializers.ValidationError("O custo total não pode ser negativo")
        return value

class ClienteCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cliente
        fields = [
            'nome', 'email', 'telefone', 'endereco', 'cidade', 'estado', 'cep',
            'tamanho_sistema', 'custo_total', 'data_instalacao', 'ativo', 'tipo_sistema'
        ]
    
    def create(self, validated_data):
        validated_data['id'] = uuid.uuid4()
        return super().create(validated_data)

# Sistema Solar Serializers
class SistemaSolarSerializer(serializers.ModelSerializer):
    potencia_total_paineis = serializers.DecimalField(max_digits=6, decimal_places=2, read_only=True)
    
    class Meta:
        model = SistemaSolar
        fields = '__all__'
        read_only_fields = ['id', 'criado_em']

class ProducaoMensalSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProducaoMensal
        fields = '__all__'
        read_only_fields = ['id']

# Configuração Serializers
class ConfiguracaoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Configuracao
        fields = '__all__'
        read_only_fields = ['id', 'atualizado_em']
    
    def validate_taxa_juros(self, value):
        if value < 0 or value > 100:
            raise serializers.ValidationError("A taxa de juros deve estar entre 0 e 100%")
        return value
    
    def validate_prazo_maximo(self, value):
        if value < 1 or value > 360:
            raise serializers.ValidationError("O prazo máximo deve ser entre 1 e 360 meses")
        return value

class ConfiguracaoUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Configuracao
        fields = [
            'nome_empresa', 'email_contato', 'telefone_contato', 'endereco_empresa', 'cnpj',
            'taxa_juros', 'prazo_maximo', 'notificacoes_email', 'notificacoes_sms',
            'relatorio_automatico', 'tema_escuro'
        ]

# Relatório Serializers
class RelatorioSerializer(serializers.ModelSerializer):
    criado_por_nome = serializers.CharField(source='criado_por.username', read_only=True)
    
    class Meta:
        model = Relatorio
        fields = '__all__'
        read_only_fields = ['id', 'criado_em', 'criado_por']

# Dashboard Serializers
class DashboardSerializer(serializers.Serializer):
    total_clientes = serializers.IntegerField()
    clientes_ativos = serializers.IntegerField()
    clientes_inativos = serializers.IntegerField()
    capacidade_total = serializers.DecimalField(max_digits=10, decimal_places=2)
    investimento_total = serializers.DecimalField(max_digits=15, decimal_places=2)
    media_sistema = serializers.DecimalField(max_digits=6, decimal_places=2)
    media_investimento = serializers.DecimalField(max_digits=12, decimal_places=2)

class RelatorioCidadeSerializer(serializers.Serializer):
    cidade = serializers.CharField()
    estado = serializers.CharField()
    quantidade = serializers.IntegerField()
    capacidade = serializers.DecimalField(max_digits=10, decimal_places=2)
    investimento = serializers.DecimalField(max_digits=15, decimal_places=2)

class RelatorioMensalSerializer(serializers.Serializer):
    mes = serializers.IntegerField()
    ano = serializers.IntegerField()
    novos_clientes = serializers.IntegerField()
    clientes_ativos = serializers.IntegerField()
    capacidade_adicionada = serializers.DecimalField(max_digits=10, decimal_places=2)
    receita = serializers.DecimalField(max_digits=15, decimal_places=2)

class RelatorioTipoSistemaSerializer(serializers.Serializer):
    tipo_sistema = serializers.CharField()
    quantidade = serializers.IntegerField()
    capacidade_total = serializers.DecimalField(max_digits=10, decimal_places=2)
    investimento_total = serializers.DecimalField(max_digits=15, decimal_places=2)

# User Serializers
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'is_active']
        read_only_fields = ['id']

class AlterarSenhaSerializer(serializers.Serializer):
    senha_atual = serializers.CharField(required=True, write_only=True)
    nova_senha = serializers.CharField(required=True, write_only=True, min_length=6)
    confirmar_senha = serializers.CharField(required=True, write_only=True)
    
    def validate(self, data):
        if data['nova_senha'] != data['confirmar_senha']:
            raise serializers.ValidationError({"confirmar_senha": "As senhas não coincidem"})
        return data