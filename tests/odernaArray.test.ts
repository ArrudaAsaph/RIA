import { ordenaArray } from "../src/ordenaArray";

describe("Função ordenaArray", () => {
  const entrada = ["carro", "boneco", "ave", "lapis"];
  const esperado = ["lapis", "carro", "boneco", "ave"]; 

  test("deve ordenar os elementos em ordem decrescente (Z → A)", () => {
    const resultado = ordenaArray([...entrada]); 
    expect(resultado).toEqual(esperado);
  });
});
