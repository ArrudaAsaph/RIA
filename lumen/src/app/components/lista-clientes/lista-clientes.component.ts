import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClienteSolar } from '../../models/clientes/clientes.component';

// Componentes do PrimeNG
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { TagModule } from 'primeng/tag';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-lista-clientes',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    InputNumberModule,
    CalendarModule,
    CheckboxModule,
    DropdownModule,
    TagModule,
    ConfirmDialogModule,
    ToastModule,
    CardModule
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './lista-clientes.component.html'
})
export class ListaClientesComponent implements OnInit {
  
  // Lista de clientes - simulando um banco de dados
  clientes: ClienteSolar[] = [
    {
      id: '1',
      nome: 'João Silva',
      email: 'joao.silva@email.com',
      telefone: '(11) 99999-9999',
      endereco: 'Rua das Flores, 123 - São Paulo, SP',
      tamanhoSistema: 5.2,
      dataInstalacao: new Date('2024-01-15'),
      custoTotal: 25000,
      economiaMensal: 450,
      ativo: true,
      tipoSistema: 'Grid-Tie'
    },
    {
      id: '2',
      nome: 'Maria Santos',
      email: 'maria.santos@email.com',
      telefone: '(11) 88888-8888',
      endereco: 'Av. Paulista, 1000 - São Paulo, SP',
      tamanhoSistema: 7.5,
      dataInstalacao: new Date('2024-02-20'),
      custoTotal: 35000,
      economiaMensal: 650,
      ativo: true,
      tipoSistema: 'Híbrido'
    },
    {
      id: '3',
      nome: 'Carlos Oliveira',
      email: 'carlos.oliveira@email.com',
      telefone: '(11) 77777-7777',
      endereco: 'Rua Augusta, 500 - São Paulo, SP',
      tamanhoSistema: 3.0,
      dataInstalacao: new Date('2024-03-10'),
      custoTotal: 18000,
      economiaMensal: 280,
      ativo: false,
      tipoSistema: 'Grid-Tie'
    }
  ];

  clienteSelecionado: ClienteSolar = this.clienteVazio();
  mostrarDialog: boolean = false;
  modoEdicao: boolean = false;
  visualizandoDetalhes: boolean = false;

  // Opções para dropdowns
  tiposSistema = [
    'Grid-Tie',
    'Híbrido',
    'Off-Grid',
    'Bombeamento Solar'
  ];

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    // Dados já inicializados
  }

  clienteVazio(): ClienteSolar {
    return {
      id: '',
      nome: '',
      email: '',
      telefone: '',
      endereco: '',
      tamanhoSistema: 0,
      dataInstalacao: new Date(),
      custoTotal: 0,
      economiaMensal: 0,
      ativo: true,
      tipoSistema: 'Grid-Tie'
    };
  }

  // Abrir modal para novo cliente
  novoCliente() {
    this.clienteSelecionado = this.clienteVazio();
    this.modoEdicao = false;
    this.visualizandoDetalhes = false;
    this.mostrarDialog = true;
  }

  // Abrir modal para editar cliente
  editarCliente(cliente: ClienteSolar) {
    this.clienteSelecionado = { ...cliente };
    this.modoEdicao = true;
    this.visualizandoDetalhes = false;
    this.mostrarDialog = true;
  }

  // Visualizar detalhes do cliente
  verDetalhes(cliente: ClienteSolar) {
    this.clienteSelecionado = { ...cliente };
    this.modoEdicao = false;
    this.visualizandoDetalhes = true;
    this.mostrarDialog = true;
  }

  // Salvar cliente (novo ou edição)
  salvarCliente() {
    if (this.modoEdicao) {
      // Atualizar cliente existente
      const index = this.clientes.findIndex(c => c.id === this.clienteSelecionado.id);
      if (index !== -1) {
        this.clientes[index] = { ...this.clienteSelecionado };
      }
      this.mostrarMensagem('success', 'Sucesso!', 'Cliente atualizado com sucesso!');
    } else {
      // Adicionar novo cliente
      this.clienteSelecionado.id = Date.now().toString();
      this.clientes.push({ ...this.clienteSelecionado });
      this.mostrarMensagem('success', 'Sucesso!', 'Cliente adicionado com sucesso!');
    }
    
    this.mostrarDialog = false;
  }

  // Confirmar exclusão
  confirmarExclusao(cliente: ClienteSolar) {
    this.confirmationService.confirm({
      message: `Tem certeza que deseja excluir o cliente ${cliente.nome}?`,
      header: 'Confirmar Exclusão',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.excluirCliente(cliente.id);
      }
    });
  }

  // Excluir cliente
  private excluirCliente(id: string) {
    this.clientes = this.clientes.filter(import { Component } from '@angular/core';

@Component({
  selector: 'app-lista-clientes',
  imports: [],
  templateUrl: './lista-clientes.component.html',
  styleUrl: './lista-clientes.component.css'
})
export class ListaClientesComponent {

}
c => c.id !== id);
    this.mostrarMensagem('success', 'Sucesso!', 'Cliente excluído com sucesso!');
  }

  // Mostrar mensagens toast
  private mostrarMensagem(severity: string, summary: string, detail: string) {
    this.messageService.add({
      severity: severity,
      summary: summary,
      detail: detail
    });
  }

  // Calcular payback aproximado
  calcularPayback(custoTotal: number, economiaMensal: number): number {
    if (economiaMensal === 0) return 0;
    return Math.round(custoTotal / economiaMensal / 12);
  }

  // Formatar moeda
  formatarMoeda(valor: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  }
}