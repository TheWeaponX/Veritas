import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 50,
    fontFamily: 'Times-Roman',
    backgroundColor: '#ffffff',
  },
  // FUNDO DA CAPA
  capaBackground: {
    flex: 1,
    backgroundColor: '#0f172a', // Azul escuro profundo
    padding: 15, 
  },
  // MOLDURA EXTERNA
  capaMoldura: {
    flex: 1,
    border: '2pt solid #f4e8c1', // Creme/Dourado
    padding: 4,
  },
  // MOLDURA INTERNA
  capaMolduraInterna: {
    flex: 1,
    border: '1pt solid #f4e8c1',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    position: 'relative',
  },
  tituloCapa: {
    fontSize: 32,
    color: '#f4e8c1',
    textAlign: 'center',
    fontFamily: 'Times-Bold',
    textTransform: 'uppercase',
  },
  ornamento: {
    width: 40,
    height: 1.5,
    backgroundColor: '#f4e8c1',
    marginVertical: 25,
  },
  autorCapa: {
    fontSize: 18,
    color: '#f4e8c1',
    fontFamily: 'Times-Roman',
    fontStyle: 'italic',
  },
  selo: {
    position: 'absolute',
    bottom: 40,
    fontSize: 10,
    color: '#f4e8c1',
    textTransform: 'uppercase',
    letterSpacing: 2,
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
    {/* PÁGINA 1: CAPA CLÁSSICA */}
    <Page size="A4" style={styles.capaBackground}>
      <View style={styles.capaMoldura}>
        <View style={styles.capaMolduraInterna}>
          <Text style={styles.tituloCapa}>{title}</Text>
          <View style={styles.ornamento} />
          <Text style={styles.autorCapa}>{author}</Text>
          
          <Text style={styles.selo}>Coleção Clássicos</Text>
        </View>
      </View>
    </Page>

    {/* PÁGINA 2: CONTEÚDO */}
    <Page size="A4" style={styles.page}>
      <Text style={styles.tituloCapitulo}>Prefácio da Edição</Text>
      <Text style={styles.texto}>{content}</Text>
    </Page>
  </Document>
);
