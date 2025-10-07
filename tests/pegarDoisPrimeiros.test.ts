import { pegarDoisPrimeiros } from "../src/pegarDoisPrimeiros";

describe("Teste da função pegarDoisPrimeiros", () => {
    test("Deve retornar os dois primeiros elementos do array", () => {
        const array = [2, 4, 6, 2, 8, 9, 5];
        const resultadoEsperado = [2, 4];

        const resultado = pegarDoisPrimeiros(array);

        expect(resultado).toEqual(resultadoEsperado);
    });
});
