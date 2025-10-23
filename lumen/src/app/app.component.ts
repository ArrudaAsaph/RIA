import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ListaClientesComponent } from './components/lista-clientes/lista-clientes.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, ListaClientesComponent],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100">
      <!-- Cabeçalho -->
      <header class="bg-white shadow-sm border-b border-blue-100">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center py-6">
            <div class="flex items-center space-x-3">
              <i class="pi pi-sun text-3xl text-yellow-500"></i>
              <div>
                <h1 class="text-2xl font-bold text-gray-900">Sistema Solar CRM</h1>
                <p class="text-sm text-gray-600">Gestão de Clientes de Energia Solar</p>
              </div>
            </div>
            <div class="bg-green-100 px-4 py-2 rounded-lg">
              <span class="text-green-800 font-semibold">Energia Limpa</span>
            </div>
          </div>
        </div>
      </header>

      <!-- Conteúdo principal -->
      <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div class="px-4 py-6 sm:px-0">
          <app-lista-clientes></app-lista-clientes>
        </div>
      </main>
    </div>
  `
})
export class AppComponent {
  titulo = 'Sistema Solar CRM';
}