import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpBaseService } from './http-base.service';
import { ClienteSolar } from '../models/clientes/clientes.component';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private endpoint = 'clientes';

  constructor(private httpBase: HttpBaseService) {}

  listarClientes(): Observable<ClienteSolar[]> {
    return this.httpBase.get<ClienteSolar[]>(this.endpoint).pipe(
      map(clientes => {
        console.log('Clientes recebidos do backend:', clientes);
        return clientes.map(cliente => this.converterParaFrontend(cliente));
      })
    );
  }

  listarClientesComTotal(): Observable<{clientes: ClienteSolar[], total: number}> {
    return this.httpBase.get<ClienteSolar[]>(this.endpoint).pipe(
      map(clientes => {
        const clientesConvertidos = clientes.map(cliente => this.converterParaFrontend(cliente));
        return {
          clientes: clientesConvertidos,
          total: clientesConvertidos.length
        };
      })
    );
  }

  obterClientePorId(id: string): Observable<ClienteSolar> {
    return this.httpBase.get<ClienteSolar>(`${this.endpoint}/${id}`).pipe(
      map(cliente => this.converterParaFrontend(cliente))
    );
  }

  adicionarCliente(cliente: ClienteSolar): Observable<ClienteSolar> {
    const clienteBackend = this.converterParaBackend(cliente);
    return this.httpBase.post<ClienteSolar>(this.endpoint, clienteBackend).pipe(
      map(cliente => this.converterParaFrontend(cliente))
    );
  }

  atualizarCliente(cliente: ClienteSolar): Observable<ClienteSolar> {
    const clienteBackend = this.converterParaBackend(cliente);
    return this.httpBase.put<ClienteSolar>(this.endpoint, cliente.id, clienteBackend).pipe(
      map(cliente => this.converterParaFrontend(cliente))
    );
  }

  removerCliente(id: string): Observable<any> {
    return this.httpBase.delete(this.endpoint, id);
  }

  private converterParaBackend(cliente: ClienteSolar): any {
    return {
      nome: cliente.nome,
      email: cliente.email,
      telefone: cliente.telefone,
      endereco: cliente.endereco,
      cidade: cliente.cidade || 'São Paulo',
      estado: cliente.estado || 'SP',
      cep: cliente.cep || '00000-000',
      tamanho_sistema: cliente.tamanhoSistema,
      custo_total: cliente.custoTotal,
      data_instalacao: cliente.dataInstalacao || new Date().toISOString().split('T')[0],
      ativo: cliente.ativo,
      tipo_sistema: cliente.tipoSistema || 'RESIDENCIAL'
    };
  }

  private converterParaFrontend(cliente: any): ClienteSolar {
    console.log('Convertendo cliente:', cliente);
    
    return {
      id: cliente.id,
      nome: cliente.nome,
      email: cliente.email,
      telefone: cliente.telefone,
      endereco: cliente.endereco,
      cidade: cliente.cidade,
      estado: cliente.estado,
      cep: cliente.cep,
      tamanhoSistema: parseFloat(cliente.tamanho_sistema),
      custoTotal: parseFloat(cliente.custo_total),
      dataInstalacao: cliente.data_instalacao,
      ativo: cliente.ativo,
      tipoSistema: cliente.tipo_sistema,
      criadoEm: cliente.criado_em,
      atualizadoEm: cliente.atualizado_em
    };
  }
}