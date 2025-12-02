import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

interface ConfiguracaoSistema {
  nomeEmpresa: string;
  emailContato: string;
  telefoneContato: string;
  enderecoEmpresa: string;
  cnpj: string;
  taxaJuros: number;
  prazoMaximo: number;
  notificacoesEmail: boolean;
  notificacoesSMS: boolean;
  relatorioAutomatico: boolean;
  temaEscuro: boolean;
}

@Component({
  selector: 'app-configuracoes-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './configuracoes-page.component.html'
})
export class ConfiguracoesPage {
  configuracao: ConfiguracaoSistema = {
    nomeEmpresa: 'Solar Energy Solutions',
    emailContato: 'contato@solar-energy.com.br',
    telefoneContato: '(11) 99999-9999',
    enderecoEmpresa: 'Av. Paulista, 1000 - São Paulo/SP',
    cnpj: '12.345.678/0001-99',
    taxaJuros: 1.5,
    prazoMaximo: 60,
    notificacoesEmail: true,
    notificacoesSMS: false,
    relatorioAutomatico: true,
    temaEscuro: false
  };

  senhaAtual: string = '';
  novaSenha: string = '';
  confirmarSenha: string = '';

  usuarios = [
    { id: 1, nome: 'Administrador', email: 'admin@solar.com', perfil: 'Administrador', ativo: true },
    { id: 2, nome: 'Vendedor 1', email: 'vendedor1@solar.com', perfil: 'Vendedor', ativo: true },
    { id: 3, nome: 'Vendedor 2', email: 'vendedor2@solar.com', perfil: 'Vendedor', ativo: false },
    { id: 4, nome: 'Financeiro', email: 'financeiro@solar.com', perfil: 'Financeiro', ativo: true }
  ];

  perfis = ['Administrador', 'Vendedor', 'Financeiro', 'Suporte'];

  salvarConfiguracoes(): void {
    localStorage.setItem('configuracoes_sistema', JSON.stringify(this.configuracao));
    alert('Configurações salvas com sucesso!');
  }

  alterarSenha(): void {
    if (!this.senhaAtual) {
      alert('Por favor, informe a senha atual.');
      return;
    }

    if (this.novaSenha !== this.confirmarSenha) {
      alert('A nova senha e a confirmação não coincidem.');
      return;
    }

    if (this.novaSenha.length < 6) {
      alert('A nova senha deve ter pelo menos 6 caracteres.');
      return;
    }

    alert('Senha alterada com sucesso!');
    this.senhaAtual = '';
    this.novaSenha = '';
    this.confirmarSenha = '';
  }

  adicionarUsuario(): void {
    alert('Funcionalidade de adicionar usuário em desenvolvimento.');
  }

  exportarDados(): void {
    alert('Dados exportados com sucesso!');
  }

  importarDados(event: any): void {
    const file = event.target.files[0];
    if (file) {
      alert(`Arquivo ${file.name} selecionado para importação.`);
    }
  }

  backupSistema(): void {
    const data = new Date().toISOString().split('T')[0];
    alert(`Backup do sistema gerado com sucesso! Arquivo: backup_${data}.zip`);
  }

  restaurarPadrao(): void {
    if (confirm('Tem certeza que deseja restaurar as configurações padrão? Todas as alterações serão perdidas.')) {
      this.configuracao = {
        nomeEmpresa: 'Solar Energy Solutions',
        emailContato: 'contato@solar-energy.com.br',
        telefoneContato: '(11) 99999-9999',
        enderecoEmpresa: 'Av. Paulista, 1000 - São Paulo/SP',
        cnpj: '12.345.678/0001-99',
        taxaJuros: 1.5,
        prazoMaximo: 60,
        notificacoesEmail: true,
        notificacoesSMS: false,
        relatorioAutomatico: true,
        temaEscuro: false
      };
      alert('Configurações restauradas para o padrão.');
    }
  }
}