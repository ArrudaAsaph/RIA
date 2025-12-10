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
  estadosBrasil = [
    { sigla: 'AC', nome: 'Acre' }, { sigla: 'AL', nome: 'Alagoas' }, { sigla: 'AP', nome: 'Amapá' },
    { sigla: 'AM', nome: 'Amazonas' }, { sigla: 'BA', nome: 'Bahia' }, { sigla: 'CE', nome: 'Ceará' },
    { sigla: 'DF', nome: 'Distrito Federal' }, { sigla: 'ES', nome: 'Espírito Santo' },
    { sigla: 'GO', nome: 'Goiás' }, { sigla: 'MA', nome: 'Maranhão' }, { sigla: 'MT', nome: 'Mato Grosso' },
    { sigla: 'MS', nome: 'Mato Grosso do Sul' }, { sigla: 'MG', nome: 'Minas Gerais' }, { sigla: 'PA', nome: 'Pará' },
    { sigla: 'PB', nome: 'Paraíba' }, { sigla: 'PR', nome: 'Paraná' }, { sigla: 'PE', nome: 'Pernambuco' },
    { sigla: 'PI', nome: 'Piauí' }, { sigla: 'RJ', nome: 'Rio de Janeiro' }, { sigla: 'RN', nome: 'Rio Grande do Norte' },
    { sigla: 'RS', nome: 'Rio Grande do Sul' }, { sigla: 'RO', nome: 'Rondônia' }, { sigla: 'RR', nome: 'Roraima' },
    { sigla: 'SC', nome: 'Santa Catarina' }, { sigla: 'SP', nome: 'São Paulo' }, { sigla: 'SE', nome: 'Sergipe' },
    { sigla: 'TO', nome: 'Tocantins' }
  ];
  tiposSistema = [
    { valor: 'RESIDENCIAL', label: 'Residencial' },
    { valor: 'COMERCIAL', label: 'Comercial' },
    { valor: 'INDUSTRIAL', label: 'Industrial' },
    { valor: 'RURAL', label: 'Rural' }
  ];
  carregando: boolean = true;
  enviando: boolean = false;
  erro: string = '';

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
        this.router.navigate(['/clientes']);
      }
    });
  }

  clienteVazio(): ClienteSolar {
    const hoje = new Date().toISOString().split('T')[0];
    
    return {
      id: '',
      nome: '',
      email: '',
      telefone: '',
      endereco: '',
      cidade: '',
      estado: 'SP',
      cep: '',
      tamanhoSistema: 0,
      custoTotal: 0,
      dataInstalacao: hoje,
      ativo: true,
      tipoSistema: 'RESIDENCIAL'
    };
  }

  salvar(): void {
    if (!this.validarFormulario()) {
      return;
    }

    this.enviando = true;
    this.erro = '';

    this.clienteService.atualizarCliente(this.cliente).subscribe({
      next: (clienteAtualizado) => {
        this.enviando = false;
        this.router.navigate(['/clientes']);
      },
      error: (error) => {
        this.enviando = false;
        this.erro = 'Erro ao atualizar cliente: ' + error.message;
        console.error('Erro:', error);
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/clientes']);
  }

  private validarFormulario(): boolean {
    this.erro = '';

    if (!this.cliente.nome?.trim()) {
      this.erro = 'Por favor, informe o nome do cliente.';
      return false;
    }
    
    if (!this.cliente.email?.trim()) {
      this.erro = 'Por favor, informe o email do cliente.';
      return false;
    }
    
    if (!this.cliente.telefone?.trim()) {
      this.erro = 'Por favor, informe o telefone do cliente.';
      return false;
    }
    
    if (!this.cliente.endereco?.trim()) {
      this.erro = 'Por favor, informe o endereço do cliente.';
      return false;
    }
    
    if (!this.cliente.cidade?.trim()) {
      this.erro = 'Por favor, informe a cidade do cliente.';
      return false;
    }
    
    if (!this.cliente.estado) {
      this.erro = 'Por favor, selecione o estado do cliente.';
      return false;
    }
    
    if (this.cliente.tamanhoSistema <= 0) {
      this.erro = 'O tamanho do sistema deve ser maior que zero.';
      return false;
    }
    
    if (this.cliente.custoTotal < 0) {
      this.erro = 'O custo total não pode ser negativo.';
      return false;
    }
    
    if (!this.cliente.dataInstalacao) {
      this.erro = 'Por favor, informe a data de instalação.';
      return false;
    }
    
    return true;
  }
}