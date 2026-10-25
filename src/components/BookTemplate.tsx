import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import capaFundo from './capa_padrao.jpg'; // O Vite vai embutir a imagem aqui

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
    minWidth: '100%',
    minHeight: '100%',
    display: 'block',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  textoSobreposto: {
    position: 'absolute',
    top: '25%',
    bottom: '25%',
    left: '20%',
    right: '20%',
    justifyContent: 'center', 
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
  },
  tituloCapa: {
    fontSize: 32,
    color: '#d4af37',
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
    bottom: -60,
    fontSize: 10,
    color: '#d4af37',
    textTransform: 'uppercase',
    letterSpacing: 2,
    opacity: 0.9,
  },
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

export const BookTemplate = ({ title, author, content }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.capaContainer}>
          {/* Agora usamos a variável importada diretamente */}
          <Image src={capaFundo} style={styles.backgroundImage} />
          
          <View style={styles.textoSobreposto}>
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
