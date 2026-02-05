import { Component, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ClienteSolar } from '../models/clientes/clientes.component';
import { ClienteService } from '../service/cliente.service';
import { Estatisticas } from '../components/cliente-estatistcas/cliente-estatistcas.component';
import { ListaClientes } from '../components/lista-clientes/lista-clientes.component';

@Component({
  selector: 'app-lista-clientes-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    Estatisticas,
    ListaClientes
  ],
  templateUrl: './cliente-page.component.html'
})
export class ListaClientesPage {
  private readonly clienteService = inject(ClienteService);

  clientes: ClienteSolar[] = [];
  carregando: boolean = true;
  erro: string = '';

  constructor() {
    effect(() => {
      this.carregarClientes();
    });
  }

  carregarClientes(): void {
    this.carregando = true;
    this.erro = '';
    
    this.clienteService.listarClientes().subscribe({
      next: (clientes) => {
        console.log('Clientes carregados:', clientes);
        this.clientes = clientes;
        this.carregando = false;
      },
      error: (error) => {
        this.erro = 'Erro ao carregar clientes: ' + error.message;
        this.carregando = false;
        console.error('Erro completo:', error);
      }
    });
  }

  excluirCliente(cliente: ClienteSolar): void {
    if (confirm(`Deseja realmente excluir o cliente ${cliente.nome}?`)) {
      this.clienteService.removerCliente(cliente.id).subscribe({
        next: () => {
          this.carregarClientes();
        },
        error: (error) => {
          alert('Erro ao excluir cliente: ' + error.message);
        }
      });
    }
  }
}