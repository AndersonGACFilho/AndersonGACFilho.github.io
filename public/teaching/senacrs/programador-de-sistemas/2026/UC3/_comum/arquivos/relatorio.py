# relatorio.py — o relatório do mês da locadora.
#
# Material da UC3, Aula 01. Este arquivo é o que vocês vão TESTAR: ele roda,
# imprime um resultado que parece certo e, mesmo assim, tem defeito. Não
# conserte nada antes de escrever o teste que mostra o problema.

from dataclasses import dataclass


@dataclass
class Aluguel:
    cliente: str
    jogo: str
    valor: float


class RelatorioDoMes:
    """Resume os aluguéis do mês para o dono da locadora."""

    def __init__(self):
        # Começa no "menos infinito" para que o primeiro aluguel, seja qual
        # for o valor, já passe a ser o maior. O menor começa no "mais
        # infinito" pelo mesmo motivo.
        self.maior = float("-inf")
        self.menor = float("inf")

    def avaliar(self, alugueis):
        for aluguel in alugueis:
            if aluguel.valor > self.maior:
                self.maior = aluguel.valor
            elif aluguel.valor < self.menor:
                self.menor = aluguel.valor


def total_do_cliente(alugueis, cliente):
    """Quanto um cliente gastou no mês, somando todos os aluguéis dele."""
    total = 0.0
    for aluguel in alugueis:
        if aluguel.cliente == cliente:
            total = aluguel.valor
    return total


# O "teste" que todo mundo já faz: rodar e olhar o que sai na tela.
if __name__ == "__main__":
    alugueis = [
        Aluguel("Ana", "FIFA 25", 30.0),
        Aluguel("Bruno", "Zelda", 40.0),
        Aluguel("Carla", "Mario Kart", 25.0),
    ]
    relatorio = RelatorioDoMes()
    relatorio.avaliar(alugueis)
    print(relatorio.maior)  # 40.0
    print(relatorio.menor)  # 25.0
