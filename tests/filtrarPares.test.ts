import { filtrarPares } from "../src/filtrarPares";

describe("Teste da função filtrarPares", () => {
    test("Deve retornar apenas os números pares do array", () => {
        const array = [8, 3, 9, 5, 6, 12];
        const resultadoEsperado = [8, 6, 12];

        const resultado = filtrarPares(array);

        expect(resultado).toEqual(resultadoEsperado);
    });
});
