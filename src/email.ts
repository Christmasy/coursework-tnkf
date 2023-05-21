import { SMTPClient } from 'emailjs';

export async function sendMail(recipientEmail: string, text: string, title: string) {
  const client = new SMTPClient({
    user: 'b1186@yandex.ru',
    password: 'enxgytvtggbyvnpa',
    host: 'smtp.yandex.ru',
    ssl: true,
  });

  client.send(
    {
      text: text,
      from: 'b1186@yandex.ru',
      to: recipientEmail,
      subject: title,
    },
    (err, message) => {
      console.log(err || message);
    }
  );
}
