from django.db import models
import uuid
from django.contrib.auth.models import User

class Cliente(models.Model):
    ESTADOS_BRASIL = [
        ('AC', 'Acre'), ('AL', 'Alagoas'), ('AP', 'Amapá'), ('AM', 'Amazonas'),
        ('BA', 'Bahia'), ('CE', 'Ceará'), ('DF', 'Distrito Federal'), ('ES', 'Espírito Santo'),
        ('GO', 'Goiás'), ('MA', 'Maranhão'), ('MT', 'Mato Grosso'), ('MS', 'Mato Grosso do Sul'),
        ('MG', 'Minas Gerais'), ('PA', 'Pará'), ('PB', 'Paraíba'), ('PR', 'Paraná'),
        ('PE', 'Pernambuco'), ('PI', 'Piauí'), ('RJ', 'Rio de Janeiro'), ('RN', 'Rio Grande do Norte'),
        ('RS', 'Rio Grande do Sul'), ('RO', 'Rondônia'), ('RR', 'Roraima'), ('SC', 'Santa Catarina'),
        ('SP', 'São Paulo'), ('SE', 'Sergipe'), ('TO', 'Tocantins'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    nome = models.CharField(max_length=200)
    email = models.EmailField(unique=True)
    telefone = models.CharField(max_length=20)
    endereco = models.CharField(max_length=300)
    cidade = models.CharField(max_length=100)
    estado = models.CharField(max_length=2, choices=ESTADOS_BRASIL)
    cep = models.CharField(max_length=10)
    
    # Sistema Solar
    tamanho_sistema = models.DecimalField(max_digits=6, decimal_places=2)  # kW
    custo_total = models.DecimalField(max_digits=12, decimal_places=2)  # R$
    data_instalacao = models.DateField()
    
    # Status
    ativo = models.BooleanField(default=True)
    tipo_sistema = models.CharField(
        max_length=20,
        choices=[
            ('RESIDENCIAL', 'Residencial'),
            ('COMERCIAL', 'Comercial'),
            ('INDUSTRIAL', 'Industrial'),
            ('RURAL', 'Rural'),
        ],
        default='RESIDENCIAL'
    )
    
    # Metadados
    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Cliente"
        verbose_name_plural = "Clientes"
        ordering = ['-criado_em']
    
    def __str__(self):
        return f"{self.nome} - {self.tamanho_sistema}kW"
    
    @property
    def endereco_completo(self):
        return f"{self.endereco}, {self.cidade} - {self.estado}, {self.cep}"

class SistemaSolar(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    cliente = models.ForeignKey(Cliente, on_delete=models.CASCADE, related_name='sistemas')
    
    # Especificações
    marca_inversor = models.CharField(max_length=100)
    modelo_inversor = models.CharField(max_length=100)
    potencia_inversor = models.DecimalField(max_digits=6, decimal_places=2)  # kW
    
    marca_painel = models.CharField(max_length=100)
    modelo_painel = models.CharField(max_length=100)
    quantidade_paineis = models.IntegerField()
    potencia_painel = models.DecimalField(max_digits=6, decimal_places=2)  # W
    
    # Localização
    orientacao = models.CharField(
        max_length=20,
        choices=[
            ('NORTE', 'Norte'),
            ('NORDESTE', 'Nordeste'),
            ('LESTE', 'Leste'),
            ('SUDESTE', 'Sudeste'),
            ('SUL', 'Sul'),
            ('SUDOESTE', 'Sudoeste'),
            ('OESTE', 'Oeste'),
            ('NOROESTE', 'Noroeste'),
        ]
    )
    inclinacao = models.IntegerField()  # graus
    
    # Garantias
    garantia_inversor = models.IntegerField()  # anos
    garantia_paineis = models.IntegerField()  # anos
    
    criado_em = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = "Sistema Solar"
        verbose_name_plural = "Sistemas Solares"
    
    def __str__(self):
        return f"Sistema de {self.cliente.nome}"
    
    @property
    def potencia_total_paineis(self):
        return (self.quantidade_paineis * self.potencia_painel) / 1000  # kW

class ProducaoMensal(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    sistema = models.ForeignKey(SistemaSolar, on_delete=models.CASCADE, related_name='producoes')
    mes = models.IntegerField()
    ano = models.IntegerField()
    producao_kwh = models.DecimalField(max_digits=10, decimal_places=2)
    irradiacao_media = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    
    class Meta:
        unique_together = ['sistema', 'mes', 'ano']
        ordering = ['-ano', '-mes']
    
    def __str__(self):
        return f"{self.mes:02d}/{self.ano} - {self.producao_kwh}kWh"

class Configuracao(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Empresa
    nome_empresa = models.CharField(max_length=200, default="Solar Energy Solutions")
    email_contato = models.EmailField(default="contato@solarenergy.com")
    telefone_contato = models.CharField(max_length=20, default="(11) 99999-9999")
    endereco_empresa = models.TextField(default="Av. Paulista, 1000 - São Paulo/SP")
    cnpj = models.CharField(max_length=18, default="12.345.678/0001-99")
    
    # Financeiro
    taxa_juros = models.DecimalField(max_digits=5, decimal_places=2, default=1.5)  # %
    prazo_maximo = models.IntegerField(default=60)  # meses
    
    # Notificações
    notificacoes_email = models.BooleanField(default=True)
    notificacoes_sms = models.BooleanField(default=False)
    relatorio_automatico = models.BooleanField(default=True)
    
    # Sistema
    tema_escuro = models.BooleanField(default=False)
    
    atualizado_em = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Configuração"
        verbose_name_plural = "Configurações"
    
    def __str__(self):
        return f"Configuração de {self.nome_empresa}"

class Relatorio(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tipo = models.CharField(max_length=50)
    periodo_inicio = models.DateField()
    periodo_fim = models.DateField()
    dados = models.JSONField()
    criado_em = models.DateTimeField(auto_now_add=True)
    criado_por = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    
    class Meta:
        ordering = ['-criado_em']
    
    def __str__(self):
        return f"Relatório {self.tipo} - {self.periodo_inicio} a {self.periodo_fim}"