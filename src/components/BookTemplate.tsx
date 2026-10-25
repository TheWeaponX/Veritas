import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Times-Roman',
    backgroundColor: '#ffffff',
  },
  
  // CONTAINER DA CAPA
  capaContainer: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  // IMAGEM DE FUNDO
  backgroundImage: {
    position: 'absolute',
    minWidth: '100%',
    minHeight: '100%',
    display: 'block',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  // CAIXA DE TEXTO (Ajustada para caber dentro da moldura dourada da sua imagem)
  textoSobreposto: {
    position: 'absolute',
    top: '25%',       // Empurra o texto para baixo para caber na moldura
    bottom: '25%',    // Empurra o texto para cima
    left: '20%',      // Margem lateral
    right: '20%',     // Margem lateral
    justifyContent: 'center', 
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
  },

  tituloCapa: {
    fontSize: 32,
    color: '#d4af37', // Dourado que combina com a sua imagem
    textAlign: 'center',
    fontFamily: 'Times-Bold',
    textTransform: 'uppercase',
    marginBottom: 20,
  },
  ornamento: {
    width: 30,
    height: 1,
    backgroundColor: '#d4af37',
    marginBottom: 20,
  },
  autorCapa: {
    fontSize: 18,
    color: '#e2c575',
    fontFamily: 'Times-Roman',
    fontStyle: 'italic',
  },
  selo: {
    position: 'absolute',
    bottom: -60, // Posiciona o selo logo abaixo da caixa de texto, perto da borda inferior
    fontSize: 10,
    color: '#d4af37',
    textTransform: 'uppercase',
    letterSpacing: 2,
    opacity: 0.9,
  },

  // ESTILOS DO CONTEÚDO
  pageConteudo: {
    padding: 50,
    fontFamily: 'Times-Roman',
    backgroundColor: '#ffffff',
  },
  tituloCapitulo: {
    fontSize: 18,
    fontFamily: 'Times-Bold',
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

export const BookTemplate = ({ title, author, content }) => (
  <Document>
    {/* PÁGINA 1: CAPA */}
    <Page size="A4" style={styles.page}>
      <View style={styles.capaContainer}>
        {/* Usando o JPG que você vai colocar na pasta public */}
        <Image src="/capa_padrao.jpg" style={styles.backgroundImage} />
        
        {/* Texto centralizado na moldura */}
        <View style={styles.textoSobreposto}>
          <Text style={styles.tituloCapa}>{title}</Text>
          <View style={styles.ornamento} />
          <Text style={styles.autorCapa}>{author}</Text>
          <Text style={styles.selo}>Coleção Clássicos - SP</Text>
        </View>
      </View>
    </Page>

    {/* PÁGINA 2: CONTEÚDO */}
    <Page size="A4" style={styles.pageConteudo}>
      <Text style={styles.tituloCapitulo}>Prefácio da Edição</Text>
      <Text style={styles.texto}>{content}</Text>
    </Page>
  </Document>
);
