import { useState, useEffect } from 'react'
import 'chart.js/auto'
import 'chartjs-adapter-moment';
import { Scatter } from 'react-chartjs-2';

import styles from '../../styles/Charts.module.css'

const AuthorCharts = () => {
	const [detailsVisible, setDetailsVisible] = useState(false)

	// avg author rating vs no of books read
	const [data1, setData1] = useState({})
	const [options1, setOptions1] = useState({})

	useEffect(() => {
		window.addEventListener('storage', () => {
			const data = JSON.parse(localStorage.getItem('goodreads_data'))
			const authorData = getAuthors(data)
			createChart1(authorData)
			setDetailsVisible(true)
		})
	}, [])

	const getAuthors = (data) => {
		let authorData = {}

		for (let i=0; i<data.length; i++){
			// If book has been read
			if (data[i]["Exclusive Shelf"] == 'read'){
				const author = data[i]["Author"]
				const book = data[i]["Title"]
				const rating = data[i]["My Rating"]

				// If valid rating
				if (rating){
					// If author entry
					if (authorData[author]){
						authorData[author]["book_list"].push({
							title: book,
							rating: rating
						})
						authorData[author]["num_books"] += 1
					} else{
						authorData[author] = {
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

		console.log(authorData)

		return authorData
	}

	// Chart 1: avg author rating vs no of books read
	const createChart1 = (data) => {
		let ratingxbooks = []
		for (const author in data){
			let total_ratings = 0
			for (let i=0; i<data[author]["book_list"].length; i++){
				total_ratings += parseInt(data[author]["book_list"][i]["rating"])
			}
			console.log(total_ratings)
			let avg_rating = total_ratings / parseInt(data[author]["num_books"])
			ratingxbooks.push({
				x: avg_rating,
				y: data[author]["num_books"],
				author: author
			})
		}

		console.log(ratingxbooks)

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
						text: 'Number of books read'
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
					text: 'Average ratings of author vs number of books read',
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
								"Number of books read: " + num_books
							]
						}
					}
				}
			},
		})

	}

	return (
		<div className={styles.bookCharts}>
			{detailsVisible ?
				<h1>Author Stats</h1> : ""
			}
			{detailsVisible ?
				<div className={styles.bookChartsMain}>
					<div className={styles.chart}>
						<Scatter options={options1} data={data1}/>
					</div>
				</div>
				: ""
			}
		</div>
	)
}

export default AuthorCharts