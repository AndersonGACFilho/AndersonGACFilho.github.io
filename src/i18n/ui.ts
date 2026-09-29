export const languages = { en: 'English', pt: 'Português' } as const;
export type Lang = keyof typeof languages;
export const defaultLang: Lang = 'en';

export const ui = {
  en: {
    'nav.home': 'Home',
    'nav.projects': 'Projects',
    'nav.games': 'Games',
    'nav.research': 'Research',
    'nav.publications': 'Publications',
    'nav.teaching': 'Teaching',
    'nav.cv': 'CV',
    'site.tagline': 'Gameplay programmer, backend engineer and Game AI researcher',
    'site.description': 'Gameplay programmer and backend engineer in Porto Alegre, researching Game AI at UFRGS. Five prototypes play in the browser, with nothing to download.',
    'hero.role': 'Gameplay programmer, backend engineer, Game AI researcher',
    'hero.blurb':
      'I build gameplay systems in Unity and Unreal, the backend services that keep them running, and I research how planning and reinforcement learning can make NPCs worth playing against. MSc in Computer Science at UFRGS.',
    'hero.cta.play': 'Play something',
    'hero.cta.projects': 'See the projects',
    'track.fullstack': 'Fullstack',
    'track.gamedev': 'Game Dev',
    'track.research': 'Game AI Research',
    'track.fullstack.desc': 'APIs, distributed systems and the services behind the game.',
    'track.gamedev.desc': 'Unity and Unreal gameplay systems, tools and shipped prototypes.',
    'track.research.desc': 'HTN planning, multi-objective RL and agents that adapt.',
    'section.play': 'Play in your browser',
    'section.play.sub': 'No download, no launcher. Click and play.',
    'section.tracks': 'Three tracks, one practice',
    'section.projects': 'Featured projects',
    'section.publications': 'Latest publications',
    'section.teaching': 'Teaching',
    'cta.all.projects': 'All projects',
    'cta.all.publications': 'All publications',
    'cta.all.games': 'All games',
    'cta.play': 'Play',
    'cta.source': 'Source',
    'cta.itch': 'itch.io',
    'cta.read': 'Read',
    'cta.back': 'Back',
    'label.private': 'Private repo',
    'status.planned': 'Planned',
    'status.wip': 'In progress',
    'label.stars': 'stars',
    'label.updated': 'Updated',
    'label.soon': 'No playable build here yet',
    'label.controls': 'Controls',
    'label.about': 'About this one',
    'label.fullscreen': 'Fullscreen',
    'label.cinema': 'Cinema mode',
    'label.close': 'Close',
    'label.filter': 'Filter',
    'label.all': 'All',
    'venue.published': 'In the proceedings of',
    'venue.accepted': 'To appear in',
    'venue.submitted': 'Under review at',
    'venue.in-preparation': 'In preparation for',
    'cta.proceedings': 'Proceedings',
    'kicker.projects': 'What I build, across the three tracks',
    'kicker.games': 'Unity builds that run in this page',
    'kicker.publications': 'Papers and notes',
    'kicker.teaching': 'Courses I teach, and the material behind them',
    'kicker.cv': 'Porto Alegre, Brazil. Open to remote work.',
    'teaching.stat.classes': 'sessions',
    'teaching.stat.hours': 'hours per session',
    'teaching.stat.format': 'Marp + Mermaid',
    'teaching.stat.open': 'open HTML',
    'teaching.what': 'What the unit covers',
    'games.count': 'prototypes. They also live on itch.io as',
    'publications.empty': 'Nothing published yet — the first papers and notes are being written.',
    'publications.intro': 'Notes and papers on game AI, planning and gameplay engineering.',
    'projects.intro': 'Selected work across gameplay, backend and research.',
    'games.intro': 'Playable prototypes, running right here in the page.',
    'play.fallback': 'The build is not published here yet. In the meantime:',
    'teaching.intro':
      'Every unit I teach publishes its material here: slide decks, self-check exercises and the submission forms, open and in HTML. Units another teacher runs, or that I have not written yet, are listed too — so you can see the whole course, not only the part that is ready.',
    'teaching.cta': 'Open the material',
    'teaching.status.live': 'published',
    'teaching.status.wip': 'in preparation',
    'teaching.status.other': 'another teacher',
    'footer.built': 'Built with Astro, hosted on GitHub Pages.',
    'lang.switch': 'Português',
    'theme.switch': 'Theme',
    'theme.system': 'System',
    'theme.light': 'Light',
    'theme.dark': 'Dark',
    'notfound.title': 'Page not found',
    'notfound.body': 'That page does not exist. Try the home page.',
  },
  pt: {
    'nav.home': 'Início',
    'nav.projects': 'Projetos',
    'nav.games': 'Jogos',
    'nav.research': 'Pesquisa',
    'nav.publications': 'Publicações',
    'nav.teaching': 'Aulas',
    'nav.cv': 'Currículo',
    'site.tagline': 'Programador de gameplay, engenheiro de backend e pesquisador de IA para jogos',
    'site.description': 'Programador de gameplay e engenheiro de backend em Porto Alegre, pesquisando IA para jogos na UFRGS. Cinco protótipos rodam no navegador, sem baixar nada.',
    'hero.role': 'Programador de gameplay, engenheiro de backend, pesquisador de IA para jogos',
    'hero.blurb':
      'Construo sistemas de gameplay em Unity e Unreal, os serviços de backend que os sustentam, e pesquiso como planejamento e aprendizado por reforço podem gerar NPCs que valem a pena enfrentar. Mestrado em Computação na UFRGS.',
    'hero.cta.play': 'Jogar agora',
    'hero.cta.projects': 'Ver os projetos',
    'track.fullstack': 'Fullstack',
    'track.gamedev': 'Game Dev',
    'track.research': 'Pesquisa em IA para Jogos',
    'track.fullstack.desc': 'APIs, sistemas distribuídos e os serviços por trás do jogo.',
    'track.gamedev.desc': 'Sistemas de gameplay em Unity e Unreal, ferramentas e protótipos publicados.',
    'track.research.desc': 'Planejamento HTN, RL multiobjetivo e agentes que se adaptam.',
    'section.play': 'Jogue no navegador',
    'section.play.sub': 'Sem download, sem launcher. Clique e jogue.',
    'section.tracks': 'Três frentes, uma prática',
    'section.projects': 'Projetos em destaque',
    'section.publications': 'Publicações recentes',
    'section.teaching': 'Aulas',
    'cta.all.projects': 'Todos os projetos',
    'cta.all.publications': 'Todas as publicações',
    'cta.all.games': 'Todos os jogos',
    'cta.play': 'Jogar',
    'cta.source': 'Código',
    'cta.itch': 'itch.io',
    'cta.read': 'Ler',
    'cta.back': 'Voltar',
    'label.private': 'Repositório privado',
    'status.planned': 'Planejado',
    'status.wip': 'Em andamento',
    'label.stars': 'estrelas',
    'label.updated': 'Atualizado',
    'label.soon': 'Ainda sem build jogável aqui',
    'label.controls': 'Controles',
    'label.about': 'Sobre este aqui',
    'label.fullscreen': 'Tela cheia',
    'label.cinema': 'Modo cinema',
    'label.close': 'Fechar',
    'label.filter': 'Filtrar',
    'label.all': 'Tudo',
    'venue.published': 'Nos anais de',
    'venue.accepted': 'A sair em',
    'venue.submitted': 'Em avaliação em',
    'venue.in-preparation': 'Em preparação para',
    'cta.proceedings': 'Anais',
    'kicker.projects': 'O que eu construo, nas três trilhas',
    'kicker.games': 'Builds Unity que rodam nesta página',
    'kicker.publications': 'Artigos e notas',
    'kicker.teaching': 'Os cursos que eu dou, e o material por trás deles',
    'kicker.cv': 'Porto Alegre. Aberto a trabalho remoto.',
    'teaching.stat.classes': 'aulas',
    'teaching.stat.hours': 'horas por aula',
    'teaching.stat.format': 'Marp + Mermaid',
    'teaching.stat.open': 'HTML aberto',
    'teaching.what': 'O que a unidade cobre',
    'games.count': 'protótipos. Eles também vivem na itch.io como',
    'publications.empty': 'Nada publicado ainda — os primeiros artigos e notas estão sendo escritos.',
    'publications.intro': 'Notas e artigos sobre IA para jogos, planejamento e engenharia de gameplay.',
    'projects.intro': 'Trabalhos selecionados em gameplay, backend e pesquisa.',
    'games.intro': 'Protótipos jogáveis, rodando aqui mesmo na página.',
    'play.fallback': 'O build ainda não está publicado aqui. Enquanto isso:',
    'teaching.intro':
      'Toda unidade que eu dou publica o material aqui: slides, exercícios de autocorreção e os formulários de entrega, abertos e em HTML. As unidades de outro docente, ou que eu ainda não escrevi, também aparecem — para você ver o curso inteiro, e não só a parte pronta.',
    'teaching.cta': 'Abrir o material',
    'teaching.status.live': 'no ar',
    'teaching.status.wip': 'em preparação',
    'teaching.status.other': 'outro docente',
    'footer.built': 'Feito com Astro, hospedado no GitHub Pages.',
    'lang.switch': 'English',
    'theme.switch': 'Tema',
    'theme.system': 'Sistema',
    'theme.light': 'Claro',
    'theme.dark': 'Escuro',
    'notfound.title': 'Página não encontrada',
    'notfound.body': 'Essa página não existe. Tente a página inicial.',
  },
} as const;

export type UIKey = keyof (typeof ui)['en'];

export function useTranslations(lang: Lang) {
  return function t(key: UIKey): string {
    return (ui[lang] as Record<string, string>)[key] ?? ui[defaultLang][key];
  };
}

/** Prefix a root-relative path with the locale (English lives at the root). */
export function localize(path: string, lang: Lang): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  return lang === defaultLang ? clean : `/${lang}${clean === '/' ? '' : clean}`;
}

/** Strip the locale prefix, so LangSwitch can rebuild the path in the other language. */
export function stripLocale(pathname: string): string {
  const withoutBase = pathname.replace(/^\/pt(?=\/|$)/, '');
  return withoutBase === '' ? '/' : withoutBase;
}

export function otherLang(lang: Lang): Lang {
  return lang === 'en' ? 'pt' : 'en';
}

export function formatDate(date: Date, lang: Lang): string {
  return new Intl.DateTimeFormat(lang === 'pt' ? 'pt-BR' : 'en-GB', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}
