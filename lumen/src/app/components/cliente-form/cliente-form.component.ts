import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClienteSolar } from '../../models/clientes/clientes.component';

@Component({
  selector: 'app-cliente-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cliente-form.component.html'
})
export class ClienteForm {
  cliente = input<ClienteSolar>(clienteVazio());
  editando = input<boolean>(false);
  mostrarDialog = input<boolean>(false);
  
  salvar = output<ClienteSolar>();
  cancelar = output<void>();

  onSalvar() {
    this.salvar.emit(this.cliente());
  }

  onCancelar() {
    this.cancelar.emit();
  }
}

function clienteVazio(): ClienteSolar {
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