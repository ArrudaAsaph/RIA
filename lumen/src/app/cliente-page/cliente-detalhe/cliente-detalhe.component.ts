import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ClienteService } from '../../service/cliente.service';
import { ClienteSolar } from '../../models/clientes/clientes.component';

@Component({
  selector: 'app-cliente-detalhe',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cliente-detalhe.component.html'
})
export class ClienteDetalheComponent {

  private route = inject(ActivatedRoute);
  private clienteService = inject(ClienteService);

  cliente = signal<ClienteSolar | null>(null);
  carregando = signal(true);
  erro = signal('');

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.carregarCliente(id);
    } else {
      this.erro.set('ID do cliente não informado.');
      this.carregando.set(false);
    }
  }

  private carregarCliente(id: string): void {
    this.carregando.set(true);
    this.erro.set('');

    this.clienteService.obterClientePorId(id).subscribe({
      next: cliente => {
        this.cliente.set(cliente);
        this.carregando.set(false);
      },
      error: err => {
        this.erro.set('Erro ao carregar cliente.');
        this.carregando.set(false);
        console.error(err);
      }
    });
  }

  formatarMoeda(valor: number): string {
    return 'R$ ' + valor.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  formatarData(data: string): string {
    return new Date(data).toLocaleDateString('pt-BR');
  }
}
