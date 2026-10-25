import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import capaFundo from './capa_padrao.jpg';

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Times-Roman',
    backgroundColor: '#ffffff',
  },
  capaContainer: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
  },
  
  // A CAIXA INVISÍVEL: Alinhada exatamente com a moldura dourada da imagem
  caixaDeTexto: {
    position: 'absolute',
    top: '24%',    // Distância exata do topo até à moldura interna
    bottom: '24%', // Distância exata da base até à moldura interna
    left: '22%',   // Distância da lateral esquerda
    right: '22%',  // Distância da lateral direita
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center', // Centraliza verticalmente dentro da caixa
    alignItems: 'center',     // Centraliza horizontalmente dentro da caixa
    padding: 10,              // Respiro extra para o texto nunca tocar na linha dourada
  },

  tituloCapa: {
    fontSize: 26, 
    color: '#d4af37',
    textAlign: 'center',
    fontFamily: 'Times-Bold',
    textTransform: 'uppercase',
    marginBottom: 20,
    // O texto vai quebrar de linha automaticamente ao atingir o limite da caixaDeTexto
  },
  ornamento: {
    width: 50,
    height: 1,
    backgroundColor: '#d4af37',
    marginBottom: 20,
  },
  autorCapa: {
    fontSize: 16,
    color: '#e2c575',
    fontFamily: 'Times-Roman',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  selo: {
    marginTop: 40, 
    fontSize: 10,
    color: '#d4af37',
    textTransform: 'uppercase',
    letterSpacing: 2,
    opacity: 0.9,
    textAlign: 'center',
  },
  
  // CONTEÚDO DO LIVRO
  pageConteudo: {
    paddingTop: 80,
    paddingBottom: 80,
    paddingHorizontal: 75,
    fontFamily: 'Times-Roman',
    backgroundColor: '#ffffff',
  },
  tituloCapitulo: {
    fontSize: 20,
    fontFamily: 'Times-Bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  texto: {
    fontSize: 12,
    lineHeight: 1.6,
    textAlign: 'justify',
    marginBottom: 12,
  },
});

export const BookTemplate = ({ title, author, content }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.capaContainer}>
          <Image src={capaFundo} style={styles.backgroundImage} />
          
          <View style={styles.caixaDeTexto}>
            <Text style={styles.tituloCapa}>{title}</Text>
            <View style={styles.ornamento} />
            <Text style={styles.autorCapa}>{author}</Text>
            <Text style={styles.selo}>Coleção Clássicos - SP</Text>
          </View>
        </View>
      </Page>

      <Page size="A4" style={styles.pageConteudo}>
        <Text style={styles.tituloCapitulo}>Prefácio da Edição</Text>
        <Text style={styles.texto}>{content}</Text>
      </Page>
    </Document>
  );
};
