import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ClienteService } from '../../service/cliente.service';

@Component({
  selector: 'app-cliente-inclusao',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './cliente-inclusao.component.html'
})
export class ClienteInclusao {
  private readonly router = inject(Router);
  private readonly clienteService = inject(ClienteService);
  private readonly formBuilder = inject(FormBuilder);

  enviando = signal(false);
  erro = signal('');

  form = this.formBuilder.group({
    nome: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    telefone: ['', [Validators.required, Validators.minLength(10)]],
    endereco: ['', [Validators.required, Validators.minLength(5)]],
    cidade: ['', [Validators.required]],
    estado: ['SP', [Validators.required]],
    cep: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
    tamanhoSistema: [0, [Validators.required, Validators.min(0.1)]],
    custoTotal: [0, [Validators.required, Validators.min(0)]],
    dataInstalacao: [new Date().toISOString().split('T')[0], [Validators.required]],
    tipoSistema: ['RESIDENCIAL', [Validators.required]],
    ativo: [true]
  });

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

  salvar(): void {
    if (this.form.invalid) {
      this.erro.set('Por favor, preencha todos os campos corretamente.');
      return;
    }

    this.enviando.set(true);
    this.erro.set('');

    const cliente = this.form.getRawValue() as any;
    delete cliente.id;

    this.clienteService.adicionarCliente(cliente).subscribe({
      next: () => {
        this.enviando.set(false);
        this.router.navigate(['/clientes']);
      },
      error: (error) => {
        this.enviando.set(false);
        this.erro.set('Erro ao salvar cliente: ' + error.message);
        console.error('Erro:', error);
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/clientes']);
  }
}