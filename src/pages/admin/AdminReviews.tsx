import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, XCircle, MessageSquareWarning } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { listSubmittedArticles, approveArticle, rejectArticle, requestChangesOnArticle } from '../../services/articles';
import { createReview } from '../../services/reviews';
import { sendNotificationEmail } from '../../services/email';
import ArticleBody from '../../components/article/ArticleBody';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { BookTemplate } from '../../components/BookTemplate';

export default function AdminReviews() {
  const { profile } = useAuth();
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState<string | null>(null);
  const [commentDraft, setCommentDraft] = useState('');
  const [busyId, setBusyId] = useState<string | null>(null);

  async function reload() {
    const data = await listSubmittedArticles();
    setArticles(data);
    setLoading(false);
  }

  useEffect(() => {
    reload();
  }, []);

  async function handleApprove(articleId: string) {
    if (!profile) return;
    setBusyId(articleId);
    try {
      await approveArticle(articleId);
      await createReview(articleId, profile.id, 'approved', 'Aprovado. Aguardando entrar em uma edição.');
      
      const article = articles.find((a) => a.id === articleId);
      if (article && article.users?.email) {
        await sendNotificationEmail(
          article.users.email,
          article.users.name || 'Autor',
          article.title,
          'O seu artigo foi aprovado e encontra-se na fila para publicação na próxima edição!'
        );
      }

      await reload();
    } finally {
      setBusyId(null);
    }
  }

  async function handleReject(articleId: string) {
    if (!profile) return;
    if (!window.confirm('Tem certeza que quer rejeitar este artigo?')) return;
    setBusyId(articleId);
    try {
      await rejectArticle(articleId);
      await createReview(articleId, profile.id, 'rejected', commentDraft || null);
      
      const article = articles.find((a) => a.id === articleId);
      if (article && article.users?.email) {
        await sendNotificationEmail(
          article.users.email,
          article.users.name || 'Autor',
          article.title,
          `O seu artigo foi infelizmente rejeitado. Observação do revisor: ${commentDraft || 'Sem observações adicionais.'}`
        );
      }

      setCommentDraft('');
      setOpenId(null);
      await reload();
    } finally {
      setBusyId(null);
    }
  }

  async function handleRequestChanges(articleId: string) {
    if (!profile) return;
    if (!commentDraft.trim()) {
      alert('Escreva uma observação explicando o que precisa mudar.');
      return;
    }
    setBusyId(articleId);
    try {
      await requestChangesOnArticle(articleId);
      await createReview(articleId, profile.id, 'changes_requested', commentDraft);
      
      const article = articles.find((a) => a.id === articleId);
      if (article && article.users?.email) {
        await sendNotificationEmail(
          article.users.email,
          article.users.name || 'Autor',
          article.title,
          `Foram solicitadas alterações no seu artigo. Observação do revisor: ${commentDraft}`
        );
      }

      setCommentDraft('');
      setOpenId(null);
      await reload();
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold mb-1">Revisão de artigos</h1>
      <p className="text-sm text-ink-500 mb-4">Artigos enviados por autores, aguardando decisão.</p>

      {/* BLOCO DE TESTE DO GERADOR DE PDF */}
      <div className="mb-8 p-4 bg-paper-50 rounded-sm border border-ink-100">
        <p className="mb-3 text-sm font-semibold text-ink-950">Teste do Gerador Académico:</p>
        <PDFDownloadLink
          document={
            <BookTemplate 
              title="A Origem das Espécies" 
              author="Charles Darwin" 
              content="Esta é a edição comentada exclusiva da Scientia Periodica. O texto flui automaticamente, as margens são respeitadas e as quebras de página são geradas sozinhas! O nosso acervo de domínio público começa aqui." 
            />
          }
          fileName="Scientia_Periodica_Darwin.pdf"
          className="inline-flex items-center justify-center bg-ink-950 text-brass-400 hover:text-brass-300 px-4 py-2 rounded-sm text-sm font-medium transition"
        >
          {({ loading }) => (loading ? 'A diagramar livro...' : 'Descarregar PDF de Teste')}
        </PDFDownloadLink>
      </div>

      {loading ? (
        <p className="text-sm text-ink-500">Carregando...</p>
      ) : articles.length === 0 ? (
        <p className="text-sm text-ink-500 border border-dashed border-ink-100 rounded-sm p-8 text-center">
          Nenhum artigo aguardando revisão no momento.
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {articles.map((a) => {
            const isOpen = openId === a.id;
            const isBusy = busyId === a.id;
            return (
              <div key={a.id} className="border border-ink-100 rounded-sm bg-paper-50">
                <div className="flex items-center justify-between px-4 py-3">
                  <div>
                    <p className="font-display text-lg font-medium">{a.title}</p>
                    <p className="text-xs text-ink-500 mt-0.5">
                      por {a.users?.name ?? 'autor desconhecido'}
                      {a.themes?.name && ` · ${a.themes.name}`}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setOpenId(isOpen ? null : a.id);
                      setCommentDraft('');
                    }}
                    className="text-sm text-brass-600 hover:text-brass-500"
                  >
                    {isOpen ? 'Fechar' : 'Ler artigo'}
                  </button>
                </div>

                {isOpen && (
                  <div className="border-t border-ink-100 px-4 py-4">
                    {a.summary && <p className="text-sm text-ink-600 italic mb-3">{a.summary}</p>}
                    <div className="max-h-80 overflow-y-auto border border-ink-100 rounded-sm bg-white p-3 text-sm">
                      <ArticleBody content={a.content} />
                    </div>

                    <textarea
                      value={commentDraft}
                      onChange={(e) => setCommentDraft(e.target.value)}
                      placeholder="Observação para o autor (obrigatória ao solicitar alterações)"
                      rows={2}
                      className="w-full mt-3 border border-ink-100 rounded-sm px-3 py-2 text-sm bg-white"
                    />

                    <div className="flex flex-wrap gap-2 mt-3">
                      <button
                        disabled={isBusy}
                        onClick={() => handleApprove(a.id)}
                        className="flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium px-3 py-2 rounded-sm disabled:opacity-50"
                      >
                        <CheckCircle2 size={15} /> Aprovar (fila da próxima edição)
                      </button>
                      <button
                        disabled={isBusy}
                        onClick={() => handleRequestChanges(a.id)}
                        className="flex items-center gap-1.5 bg-brass-500 hover:bg-brass-400 text-ink-950 text-sm font-medium px-3 py-2 rounded-sm disabled:opacity-50"
                      >
                        <MessageSquareWarning size={15} /> Solicitar alterações
                      </button>
                      <button
                        disabled={isBusy}
                        onClick={() => handleReject(a.id)}
                        className="flex items-center gap-1.5 border border-red-300 text-red-600 hover:bg-red-50 text-sm font-medium px-3 py-2 rounded-sm disabled:opacity-50"
                      >
                        <XCircle size={15} /> Rejeitar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <p className="text-xs text-ink-500 mt-8">
        <Link to="/admin" className="hover:text-brass-600">← Voltar à visão geral</Link>
      </p>
    </div>
  );
}
