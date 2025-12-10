export interface ClienteSolar {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
  tamanhoSistema: number;
  custoTotal: number;
  dataInstalacao: string; // Alterado de Date para string para compatibilidade
  ativo: boolean;
  tipoSistema: string;
  criadoEm?: string;
  atualizadoEm?: string;
}

// Interface para o dashboard
export interface DashboardStats {
  totalClientes: number;
  clientesAtivos: number;
  clientesInativos: number;
  capacidadeTotal: number;
  investimentoTotal: number;
  mediaSistema: number;
  mediaInvestimento: number;
}

// Interface para relatório por cidade
export interface RelatorioCidade {
  cidade: string;
  estado: string;
  quantidade: number;
  capacidade: number;
  investimento: number;
}

// Interface para relatório mensal
export interface RelatorioMensal {
  mes: number;
  ano: number;
  novosClientes: number;
  clientesAtivos: number;
  capacidadeAdicionada: number;
  receita: number;
}

// Interface para relatório por tipo de sistema
export interface RelatorioTipoSistema {
  tipoSistema: string;
  quantidade: number;
  capacidadeTotal: number;
  investimentoTotal: number;
}

// Interface para categoria de tamanho
export interface CategoriaTamanho {
  categoria: string;
  quantidade: number;
}