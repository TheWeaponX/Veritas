export default function EditorialPolicy() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
      <span className="specimen-tag">Política editorial</span>
      <h1 className="font-display text-3xl font-semibold mt-4 mb-6">Como revisamos e publicamos</h1>

      <div className="flex flex-col gap-6 text-ink-700 leading-relaxed">
        <section>
          <h2 className="font-display text-lg font-semibold text-ink-900 mb-2">O processo de revisão</h2>
          <p>
            Todo artigo enviado passa pela leitura de um editor ou administrador antes de ir ao ar. A
            revisão pode terminar de três formas: aprovação (o texto entra na fila da próxima edição),
            solicitação de alterações (o autor recebe um comentário explicando o que ajustar e pode
            reenviar) ou rejeição (o texto não segue para publicação nesse formato).
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-ink-900 mb-2">O que avaliamos</h2>
          <p>
            Clareza da explicação, precisão das informações, uso adequado de referências quando o tema
            exige, e adequação ao tom da publicação — divulgação científica acessível, não um trabalho
            acadêmico formal nem um texto opinativo.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-ink-900 mb-2">Publicação em edições</h2>
          <p>
            Não publicamos artigo por artigo, à medida que ficam prontos. Textos aprovados aguardam a
            montagem da próxima edição semanal, quando são publicados todos juntos.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-ink-900 mb-2">Correções após a publicação</h2>
          <p>
            Erros acontecem. Se um leitor ou autor identificar um erro factual em um artigo já publicado,
            pode entrar em contato pelo e-mail no rodapé do site — correções relevantes são aplicadas e,
            quando o caso pedir, sinalizadas no próprio artigo.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-ink-900 mb-2">Sobre os autores</h2>
          <p>
            Muitos dos nossos autores são adolescentes e jovens em formação. A equipe editorial leva isso
            em conta durante a revisão — o objetivo é orientar e ajudar a melhorar o texto, não aplicar o
            mesmo padrão de rigor de uma publicação acadêmica profissional.
          </p>
        </section>
      </div>
    </div>
  );
}
