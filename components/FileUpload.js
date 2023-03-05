import { useState, useEffect } from 'react'

import styles from '../styles/FileUpload.module.css'

const FileUpload = () => {
	const [rawFile, setRawFile] = useState('')
	const [fileData, setFileData] = useState('')
	const [fileRender, setFileRender] = useState('')

	useEffect(() => {
    if (fileData) {
      setFileRender(fileData.split('\n').map((line, index) => {
        return (
        	<div key={index} className={styles.fileItem}>
          	{line}
        	</div> 
        )
      }))
    }
  }, [fileData])

	const handleFileInputChange = (e) =>{
		const file = e.target.files[0]
		setRawFile(file)
	}

	const handleFileUpload = () => {
		const reader = new FileReader()
		reader.readAsText(rawFile)
		reader.onload = (e) => {
			setFileData(e.target.result)
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

			<div className={styles.fileContent}>
				{fileRender}
			</div>
			
		</div>
	)
}

export default FileUpload