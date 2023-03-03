import Layout from '../components/Layout.js'
import '../styles/globals.css'

const MyApp = ({ Component, pageProps }) => {
	return (
		<>
			<Layout>
				<Component {...pageProps} />
			</Layout>
		</>
	)
}

export default MyApp