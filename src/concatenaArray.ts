// 2. Faça um Programa TypeScript que transforme o array, concatenando as strings com 1 (um) espaço (“ “).
// Utilize o método JOIN da classe Array, passando uma função arrow como parâmetro.
// 2.1 Escreva um teste com o array ['Arrays', 'com', 'TypeScript']

export const concatArray = (array: string[]): string => {
  const resultado = (() => array.join(" "))();
  return resultado;
};
