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
      'I want an agent that stays inside the rules it was given and still follows priorities that change while it runs. A hierarchical task network handles the first part: the agent only ever does what the domain allows, so it is valid by construction. The cost is rigidity. When safety starts to matter more than speed, someone has to rewrite the domain. Letting a learner loose on the primitive actions removes the rigidity and throws the guarantee away with it. My MSc moves the learning to the choice of method. I test it on NPCs, where the agent works with partial information and a deadline per frame, and a player notices as soon as it does something odd.',
    blocks: [
      {
        heading: 'Filtering: the domain says what is legal',
        body: [
          'At each compound task, the HTN exposes only the methods whose preconditions hold in the current state. Everything semantically invalid under the constraints written into the domain is gone before learning is consulted at all.',
        ],
      },
      {
        heading: 'Learning: preference-conditioned MORL picks among the survivors',
        body: [
          'Each reward is a vector with one entry per objective, so objectives that disagree stay separate and never collapse into one number. Conditioning the policy on a preference vector gives a single agent that covers the trade-off space: for every linear preference, an optimal policy lies in the convex coverage set.',
        ],
      },
      {
        heading: 'Preferences: what matters, right now',
        body: [
          'The weight vector carries the current trade-off between mission, safety, resources and time. Changing it changes which method gets selected while the HTN domain stays as written, so adapting to a new priority costs no re-authoring.',
        ],
      },
      {
        heading: 'Credit where the decision was made',
        body: [
          'Only the selected method is decomposed, and primitive tasks keep executing conventionally. Credit goes to the hierarchical decision that picked the method. That keeps the learning signal legible, and it lets me explain why the agent did what it did.',
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
      'Quero um agente que fique dentro das regras que recebeu e ainda assim siga prioridades que mudam enquanto ele roda. Uma rede hierárquica de tarefas resolve a primeira parte: o agente só faz o que o domínio permite, então é válido por construção. O preço é a rigidez. Quando segurança passa a valer mais que velocidade, alguém precisa reescrever o domínio. Soltar um aprendiz sobre as ações primitivas tira a rigidez e leva a garantia junto. O meu mestrado move o aprendizado para a escolha do método. Eu testo em NPC, onde o agente trabalha com informação parcial e prazo por quadro, e o jogador percebe na hora quando ele faz alguma coisa estranha.',
    blocks: [
      {
        heading: 'Filtragem: o domínio diz o que é legal',
        body: [
          'Em cada tarefa composta, o HTN expõe apenas os métodos cujas pré-condições valem no estado atual. Tudo o que é semanticamente inválido sob as restrições escritas no domínio sai de cena antes de o aprendizado ser consultado.',
        ],
      },
      {
        heading: 'Aprendizado: MORL condicionado a preferências escolhe entre os sobreviventes',
        body: [
          'Cada recompensa é um vetor com uma entrada por objetivo, então objetivos em conflito ficam separados e nunca colapsam num número só. Condicionar a política a um vetor de preferências dá um único agente que cobre o espaço de trade-offs: para toda preferência linear existe uma política ótima no conjunto de cobertura convexa.',
        ],
      },
      {
        heading: 'Preferências: o que importa, agora',
        body: [
          'O vetor de pesos carrega o trade-off atual entre missão, segurança, recursos e tempo. Mudá-lo muda o método selecionado sem tocar no domínio HTN, então se adaptar a uma prioridade nova não exige reescrever nada.',
        ],
      },
      {
        heading: 'Crédito onde a decisão foi tomada',
        body: [
          'Só o método selecionado é decomposto, e as tarefas primitivas seguem em execução convencional. O crédito vai para a decisão hierárquica que escolheu o método. Isso mantém o sinal de aprendizado legível e me deixa explicar por que o agente fez o que fez.',
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
