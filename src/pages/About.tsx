export default function About() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
      <span className="specimen-tag">Sobre</span>
      <h1 className="font-display text-3xl font-semibold mt-4 mb-6">Sobre a Scientia Periodica</h1>

      <div className="flex flex-col gap-5 text-ink-700 leading-relaxed">
        <p>
          A Scientia Periodica é um periódico científico semanal escrito por jovens estudantes e cientistas em
          formação. A cada edição, reunimos artigos sobre astronomia, biologia, física, química,
          matemática, tecnologia e outras áreas da ciência — escritos por quem está aprendendo a pensar
          cientificamente, para quem também quer aprender.
        </p>
        <p>
          Acreditamos que escrever sobre ciência é uma das melhores formas de aprender ciência. Por
          isso, a Scientia Periodica funciona como uma redação de verdade: autores enviam seus textos, uma equipe
          editorial revisa, sugere correções quando necessário, e os textos aprovados entram na próxima
          edição semanal.
        </p>
        <p>
          Não somos uma publicação acadêmica revisada por pares no sentido formal — somos um espaço de
          prática, orientação e crescimento. Os artigos refletem o esforço e o processo de aprendizagem
          de seus autores, com o apoio da equipe editorial para garantir clareza, precisão e boa forma.
        </p>
        <p>
          Se você é estudante e quer contribuir com um artigo, veja nossas{' '}
          <a href="/diretrizes-autores" className="text-brass-600 hover:underline">
            diretrizes para autores
          </a>
          .
        </p>
      </div>
    </div>
  );
}
