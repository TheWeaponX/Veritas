import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Aqui definimos o "Design System" do nosso PDF acadêmico
const styles = StyleSheet.create({
  page: {
    padding: 50,
    fontFamily: 'Times-Roman', // Fonte clássica, já embutida no sistema
    backgroundColor: '#ffffff',
  },
  capa: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f172a', // O azul escuro (slate-900) da enciclopédia
  },
  tituloCapa: {
    fontSize: 28,
    color: '#d4af37', // Dourado/Latão
    marginBottom: 20,
    textAlign: 'center',
  },
  autorCapa: {
    fontSize: 16,
    color: '#ffffff',
  },
  selo: {
    marginTop: 50,
    fontSize: 12,
    color: '#94a3b8',
    fontStyle: 'italic',
  },
  tituloCapitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 20,
    textAlign: 'center',
  },
  texto: {
    fontSize: 12,
    lineHeight: 1.5,
    textAlign: 'justify',
    marginBottom: 10,
  },
});

// Este é o componente que gera o livro
export const BookTemplate = ({ title, author, content }) => (
  <Document>
    {/* PÁGINA 1: CAPA */}
    <Page size="A4" style={styles.capa}>
      <Text style={styles.tituloCapa}>{title}</Text>
      <Text style={styles.autorCapa}>por {author}</Text>
      <Text style={styles.selo}>Edição Exclusiva - Scientia Periodica</Text>
    </Page>

    {/* PÁGINA 2: CONTEÚDO */}
    <Page size="A4" style={styles.page}>
      <Text style={styles.tituloCapitulo}>Prefácio da Edição</Text>
      <Text style={styles.texto}>{content}</Text>
      <Text style={styles.texto}>
        (Aqui o texto flui naturalmente para outras páginas se for muito grande. O gerador faz a quebra de página automaticamente!)
      </Text>
    </Page>
  </Document>
);
