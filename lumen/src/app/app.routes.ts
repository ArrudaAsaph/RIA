import { Routes } from '@angular/router';
import { ListaClientesPage } from './cliente-page/cliente-page.component';
import { ClienteDetalheComponent } from './cliente-page/cliente-detalhe/cliente-detalhe.component';
import { ClienteEdicao } from './cliente-page/cliente-edicao/cliente-edicao.component';
import { ClienteInclusao } from './cliente-page/cliente-inclusao/cliente-inclusao.component';
import { RelatoriosPage } from './cliente-page/relatorios-page/relatorios-page.component';
import { ConfiguracoesPage } from './cliente-page/configuracoes-page/configuracoes-page.component';
import { Login } from './components/login/login.component';
import { Register } from './components/register/register.component';
import { AuthGuard } from './service/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  
  // Rotas protegidas
  { 
    path: 'clientes', 
    component: ListaClientesPage,
    canActivate: [AuthGuard]
  },
  { 
    path: 'clientes/novo', 
    component: ClienteInclusao,
    canActivate: [AuthGuard]
  },
  { 
    path: 'clientes/detalhe/:id', 
    component: ClienteDetalheComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'clientes/editar/:id', 
    component: ClienteEdicao,
    canActivate: [AuthGuard]
  },
  { 
    path: 'relatorios', 
    component: RelatoriosPage,
    canActivate: [AuthGuard]
  },
  { 
    path: 'configuracoes', 
    component: ConfiguracoesPage,
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: '/login' }
];