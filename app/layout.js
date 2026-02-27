import "./globals.css";

export const metadata = {
  title: "TGMR Achievement Viewer",
  description: "View Minecraft achievements by team or player UUID"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <div className="brand-wrap">
            <img src="/tgmr-logo.svg" alt="TGMR logo" className="site-logo" />
            <div>
              <h1>TGMR Achievement Viewer</h1>
              <p>Track team and player progress by world.</p>
            </div>
          </div>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
