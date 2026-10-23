import emailjs from '@emailjs/browser';

const SERVICE_ID = 'service_it46n5d';
const TEMPLATE_ID = 'template_hepupjl';
const PUBLIC_KEY = '2vgB-arTgZ2a1-BXS';

export async function sendNotificationEmail(
  toEmail: string,
  authorName: string,
  articleTitle: string,
  statusMessage: string
) {
  try {
    await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      {
        to_email: toEmail,
        author_name: authorName,
        article_title: articleTitle,
        status_message: statusMessage,
      },
      PUBLIC_KEY
    );
    console.log('Notificação por e-mail enviada com sucesso para:', toEmail);
  } catch (error) {
    console.error('Erro ao enviar notificação por e-mail:', error);
  }
}
