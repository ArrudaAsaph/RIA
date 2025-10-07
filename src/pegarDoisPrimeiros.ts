// 4. Faça um programa que leia o array pegue apenas os dois primeiros elementos. Use o método SLICE da classe Array.
// 4.1 Escreva um teste com o array [2,4,6,2,8,9,5]
export function pegarDoisPrimeiros(array: number[]): number[] {
    
    const resultado = array.slice(0, 2);
    console.log(resultado);
    return resultado;
}
