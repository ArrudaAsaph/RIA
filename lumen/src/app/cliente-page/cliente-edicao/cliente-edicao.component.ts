import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ClienteService } from '../../service/cliente.service';
import { ClienteSolar } from '../../models/clientes/clientes.component';

@Component({
  selector: 'app-cliente-edicao',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './cliente-edicao.component.html'
})
export class ClienteEdicaoComponent implements OnInit {
  cliente: ClienteSolar = this.clienteVazio();
  clienteId: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private clienteService: ClienteService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.clienteId = params['id'];
      this.carregarCliente();
    });
  }

  carregarCliente(): void {
    const clienteExistente = this.clienteService.obterClientePorId(this.clienteId);
    if (clienteExistente) {
      this.cliente = { ...clienteExistente };
    } else {
      this.router.navigate(['/clientes']);
    }
  }

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

  salvar(): void {
    if (this.validarFormulario()) {
      this.clienteService.atualizarCliente(this.cliente);
      this.router.navigate(['/clientes']);
    }
  }

  cancelar(): void {
    this.router.navigate(['/clientes']);
  }

  private validarFormulario(): boolean {
    if (!this.cliente.nome.trim()) {
      alert('Por favor, informe o nome do cliente.');
      return false;
    }
    
    if (!this.cliente.email.trim()) {
      alert('Por favor, informe o email do cliente.');
      return false;
    }
    
    if (this.cliente.tamanhoSistema <= 0) {
      alert('O tamanho do sistema deve ser maior que zero.');
      return false;
    }
    
    if (this.cliente.custoTotal < 0) {
      alert('O custo total não pode ser negativo.');
      return false;
    }
    
    return true;
  }
}