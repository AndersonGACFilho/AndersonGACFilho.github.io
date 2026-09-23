/**
 * Career data for the CV page, in both languages.
 * Source: Anderson's own CV (Sep 2026). Phone number deliberately left out —
 * the site is public.
 */
import type { Lang } from './ui';

type Bi = { en: string; pt: string };
export type Entry = {
  role: Bi;
  org: string;
  url?: string;
  period: Bi;
  place: Bi;
  tech?: string[];
  bullets: { en: string[]; pt: string[] };
};

export const headline: Bi = {
  en: 'Software developer · MSc candidate in AI · Teaching programming',
  pt: 'Desenvolvedor de software · Mestrando em IA · Ensino de programação',
};

export const profile: Bi = {
  en: 'BSc in Information Systems from UFG and MSc candidate in Computer Science / AI at UFRGS. Four-plus years building corporate systems and software products across backend, frontend, databases, testing, architecture and integrations — plus three academic teaching-assistant terms at UFG and a year writing gameplay systems in Unreal Engine 5.',
  pt: 'Bacharel em Sistemas de Informação pela UFG e mestrando em Ciência da Computação / IA na UFRGS. Mais de quatro anos construindo sistemas corporativos e produtos de software entre backend, frontend, bancos de dados, testes, arquitetura e integrações — somados a três vínculos de monitoria na UFG e um ano escrevendo sistemas de gameplay em Unreal Engine 5.',
};

export const experience: Entry[] = [
  {
    role: { en: 'Full Stack Developer', pt: 'Desenvolvedor Full Stack' },
    org: 'econtrole — waste management software',
    period: { en: 'Nov 2025 – Jul 2026', pt: 'nov 2025 – jul 2026' },
    place: { en: 'Remote', pt: 'Remoto' },
    tech: ['Python', 'FastAPI', 'Angular', 'PostgreSQL', 'Redis', 'RabbitMQ', 'Docker'],
    bullets: {
      en: [
        'Built a production platform end to end, from the Angular front end to asynchronous workers behind RabbitMQ.',
        'Applied DDD, modular architecture and SOLID, with automated tests, external integrations and async processing.',
        'Took part in technical documentation, code review, CI/CD, troubleshooting and architectural evolution.',
      ],
      pt: [
        'Construí uma plataforma de produção ponta a ponta, do front em Angular aos workers assíncronos atrás do RabbitMQ.',
        'Apliquei DDD, arquitetura modular e SOLID, com testes automatizados, integrações externas e processamento assíncrono.',
        'Participei de documentação técnica, revisão de código, CI/CD, troubleshooting e evolução arquitetural.',
      ],
    },
  },
  {
    role: { en: 'Backend Software Engineer — AI systems', pt: 'Engenheiro de Software Backend — Sistemas de IA' },
    org: 'CEIA',
    period: { en: 'Apr 2025 – Apr 2026', pt: 'abr 2025 – abr 2026' },
    place: { en: 'Goiânia, BR', pt: 'Goiânia, GO' },
    tech: ['Python', 'FastAPI', 'Docker', 'Clean Architecture', 'TDD'],
    bullets: {
      en: [
        'Wrote APIs and asynchronous services in Python/FastAPI for AI-driven platforms.',
        'Worked with clean and hexagonal architecture, DDD, TDD, static analysis and API versioning.',
        'Turned research and product requirements into production software alongside multidisciplinary teams.',
      ],
      pt: [
        'Escrevi APIs e serviços assíncronos em Python/FastAPI para plataformas orientadas a IA.',
        'Trabalhei com arquitetura limpa e hexagonal, DDD, TDD, análise estática e versionamento de APIs.',
        'Transformei requisitos de pesquisa e de produto em software de produção com equipes multidisciplinares.',
      ],
    },
  },
  {
    role: { en: 'Full Stack Developer', pt: 'Desenvolvedor Full Stack' },
    org: 'TOTVS Brasil Central',
    period: { en: 'Nov 2024 – Apr 2025', pt: 'nov 2024 – abr 2025' },
    place: { en: 'Goiânia, BR', pt: 'Goiânia, GO' },
    tech: ['Python', 'Java', 'TypeScript', 'Angular', 'React', 'Spring Boot', 'MongoDB'],
    bullets: {
      en: [
        'Built internal tools and features across a polyglot stack, from Spring Boot services to Angular and React front ends.',
        'Shipped an internal assistant using RAG/LLM, plus process automations.',
        'Contributed to testing, documentation and support.',
      ],
      pt: [
        'Construí ferramentas e funcionalidades internas numa stack poliglota, de serviços Spring Boot a front-ends Angular e React.',
        'Entreguei um assistente interno com RAG/LLM, além de automações de processos.',
        'Contribuí em testes, documentação e suporte.',
      ],
    },
  },
  {
    role: { en: 'Game Developer — Unreal Engine / C++', pt: 'Desenvolvedor de Jogos — Unreal Engine / C++' },
    org: 'LabTIME / UFG',
    period: { en: 'Nov 2023 – Nov 2024', pt: 'nov 2023 – nov 2024' },
    place: { en: 'Goiânia, BR', pt: 'Goiânia, GO' },
    tech: ['Unreal Engine 5', 'C++'],
    bullets: {
      en: [
        'Wrote gameplay systems in C++/Unreal Engine 5, with reusable components and modular features.',
        'Took part in architecture, debugging, technical documentation and code review.',
      ],
      pt: [
        'Escrevi sistemas de gameplay em C++/Unreal Engine 5, com componentes reutilizáveis e funcionalidades modulares.',
        'Participei de arquitetura, debugging, documentação técnica e revisão de código.',
      ],
    },
  },
  {
    role: { en: 'Full Stack Software Engineering Intern', pt: 'Estagiário de Engenharia de Software Full Stack' },
    org: 'TOTVS',
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
        'Twelve weekly hours per term supporting students, including learners with disabilities and students facing difficulty.',
        'Backed the supervising professor in preparing and running class activities, through Moodle and Teams.',
      ],
      pt: [
        'Doze horas semanais por vínculo acompanhando estudantes, incluindo alunos com deficiência e com dificuldade de aprendizagem.',
        'Apoiei o professor orientador na organização e execução das atividades didáticas, via Moodle e Teams.',
      ],
    },
  },
];

export const education: Entry[] = [
  {
    role: { en: 'MSc in Computer Science / Artificial Intelligence', pt: 'Mestrado em Ciência da Computação / Inteligência Artificial' },
    org: 'Universidade Federal do Rio Grande do Sul (UFRGS)',
    period: { en: 'Feb 2026 – Mar 2028 (expected)', pt: 'fev 2026 – mar 2028 (previsto)' },
    place: { en: 'Porto Alegre, BR', pt: 'Porto Alegre, RS' },
    bullets: {
      en: ['Research on reinforcement learning, hierarchical planning and multi-agent systems.'],
      pt: ['Pesquisa em aprendizado por reforço, planejamento hierárquico e sistemas multiagentes.'],
    },
  },
  {
    role: { en: 'BSc in Information Systems', pt: 'Bacharelado em Sistemas de Informação' },
    org: 'Universidade Federal de Goiás (UFG)',
    period: { en: 'Feb 2020 – Jun 2025', pt: 'fev 2020 – jun 2025' },
    place: { en: 'Goiânia, BR', pt: 'Goiânia, GO' },
    bullets: {
      en: ['Emphasis on software engineering, backend development, AI and computing fundamentals.'],
      pt: ['Ênfase em engenharia de software, desenvolvimento backend, IA e fundamentos de computação.'],
    },
  },
];

export const certifications: Bi[] = [
  {
    en: 'Advanced Topics on Software Testing and Quality Assurance — UFG / Penn State University',
    pt: 'Advanced Topics on Software Testing and Quality Assurance — UFG / Penn State University',
  },
];

export const languages: Bi[] = [
  { en: 'Portuguese — native', pt: 'Português — nativo' },
  { en: 'English — advanced (C1, professional use)', pt: 'Inglês — avançado (C1, uso profissional)' },
];

export const skills: { label: Bi; items: string[] }[] = [
  { label: { en: 'Languages', pt: 'Linguagens' }, items: ['Python', 'Java', 'TypeScript', 'C#', 'C++'] },
  { label: { en: 'Backend', pt: 'Backend' }, items: ['FastAPI', 'Spring Boot', 'REST APIs', 'RabbitMQ', 'Redis'] },
  { label: { en: 'Frontend', pt: 'Frontend' }, items: ['Angular', 'React', 'TypeScript', 'SPA'] },
  { label: { en: 'Data', pt: 'Dados' }, items: ['PostgreSQL', 'SQL Server', 'MongoDB', 'Redis'] },
  { label: { en: 'Games', pt: 'Jogos' }, items: ['Unity', 'Unreal Engine 5', 'C#', 'C++', 'Gameplay Ability System'] },
  { label: { en: 'AI', pt: 'IA' }, items: ['Reinforcement Learning', 'HTN', 'GOAP', 'Behavior Trees', 'Multi-agent'] },
  { label: { en: 'DevOps', pt: 'DevOps' }, items: ['Git', 'Docker', 'CI/CD', 'GCP', 'Azure DevOps', 'Terraform'] },
];

export const links = [
  { label: 'LinkedIn', url: 'https://www.linkedin.com/in/agacf/' },
  { label: 'GitHub', url: 'https://github.com/AndersonGACFilho' },
  { label: 'itch.io', url: 'https://vertex-shift.itch.io' },
  { label: 'E-mail', url: 'mailto:andersonfilho09@gmail.com' },
];

export const pick = <T,>(value: { en: T; pt: T }, lang: Lang): T => value[lang] ?? value.en;
