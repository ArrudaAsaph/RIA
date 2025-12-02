import { Injectable } from '@angular/core';
import { ClienteSolar } from '../models/clientes/clientes.component';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private clientes: ClienteSolar[] = [
    {
      id: '1',
      nome: 'João Silva',
      email: 'joao@email.com',
      telefone: '(11) 99999-9999',
      endereco: 'Rua A, 123 - São Paulo/SP',
      tamanhoSistema: 5.5,
      custoTotal: 25000,
      ativo: true
    },
    {
      id: '2',
      nome: 'Maria Santos',
      email: 'maria@email.com',
      telefone: '(11) 88888-8888',
      endereco: 'Rua B, 456 - Rio de Janeiro/RJ',
      tamanhoSistema: 7.2,
      custoTotal: 32000,
      ativo: true
    },
    {
      id: '3',
      nome: 'Pedro Oliveira',
      email: 'pedro@email.com',
      telefone: '(11) 77777-7777',
      endereco: 'Rua C, 789 - Belo Horizonte/MG',
      tamanhoSistema: 3.0,
      custoTotal: 15000,
      ativo: false
    }
  ];

  constructor() {}

  listarClientes(): ClienteSolar[] {
    return [...this.clientes];
  }

  obterClientePorId(id: string): ClienteSolar | undefined {
    const cliente = this.clientes.find(c => c.id === id);
    return cliente ? { ...cliente } : undefined;
  }

  adicionarCliente(cliente: ClienteSolar): ClienteSolar {
    const novoCliente = {
      ...cliente,
      id: this.gerarIdUnico()
    };
    this.clientes.push(novoCliente);
    return novoCliente;
  }

  atualizarCliente(clienteAtualizado: ClienteSolar): boolean {
    const index = this.clientes.findIndex(c => c.id === clienteAtualizado.id);
    if (index !== -1) {
      this.clientes[index] = { ...clienteAtualizado };
      return true;
    }
    return false;
  }

  removerCliente(id: string): boolean {
    const index = this.clientes.findIndex(c => c.id === id);
    if (index !== -1) {
      this.clientes.splice(index, 1);
      return true;
    }
    return false;
  }

  private gerarIdUnico(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}