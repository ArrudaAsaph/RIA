import { quadradoForEach, quadradoInteracao } from "../src/quadradoArray";

describe("Funções para calcular o quadrado dos elementos do array", () => {
  const entrada = [3, 5, 7, 3, 8, 9, 1];
  const esperado = [9, 25, 49, 9, 64, 81, 1];

  test("quadradoForEach deve retornar o quadrado de cada número", () => {
    const resultado = quadradoForEach(entrada);
    expect(resultado).toEqual(esperado);
  });

  test("quadradoIteracao deve retornar o quadrado de cada número", () => {
    const resultado = quadradoInteracao(entrada);
    expect(resultado).toEqual(esperado);
  });
});
