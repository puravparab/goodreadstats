import Head from 'next/head' 
import Layout from '../components/Layout.js'
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
	return (
		<>
			<Head>
				<link rel="icon" href="" />
				<meta name="author" content="goodreadstats" />
				<meta name="twitter:card" content="" />
				<meta name="twitter:image" content="" />
				<meta name="twitter:site" content="" />
				<meta name="twitter:creator" content="" />
				<meta property="og:type" content="website" />
				<meta property="og:image" content="" />
			</Head>
			
			<Layout>
				<Component {...pageProps} />
			</Layout>
		</>
	)
}

export default MyApp