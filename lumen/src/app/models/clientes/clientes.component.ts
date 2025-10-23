export interface ClienteSolar {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  endereco: string;
  tamanhoSistema: number; // kW
  dataInstalacao: Date;
  custoTotal: number;
  economiaMensal: number;
  ativo: boolean;
  tipoSistema: string;
}