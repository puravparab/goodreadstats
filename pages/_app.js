import Head from 'next/head' 
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
			
			<Layout>
				<Component {...pageProps} />
			</Layout>
		</>
	)
}

export default MyApp