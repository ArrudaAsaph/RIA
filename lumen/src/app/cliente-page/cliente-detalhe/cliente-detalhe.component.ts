import { Component, OnInit } from '@angular/core';
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
export class ClienteDetalheComponent implements OnInit {
  cliente: ClienteSolar | null = null;
  clienteId: string = '';
  carregando: boolean = true;
  erro: string = '';

  constructor(
    private route: ActivatedRoute,
    private clienteService: ClienteService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.clienteId = params['id'];
      this.carregarCliente();
    });
  }

  carregarCliente(): void {
    this.carregando = true;
    this.erro = '';
    
    this.clienteService.obterClientePorId(this.clienteId).subscribe({
      next: (cliente) => {
        this.cliente = cliente;
        this.carregando = false;
      },
      error: (error) => {
        this.erro = 'Erro ao carregar cliente: ' + error.message;
        this.carregando = false;
        console.error('Erro:', error);
      }
    });
  }

  formatarMoeda(valor: number): string {
    return 'R$ ' + valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  formatarData(data: string): string {
    return new Date(data).toLocaleDateString('pt-BR');
  }
}