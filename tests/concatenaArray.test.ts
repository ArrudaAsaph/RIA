import { concatArray } from "../src/concatenaArray";

describe("Função concatArray", () => {
  const entrada = ["Arrays", "com", "TypeScript"];
  const esperado = "Arrays com TypeScript";

  test("deve concatenar as strings com um espaço", () => {
    const resultado = concatArray(entrada);
    expect(resultado).toBe(esperado);
  });
});
