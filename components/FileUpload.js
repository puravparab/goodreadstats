import { useState, useEffect } from 'react'

import Papa from 'papaparse';

import styles from '../styles/FileUpload.module.css'

const FileUpload = () => {
	const [rawFile, setRawFile] = useState('')
	const [invalidData, setInvalidData] = useState(false)

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
				if (validate_csv(rows)){
					localStorage.setItem('goodreads_data', JSON.stringify(rows))
					setInvalidData(false)
					window.dispatchEvent(new Event("storage"))
				} else{
					setInvalidData(true)
				}
			},
			header: true,
			skipEmptyLines: true,
		})
	}

	// Validate if data is exported from goodreads
	const validate_csv = (rows) => {
		const categories = ['Book Id', 'Title', 'Author', 'Additional Authors', 'ISBN',	'ISBN13',	'My Rating', 'Average Rating', 'Publisher', 'Number of Pages',	'Original Publication Year', 'Date Read',	'Date Added']
		// If rows has no elements invalidate it
		if (rows.length < 1){
			return false
		}
		// Check if required categories exist
		for (let i=0; i < categories.length; i++){
			if (rows[0].hasOwnProperty(categories[i])){
				continue
			} else{
				return false
			}
		}
		return true
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
				 
				 {invalidData ? 
					<p>Invalid File!</p> : ""
				 }

				 <button onClick={handleFileUpload}>
					Upload
				 </button>
			</div>		
		</div>
	)
}

export default FileUpload