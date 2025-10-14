
import Script from 'next/script';

function TelegramScript() {
  return (
    <Script src="https://telegram.org/js/telegram-web-app.js" strategy="beforeInteractive" />
  );
}

export default TelegramScript;
