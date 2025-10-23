import { Component } from '@angular/core';
import { ListaClientesComponent } from './components/lista-clientes/lista-clientes.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ListaClientesComponent],
  template: `
    <app-lista-clientes></app-lista-clientes>
  `
})
export class AppComponent {
  title = 'solar-crm';
}