import { useState, useEffect } from 'react'
import 'chart.js/auto'
import 'chartjs-adapter-moment';
import { Scatter, Bar } from 'react-chartjs-2';

import styles from '../../styles/Charts.module.css'

// AUTHOR CHARTS
// 
// Chart 1: 
// 	- Scatter plot showing the average ratings the user has given each author compared to the number of books read
// 	
// Chart 2:
// 	- Horizontal bar chart showing number of books read per author

const AuthorCharts = () => {
	const [detailsVisible, setDetailsVisible] = useState(false)

	// avg author rating vs no of books read
	const [data1, setData1] = useState({})
	const [options1, setOptions1] = useState({})

	// Number of books read per author
	const [data2, setData2] = useState({})
	const [options2, setOptions2] = useState({})

	useEffect(() => {
		window.addEventListener('storage', () => {
			const data = JSON.parse(localStorage.getItem('goodreads_data'))

			const authorRatings = getAuthorRatings(data)
			createChart1(authorRatings)

			createChart2(data)

			setDetailsVisible(true)
		})
	}, [])

	// Get a json containing data specific to the authors of read books
	const getAuthorRatings = (data) => {
		let authorRatings = {}

		for (let i=0; i<data.length; i++){
			// If book has been read
			if (data[i]["Exclusive Shelf"] == 'read'){
				const author = data[i]["Author"]
				const book = data[i]["Title"]
				const rating = data[i]["My Rating"]

				// If user has rated the book
				if (rating && rating > 0){
					// If author entry exists in authorData
					if (authorRatings[author]){
						authorRatings[author]["book_list"].push({
							title: book,
							rating: rating
						})
						authorRatings[author]["num_books"] += 1
					} else{
						authorRatings[author] = {
							book_list: [{
								title: book,
								rating: rating
							}],
							num_books: 1
						}
					}
				}

			}
		}
		return authorRatings
	}

	// Chart 1:
	// 	- Scatter plot showing the average ratings the user has given each author compared to the number of books read
	const createChart1 = (data) => {
		// JSON containing authors ratings and books
		let ratingxbooks = []

		for (const author in data){
			let total_ratings = 0
			// Iterate through author's book list
			for (let i=0; i<data[author]["book_list"].length; i++){
				total_ratings += parseInt(data[author]["book_list"][i]["rating"])
			}

			// Get average rating
			let avg_rating = total_ratings / parseInt(data[author]["num_books"])
			ratingxbooks.push({
				x: avg_rating,
				y: data[author]["num_books"],
				author: author
			})
		}

		setData1({
			datasets: [{
				label: "Authors read",
				data: ratingxbooks,
				pointRadius: 4,
				pointBackgroundColor: "rgb(102,187,106)",
			}]
		})

		setOptions1({
			aspectRatio: 1,
			scales: {
				x: {
					title: {
						display: true,
						text: 'Average ratings'
					},
					min: 0,
					max: 5,
					ticks: {
						stepSize: 1
					}
				},
				y: {
					title: {
						display: true,
						text: 'Number of books rated'
					},
					min: 0,
					ticks: {
						stepSize: 1
					}
				}
			},
			clip: false,
			plugins: {
				title: {
					display: true,
					text: 'Average ratings of author vs number of books rated',
					font: { size: 16 },
				},
				tooltip: {
					callbacks: {
						label: function(tooltipItem) {
							const dataIndex = tooltipItem.dataIndex
							const avg_rating = tooltipItem.dataset.data[dataIndex].x
							const num_books = tooltipItem.dataset.data[dataIndex].y	
							const author = tooltipItem.dataset.data[dataIndex].author
							return [
								author,
								"Average rating: " + avg_rating,
								"Number of books rated: " + num_books
							]
						}
					}
				}
			},
		})
	}

	// Chart 2:
	// 	- Horizontal bar chart showing number of books read per author
	const createChart2 = (data) => {
		let authorData = []
		for (let i=0; i<data.length; i++){
			// If book has been read
			if (data[i]["Exclusive Shelf"] == 'read'){
				const author = data[i]["Author"]
				if (authorData[author]){
					authorData[author] += 1
				} else{
					authorData[author] = 1
				}
			}
		}

		// Sort the list of authors wrt numbe rof books read
		const sortedAuthors = Object.keys(authorData).sort((a, b) => authorData[b] - authorData[a])
		// Display top 
		const topAuthors = sortedAuthors.slice(0, 23)

		setData2({
			labels: topAuthors,
			datasets: [{
				label: "Authors",
				data: topAuthors.map(author => authorData[author]),
				backgroundColor: "rgb(102,187,106)",
			}]
		})

		setOptions2({
			aspectRatio: 1,
			indexAxis: 'y',
			scales: {
				x: {
					title: {
						display: true,
						text: 'Number of books read'
					},
					beginAtZero: true,
				},
				y: {
					title: {
						display: true,
						text: 'Authors read'
					}
				}
			},
			plugins: {
				title: {
					display: true,
					text: 'Number of books read per author',
					font: { size: 16 },
				},
				legend: {
					display: false
				},
				tooltip: {
					callbacks: {
						title: function(tooltipItem) {
							const dataIndex = tooltipItem[0].dataIndex
							const author = tooltipItem[0]["label"]
							const num_books = tooltipItem[0].dataset.data[dataIndex]
							return author + ": " + num_books + " books"
						},
						label: function(tooltipItem){
							return ""
						}
					}
				}
			},
		})
	}

	return (
		<div className={styles.bookCharts} id='Author-Stats'>
			{detailsVisible ?
				<h2>Author Stats</h2> : ""
			}
			{detailsVisible ?
				<div className={styles.bookChartsMain}>
					<div className={styles.chart}>
						<Scatter options={options1} data={data1}/>
					</div>
					<div className={styles.chart}>
						<Bar options={options2} data={data2}/>
					</div>
				</div>
				: ""
			}
		</div>
	)
}

export default AuthorCharts