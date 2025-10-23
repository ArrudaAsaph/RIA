import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClienteSolar } from '../../models/clientes/clientes.component';

@Component({
  selector: 'app-lista-clientes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lista-clientes.component.html'
})
export class ListaClientesComponent {
  
  clientes: ClienteSolar[] = [
    {
      id: '1',
      nome: 'João Silva',
      email: 'joao@email.com',
      telefone: '(11) 99999-9999',
      endereco: 'Rua das Flores, 123',
      tamanhoSistema: 5.2,
      custoTotal: 25000,
      ativo: true
    }
  ];

  clienteSelecionado: ClienteSolar = this.clienteVazio();
  mostrarDialog: boolean = false;
  editando: boolean = false;

  clienteVazio(): ClienteSolar {
    return {
      id: '',
      nome: '',
      email: '',
      telefone: '',
      endereco: '',
      tamanhoSistema: 0,
      custoTotal: 0,
      ativo: true
    };
  }

  novoCliente() {
    console.log('Botão novo cliente clicado!');
    this.clienteSelecionado = this.clienteVazio();
    this.editando = false;
    this.mostrarDialog = true;
  }

  editarCliente(cliente: ClienteSolar) {
    this.clienteSelecionado = { ...cliente };
    this.editando = true;
    this.mostrarDialog = true;
  }

  salvarCliente() {
    console.log('Salvando cliente:', this.clienteSelecionado);
    
    if (this.editando) {
      const index = this.clientes.findIndex(c => c.id === this.clienteSelecionado.id);
      if (index !== -1) {
        this.clientes[index] = { ...this.clienteSelecionado };
      }
    } else {
      this.clienteSelecionado.id = Date.now().toString();
      this.clientes.push({ ...this.clienteSelecionado });
    }
    
    this.mostrarDialog = false;
  }

  excluirCliente(cliente: ClienteSolar) {
    if (confirm(`Tem certeza que deseja excluir ${cliente.nome}?`)) {
      this.clientes = this.clientes.filter(c => c.id !== cliente.id);
    }
  }

  formatarMoeda(valor: number): string {
    return 'R$ ' + valor.toLocaleString('pt-BR');
  }

  getClientesAtivos(): number {
    let count = 0;
    for (let cliente of this.clientes) {
      if (cliente.ativo) count++;
    }
    return count;
  }

  getCapacidadeTotal(): number {
    let total = 0;
    for (let cliente of this.clientes) {
      total += cliente.tamanhoSistema;
    }
    return total;
  }

  getInvestimentoTotal(): number {
    let total = 0;
    for (let cliente of this.clientes) {
      total += cliente.custoTotal;
    }
    return total;
  }
}