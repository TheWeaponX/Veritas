import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';
import capaFundo from './capa_padrao.jpg';

// Desativa a separação de sílabas (hifenização) no documento inteiro
Font.registerHyphenationCallback((word) => [word]);

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
  caixaDeTexto: {
    position: 'absolute',
    top: '24%',
    bottom: '24%',
    left: '22%',
    right: '22%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  tituloCapa: {
    fontSize: 26, 
    color: '#d4af37',
    textAlign: 'center',
    fontFamily: 'Times-Bold',
    textTransform: 'uppercase',
    marginBottom: 20,
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
            
            {/* Texto do selo atualizado */}
            <Text style={styles.selo}>Coleção Clássicos</Text>
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
