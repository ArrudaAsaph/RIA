import { Routes } from '@angular/router';
import { ListaClientesPage } from './cliente-page/cliente-page.component';
import { ClienteDetalheComponent } from './cliente-page/cliente-detalhe/cliente-detalhe.component';
import { ClienteEdicaoComponent } from './cliente-page/cliente-edicao/cliente-edicao.component';
import { ClienteInclusaoComponent } from './cliente-page/cliente-inclusao/cliente-inclusao.component';
import { RelatoriosPage } from './cliente-page/relatorios-page/relatorios-page.component';
import { ConfiguracoesPage } from './cliente-page/configuracoes-page/configuracoes-page.component';

export const routes: Routes = [
  { path: '', redirectTo: '/clientes', pathMatch: 'full' },
  { path: 'clientes', component: ListaClientesPage },
  { path: 'clientes/novo', component: ClienteInclusaoComponent },
  { path: 'clientes/detalhe/:id', component: ClienteDetalheComponent },
  { path: 'clientes/editar/:id', component: ClienteEdicaoComponent },
  { path: 'relatorios', component: RelatoriosPage },
  { path: 'configuracoes', component: ConfiguracoesPage },
  { path: '**', redirectTo: '/clientes' }
];