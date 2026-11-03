# crud_jogo.py — o CRUD de jogo da locadora, fora do notebook.
#
# Material da UC3, Aula 05. É o CRUD do locadora-crud.ipynb (UC2, Aula 18),
# com uma mudança só: a CONEXÃO chega por parâmetro. No notebook ela era uma
# variável global criada numa célula, e um teste não tem como trocar a
# conexão de verdade por uma conexão com o banco de teste.
#
# Dois avisos:
#   - este código tem defeito, e só o banco de verdade mostra;
#   - rodem os testes num banco SEPARADO (locadora_teste), nunca no banco que
#     tem os dados do projeto: o teste apaga tudo antes de começar.

from decimal import Decimal

import psycopg2 as pg


class Jogo:
    def __init__(self, titulo, genero, ano_lancamento, preco_diaria, id_jogo=None):
        self.id_jogo = id_jogo
        self.titulo = titulo
        self.genero = genero
        self.ano_lancamento = ano_lancamento
        self.preco_diaria = preco_diaria

    def __repr__(self):
        return f"Jogo( {self.id_jogo} - {self.titulo} )"


def _linha_para_jogo(linha):
    return Jogo(linha[1], linha[2], linha[3], linha[4], linha[0])


def criar_jogo(conexao, titulo, genero, ano_lancamento, preco_diaria):
    cursor = conexao.cursor()
    try:
        cursor.execute(
            "INSERT INTO jogo (titulo, genero, ano_lancamento, preco_diaria) "
            "VALUES (%s, %s, %s, %s) RETURNING id_jogo",
            (titulo, genero, ano_lancamento, preco_diaria),
        )
        id_jogo = cursor.fetchone()[0]
        conexao.commit()
        return Jogo(titulo, genero, ano_lancamento, Decimal(preco_diaria), id_jogo)
    except pg.DatabaseError as e:
        print(e)
        conexao.rollback()
    return None


def buscar_jogo(conexao, id_jogo):
    cursor = conexao.cursor()
    try:
        cursor.execute(
            "SELECT id_jogo, titulo, genero, ano_lancamento, preco_diaria "
            "FROM jogo WHERE id_jogo = %s",
            (id_jogo,),
        )
        linha = cursor.fetchone()
        if linha:
            return _linha_para_jogo(linha)
    except pg.DatabaseError as e:
        print(e)
        conexao.rollback()
    return None


def buscar_por_titulo(conexao, titulo):
    cursor = conexao.cursor()
    try:
        cursor.execute(
            "SELECT id_jogo, titulo, genero, ano_lancamento, preco_diaria "
            "FROM jogo WHERE titlo = %s",
            (titulo,),
        )
        linha = cursor.fetchone()
        if linha:
            return _linha_para_jogo(linha)
    except pg.DatabaseError as e:
        print(e)
        conexao.rollback()
    return None


def atualizar_preco(conexao, id_jogo, novo_preco):
    cursor = conexao.cursor()
    try:
        cursor.execute(
            "UPDATE jogo SET preco_diaria = %s WHERE id_jogo = %s",
            (novo_preco, id_jogo),
        )
        alteradas = cursor.rowcount
        conexao.commit()
        return alteradas > 0
    except pg.DatabaseError as e:
        print(e)
        conexao.rollback()
    return False


def deletar_jogo(conexao, id_jogo):
    cursor = conexao.cursor()
    try:
        cursor.execute("DELETE FROM jogo WHERE id_jogo = %s", (id_jogo,))
        apagadas = cursor.rowcount
        conexao.commit()
        return apagadas > 0
    except pg.DatabaseError as e:
        print(e)
        conexao.rollback()
    return False
