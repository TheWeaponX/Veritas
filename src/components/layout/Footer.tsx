import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-ink-950 text-ink-100 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="col-span-2 md:col-span-1">
          <p className="font-display text-lg text-paper-50 mb-2">Scientia Periodica</p>
          <p className="text-sm text-ink-300">Conhecimento científico, organizado para todos.</p>
        </div>
        <div className="flex flex-col gap-2 text-sm">
          <span className="text-ink-500 font-mono text-xs uppercase tracking-wider mb-1">Navegar</span>
          <Link to="/temas" className="hover:text-brass-400">Temas</Link>
          <Link to="/autores" className="hover:text-brass-400">Autores</Link>
          <Link to="/pesquisa" className="hover:text-brass-400">Pesquisar</Link>
        </div>
        <div className="flex flex-col gap-2 text-sm">
          <span className="text-ink-500 font-mono text-xs uppercase tracking-wider mb-1">Sobre</span>
          <Link to="/sobre" className="hover:text-brass-400">Sobre o projeto</Link>
          <Link to="/politica-editorial" className="hover:text-brass-400">Política editorial</Link>
          <Link to="/diretrizes-autores" className="hover:text-brass-400">Diretrizes para autores</Link>
        </div>
        <div className="flex flex-col gap-2 text-sm">
          <span className="text-ink-500 font-mono text-xs uppercase tracking-wider mb-1">Contato</span>
          <a href="mailto:contato@scientiaperiodica.com" className="hover:text-brass-400">contato@scientiaperiodica.com</a>
        </div>
      </div>
    </footer>
  );
}
