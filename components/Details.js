import { useState, useEffect } from 'react'

const Details = () => {
	const [detailsVisible, setDetailsVisible] = useState(false)
	const [renderDetails, setRenderDetails] = useState("")
	// Listen for changes to local storage
	useEffect(() => {
		window.addEventListener('storage', () => {
			const data = JSON.parse(localStorage.getItem('goodreads_data'))
			parseData(data)
			setDetailsVisible(true)
		})
	}, [])

	// parse jsonData and get relavent details
	const parseData = (data) => {
		// Books
		let books_read = 0
		let total_books_read = 0
		let pages_read = 0

		// Authors
		let authors_read = 0
		let authors_read_list = {}
		let total_authors = 0
		let authors_list = {}
		let author1 = ""

		// Iterate through books
		for (let i=0; i < data.length; i++){
			// If book is read
			if (data[i]["Exclusive Shelf"] == "read"){
				books_read++
				pages_read = pages_read + parseInt(data[i]["Number of Pages"])

				// Store authors of books read
				if (authors_read_list[data[i]["Author"]]){
					authors_read_list[data[i]["Author"]] = authors_read_list[data[i]["Author"]] + 1
				} else{
					authors_read_list[data[i]["Author"]] = 1
					authors_read++
				}
			}

			// Store all authors
			if (authors_list[data[i]["Author"]]){
				authors_list[data[i]["Author"]] = authors_list[data[i]["Author"]] + 1
			} else{
				authors_list[data[i]["Author"]] = 1
				total_authors++
			}

			total_books_read++
		}

		let max_books = 0
		for (var key in authors_read_list){
			if (authors_read_list[key] > max_books){
				author1 = key
				max_books = authors_read_list[key]
			}
		}
		
		setRenderDetails(
			<>
				<div>
					<p>Books read: {books_read}</p>
					<p>Total books: {total_books_read}</p>
					<p>Pages read: {pages_read}</p>
				</div>
				<div>
					<p>No of authors read: {authors_read}</p>
					<p>Total authors: {total_authors}</p>
				</div>
				<div>
					<h4>Top authors:</h4>
					<p>1. {author1} </p>
				</div>
			</>
		)
	}
	return (
		<div>
			{detailsVisible ?
				(renderDetails): ""
			}
		</div>
	)
}

export default Details