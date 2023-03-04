import styles from '../styles/FileUpload.module.css'

const FileUpload = () => {
	return (
		<div className={styles.fileUploadSection}>
			<p>
				Upload a .csv file containing the data exported from
				<a target="_blank" rel="noopener"href="https://www.goodreads.com/review/import"> goodreads
				</a>
			</p>

			<div className={styles.fileInput}>
				 <input type="file" accept=".csv" />
				 <button>
				 	Upload
				 </button>
			</div>
		</div>
	)
}

export default FileUpload