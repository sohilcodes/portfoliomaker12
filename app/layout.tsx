import "./globals.css";

export const metadata = {
  title: "Portfolio Maker",
  description: "Create your professional portfolio",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
