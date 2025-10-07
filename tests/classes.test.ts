import { JavaIDE, PythonIDE } from "../src/classes";

describe("Testes das classes de programas de computador", () => {
  test("JavaIDE deve retornar a descrição correta", () => {
    const java = new JavaIDE("IntelliJ IDEA", "2024.1");
    expect(java.descricao()).toBe("Programa Java: IntelliJ IDEA, versão 2024.1");


    java.nome = "Eclipse";
    java.versao = "2023-12";
    expect(java.descricao()).toBe("Programa Java: Eclipse, versão 2023-12");
  });

  test("PythonIDE deve retornar a descrição correta", () => {
    const python = new PythonIDE("PyCharm", "VirtualEnv");
    expect(python.descricao()).toBe("Programa Python: PyCharm, ambiente VirtualEnv");

    python.nome = "VSCode";
    python.tipoAmbiente = "Conda";
    expect(python.descricao()).toBe("Programa Python: VSCode, ambiente Conda");
  });
});
