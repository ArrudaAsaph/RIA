import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClienteSolar } from '../models/clientes/clientes.component';
import { ListaClientesComponent } from '../components/lista-clientes/lista-clientes.component';
import { ClienteFormComponent } from '../components/cliente-form/cliente-form.component';
import { EstatisticasClientesComponent } from '../components/cliente-estatistcas/cliente-estatistcas.component';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [
    CommonModule, 
    ListaClientesComponent, 
    ClienteFormComponent, 
    EstatisticasClientesComponent
  ],
  templateUrl: './cliente-page.component.html'
})
export class ListaClientesPage {
  
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
    this.clienteSelecionado = this.clienteVazio();
    this.editando = false;
    this.mostrarDialog = true;
  }

  editarCliente(cliente: ClienteSolar) {
    this.clienteSelecionado = { ...cliente };
    this.editando = true;
    this.mostrarDialog = true;
  }

  salvarCliente(cliente: ClienteSolar) {
    if (this.editando) {
      const index = this.clientes.findIndex(c => c.id === cliente.id);
      if (index !== -1) {
        this.clientes[index] = { ...cliente };
      }
    } else {
      cliente.id = Date.now().toString();
      this.clientes.push({ ...cliente });
    }
    
    this.mostrarDialog = false;
  }

  excluirCliente(cliente: ClienteSolar) {
    if (confirm(`Tem certeza que deseja excluir ${cliente.nome}?`)) {
      this.clientes = this.clientes.filter(c => c.id !== cliente.id);
    }
  }

  fecharDialog() {
    this.mostrarDialog = false;
  }
}