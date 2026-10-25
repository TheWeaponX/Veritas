import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import capaFundo from './capa_padrao.jpg'; // Importação direta do JPG na mesma pasta

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
    left: '15%', // Margens ajustadas para dar mais espaço ao título
    right: '15%',
    justifyContent: 'center', 
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
  },
  tituloCapa: {
    fontSize: 28, // Fonte reduzida ligeiramente para a palavra não quebrar
    color: '#d4af37',
    textAlign: 'center',
    fontFamily: 'Times-Bold',
    textTransform: 'uppercase',
    marginBottom: 15,
  },
  ornamento: {
    width: 40,
    height: 1,
    backgroundColor: '#d4af37',
    marginBottom: 15,
  },
  autorCapa: {
    fontSize: 16,
    color: '#e2c575',
    fontFamily: 'Times-Roman',
    fontStyle: 'italic',
  },
  selo: {
    position: 'absolute',
    bottom: -35,
    fontSize: 10,
    color: '#d4af37',
    textTransform: 'uppercase',
    letterSpacing: 2,
    opacity: 0.9,
  },
  pageConteudo: {
    paddingTop: 80, // Margens com padrão de livro acadêmico
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
    lineHeight: 1.6, // Maior respiro entre as linhas de texto
    textAlign: 'justify',
    marginBottom: 12,
  },
});

export const BookTemplate = ({ title, author, content }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.capaContainer}>
          {/* O código volta a usar a variável capaFundo que importamos acima */}
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
