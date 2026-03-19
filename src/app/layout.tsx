import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "K-Kash",
  description: "The official K-Kash wallet",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "K-Kash",
  },
  formatDetection: { telephone: false },
  icons: {
    apple: "/icons/koli-logo.png",
    icon: "/icons/koli-logo.png",
    shortcut: "/icons/koli-logo.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#5E9B8A",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                try {
                  if ("serviceWorker" in navigator) {
                    navigator.serviceWorker
                      .getRegistrations()
                      .then(function (registrations) {
                        return Promise.all(
                          registrations.map(function (registration) {
                            return registration.unregister();
                          })
                        );
                      })
                      .catch(function () {});
                  }
                  if ("caches" in window) {
                    caches
                      .keys()
                      .then(function (keys) {
                        return Promise.all(
                          keys.map(function (key) {
                            return caches.delete(key);
                          })
                        );
                      })
                      .catch(function () {});
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
        {children}
      </body>
    </html>
  );
}
