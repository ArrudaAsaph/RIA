
// 1. Faça um programa TypeScript que calcule o quadrado de cada elemento do array, use as seguintes estratégias:
// a. iterando com for simples
// b. iterando com forEach
// 1.1 Escreve um teste com o array [3,5,7,3,8,9,1]

let array = [3,5,7,3,8,9,1];

// ForEach
function quadradoForEach(array: number[]): number[] {
    let novo_array: number[] = [];

    array.forEach((num) => {
        novo_array.push(num * num);
        console.log(num * num);
    })

    return novo_array;
}

function quadradoInteracao(array:number[]):Number[] {
    let novo_array: number[] = [];

    for (let i = 0; i < array.length; i++) {
        novo_array.push(array[i] * array[i]);
        console.log(array[i] * array[i]);
    }

    return novo_array;
}

const esperado = [9, 25, 49, 9, 64, 81, 1];

quadradoForEach(esperado);
quadradoInteracao(esperado);

export default {quadradoForEach, quadradoInteracao};