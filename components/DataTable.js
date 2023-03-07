import { useState, useEffect } from 'react'

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

	return (
		<>	
			{headers.length > 0 && jsonData.length > 0 && (
				<table>
					<thead>
						<tr>
							{headers.map(header => (
								<th key={header}>
									{header}
								</th>
							))}
						</tr>
					</thead>

					<tbody>
						{jsonData.map((data, index) => (
							<tr key={index}>
								{headers.map(header => (
									<td key={header}>
										{data[header]}
									</td>
								))}
							</tr>
						))}
					</tbody>
				</table>
			)}
		</>
	)

}

export default DataTable