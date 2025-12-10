import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ClienteService } from '../../service/cliente.service';
import { ClienteSolar } from '../../models/clientes/clientes.component';

interface RelatorioMensal {
  mes: string;
  novosClientes: number;
  clientesAtivos: number;
  capacidadeAdicionada: number;
  receita: number;
}

interface RelatorioCidade {
  cidade: string;
  quantidade: number;
  capacidade: number;
  investimento: number;
}

@Component({
  selector: 'app-relatorios-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './relatorios-page.component.html'
})
export class RelatoriosPage implements OnInit {
  clientes: ClienteSolar[] = [];
  carregando: boolean = true;
  erro: string = '';
  
  relatorioMensal: RelatorioMensal[] = [
    { mes: 'Janeiro', novosClientes: 5, clientesAtivos: 45, capacidadeAdicionada: 25.5, receita: 125000 },
    { mes: 'Fevereiro', novosClientes: 8, clientesAtivos: 50, capacidadeAdicionada: 38.2, receita: 150000 },
    { mes: 'Março', novosClientes: 12, clientesAtivos: 58, capacidadeAdicionada: 42.7, receita: 180000 },
    { mes: 'Abril', novosClientes: 7, clientesAtivos: 62, capacidadeAdicionada: 35.8, receita: 165000 },
    { mes: 'Maio', novosClientes: 10, clientesAtivos: 68, capacidadeAdicionada: 48.3, receita: 195000 },
    { mes: 'Junho', novosClientes: 15, clientesAtivos: 75, capacidadeAdicionada: 52.6, receita: 220000 }
  ];

  relatorioCidades: RelatorioCidade[] = [
    { cidade: 'São Paulo', quantidade: 25, capacidade: 120.5, investimento: 550000 },
    { cidade: 'Rio de Janeiro', quantidade: 18, capacidade: 85.2, investimento: 380000 },
    { cidade: 'Belo Horizonte', quantidade: 12, capacidade: 65.8, investimento: 295000 },
    { cidade: 'Curitiba', quantidade: 8, capacidade: 42.3, investimento: 190000 },
    { cidade: 'Porto Alegre', quantidade: 7, capacidade: 38.7, investimento: 175000 }
  ];

  constructor(private clienteService: ClienteService) {}

  ngOnInit(): void {
    this.carregarDados();
  }

  carregarDados(): void {
    this.carregando = true;
    this.erro = '';
    
    this.clienteService.listarClientes().subscribe({
      next: (clientes) => {
        this.clientes = clientes;
        this.carregando = false;
      },
      error: (error) => {
        this.erro = 'Erro ao carregar dados: ' + error.message;
        this.carregando = false;
        console.error('Erro:', error);
      }
    });
  }

  getEstatisticas() {
    const totalClientes = this.clientes.length;
    const clientesAtivos = this.clientes.filter(c => c.ativo).length;
    const capacidadeTotal = this.clientes.reduce((sum, c) => sum + c.tamanhoSistema, 0);
    const investimentoTotal = this.clientes.reduce((sum, c) => sum + c.custoTotal, 0);
    const mediaSistema = totalClientes > 0 ? capacidadeTotal / totalClientes : 0;
    const mediaInvestimento = totalClientes > 0 ? investimentoTotal / totalClientes : 0;

    return {
      totalClientes,
      clientesAtivos,
      clientesInativos: totalClientes - clientesAtivos,
      capacidadeTotal: parseFloat(capacidadeTotal.toFixed(2)),
      investimentoTotal,
      mediaSistema: parseFloat(mediaSistema.toFixed(2)),
      mediaInvestimento: parseFloat(mediaInvestimento.toFixed(2))
    };
  }

  formatarMoeda(valor: number): string {
    return 'R$ ' + valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  getCrescimento(index: number): number {
    if (index === 0) return 0;
    const anterior = this.relatorioMensal[index - 1].receita;
    const atual = this.relatorioMensal[index].receita;
    return Math.round(((atual - anterior) / anterior) * 100);
  }

  getQuantidadePorTamanho(min: number, max: number): number {
    return this.clientes.filter(c => c.tamanhoSistema >= min && c.tamanhoSistema <= max).length;
  }

  getClientesAtivosPercentual(): number {
    const total = this.clientes.length;
    const ativos = this.clientes.filter(c => c.ativo).length;
    return total > 0 ? Math.round((ativos / total) * 100) : 0;
  }

  getCrescimentoMensal(): number {
    if (this.relatorioMensal.length < 2) return 0;
    const primeiro = this.relatorioMensal[0].novosClientes;
    const ultimo = this.relatorioMensal[this.relatorioMensal.length - 1].novosClientes;
    return Math.round(((ultimo - primeiro) / primeiro) * 100);
  }

  getTotalClientesCidades(): number {
    return this.relatorioCidades.reduce((total, cidade) => total + cidade.quantidade, 0);
  }

  gerarRelatorioPDF(): void {
    alert('Relatório PDF gerado com sucesso!');
  }

  exportarParaExcel(): void {
    alert('Dados exportados para Excel com sucesso!');
  }
}