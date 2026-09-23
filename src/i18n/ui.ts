export const languages = { en: 'English', pt: 'Português' } as const;
export type Lang = keyof typeof languages;
export const defaultLang: Lang = 'en';

export const ui = {
  en: {
    'nav.home': 'Home',
    'nav.projects': 'Projects',
    'nav.games': 'Games',
    'nav.research': 'Research',
    'nav.articles': 'Articles',
    'nav.teaching': 'Teaching',
    'nav.cv': 'CV',
    'site.tagline': 'Gameplay programmer, backend engineer and Game AI researcher',
    'hero.role': 'Gameplay Programmer · Backend Engineer · Game AI Researcher',
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
    'section.articles': 'Latest articles',
    'section.teaching': 'Teaching',
    'cta.all.projects': 'All projects',
    'cta.all.articles': 'All articles',
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
    'label.soon': 'Build coming soon',
    'label.controls': 'Controls',
    'label.fullscreen': 'Fullscreen',
    'label.filter': 'Filter',
    'label.all': 'All',
    'section.publications': 'Publications',
    'section.notes': 'Notes',
    'publications.empty': 'Peer-reviewed papers will be listed here.',
    'venue.published': 'In the proceedings of',
    'venue.accepted': 'To appear in',
    'venue.submitted': 'Under review at',
    'venue.in-preparation': 'In preparation for',
    'cta.proceedings': 'Proceedings',
    'articles.empty': 'No articles published yet — the first ones are being written.',
    'articles.intro': 'Notes and papers on game AI, planning and gameplay engineering.',
    'projects.intro': 'Selected work across gameplay, backend and research.',
    'games.intro': 'Playable prototypes, running right here in the page.',
    'play.fallback': 'The build is not published here yet. In the meantime:',
    'teaching.intro':
      'I teach the Systems Programmer course at Senac RS. The slide decks are open and published as HTML.',
    'teaching.cta': 'Open the slides',
    'footer.built': 'Built with Astro, hosted on GitHub Pages.',
    'lang.switch': 'Português',
    'notfound.title': 'Page not found',
    'notfound.body': 'That page does not exist. Try the home page.',
  },
  pt: {
    'nav.home': 'Início',
    'nav.projects': 'Projetos',
    'nav.games': 'Jogos',
    'nav.research': 'Pesquisa',
    'nav.articles': 'Artigos',
    'nav.teaching': 'Aulas',
    'nav.cv': 'Currículo',
    'site.tagline': 'Programador de gameplay, engenheiro de backend e pesquisador de IA para jogos',
    'hero.role': 'Programador de Gameplay · Engenheiro de Backend · Pesquisador de IA para Jogos',
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
    'section.articles': 'Artigos recentes',
    'section.teaching': 'Aulas',
    'cta.all.projects': 'Todos os projetos',
    'cta.all.articles': 'Todos os artigos',
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
    'label.soon': 'Build em breve',
    'label.controls': 'Controles',
    'label.fullscreen': 'Tela cheia',
    'label.filter': 'Filtrar',
    'label.all': 'Tudo',
    'section.publications': 'Publicações',
    'section.notes': 'Notas',
    'publications.empty': 'Os artigos revisados por pares aparecem aqui.',
    'venue.published': 'Nos anais de',
    'venue.accepted': 'A sair em',
    'venue.submitted': 'Em avaliação em',
    'venue.in-preparation': 'Em preparação para',
    'cta.proceedings': 'Anais',
    'articles.empty': 'Nenhum artigo publicado ainda — os primeiros estão sendo escritos.',
    'articles.intro': 'Notas e artigos sobre IA para jogos, planejamento e engenharia de gameplay.',
    'projects.intro': 'Trabalhos selecionados em gameplay, backend e pesquisa.',
    'games.intro': 'Protótipos jogáveis, rodando aqui mesmo na página.',
    'play.fallback': 'O build ainda não está publicado aqui. Enquanto isso:',
    'teaching.intro':
      'Leciono o curso de Programador de Sistemas no Senac RS. Os slides são abertos e publicados em HTML.',
    'teaching.cta': 'Abrir os slides',
    'footer.built': 'Feito com Astro, hospedado no GitHub Pages.',
    'lang.switch': 'English',
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
