import Head from 'next/head'

import Header from '../components/Header.js'
import FileUpload from '../components/FileUpload.js'
import DataTable from '../components/DataTable.js'
import Details from '../components/Details.js'
import Summary from '../components/Summary.js'
import Charts from '../components/Charts/Charts.js'

const Home = () => {
	return (
		<>
			<Head>
				<title>Goodreadstats</title>
				<meta 
					name="description" 
					content="Statistics for Goodreads"
				/>
				<link rel="canonical" href="/" />
				<meta property="og:title" content=">Goodreadstats" />
				<meta property="og:url" content="https://goodreadstats.vercel.app/" />
				<meta 
					property="og:description" 
					content="Statistics for Goodreads"
				/>
			</Head>

			<Header />
			<FileUpload />
			<Details />
			<Summary />
			<DataTable />
			<Charts />
		</>
	)
}

export default Home