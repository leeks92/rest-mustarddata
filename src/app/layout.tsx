import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const BASE_URL = 'https://rest.mustarddata.com';
const GA_ID = 'G-PLACEHOLDER';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#059669',
};

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: '전국 고속도로 휴게소 정보 - 맛집, 편의시설, 대표 메뉴',
    template: '%s | 고속도로 휴게소',
  },
  description:
    '전국 고속도로 휴게소 정보를 한눈에! 경부·서해안·영동·호남 등 노선별 휴게소 맛집, 대표 음식, 편의시설(전기차충전·주유소·수유실·샤워실), 브랜드 매장 정보를 제공합니다.',
  keywords: [
    '고속도로 휴게소',
    '휴게소 맛집',
    '휴게소 메뉴',
    '휴게소 음식',
    '경부고속도로 휴게소',
    '서해안고속도로 휴게소',
    '영동고속도로 휴게소',
    '호남고속도로 휴게소',
    '행담도휴게소',
    '덕평휴게소',
    '망향휴게소',
    '휴게소 돈까스',
    '휴게소 국밥',
    '휴게소 호두과자',
    '전기차 충전 휴게소',
    '휴게소 편의시설',
  ],
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    title: '전국 고속도로 휴게소 맛집·편의시설 정보',
    description: '전국 고속도로 휴게소의 대표 음식, 편의시설, 브랜드 매장 정보를 한눈에 확인하세요.',
    type: 'website',
    locale: 'ko_KR',
    url: BASE_URL,
    siteName: '고속도로 휴게소 정보',
  },
  twitter: {
    card: 'summary_large_image',
    title: '전국 고속도로 휴게소 정보',
    description: '고속도로 휴게소 맛집과 편의시설 정보',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  category: '교통',
  creator: 'MustardData',
  publisher: 'MustardData',
  other: {
    'naver-site-verification': 'ba1ae0526ca8b81db47476c81df03aff8de31f39',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="google-adsense-account" content="ca-pub-9325661912203986" />
        <meta name="NaverBot" content="All" />
        <meta name="NaverBot" content="index,follow" />
        <meta name="Yeti" content="All" />
        <meta name="Yeti" content="index,follow" />
        <meta name="daumsa" content="index,follow" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="휴게소 정보" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
      </head>
      <body className="min-h-screen flex flex-col">
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}');
          `}
        </Script>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
