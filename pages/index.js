import Head from 'next/head'

import Header from '../components/Header.js'
import FileUpload from '../components/FileUpload.js'
import DataTable from '../components/DataTable.js'
import Details from '../components/Details.js'
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
				<meta property="og:url" content="" />
				<meta 
					property="og:description" 
					content="Statistics for Goodreads"
				/>
			</Head>

			<Header />
			<FileUpload />
			<Details />
			<DataTable />
			<Charts />
		</>
	)
}

export default Home