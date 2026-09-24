/**
 * Copy for the research page. It lives apart from ui.ts because this is prose,
 * not interface labels — and because both languages must stay side by side.
 *
 * Source: the poster "HTN Method Selection Guided by Multi-Objective
 * Reinforcement Learning and Dynamic Preferences" (UFRGS).
 */
import type { Lang } from './ui';

export const paperTitle =
  'HTN Method Selection Guided by Multi-Objective Reinforcement Learning and Dynamic Preferences';

export const authors = [
  { name: 'Anderson G. Alves', self: true },
  { name: 'Lucas N. Alegre', url: 'https://lucasalegre.github.io' },
  // http, not https: the certificate served on 443 does not cover this
  // hostname, so the browser stops visitors with a full-page security
  // warning. Plain http answers cleanly. Revisit if the site gets a
  // valid certificate.
  { name: 'Anderson R. Tavares', url: 'http://andertavares.net' },
];

export const affiliation = 'Instituto de Informática, Universidade Federal do Rio Grande do Sul';

type Block = { heading: string; body: string[]; items?: string[] };
type Copy = {
  kicker: string;
  thesis: string[];
  intro: string;
  blocks: Block[];
  posterCaption: string;
  materials: string;
  materialsIntro: string;
  posterLabel: string;
  posterMeta: string;
  paperPending: string;
  codeLabel: string;
  codeNote: string;
};

export const research: Record<Lang, Copy> = {
  en: {
    kicker: 'MSc research · Game AI · UFRGS',
    thesis: [
      'HTN defines what is valid.',
      'MORL learns what is preferable.',
      'Dynamic preferences determine what matters now.',
    ],
    intro:
      'An NPC authored with a hierarchical task network is valid by construction: it only ever does what the designer allowed. The price is rigidity — when the priorities change, and safety starts to matter more than speed, the domain has to be rewritten. Letting a learner loose on primitive actions fixes the rigidity and throws away the guarantee. This work puts the learning somewhere else: on the choice of method.',
    blocks: [
      {
        heading: 'Filtering: the domain says what is legal',
        body: [
          'At each compound task, the HTN exposes only the methods whose preconditions hold in the current state. Everything semantically invalid under the designer-defined constraints is gone before learning is consulted at all.',
        ],
      },
      {
        heading: 'Learning: preference-conditioned MORL picks among the survivors',
        body: [
          'Rewards are vectors, not scalars, so objectives that disagree stay separate instead of collapsing into one number. Conditioning the policy on a preference vector gives a single agent that covers the trade-off space: for every linear preference, an optimal policy lies in the convex coverage set.',
        ],
      },
      {
        heading: 'Preferences: what matters, right now',
        body: [
          'The weight vector carries the current trade-off between mission, safety, resources and time. Changing it changes which method gets selected — with the HTN domain untouched. That is the point: adaptation without re-authoring.',
        ],
      },
      {
        heading: 'Credit where the decision was made',
        body: [
          'Only the selected method is decomposed, and primitive tasks keep executing conventionally. Credit is assigned at the hierarchical decision level rather than to individual actions, which is what keeps the learning signal legible and the behaviour explainable.',
        ],
      },
    ],
    posterCaption:
      'Poster: architecture, hierarchical credit assignment and the planned experiments.',
    materials: 'Materials',
    materialsIntro:
      'The full paper is not published here. What is available is the poster and, once it is out, the ERAMIA-RS paper.',
    posterLabel: 'Poster (PDF)',
    posterMeta: 'UFRGS · 1.1 MB',
    paperPending: 'ERAMIA-RS paper',
    codeLabel: 'Prototype',
    codeNote:
      'Grid-world prototype with HTN execution, sensing, navigation and replanning. Vector rewards, conflicting objectives and dynamic preferences are next. The repository is private while the work is in progress.',
  },
  pt: {
    kicker: 'Pesquisa de mestrado · IA para Jogos · UFRGS',
    thesis: [
      'O HTN define o que é válido.',
      'O MORL aprende o que é preferível.',
      'As preferências dinâmicas determinam o que importa agora.',
    ],
    intro:
      'Um NPC escrito com uma rede hierárquica de tarefas é válido por construção: ele só faz o que o designer permitiu. O preço é a rigidez — quando as prioridades mudam, e segurança passa a valer mais que velocidade, o domínio precisa ser reescrito. Soltar um aprendiz sobre as ações primitivas resolve a rigidez e joga fora a garantia. Este trabalho move o aprendizado para outro lugar: a escolha do método.',
    blocks: [
      {
        heading: 'Filtragem: o domínio diz o que é legal',
        body: [
          'Em cada tarefa composta, o HTN expõe apenas os métodos cujas pré-condições valem no estado atual. Tudo o que é semanticamente inválido sob as restrições do designer sai de cena antes de o aprendizado ser consultado.',
        ],
      },
      {
        heading: 'Aprendizado: MORL condicionado a preferências escolhe entre os sobreviventes',
        body: [
          'As recompensas são vetores, não escalares, então objetivos em conflito permanecem separados em vez de colapsar num número só. Condicionar a política a um vetor de preferências dá um único agente que cobre o espaço de trade-offs: para toda preferência linear existe uma política ótima no conjunto de cobertura convexa.',
        ],
      },
      {
        heading: 'Preferências: o que importa, agora',
        body: [
          'O vetor de pesos carrega o trade-off atual entre missão, segurança, recursos e tempo. Mudá-lo muda o método selecionado — sem tocar no domínio HTN. É esse o ponto: adaptação sem reautoria.',
        ],
      },
      {
        heading: 'Crédito onde a decisão foi tomada',
        body: [
          'Só o método selecionado é decomposto, e as tarefas primitivas seguem em execução convencional. O crédito é atribuído no nível da decisão hierárquica, e não a ações individuais, que é o que mantém o sinal de aprendizado legível e o comportamento explicável.',
        ],
      },
    ],
    posterCaption:
      'Pôster: arquitetura, atribuição hierárquica de crédito e os experimentos propostos.',
    materials: 'Materiais',
    materialsIntro:
      'O artigo principal não está publicado aqui. O que está disponível é o pôster e, quando sair, o artigo do ERAMIA-RS.',
    posterLabel: 'Pôster (PDF)',
    posterMeta: 'UFRGS · 1,1 MB',
    paperPending: 'Artigo do ERAMIA-RS',
    codeLabel: 'Protótipo',
    codeNote:
      'Protótipo em grid world com execução HTN, sensoriamento, navegação e replanejamento. Recompensas vetoriais, objetivos conflitantes e preferências dinâmicas são o próximo passo. O repositório é privado enquanto o trabalho está em andamento.',
  },
};

/** Planned evaluation, straight from the poster. */
export const experiments: Record<Lang, { heading: string; columns: { title: string; items: string[] }[] }> = {
  en: {
    heading: 'How it will be evaluated',
    columns: [
      {
        title: 'Compare',
        items: [
          'First-applicable HTN',
          'Heuristic HTN',
          'Scalar HTN-RL',
          'Contextual scalar RL + HTN mask',
          'HTN + preference-conditioned MORL',
        ],
      },
      { title: 'Stress', items: ['Dynamic preferences', 'Novel context', 'Unseen preferences'] },
      {
        title: 'Measure',
        items: ['Performance', 'Adaptation', 'Generalization', 'Semantic validity', 'Latency'],
      },
    ],
  },
  pt: {
    heading: 'Como será avaliado',
    columns: [
      {
        title: 'Comparar',
        items: [
          'HTN por primeiro aplicável',
          'HTN heurístico',
          'HTN-RL escalar',
          'RL escalar contextual + máscara HTN',
          'HTN + MORL condicionado a preferências',
        ],
      },
      { title: 'Estressar', items: ['Preferências dinâmicas', 'Contexto inédito', 'Preferências não vistas'] },
      {
        title: 'Medir',
        items: ['Desempenho', 'Adaptação', 'Generalização', 'Validade semântica', 'Latência'],
      },
    ],
  },
};
