import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClienteSolar } from '../../models/clientes/clientes.component';

@Component({
  selector: 'app-lista-clientes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lista-clientes.component.html'
})
export class ListaClientesComponent {
  @Input() clientes: ClienteSolar[] = [];
  @Output() editar = new EventEmitter<ClienteSolar>();
  @Output() excluir = new EventEmitter<ClienteSolar>();

  formatarMoeda(valor: number): string {
    return 'R$ ' + valor.toLocaleString('pt-BR');
  }
}