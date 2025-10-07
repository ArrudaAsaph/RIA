// 6. Faça um programa TypeScript:
// 6.1 Crie duas classes que possuam uma interface em comum. Evite criar classes com nomes sem significado (class A, class X). Crie classes com nomes que representem algo significativo.
// 6.2 As classes devem possuir atributos diferentes. 
// 6.3 A interface deve possuir pelo menos um método. 
// 6.4 A implementação desse método nas classes deve utilizar os atributos.
// 6.5 Escreve um teste que instancie as classes criadas, altera os atributos e teste o método comum na interface.


export interface Programa {
  descricao(): string;
}


export class JavaIDE implements Programa {
  nome: string;
  versao: string;

  constructor(nome: string, versao: string) {
    this.nome = nome;
    this.versao = versao;
  }

  descricao(): string {
    return `Programa Java: ${this.nome}, versão ${this.versao}`;
  }
}


export class PythonIDE implements Programa {
  nome: string;
  tipoAmbiente: string;

  constructor(nome: string, tipoAmbiente: string) {
    this.nome = nome;
    this.tipoAmbiente = tipoAmbiente;
  }

  descricao(): string {
    return `Programa Python: ${this.nome}, ambiente ${this.tipoAmbiente}`;
  }
}
