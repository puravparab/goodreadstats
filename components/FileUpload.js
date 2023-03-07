import { useState, useEffect } from 'react'

import Papa from 'papaparse';

import styles from '../styles/FileUpload.module.css'

const FileUpload = () => {
	const [rawFile, setRawFile] = useState('')

	// When user selects a .csv file
	const handleFileInputChange = (e) =>{
		const file = e.target.files[0]
		setRawFile(file)
	}

	// When user clicks on the upload button
	const handleFileUpload = () => {
		let rows = []
		Papa.parse(rawFile, {
			complete: (results) => {
				rows = results.data;
				localStorage.setItem('goodreads_data', JSON.stringify(rows))
				window.dispatchEvent(new Event("storage"));
			},
			header: true,
			skipEmptyLines: true,
		})
	}

	return (
		<div className={styles.fileUploadSection}>
			<p>
				Upload a .csv file containing the data exported from
				<a target="_blank" rel="noopener"href="https://www.goodreads.com/review/import"> goodreads
				</a>
			</p>

			<div className={styles.fileInput}>
				 <input type="file" accept=".csv" onChange={handleFileInputChange}/>
				 <button onClick={handleFileUpload}>
				 	Upload
				 </button>
			</div>		
		</div>
	)
}

export default FileUpload