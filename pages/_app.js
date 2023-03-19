import Head from 'next/head' 
import Script from 'next/script';
import Layout from '../components/Layout.js'
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
	return (
		<>
			<Head>
				<link rel="icon" href="/favicon.ico" />
				<meta name="author" content="goodreadstats" />
				<meta name="twitter:card" content="summary" />
				<meta name="twitter:image" content="https://goodreadstats.vercel.app/favicon.ico" />
				<meta name="twitter:site" content="" />
				<meta name="twitter:creator" content="@notpurav" />
				<meta property="og:type" content="website" />
				<meta property="og:image" content="https://goodreadstats.vercel.app/favicon.ico" />
			</Head>
			
			{/* Google Analytics */}
			<Script 
				strategy="afterInteractive"
				src="https://www.googletagmanager.com/gtag/js?id=G-46E2Q090Z2" 
			/>
			<Script id="google-analytics" strategy="afterInteractive">
				{`
					window.dataLayer = window.dataLayer || [];
					function gtag(){dataLayer.push(arguments);}
					gtag("js", new Date());
					gtag("config", 'G-46E2Q090Z2');
				`}
			</Script>

			<Layout>
				<Component {...pageProps} />
			</Layout>
		</>
	)
}

export default MyApp