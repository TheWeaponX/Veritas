export default function AuthorGuidelines() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
      <span className="specimen-tag">Diretrizes para autores</span>
      <h1 className="font-display text-3xl font-semibold mt-4 mb-6">Como publicar na Scientia Periodica</h1>

      <div className="flex flex-col gap-6 text-ink-700 leading-relaxed">
        <section>
          <h2 className="font-display text-lg font-semibold text-ink-900 mb-2">1. Crie sua conta</h2>
          <p>
            Cadastros novos começam como leitor. Peça a um administrador para promover sua conta a autor
            — só assim o painel de criação de artigos fica disponível.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-ink-900 mb-2">2. Escreva seu artigo</h2>
          <p>Estrutura recomendada, embora não obrigatória:</p>
          <ul className="list-disc list-inside mt-2 flex flex-col gap-1">
            <li>Um resumo curto explicando do que trata o texto</li>
            <li>Introdução ao tema</li>
            <li>Desenvolvimento com os conceitos principais</li>
            <li>Aplicações ou exemplos concretos</li>
            <li>Conclusão</li>
            <li>Referências, quando você usou fontes específicas</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-ink-900 mb-2">3. Escreva para quem está aprendendo</h2>
          <p>
            O leitor da Scientia Periodica não é um especialista. Evite jargão sem explicação, prefira frases
            diretas e use exemplos do dia a dia sempre que ajudar a entender um conceito.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-ink-900 mb-2">4. Cite suas fontes</h2>
          <p>
            Se você se baseou em um livro, artigo ou site específico, adicione a referência na tela de
            edição do artigo. Isso dá credibilidade ao texto e ajuda o leitor a ir mais fundo no assunto.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-ink-900 mb-2">5. Envie para revisão</h2>
          <p>
            Quando terminar, clique em "Enviar para revisão". Um editor vai ler seu texto e pode aprovar,
            pedir ajustes (com um comentário explicando o quê) ou, em alguns casos, não aprovar. Se pedirem
            ajustes, você pode editar e reenviar quantas vezes precisar.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-ink-900 mb-2">6. Aguarde a próxima edição</h2>
          <p>
            Artigos aprovados não vão ao ar na hora — eles esperam a montagem da próxima edição semanal,
            publicada com os demais textos aprovados daquela semana.
          </p>
        </section>
      </div>
    </div>
  );
}
