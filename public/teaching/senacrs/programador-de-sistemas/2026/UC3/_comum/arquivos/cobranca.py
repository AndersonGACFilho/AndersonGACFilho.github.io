"""
Cobrança de atrasos da locadora — UC3, Aula 04 (mock objects).

Toda manhã de dia útil, o sistema pega os empréstimos ainda abertos, avisa
pelo WhatsApp quem passou do prazo e anota no banco o dia do aviso.

Esta é a versão de PARTIDA, e ela está difícil de testar de propósito. O
CobradorDeAtrasos cria sozinho tudo de que precisa:

  - o repositório, que conecta no PostgreSQL da UC2;
  - o avisador, que manda mensagem para o cliente;
  - a data de hoje, que ele pergunta ao relógio do computador.

Nenhum teste consegue entregar a ele um cenário pronto. É esse o problema
da aula, e são vocês que vão mudar este arquivo até ele ficar testável.
"""

from datetime import date


class Emprestimo:
    id_emprestimo: int
    cliente: str
    telefone: str | None
    data_prevista: date
    data_entregue: date | None
    avisado_em: date | None

    def __init__(
        self,
        id_emprestimo: int,
        cliente: str,
        telefone: str | None,
        data_prevista: date,
        data_entregue: date | None = None,
        avisado_em: date | None = None
        ):
        self.id_emprestimo = id_emprestimo
        self.cliente = cliente
        self.telefone = telefone
        self.data_prevista = data_prevista
        self.data_entregue = data_entregue
        self.avisado_em = avisado_em

    def atrasado_em(self, hoje: date) -> bool:
        # "Atrasado" é calculado, nunca guardado: uma coluna atrasado = TRUE
        # continuaria TRUE depois da devolução, se alguém esquecesse de
        # desmarcar. É o "guarde fatos, calcule resultados" da UC2.
        # No dia do prazo o jogo ainda não está atrasado — só no dia seguinte.
        return self.data_entregue is None and hoje > self.data_prevista

    def registrar_aviso(self, hoje: date) -> None:
        # Este é um fato, e por isso se guarda: o balcão precisa saber se o
        # cliente já foi avisado antes de telefonar para ele.
        self.avisado_em = hoje

    def __repr__(self):
        return f"Emprestimo( {self.id_emprestimo} - {self.cliente} - prazo {self.data_prevista} )"


class RepositorioDeEmprestimos:
    """Lê e grava empréstimos no PostgreSQL da UC2.

    A coluna avisado_em não existe no locadora-demo.sql. Para usar este
    repositório num banco de verdade, rode antes, uma vez:

        ALTER TABLE emprestimo ADD COLUMN IF NOT EXISTS avisado_em DATE;
    """

    def __init__(self):
        # O import mora aqui dentro, e não no topo do arquivo: o teste com
        # dublê nunca cria um repositório de verdade, e assim ele roda até
        # numa máquina sem o psycopg2 instalado.
        import psycopg2
        self.conexao = psycopg2.connect(
            dbname="postgres",
            user="postgres",
            password="postgres",
            host="localhost",
            port="5432"
        )

    def abertos(self) -> list[Emprestimo]:
        with self.conexao.cursor() as cursor:
            # JOIN com cliente porque o aviso precisa do nome e do telefone,
            # que não moram na tabela emprestimo.
            cursor.execute(
                "SELECT e.id_emprestimo, c.nome, c.telefone, "
                "       e.data_prevista, e.data_entregue, e.avisado_em "
                "FROM emprestimo e "
                "JOIN cliente c ON c.id_cliente = e.id_cliente "
                "WHERE e.data_entregue IS NULL "
                "ORDER BY e.id_emprestimo"
            )
            return [Emprestimo(*linha) for linha in cursor.fetchall()]

    def atualiza(self, emprestimo: Emprestimo) -> None:
        try:
            with self.conexao.cursor() as cursor:
                cursor.execute(
                    "UPDATE emprestimo SET avisado_em = %s WHERE id_emprestimo = %s",
                    (emprestimo.avisado_em, emprestimo.id_emprestimo)
                )
            self.conexao.commit()
        except Exception:
            # Sem o rollback, a conexão fica presa numa transação abortada e
            # todo comando seguinte falha também. O erro segue adiante: quem
            # decide se a cobrança continua é o cobrador, não o repositório.
            self.conexao.rollback()
            raise


class AvisadorPorWhatsApp:
    """Avisa o cliente de que o prazo venceu.

    O envio de verdade passaria pela API do WhatsApp Business, que pede conta
    e chave. Aqui ele só escreve na tela, para o arquivo rodar no laboratório
    — mas leia como se a mensagem saísse: um teste não tem como desmandar
    uma mensagem que já chegou no celular do cliente.
    """

    def avisa(self, emprestimo: Emprestimo) -> None:
        print(
            f"[WhatsApp para {emprestimo.telefone}] Olá, {emprestimo.cliente}! "
            f"O prazo do empréstimo {emprestimo.id_emprestimo} venceu em "
            f"{emprestimo.data_prevista:%d/%m/%Y}. Passe na locadora para devolver."
        )


class CobradorDeAtrasos:
    total_avisados: int

    def __init__(self):
        self.total_avisados = 0

    def cobrar(self) -> None:
        repositorio = RepositorioDeEmprestimos()
        avisador = AvisadorPorWhatsApp()
        hoje = date.today()

        # Mensagem de cobrança no sábado irrita o cliente: o balcão decidiu
        # que aviso só sai em dia útil.
        if hoje.weekday() >= 5:  # 5 é sábado, 6 é domingo
            return

        for emprestimo in repositorio.abertos():
            if emprestimo.atrasado_em(hoje):
                emprestimo.registrar_aviso(hoje)
                repositorio.atualiza(emprestimo)
                avisador.avisa(emprestimo)
                self.total_avisados += 1


if __name__ == "__main__":
    cobrador = CobradorDeAtrasos()
    cobrador.cobrar()
    print(f"{cobrador.total_avisados} cliente(s) avisado(s).")
