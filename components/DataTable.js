import { useState, useEffect } from 'react'

import styles from '../styles/DataTable.module.css'

const DataTable = () => {
	const [jsonData, setJSONData] = useState([])
	const [headers, setHeaders] = useState([])

	// Listen for changes to local storage
	useEffect(() => {
		window.addEventListener('storage', () => {
			const data = JSON.parse(localStorage.getItem('goodreads_data'))
			setHeaders(Object.keys(data[0]))
			setJSONData(data)
		})
	}, [])

	// Is column included?
	const isIncluded = (header) => {
		const excluded_list = ['Author l-f', 'Binding', 'Year Published', 'Bookshelves with positions', 'Bookshelves', 'My Review', 'Spoiler', 'Private Notes', 'Read Count', 'Owned Copies']
		for (let i =0; i < excluded_list.length; i++){
			if (header == excluded_list[i]){
				return false
			}
		}
		return true
	}

	return (
		<>
			{headers.length > 0 && jsonData.length > 0 && (
				<div className={styles.dataTableContainer}>	
					<table className={styles.dataTable}>
						<thead>
							<tr>
								{headers.map(header => (
									(isIncluded(header) ?
										<th key={header}>
											{header}
										</th> : ""
									)
								))}
							</tr>
						</thead>

						<tbody>
							{jsonData.map((data, index) => (
								<tr key={index}>
									{headers.map(header => (
										(isIncluded(header) ?
											<td key={header}>
												{data[header]}
											</td> : ""
										)
									))}
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</>
	)

}

export default DataTable