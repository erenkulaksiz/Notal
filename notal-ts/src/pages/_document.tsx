import { Html, Head, Main, NextScript } from "next/document";
import { readFileSync } from "fs";
import { join } from "path";

const SEO = (
  <>
    <meta
      property="apple-mobile-web-app-capable"
      name="apple-mobile-web-app-capable"
      content="yes"
    />
    <meta
      property="apple-mobile-web-app-status-bar-style"
      name="apple-mobile-web-app-status-bar-style"
      content="default"
    />
    <meta
      property="format-detection"
      name="format-detection"
      content="telephone=no"
    />
    <meta
      property="mobile-web-app-capable"
      name="mobile-web-app-capable"
      content="yes"
    />
    <link
      rel="apple-touch-icon"
      href="https://notal.app/apple-touch-icon.png"
    ></link>
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
    <link rel="manifest" href="/manifest.json" />
    <link rel="shortcut icon" href="/favicon.ico" />
    <meta property="twitter:card" name="twitter:card" content="summary" />
    <meta
      property="twitter:url"
      name="twitter:url"
      content="https://notal.app"
    />
    <meta
      property="twitter:creator"
      name="twitter:creator"
      content="@erencode"
    />
    <meta property="twitter:site" name="twitter:site" content="@notalapp" />
    <meta property="og:type" name="og:type" content="website" />
    <meta property="og:site_name" name="og:site_name" content="notal.app" />
    <meta property="theme-color" name="theme-color" content="#292524" />
  </>
);

interface StyleType {
  assetPrefix: string | undefined;
  file: string;
  nonce: string | undefined;
}

function InlineStyle({ assetPrefix, file, nonce }: StyleType) {
  const cssPath = join(process.cwd(), ".next", file);
  const cssSource = readFileSync(cssPath, "utf-8");
  const html = { __html: cssSource };
  const id = `${assetPrefix}/_next/${file}`;
  return <style dangerouslySetInnerHTML={html} data-href={id} nonce={nonce} />;
}

class CriticalCssHead extends Head {
  getCssLinks({ allFiles }: { allFiles: any }) {
    const { assetPrefix } = this.context;
    const { nonce } = this.props;
    const isCss = (file: string) => /\.css$/.test(file);
    const renderCss = (file: string) => (
      <InlineStyle
        key={file}
        file={file}
        nonce={nonce}
        assetPrefix={assetPrefix}
      />
    );
    return allFiles && allFiles.length > 0
      ? allFiles.filter(isCss).map(renderCss)
      : null;
  }
}

export default function Notal() {
  return (
    <Html lang="en">
      <CriticalCssHead>
        <head
          dangerouslySetInnerHTML={{
            __html: `
<!-- Developed with <3 By Eren Kulaksiz -->
`,
          }}
        ></head>
        <meta charSet="UTF-8" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700;900&display=swap"
          rel="stylesheet"
        ></link>
        {SEO}
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}', {page_path: window.location.pathname});`,
          }}
        />
      </CriticalCssHead>
      <body>
        <noscript className="p-2 absolute bg-white" style={{ zIndex: 999 }}>
          If you are seeing this message, that means{" "}
          <strong>JavaScript has been disabled on your browser</strong>, please{" "}
          <strong>enable JavaScript</strong> to make this app work.
        </noscript>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
