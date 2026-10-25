import React, { useState } from 'react';
import { BookOpen, Wand2, Save, AlertCircle } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const AdminClassics = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [rawText, setRawText] = useState('');
  const [formattedHtml, setFormattedHtml] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleFormatWithAI = async () => {
    if (!rawText) return;
    setIsProcessing(true);

    const apiKey = import.meta.env.VITE_GROQ_API_KEY;
    if (!apiKey) {
      alert('Chave de API da Groq não encontrada no ficheiro .env!');
      setIsProcessing(false);
      return;
    }

    try {
      const prompt = `És um editor especialista em formatação de livros clássicos. Limpa o texto bruto extraído de um PDF, corrige as quebras de linha a meio de frases e estrutura-o em HTML válido usando <h2> para capítulos e <p> para parágrafos. Devolve apenas o código HTML limpo, sem conversas. Texto bruto: ${rawText}`;

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.3
        })
      });

      const data = await response.json();
      
      if (data.choices && data.choices[0].message?.content) {
        let aiOutput = data.choices[0].message.content;
        aiOutput = aiOutput.replace(/```html/g, '').replace(/```/g, '').trim();
        setFormattedHtml(aiOutput);
      } else {
        throw new Error('Resposta inválida da Groq.');
      }
    } catch (error) {
      console.error('Erro na IA:', error);
      alert('Erro ao comunicar com a Groq.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveBook = async () => {
    if (!title || !author || !formattedHtml) {
      alert('Preencha o título, o autor e certifique-se de que o texto foi formatado.');
      return;
    }
    setIsSaving(true);

    try {
      const { error } = await supabase
        .from('classic_books')
        .insert([{ title: title.trim(), author: author.trim(), content: formattedHtml }]);

      if (error) throw error;
      alert('Livro guardado no Supabase com sucesso!');
      setTitle(''); setAuthor(''); setRawText(''); setFormattedHtml('');
    } catch (error) {
      console.error('Erro no Supabase:', error);
      alert('Erro ao guardar o livro na base de dados.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center gap-3 border-b pb-4">
        <BookOpen className="w-8 h-8 text-blue-600" />
        <h1 className="text-3xl font-bold text-gray-800">Importador de Clássicos com IA</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2 border rounded-md" placeholder="Título. Ex: A Origem das Espécies" />
          <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} className="w-full p-2 border rounded-md" placeholder="Autor. Ex: Charles Darwin" />
          <textarea value={rawText} onChange={(e) => setRawText(e.target.value)} className="w-full h-96 p-2 border rounded-md font-mono text-sm" placeholder="Cole aqui o texto desformatado..." />
          <button onClick={handleFormatWithAI} disabled={isProcessing || !rawText} className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-md font-semibold disabled:opacity-50">
            <Wand2 className="w-5 h-5" /> {isProcessing ? 'A processar...' : 'Limpar e Formatar com IA'}
          </button>
        </div>
        <div className="space-y-4 flex flex-col">
          <div className="flex-1 min-h-[400px] border rounded-md bg-gray-50 p-4 overflow-y-auto">
            {formattedHtml ? <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: formattedHtml }} /> : <div className="h-full flex flex-col items-center justify-center text-gray-400"><AlertCircle className="w-12 h-12 mb-2 opacity-50" /><p>Resultado aparecerá aqui</p></div>}
          </div>
          <button onClick={handleSaveBook} disabled={!formattedHtml || isSaving} className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-md font-semibold disabled:opacity-50">
            <Save className="w-5 h-5" /> {isSaving ? 'A guardar...' : 'Guardar no Acervo'}
          </button>
        </div>
      </div>
    </div>
  );
};
