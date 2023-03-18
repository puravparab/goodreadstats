import { useState, useEffect } from 'react'
import Image from 'next/image'
import Navbar from './Navbar.js'
import styles from '../styles/Summary.module.css'
import BookImg from '../public/assets/images/book_stack.png'
import AuthorImg from '../public/assets/images/typewriter.png'

const Summary = () => {
	const [summaryVisible, setSummaryVisible] = useState(false)
	const [render, setRender] = useState("")

	// Listen for changes to local storage
	useEffect(() => {
		window.addEventListener('storage', () => {
			const data = JSON.parse(localStorage.getItem('goodreads_data'))
			populateSummary(data)
		})
	}, [])

	// Parse through data and populate the summary component
	const populateSummary = (data) => {
		// Book Summary
		let num_books = 0 // Number of books read
		let total_books = 0 // Number of books added
		let pages_read = 0 // Number of pages read
		let total_pages = 0 // Number of pages in all books added

		// Author Summary
		let num_authors = 0 // Number of authors read
		let total_authors = 0 // Total authors
		let author_data = {}
		let author_ranking = []

		// Iterate through books
		for (let i=0; i<data.length; i++){
			total_books += 1
			const pages = parseInt(data[i]["Number of Pages"])
			if (pages){
				total_pages += pages
			}

			// If book was read
			if (data[i]["Exclusive Shelf"] == 'read'){
				// If number of pages is not empty
				if (pages){
					pages_read += parseInt(data[i]["Number of Pages"])
					num_books += 1
				}

				const author = data[i]["Author"]
				const book = data[i]["Title"]
				let user_rating = data[i]["My Rating"]
				if (user_rating){} else {user_rating = 0}
				let average_rating = data[i]["Average Rating"]
				if (average_rating){} else {average_rating = 0}

				// If author entry exists in author_data
				if (author_data[author]){
					author_data[author].push({
						book: book,
						rating: user_rating,
						avg_rating: average_rating,
						pages: pages,
						status: "read"
					})
				} else{
					num_authors += 1
					total_authors += 1
					author_data[author] = [{
						book: book,
						rating: user_rating,
						avg_rating: average_rating,
						pages: pages,
						status: "read"
					}]
				}
			}

			// If book not read
			else{
				const author = data[i]["Author"]
				const book = data[i]["Title"]
				const pages = data[i]["Number of Pages"]
				let user_rating = data[i]["My Rating"]
				if (user_rating){} else {user_rating = 0}
				let average_rating = data[i]["Average Rating"]
				if (average_rating){} else {average_rating = 0}

				// If author entry exists in author_data
				if (author_data[author]){
					author_data[author].push({
						book: book,
						rating: user_rating,
						avg_rating: average_rating,
						pages: pages,
						status: "unread"
					})
				} else{
					num_authors += 1
					total_authors += 1
					author_data[author] = [{
						book: book,
						rating: user_rating,
						avg_rating: average_rating,
						pages: pages,
						status: "unread"
					}]
				}
			}
		}

		// Iterate through author_data
		for (const key in author_data){
			let score = 0 // Author's score
			let total_books = 0// Books read of specified author
			let total_rating = 0 // sum of all ratings given by user
			let total_avg_rating = 0 // sum of all avg ratings given by other users
			let books_read_for_avg = 0 // number of books read of selected author (books with valid ratings)
			let total_pages_read = 0 // total pages read of books by selected author

			// Iterate through author's books
			for (let i=0; i<author_data[key].length; i++){
				if (author_data[key][i]["status"] == "read"){
					total_books++
					const pages = parseInt(author_data[key][i]["pages"])
					if (pages){total_pages_read += pages}

					const rating = parseInt(author_data[key][i]["rating"])
					const avg_rating = parseInt(author_data[key][i]["avg_rating"])
					if(rating != null && rating != 0 && avg_rating != null && avg_rating != 0){
						books_read_for_avg += 1
						total_rating += rating
						total_avg_rating += avg_rating
					}
				}
			}
			
			let term1 = 0 // 100 * total_rating / books_read_for_avg
			let term2 = 0 // 10 * total_avg_rating / books_read_for_avg
			let term3 = 0 // total_books * 20

			// If no books are read
			if (total_books == 0){
				score = 0
			} 
			else{
				if (total_rating == 0 && total_avg_rating == 0){
					term1 = 100 * 3
					term2 = 10 * 3
				} else if (total_rating == 0){
					term1 = 100 * total_avg_rating / books_read_for_avg
					term2 = 10 * total_avg_rating / books_read_for_avg
				} else if (total_avg_rating == 0){
					term1 = 100 * total_rating / books_read_for_avg
					term2 = 10 * total_rating / books_read_for_avg
				} else{
					term1 = 100 * total_rating / books_read_for_avg
					term2 = 10 * total_avg_rating / books_read_for_avg
				}

				term3 = total_books * 30
				score = term1 + term2 + term3
			}
			author_ranking.push([key, score, total_books, total_pages_read])
		}

		// Rank authors
		author_ranking.sort((a, b) => {
			// Sort based on score
			if (b[1] !== a[1]){
				return b[1] - a[1];
			}
			// If scores are equal, sort based on no of books
			return b[2] - a[2];
		})

		// Create list of top three authors
		const top_authors = author_ranking.splice(0,3).map((row, key) => {
			return (
				<p key={key}>{key + 1}. {row[0]} - {row[2]} book(s)</p>
			)
		})

		setRender(
			<>
				<div className={styles.summaryColumn}>
					<div className={styles.summaryHeading}>
						<h3>Book Stats</h3>
						<Image 
							src={BookImg}
							alt="stack of books"
							width={35}
							height={35}
						/>
					</div>
					<div className={styles.summaryBody}>
						<p>Books read: {num_books}</p>
						<p>Total books: {total_books}</p>
						<p>Pages read: {pages_read}</p>
						<p>Pages to be read: {total_pages - pages_read}</p>
					</div>
				</div>

				<div className={styles.summaryColumn}>
					<div className={styles.summaryHeading}>
						<h3>Author Stats</h3>
						<Image 
							src={AuthorImg}
							alt="typewriter"
							width={35}
							height={35}
						/>
					</div>
					<div className={styles.summaryBody}>
						<p>Number of authors read: {num_authors}</p>
						<p>Total authors: {total_authors}</p>
						<h4>Top authors:</h4>
						{top_authors}
					</div>
				</div> 
			</>
		)
		setSummaryVisible(true)
	}

	return (
		<>
			{summaryVisible ? 
				<>
					<div className={styles.summaryContainer}>
						<Navbar />
						<h2>Summary</h2>
						<div className={styles.summaryContent}>
							{render}
						</div>
					</div>
				</>
				: ""
			}
		</>
	)
}

export default Summary