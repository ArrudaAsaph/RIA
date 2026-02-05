import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClienteSolar } from '../../models/clientes/clientes.component';

@Component({
  selector: 'app-estatisticas-clientes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cliente-estatistcas.component.html'
})
export class Estatisticas {
  clientes = input<ClienteSolar[]>([]);

  getClientesAtivos(): number {
    return this.clientes().filter(cliente => cliente.ativo).length;
  }

  getCapacidadeTotal(): number {
    return this.clientes().reduce((total, cliente) => total + cliente.tamanhoSistema, 0);
  }

  getInvestimentoTotal(): number {
    return this.clientes().reduce((total, cliente) => total + cliente.custoTotal, 0);
  }

  formatarMoeda(valor: number): string {
    return 'R$ ' + valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
}