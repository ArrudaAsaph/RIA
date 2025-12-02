import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ClienteSolar } from '../models/clientes/clientes.component';
import { ClienteService } from '../service/cliente.service';
import { EstatisticasClientesComponent } from '../components/cliente-estatistcas/cliente-estatistcas.component';
import { ListaClientesComponent } from '../components/lista-clientes/lista-clientes.component';

@Component({
  selector: 'app-lista-clientes-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    EstatisticasClientesComponent,
    ListaClientesComponent
  ],
  templateUrl: './cliente-page.component.html'
})
export class ListaClientesPage implements OnInit {
  clientes: ClienteSolar[] = [];

  constructor(private clienteService: ClienteService) {}

  ngOnInit(): void {
    this.carregarClientes();
  }

  carregarClientes(): void {
    this.clientes = this.clienteService.listarClientes();
  }

  excluirCliente(cliente: ClienteSolar): void {
    if (confirm(`Deseja realmente excluir o cliente ${cliente.nome}?`)) {
      this.clienteService.removerCliente(cliente.id);
      this.carregarClientes();
    }
  }
}