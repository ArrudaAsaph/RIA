from django.contrib import admin
from .models import Cliente, SistemaSolar, ProducaoMensal, Configuracao, Relatorio

@admin.register(Cliente)
class ClienteAdmin(admin.ModelAdmin):
    list_display = ['nome', 'email', 'cidade', 'estado', 'tamanho_sistema', 'custo_total', 'ativo']
    list_filter = ['ativo', 'estado', 'tipo_sistema']
    search_fields = ['nome', 'email', 'telefone']
    readonly_fields = ['criado_em', 'atualizado_em']

@admin.register(SistemaSolar)
class SistemaSolarAdmin(admin.ModelAdmin):
    list_display = ['cliente', 'marca_inversor', 'modelo_inversor', 'potencia_inversor']
    list_filter = ['marca_inversor', 'orientacao']
    search_fields = ['cliente__nome', 'modelo_inversor']

@admin.register(ProducaoMensal)
class ProducaoMensalAdmin(admin.ModelAdmin):
    list_display = ['sistema', 'mes', 'ano', 'producao_kwh']
    list_filter = ['ano', 'mes']
    search_fields = ['sistema__cliente__nome']

@admin.register(Configuracao)
class ConfiguracaoAdmin(admin.ModelAdmin):
    list_display = ['nome_empresa', 'email_contato', 'taxa_juros', 'prazo_maximo']
    readonly_fields = ['atualizado_em']

@admin.register(Relatorio)
class RelatorioAdmin(admin.ModelAdmin):
    list_display = ['tipo', 'periodo_inicio', 'periodo_fim', 'criado_em', 'criado_por']
    list_filter = ['tipo', 'criado_por']
    search_fields = ['tipo']
    readonly_fields = ['criado_em']