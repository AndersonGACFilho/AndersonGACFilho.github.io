/**
 * Career data for the CV page, in both languages.
 * Source: Anderson's LinkedIn profile (Sep 2026) and his own CV.
 * Phone number deliberately left out — the site is public.
 */
import type { Lang } from './ui';
import type { Track } from '../lib/tracks';

type Bi = { en: string; pt: string };

/**
 * O currículo serve duas candidaturas diferentes com o mesmo histórico. O
 * foco troca headline, perfil, disponibilidade e a ordem das competências;
 * nenhuma experiência é escondida — a lista é a mesma nos três estados.
 */
export const CV_FOCUSES = ['all', 'gamedev', 'fullstack'] as const;
export type CvFocus = (typeof CV_FOCUSES)[number];
type ByFocus<T> = Record<CvFocus, T>;

export type Entry = {
  role: Bi;
  org: string;
  kind?: Bi;
  url?: string;
  period: Bi;
  place: Bi;
  /** Trilha da vaga a que a experiência responde; só a lista de experiência usa. */
  track?: Track;
  /**
   * Outras trilhas que a experiência também cobre. Só rotulam: a chave de
   * foco do /cv lê `track`, e estas não a mudam.
   */
  alsoTracks?: Track[];
  tech?: string[];
  bullets: { en: string[]; pt: string[] };
};

export const headline: ByFocus<Bi> = {
  all: {
    en: 'Gameplay Programmer and Full Stack Engineer · Unreal Engine 5/C++, Unity/C# · Python/FastAPI, Java, Angular · MSc at UFRGS on control and decision-making',
    pt: 'Gameplay Programmer e Engenheiro Full Stack · Unreal Engine 5/C++, Unity/C# · Python/FastAPI, Java, Angular · mestrado na UFRGS em controle e tomada de decisão',
  },
  gamedev: {
    en: 'Gameplay Programmer · Unreal Engine 5/C++ & Unity/C# · Game AI, gameplay systems and multiplayer',
    pt: 'Gameplay Programmer · Unreal Engine 5/C++ e Unity/C# · IA para jogos, sistemas de gameplay e multiplayer',
  },
  fullstack: {
    en: 'Full Stack Engineer · Python/FastAPI & Java/Spring Boot · Angular and React · DDD, event-driven systems, observability',
    pt: 'Engenheiro Full Stack · Python/FastAPI e Java/Spring Boot · Angular e React · DDD, sistemas orientados a eventos, observabilidade',
  },
};

export const profile: ByFocus<Bi> = {
  all: {
    en: 'I write gameplay code and the services behind it. Four years of production engineering came first (Python, FastAPI, Java, PostgreSQL, RabbitMQ, Docker, CI/CD), and that is why my Unity and Unreal projects get architected instead of improvised. The week splits three ways today: a production platform in Python and Angular, solo Unity releases under the Vertex Shift label, and an MSc at UFRGS on control and decision-making, where HTN, GOAP and reinforcement learning get tried out on NPCs.',
    pt: 'Escrevo código de gameplay e os serviços que ficam atrás dele. Quatro anos de engenharia em produção vieram primeiro (Python, FastAPI, Java, PostgreSQL, RabbitMQ, Docker, CI/CD), e é por isso que meus projetos em Unity e Unreal nascem arquitetados em vez de improvisados. Hoje a semana se divide em três: uma plataforma de produção em Python e Angular, lançamentos solo em Unity sob o selo Vertex Shift, e o mestrado na UFRGS em controle e tomada de decisão, onde HTN, GOAP e aprendizado por reforço são testados em NPCs.',
  },
  gamedev: {
    en: 'Gameplay programmer and Game AI researcher building data-driven systems in Unity/C# and Unreal Engine 5/C++. At UFRGS I work on control and decision-making with reinforcement learning, HTN and GOAP, and the NPC is where I test it: a game gives an agent partial information, a deadline per frame and a human watching, which is a hard bench to pass. Under the Vertex Shift label I ship the prototypes solo, from enemy state machines to wave spawning and dynamic difficulty, and at LabTIME/UFG I wrote gameplay systems in C++ including a plugin reused across projects. The four years of backend engineering before that are the reason gameplay code of mine comes with an architecture, tests and numbers I can defend.',
    pt: 'Programador de gameplay e pesquisador de IA para jogos, construindo sistemas data-driven em Unity/C# e Unreal Engine 5/C++. Na UFRGS trabalho com controle e tomada de decisão usando aprendizado por reforço, HTN e GOAP, e o NPC é onde eu testo: o jogo dá ao agente informação parcial, prazo por quadro e um humano olhando, o que é uma bancada difícil de passar. Sob o selo Vertex Shift publico os protótipos sozinho, de máquinas de estado de inimigo a ondas e dificuldade dinâmica, e no LabTIME/UFG escrevi sistemas de gameplay em C++, incluindo um plugin reaproveitado entre projetos. Os quatro anos de backend antes disso são a razão de o meu código de gameplay vir com arquitetura, testes e números que eu sei defender.',
  },
  fullstack: {
    en: 'Full stack engineer, four-plus years in production: asynchronous REST APIs in Python and FastAPI, ERP modules in Java and Spring Boot, Angular and React on the front end. I currently build econtrole, a platform for environmental compliance, tax and logistics, restructured with DDD and a modular-monolith-first strategy, with 1,000+ automated tests green and tracing that follows one request across asynchronous flows. At TOTVS Brasil Central I shipped an internal RAG assistant indexing 10+ GitLab repositories. The MSc I am taking at UFRGS is on control and decision-making under partial information, tested on NPCs because a game is an unforgiving bench for it. The gameplay work further down this CV is the same discipline applied where the budget is measured per frame.',
    pt: 'Engenheiro full stack, mais de quatro anos em produção: APIs REST assíncronas em Python e FastAPI, módulos de ERP em Java e Spring Boot, Angular e React no front. Hoje construo o econtrole, plataforma de compliance ambiental, fiscal e logística, reestruturada com DDD e estratégia de monólito modular primeiro, com mais de mil testes automatizados passando e tracing que segue uma requisição pelos fluxos assíncronos. Na TOTVS Brasil Central entreguei um assistente interno com RAG indexando mais de 10 repositórios GitLab. O mestrado que faço na UFRGS é sobre controle e tomada de decisão com informação parcial, testado em NPC porque o jogo é uma bancada que não perdoa. O trabalho de gameplay mais abaixo neste currículo é a mesma disciplina aplicada onde o orçamento se mede por quadro.',
  },
};

export const experience: Entry[] = [
  {
    role: { en: 'Researcher — control and decision-making for autonomous agents', pt: 'Pesquisador — controle e tomada de decisão para agentes autônomos' },
    org: 'Universidade Federal do Rio Grande do Sul',
    kind: { en: 'Fixed term', pt: 'Temporário' },
    track: 'gamedev',
    alsoTracks: ['research'],
    period: { en: 'Mar 2026 – present', pt: 'mar 2026 – o momento' },
    place: { en: 'Porto Alegre, BR · Remote', pt: 'Porto Alegre, RS · Remoto' },
    tech: ['Reinforcement Learning', 'HTN', 'GOAP', 'Multi-agent', 'Python'],
    bullets: {
      en: [
        'Research and implement decision-making and control for agents acting under partial information, with reinforcement learning, hierarchical task networks and goal-oriented action planning.',
        'Design hybrid architectures where HTN handles strategic decomposition, GOAP handles contextual goal selection and multi-objective RL improves execution policies.',
        'Build simulated environments and controlled experiments on NPCs, measuring responsiveness, adaptability, computational cost, scalability and behavioural interpretability.',
        'Translate research into modular architectures and implementation patterns fit for commercial engines.',
      ],
      pt: [
        'Pesquiso e implemento tomada de decisão e controle de agentes que agem com informação parcial, usando aprendizado por reforço, redes hierárquicas de tarefas e planejamento orientado a objetivos.',
        'Projeto arquiteturas híbridas em que o HTN cuida da decomposição estratégica, o GOAP da seleção contextual de objetivos e o RL multiobjetivo melhora as políticas de execução.',
        'Construo ambientes simulados e experimentos controlados em NPC, medindo responsividade, adaptabilidade, custo computacional, escalabilidade e interpretabilidade do comportamento.',
        'Traduzo a pesquisa em arquiteturas modulares e padrões de implementação viáveis em engines comerciais.',
      ],
    },
  },
  {
    role: { en: 'Solo Gameplay Programmer', pt: 'Solo Gameplay Programmer' },
    org: 'Vertex Shift',
    kind: { en: 'Self-employed', pt: 'Autônomo' },
    url: 'https://vertex-shift.itch.io',
    track: 'gamedev',
    period: { en: 'Nov 2025 – present', pt: 'nov 2025 – o momento' },
    place: { en: 'Remote', pt: 'Remoto' },
    tech: ['Unity', 'C#', 'Game Architecture', 'Data-driven Design'],
    bullets: {
      en: [
        'Ship independent game projects under the Vertex Shift label, from prototype to playable release.',
        'Implement enemy behaviour, state machines, progression, inventory, combat, wave spawning and dynamic difficulty.',
        'Run the whole pipeline solo: design, architecture, testing, version control, builds, documentation and portfolio presentation.',
      ],
      pt: [
        'Publico projetos independentes sob o selo Vertex Shift, do protótipo à versão jogável.',
        'Implemento comportamento de inimigos, máquinas de estado, progressão, inventário, combate, ondas e dificuldade dinâmica.',
        'Toco o pipeline inteiro sozinho: design, arquitetura, testes, versionamento, builds, documentação e apresentação de portfólio.',
      ],
    },
  },
  {
    role: { en: 'Full Stack Developer', pt: 'Desenvolvedor Full Stack' },
    org: 'econtrole — waste management software',
    kind: { en: 'Freelance', pt: 'Freelance' },
    period: { en: 'Nov 2025 – present', pt: 'nov 2025 – o momento' },
    place: { en: 'Remote', pt: 'Remoto' },
    track: 'fullstack',
    tech: ['Python', 'FastAPI', 'Angular', 'PostgreSQL', 'Redis', 'RabbitMQ', 'Docker', 'Grafana', 'Jaeger'],
    bullets: {
      en: [
        'Engineer a production platform for environmental compliance, tax, financial and logistics operations.',
        'Restructure a complex business platform with DDD and a modular-monolith-first strategy — bounded contexts and stable contracts that keep service extraction an option rather than a rewrite.',
        'Design event-driven workflows with transactional consistency, idempotency, retry policies and the transactional outbox pattern.',
        'Maintain 1,000+ passing automated tests across domain rules, use cases, APIs, persistence, workers and integrations.',
        'Built the observability stack — Grafana dashboards, Jaeger tracing and correlation IDs that follow a request across asynchronous flows.',
      ],
      pt: [
        'Construo uma plataforma de produção para compliance ambiental, fiscal, financeiro e logística.',
        'Reestruturo uma plataforma complexa com DDD e estratégia de monólito modular primeiro — contextos delimitados e contratos estáveis que mantêm a extração de serviços como opção, não como reescrita.',
        'Projeto fluxos orientados a eventos com consistência transacional, idempotência, políticas de retry e transactional outbox.',
        'Mantenho mais de mil testes automatizados passando, cobrindo regras de domínio, casos de uso, APIs, persistência, workers e integrações.',
        'Montei a stack de observabilidade — dashboards no Grafana, tracing no Jaeger e correlation IDs que seguem a requisição pelos fluxos assíncronos.',
      ],
    },
  },
  {
    role: { en: 'Mid Level Backend Software Engineer', pt: 'Engenheiro de Software Backend Pleno' },
    org: 'Centro de Excelência em Inteligência Artificial (CEIA)',
    kind: { en: 'Full time', pt: 'Tempo integral' },
    track: 'fullstack',
    period: { en: 'Apr 2025 – Apr 2026', pt: 'abr 2025 – abr 2026' },
    place: { en: 'Goiânia, BR · Remote', pt: 'Goiânia, GO · Remoto' },
    tech: ['Python', 'FastAPI', 'PostgreSQL', 'Docker', 'Hexagonal Architecture', 'TDD'],
    bullets: {
      en: [
        'Engineered asynchronous REST APIs and backend services for AI-driven platforms.',
        'Applied DDD, hexagonal architecture and strict separation between domain, application and infrastructure.',
        'Wrote automated tests across domain rules, use cases, API contracts, persistence and integration scenarios.',
        'Turned AI research and product requirements into reliable production software with multidisciplinary teams.',
      ],
      pt: [
        'Desenvolvi APIs REST assíncronas e serviços de backend para plataformas orientadas a IA.',
        'Apliquei DDD, arquitetura hexagonal e separação estrita entre domínio, aplicação e infraestrutura.',
        'Escrevi testes automatizados cobrindo regras de domínio, casos de uso, contratos de API, persistência e integração.',
        'Transformei requisitos de pesquisa e de produto em software de produção com equipes multidisciplinares.',
      ],
    },
  },
  {
    role: { en: 'Mid Level Fullstack Developer', pt: 'Desenvolvedor Full Stack Pleno' },
    org: 'TOTVS Brasil Central',
    kind: { en: 'Full time', pt: 'Tempo integral' },
    track: 'fullstack',
    period: { en: 'Nov 2024 – Apr 2025', pt: 'nov 2024 – abr 2025' },
    place: { en: 'Goiânia, BR · Hybrid', pt: 'Goiânia, GO · Híbrido' },
    tech: ['Python', 'Java', 'TypeScript', 'Angular', 'React', 'Spring Boot', 'MongoDB', 'n8n'],
    bullets: {
      en: [
        'Built an internal RAG assistant indexing 10+ GitLab repositories into a MongoDB-backed vector database, for code discovery and onboarding.',
        'Automated Jira time-entry synchronisation and recurring reporting with n8n, cutting manual work.',
        'Developed licence-management tools and internal integrations across engineering and business operations.',
      ],
      pt: [
        'Construí um assistente interno com RAG indexando mais de 10 repositórios GitLab num banco vetorial sobre MongoDB, para busca de código e onboarding.',
        'Automatizei a sincronização de apontamentos no Jira e relatórios recorrentes com n8n, cortando trabalho manual.',
        'Desenvolvi ferramentas de gestão de licenças e integrações internas entre engenharia e operações.',
      ],
    },
  },
  {
    role: { en: 'Game Developer — Unreal Engine / C++', pt: 'Desenvolvedor de Jogos — Unreal Engine / C++' },
    org: 'LabTIME / UFG',
    track: 'gamedev',
    period: { en: 'Nov 2023 – Nov 2024', pt: 'nov 2023 – nov 2024' },
    place: { en: 'Goiânia, BR', pt: 'Goiânia, GO' },
    tech: ['Unreal Engine 5', 'C++', 'Plugins'],
    bullets: {
      en: [
        'Wrote gameplay systems in C++/Unreal Engine 5, including a plugin built for modularity and reuse across projects.',
        'Took part in architecture, debugging, technical documentation and code review with a multidisciplinary team.',
      ],
      pt: [
        'Escrevi sistemas de gameplay em C++/Unreal Engine 5, incluindo um plugin feito para modularidade e reuso entre projetos.',
        'Participei de arquitetura, debugging, documentação técnica e revisão de código com equipe multidisciplinar.',
      ],
    },
  },
  {
    role: { en: 'Full Stack Software Engineering Intern', pt: 'Estagiário de Engenharia de Software Full Stack' },
    org: 'TOTVS',
    track: 'fullstack',
    period: { en: 'Oct 2021 – Aug 2023', pt: 'out 2021 – ago 2023' },
    place: { en: 'Goiânia, BR', pt: 'Goiânia, GO' },
    tech: ['Java', 'Spring Boot', 'Angular', 'SQL Server', 'Python', 'Node.js', 'GCP', 'Terraform'],
    bullets: {
      en: [
        'Maintained and evolved ERP modules on a legacy-heavy stack.',
        'Built ETLs, optimised algorithms, documented legacy systems and automated pipelines with GCP, Terraform and Azure DevOps.',
      ],
      pt: [
        'Mantive e evoluí módulos de ERP numa stack com bastante legado.',
        'Construí ETLs, otimizei algoritmos, documentei sistemas legados e automatizei pipelines com GCP, Terraform e Azure DevOps.',
      ],
    },
  },
];

export const teaching: Entry[] = [
  {
    role: { en: 'Instructor — Systems Programmer course', pt: 'Docente — curso Programador de Sistemas' },
    org: 'Senac RS',
    period: { en: '2026', pt: '2026' },
    place: { en: 'Porto Alegre, BR', pt: 'Porto Alegre, RS' },
    bullets: {
      en: ['Database unit (UC2): 19 sessions authored from scratch, published as open HTML slides.'],
      pt: ['Unidade de banco de dados (UC2): 19 aulas escritas do zero, publicadas como slides HTML abertos.'],
    },
  },
  {
    role: { en: 'Teaching Assistant — three terms', pt: 'Monitor Acadêmico — 3 vínculos' },
    org: 'Universidade Federal de Goiás (UFG)',
    period: { en: '2021 (×2) and 2023–2024', pt: '2021 (2 monitorias) e 2023–2024' },
    place: { en: 'Goiânia, BR', pt: 'Goiânia, GO' },
    bullets: {
      en: [
        'Twelve weekly hours per term, including a volunteer term teaching Introduction to Computing for Electrical Engineering.',
        'Supported students one to one — including learners with disabilities — and backed the supervising professor through Moodle and Teams.',
      ],
      pt: [
        'Doze horas semanais por vínculo, incluindo uma monitoria voluntária de Introdução à Computação para a Engenharia Elétrica.',
        'Acompanhei estudantes individualmente — incluindo alunos com deficiência — e apoiei o professor orientador via Moodle e Teams.',
      ],
    },
  },
];

export const education: Entry[] = [
  {
    role: { en: "Master's degree — Artificial Intelligence", pt: 'Mestrado — Inteligência Artificial' },
    org: 'Universidade Federal do Rio Grande do Sul (UFRGS)',
    period: { en: 'Feb 2026 – Mar 2028', pt: 'fev 2026 – mar 2028' },
    place: { en: 'Porto Alegre, BR', pt: 'Porto Alegre, RS' },
    bullets: {
      en: [
        'Institute of Informatics, track: Planning, Multi-Agent Systems and Robotics, supervised by Prof. Lucas N. Alegre.',
        'Research: control and decision-making under partial information, combining reinforcement learning with GOAP and HTN. The NPC is the test bench, and believable behaviour is the pass mark the game imposes.',
      ],
      pt: [
        'Instituto de Informática, linha de Planejamento, Sistemas Multiagentes e Robótica, sob orientação do Prof. Lucas N. Alegre.',
        'Pesquisa: controle e tomada de decisão com informação parcial, combinando aprendizado por reforço a GOAP e HTN. O NPC é a bancada de teste, e comportamento crível é a nota de corte que o jogo impõe.',
      ],
    },
  },
  {
    role: { en: 'BSc in Information Systems', pt: 'Bacharelado em Sistemas de Informação' },
    org: 'Universidade Federal de Goiás (UFG)',
    period: { en: 'Feb 2020 – Jun 2025', pt: 'fev 2020 – jun 2025' },
    place: { en: 'Goiânia, BR', pt: 'Goiânia, GO' },
    bullets: {
      en: [
        '3,000-hour interdisciplinary degree across computer science, management and IT: requirements engineering, software architecture, databases, security and human-computer interaction.',
        'Includes a practical residency project and complementary activities. Final average 8.5.',
      ],
      pt: [
        'Curso interdisciplinar de 3.000 horas entre computação, administração e TI: engenharia de requisitos, arquitetura de software, bancos de dados, segurança e interação humano-computador.',
        'Inclui projeto de residência prática e atividades complementares. Média final 8,5.',
      ],
    },
  },
];

export const certifications: Bi[] = [
  {
    en: 'Game Design and Development 1: 2D Shooter — Michigan State University (May 2026)',
    pt: 'Game Design and Development 1: 2D Shooter — Michigan State University (mai 2026)',
  },
  {
    en: 'Advanced Topics on Software Testing and Quality Assurance — UFG (Aug 2024)',
    pt: 'Advanced Topics on Software Testing and Quality Assurance — UFG (ago 2024)',
  },
];

export const languages: Bi[] = [
  { en: 'Portuguese — native', pt: 'Português — nativo' },
  { en: 'English — advanced (C1, professional use)', pt: 'Inglês — avançado (C1, uso profissional)' },
];

/**
 * `group` ordena a lista conforme o foco escolhido: o grupo do foco sobe,
 * `core` fica no meio por valer para as duas vagas, o outro desce. Nada é
 * removido — só a ordem muda, e em CSS.
 */
export type SkillGroup = 'gamedev' | 'core' | 'fullstack';

export const skills: { label: Bi; group: SkillGroup; items: string[] }[] = [
  { label: { en: 'Games', pt: 'Jogos' }, group: 'gamedev', items: ['Unity', 'Unreal Engine 5', 'C#', 'C++', 'Gameplay Ability System', 'State Machines', 'Data-driven Design'] },
  { label: { en: 'Game AI', pt: 'IA para jogos' }, group: 'gamedev', items: ['HTN', 'GOAP', 'Behavior Trees', 'Reinforcement Learning', 'Multi-agent', 'Pathfinding'] },
  { label: { en: 'Backend', pt: 'Backend' }, group: 'fullstack', items: ['Python', 'FastAPI', 'Java', 'Spring Boot', 'REST APIs', 'RabbitMQ', 'Redis'] },
  { label: { en: 'Frontend', pt: 'Frontend' }, group: 'fullstack', items: ['TypeScript', 'Angular', 'React'] },
  { label: { en: 'Data', pt: 'Dados' }, group: 'fullstack', items: ['PostgreSQL', 'SQL Server', 'MongoDB'] },
  { label: { en: 'Architecture', pt: 'Arquitetura' }, group: 'core', items: ['DDD', 'Clean Architecture', 'Hexagonal', 'SOLID', 'Event-driven', 'TDD'] },
  { label: { en: 'DevOps', pt: 'DevOps' }, group: 'core', items: ['Git', 'Docker', 'CI/CD', 'GCP', 'Azure DevOps', 'Terraform', 'Grafana', 'Jaeger'] },
];

export const links = [
  { label: 'LinkedIn', url: 'https://www.linkedin.com/in/agacf/' },
  { label: 'GitHub', url: 'https://github.com/AndersonGACFilho' },
  { label: 'itch.io', url: 'https://vertex-shift.itch.io' },
  { label: 'E-mail', url: 'mailto:andersonfilho09@gmail.com' },
];

export const availability: ByFocus<Bi> = {
  all: {
    en: 'Based in Porto Alegre, Brazil (UTC−3). Open to remote contracts and to relocation, for gameplay programming as much as for backend and full stack roles.',
    pt: 'Baseado em Porto Alegre (UTC−3). Aberto a contratos remotos e a mudança de cidade ou país, tanto para gameplay quanto para vagas de backend e full stack.',
  },
  gamedev: {
    en: 'Based in Porto Alegre, Brazil (UTC−3). Open to remote contracts and relocation, targeting gameplay programmer and Game AI roles.',
    pt: 'Baseado em Porto Alegre (UTC−3). Aberto a contratos remotos e mudança de cidade ou país, mirando vagas de gameplay programmer e IA para jogos.',
  },
  fullstack: {
    en: 'Based in Porto Alegre, Brazil (UTC−3). Open to remote contracts and relocation, targeting backend, full stack and software architecture roles.',
    pt: 'Baseado em Porto Alegre (UTC−3). Aberto a contratos remotos e mudança de cidade ou país, mirando vagas de backend, full stack e arquitetura de software.',
  },
};

/**
 * Recommendations written on LinkedIn. The originals are in Portuguese —
 * the English column is a translation, and the page says so.
 */
export type Recommendation = {
  author: string;
  url: string;
  role: Bi;
  relation: Bi;
  date: Bi;
  text: Bi;
};

export const recommendations: Recommendation[] = [
  {
    author: 'Daniel Henrique Pinheiro',
    url: 'https://www.linkedin.com/in/danielpinheirohs/',
    role: {
      en: 'AI Specialist & Software Engineer · AI Architect',
      pt: 'Especialista em IA & Engenheiro de Software · Arquiteto de IA',
    },
    relation: {
      en: 'Directly supervised Anderson at CEIA',
      pt: 'Supervisionou Anderson diretamente no CEIA',
    },
    date: { en: '30 Oct 2025', pt: '30 de outubro de 2025' },
    text: {
      en: 'I had the pleasure of working directly with Anderson at CEIA during 2025, and my recommendation is absolute. He is the kind of developer who raises the level of the team. Beyond his excellent command of the technologies we used (Python and FastAPI), what really sets him apart is his initiative and his commitment to good architecture and clean code. He is proactive, communicative, and was constantly looking for ways to actively improve the structure of our codebase. He is a professional who cares about product quality in the long run. I strongly recommend him.',
      pt: 'Tive o prazer de trabalhar diretamente com o Anderson no CEIA durante 2025 e minha recomendação é absoluta. Ele é o tipo de desenvolvedor que eleva o nível do time. Além de seu excelente domínio das tecnologias utilizadas (Python e FastAPI), o que realmente o diferencia é sua proatividade e dedicação a boas práticas de arquitetura e código limpo. É proativo, comunicativo e estava constantemente buscando formas de melhorar ativamente a estrutura do nosso código. É um profissional que se preocupa com a qualidade do produto a longo prazo. Recomendo fortemente.',
    },
  },
  {
    author: 'José Miguel Ferreira Guimarães',
    url: 'https://www.linkedin.com/in/josemiguelferreiraguimaraes/',
    role: {
      en: 'Tech Lead in Digital Transformation · TOTVS RM ERP specialist',
      pt: 'Líder Técnico em Transformação Digital · Especialista em ERP TOTVS Linha RM',
    },
    relation: {
      en: 'Worked with Anderson at TOTVS Brasil Central, on a different team',
      pt: 'Trabalhou com Anderson na TOTVS Brasil Central, em equipes diferentes',
    },
    date: { en: '26 Aug 2025', pt: '26 de agosto de 2025' },
    text: {
      en: 'I strongly recommend Anderson, with whom I had the pleasure of working at TOTVS Brasil Central. As a full stack developer he showed impressive technical versatility and a solid ability to solve complex problems, moving nimbly between backend and frontend technologies. His skill stood out especially when he implemented an internal chatbot with RAG and LLM, a project that demonstrated his ability to create innovative, high-impact solutions. Anderson is a high-potential, collaborative professional who without a doubt adds immense value to any team.',
      pt: 'Recomendo fortemente o Anderson, com quem tive o prazer de trabalhar na TOTVS Brasil Central. Como Desenvolvedor Full Stack, ele demonstrou uma versatilidade técnica impressionante e uma sólida capacidade para resolver problemas complexos, transitando com agilidade entre tecnologias de back-end e front-end. Sua capacidade se destacou especialmente quando implementou um chatbot interno com RAG e LLM, um projeto que demonstrou sua habilidade em criar soluções inovadoras e de alto impacto. Anderson é um profissional de alto potencial, colaborativo e que, sem dúvida, agrega imenso valor a qualquer time.',
    },
  },
];

export const recommendationsNote: Bi = {
  en: 'Written on LinkedIn, in Portuguese; translated here.',
  pt: 'Escritas no LinkedIn, no original em português.',
};

export const pick = <T,>(value: { en: T; pt: T }, lang: Lang): T => value[lang] ?? value.en;
