import Document, { Html, Head, Main, NextScript } from 'next/document';

export default function Notal() {

    const getInitialProps = async (ctx) => {
        const initialProps = await Document.getInitialProps(ctx);
        //const styledJSXStyles = flush();

        return {
            ...initialProps,
            styles: (
                <>
                    {initialProps.styles}
                </>
            )
        };
    }

    return (
        <Html lang='en'>
            <Head>
                <meta charSet="UTF-8" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
                <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700;900&display=swap" rel="stylesheet"></link>
                <meta name="x" content="why are you reading this?" />

                <meta name='application-name' content='Notal' />
                <meta name='apple-mobile-web-app-capable' content='yes' />
                <meta name='apple-mobile-web-app-status-bar-style' content='default' />
                <meta name='apple-mobile-web-app-title' content='Notal' />
                <meta name='format-detection' content='telephone=no' />
                <meta name='mobile-web-app-capable' content='yes' />

                <link rel='icon' type='image/png' sizes='32x32' href='/favicon-32x32.png' />
                <link rel='icon' type='image/png' sizes='16x16' href='/favicon-16x16.png' />
                <link rel='manifest' href='/manifest.json' />
                <link rel='shortcut icon' href='/favicon.ico' />

                <meta name='twitter:card' content='summary' />
                <meta name='twitter:url' content='https://notal.app' />
                <meta name='twitter:title' content='Notal' />
                <meta name='twitter:image' content='https://notal.app/icon_big.png' />
                <meta name='twitter:creator' content='@erencode' />
                <meta property='og:type' content='website' />
                <meta property='og:title' content='Notal' />
                <meta property='og:site_name' content='Notal' />
                <meta property='og:url' content='https://notal.app' />
                <meta property='og:image' content='https://notal.app/icon_big.png' />

                <script
                    async
                    src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
                />
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}', {
page_path: window.location.pathname,
});
`,
                    }}
                />
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    )
}