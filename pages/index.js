import Head from 'next/head'

import Header from '../components/Header.js'
import FileUpload from '../components/FileUpload.js'
import DataTable from '../components/DataTable.js'

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
			<DataTable />
			
		</>
	)
}

export default Home