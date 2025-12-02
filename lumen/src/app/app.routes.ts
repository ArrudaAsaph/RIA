import { Routes } from '@angular/router';
import { ListaClientesPage } from './cliente-page/cliente-page.component';
import { ClienteDetalheComponent } from './cliente-page/cliente-detalhe/cliente-detalhe.component';
import { ClienteEdicaoComponent } from './cliente-page/cliente-edicao/cliente-edicao.component';
import { ClienteInclusaoComponent } from './cliente-page/cliente-inclusao/cliente-inclusao.component';

export const routes: Routes = [
  { path: '', redirectTo: '/clientes', pathMatch: 'full' },
  { path: 'clientes', component: ListaClientesPage },
  { path: 'clientes/novo', component: ClienteInclusaoComponent },
  { path: 'clientes/detalhe/:id', component: ClienteDetalheComponent },
  { path: 'clientes/editar/:id', component: ClienteEdicaoComponent },
  { path: '**', redirectTo: '/clientes' }
];