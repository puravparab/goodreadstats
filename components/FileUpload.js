import { useState, useEffect } from 'react'

import styles from '../styles/FileUpload.module.css'

const FileUpload = () => {
	const [rawFile, setRawFile] = useState('')
	// const [fileData, setFileData] = useState('')
	// const [fileRender, setFileRender] = useState('')

	// useEffect(() => {
 //    if (fileData) {
 //    	const rowList = fileData.split('\n')
 //      setFileRender(rowList.map((line, index) => {
 //      	const cols = line.split(',')
 //        return (
 //        	<div key={index} className={styles.fileRow}>
 //        		{cols.map((col, i) => {
 //        			return (
 //        				(isIncluded(i, rowList[0].split(',')) ? 
	//         				<div key={i} className={styles.fileCol}>
	// 	        				{col}
	// 	        			</div>
	// 	        			: ""
 //        				)
 //        			)
 //        		})}
 //        	</div>
 //        )
 //      }))
 //    }
 //  }, [fileData])

	// Is column included?
	const isIncluded = (col_index, header) => {
		const excluded_list = ['Author l-f', 'ISBN13', 'Binding', 'Year Published', 'Bookshelves with positions', 'Exclusive Shelf', 'My Review', 'Spoiler', 'Private Notes', 'Read Count', 'Owned Copies']
		for (let i = 0; i < excluded_list.length; i++){
			if (header[col_index] == excluded_list[i]){
				return false
			}
		}
		return true
	}

	// When user selects a .csv file
	const handleFileInputChange = (e) =>{
		const file = e.target.files[0]
		setRawFile(file)
	}

	// When user clicks on the upload button
	const handleFileUpload = () => {
		const reader = new FileReader()
		reader.readAsText(rawFile)

		reader.onload = (e) => {
			// setFileData(e.target.result)
			const csv_data = e.target.result
			const rows = csv_data.split('\n')
			const headers = rows[0].split(',')

			const jsonData = []

			for (let i=1; i < rows.length; i++){
				const row = rows[i].split(',')
				const item = {}
				for (let j=0; j < headers.length; j++){
					item[headers[j]] = row[j]
				}
				jsonData.push(item)
			}

			localStorage.setItem('goodreads_data', JSON.stringify(jsonData))
		}
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