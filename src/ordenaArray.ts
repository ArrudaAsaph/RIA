// 3. Faça um programa que imprima seus elementos ordenados. Use o método SORT
// da classe Array para ordenar de forma decrescente, passando uma função arrow como parâmetro.
// 3.1 Escreva um teste com o array [‘carro’, ’boneco’, ’ave’, ‘lapis’]

export function ordenaArray(array: string[]): string[] {
    return array.sort((a, b) => b.localeCompare(a));
}