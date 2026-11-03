"""Empréstimo do balcão da locadora — ponto de partida da Aula 03 da UC3.

Este arquivo não tem teste nenhum, e é de propósito: hoje o teste nasce
ANTES do código. Crie o test_emprestimo.py nesta mesma pasta. O painel
Testing do VS Code só encontra arquivo cujo nome começa com test_, e é
por estar na mesma pasta que o "from emprestimo import ..." funciona.
"""


class Cliente:
    """Quem leva os jogos.

    O número de empréstimos anteriores mora no cadastro da locadora, no
    banco da UC2. Hoje ele entra digitado, à mão: testar com o banco no
    meio é assunto das Aulas 04 e 05.
    """

    def __init__(self, nome, emprestimos_anteriores=0):
        self.nome = nome
        self.emprestimos_anteriores = emprestimos_anteriores


class Emprestimo:
    """Um empréstimo: um cliente, um ou mais jogos.

    Segue as tabelas da UC2: o cliente fica no emprestimo, e cada jogo é
    uma linha de item_emprestimo. Por isso o cliente entra quando o
    empréstimo é criado, e não a cada jogo adicionado.
    """

    def __init__(self, cliente):
        self.cliente = cliente
        self.jogos = []

    def adicionar(self, jogo):
        self.jogos.append(jogo)
