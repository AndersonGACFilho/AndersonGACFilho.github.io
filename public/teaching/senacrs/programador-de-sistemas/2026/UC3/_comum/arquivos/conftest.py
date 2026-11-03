# conftest.py — o que o pytest prepara antes de cada teste de integração.
#
# Material da UC3, Aula 05. O pytest lê este arquivo sozinho, pelo nome: as
# fixtures daqui ficam disponíveis para todo teste da mesma pasta.
#
# ANTES DE RODAR: troquem a senha abaixo pela do PostgreSQL de vocês, e criem
# no pgAdmin o banco locadora_teste (o passo a passo está nos slides).

import psycopg2 as pg
import pytest

BANCO_DE_TESTE = {
    "host": "localhost",
    "port": 5432,
    "dbname": "locadora_teste",  # NUNCA o banco com os dados do projeto
    "user": "postgres",
    "password": "SUA_SENHA",
}


@pytest.fixture
def conexao():
    conexao = pg.connect(**BANCO_DE_TESTE)
    cursor = conexao.cursor()
    # Limpa ANTES de cada teste, e não depois: se um teste quebrar no meio, o
    # próximo ainda começa do zero. TRUNCATE e não rollback, porque as funções
    # do CRUD dão commit() — e o que já foi gravado, o rollback não desfaz.
    # CASCADE esvazia junto as tabelas que apontam para jogo e plataforma;
    # RESTART IDENTITY volta o SERIAL para 1.
    cursor.execute("TRUNCATE jogo, plataforma RESTART IDENTITY CASCADE")
    conexao.commit()
    yield conexao
    conexao.close()
