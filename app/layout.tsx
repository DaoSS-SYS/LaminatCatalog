import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Каталог ламината",
  description: "Каталог цветов ламината с поиском и фильтрами"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>
        {children}
      </body>
    </html>
  );
}
