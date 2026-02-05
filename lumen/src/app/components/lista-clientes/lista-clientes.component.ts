import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ClienteSolar } from '../../models/clientes/clientes.component';

@Component({
  selector: 'app-lista-clientes',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './lista-clientes.component.html'
})
export class ListaClientes {
  clientes = input<ClienteSolar[]>([]);
  excluir = output<ClienteSolar>();

  formatarMoeda(valor: number): string {
    return 'R$ ' + valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
}