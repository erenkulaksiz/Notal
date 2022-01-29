import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
    return (
        <Html lang='en'>
            <Head>
                <meta charSet="UTF-8" />

                <meta name="description" content="Take notes to extreme level with notal."></meta>

                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
                <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700;900&display=swap" rel="stylesheet"></link>

                <meta name="twitter:card" content="summary_large_image" />
                <meta property="twitter:domain" content="https://github.com/erenkulaksiz" />

                <meta name="theme-color" content="#19181e" />

                <meta name="x" content="why are you reading this?" />
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    )
}