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
          <h1>TGMR Achievement Viewer</h1>
          <p>View Minecraft achievements by team or player UUID.</p>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
