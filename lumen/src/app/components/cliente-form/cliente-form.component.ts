import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClienteSolar } from '../../models/clientes/clientes.component';

@Component({
  selector: 'app-cliente-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cliente-form.component.html'
})
export class ClienteFormComponent {
  @Input() cliente: ClienteSolar = this.clienteVazio();
  @Input() editando: boolean = false;
  @Input() mostrarDialog: boolean = false;
  @Output() salvar = new EventEmitter<ClienteSolar>();
  @Output() cancelar = new EventEmitter<void>();

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

  onSalvar() {
    this.salvar.emit(this.cliente);
  }

  onCancelar() {
    this.cancelar.emit();
  }
}