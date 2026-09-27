/**
 * O que eu ensino, e onde.
 *
 * POR QUE virou dado e não texto no componente: a página trazia o programa da
 * UC2 escrito à mão, como se o Senac fosse a única instituição e a UC2 o único
 * material. Nenhuma das duas coisas se sustenta — o Senac abre outros cursos,
 * e este mesmo curso ainda vai receber a UC3 e o Projeto Integrador.
 *
 * A hierarquia é instituição → curso → edição (ano) → UC, a mesma do endereço
 * em que o material é publicado.
 *
 * A LISTA DE UCs AQUI É RESUMO, NÃO FONTE. Quem manda no material é o
 * `cursos.md` do repositório de courseware; esta lista existe só para a página
 * dizer o que vem e o que já está no ar sem precisar buscar nada.
 */

export type Situacao = 'no-ar' | 'preparando' | 'outro-docente';

interface Bi {
  en: string;
  pt: string;
}

export interface Uc {
  codigo: string;
  nome: Bi;
  ch: string;
  situacao: Situacao;
}

export interface Edicao {
  ano: string;
  periodo: string;
  turno: Bi;
  /** Material publicado. Sem isto, a edição aparece sem link. */
  href?: string;
  ucs: Uc[];
}

export interface Curso {
  nome: Bi;
  nivel: Bi;
  edicoes: Edicao[];
}

export interface Instituicao {
  nome: string;
  local: string;
  cursos: Curso[];
}

export const ensino: Instituicao[] = [
  {
    nome: 'Senac RS',
    local: 'Porto Alegre',
    cursos: [
      {
        nome: { en: 'Systems Programmer', pt: 'Programador de Sistemas' },
        nivel: { en: 'Professional qualification', pt: 'Qualificação profissional' },
        edicoes: [
          {
            ano: '2026',
            periodo: '08/09 — 25/11/2026',
            turno: { en: 'Evenings, 6–10pm', pt: 'Noite, 18h às 22h' },
            // aponta para o arquivo, não para a pasta: servidor que não monta
            // índice de diretório devolve 404, e foi assim que este botão quebrou
            href: '/teaching/senacrs/programador-de-sistemas/2026/index.html',
            ucs: [
              {
                codigo: 'UC1',
                nome: { en: 'Developing information systems', pt: 'Desenvolver sistemas de informação' },
                ch: '72h',
                situacao: 'outro-docente',
              },
              {
                codigo: 'UC2',
                nome: { en: 'Implementing databases', pt: 'Implementar banco de dados' },
                ch: '72h',
                situacao: 'no-ar',
              },
              {
                codigo: 'UC3',
                nome: { en: 'Testing and maintaining the system', pt: 'Realizar testes e manutenção do sistema' },
                ch: '36h',
                situacao: 'preparando',
              },
              {
                codigo: 'UC4',
                nome: { en: 'Capstone project', pt: 'Projeto Integrador' },
                ch: '20h',
                situacao: 'preparando',
              },
            ],
          },
        ],
      },
    ],
  },
];
