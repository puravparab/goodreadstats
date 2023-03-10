import { useState, useEffect } from 'react'
import {
	Chart as ChartJS,
	LinearScale,
	PointElement,
	LineElement,
	Tooltip,
	Legend,
} from 'chart.js';

import { Scatter } from 'react-chartjs-2';

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);

import styles from '../../styles/Charts.module.css'

const BookCharts = () => {
	const [detailsVisible, setDetailsVisible] = useState(false)

	// Date read vs Data published
	const [data1, setData1] = useState({})
	const [options1, setOptions1] = useState({})

	useEffect(() => {
		window.addEventListener('storage', () => {
			const data = JSON.parse(localStorage.getItem('goodreads_data'))
			createChart1(data)
			setDetailsVisible(true)
		})
	}, [])

	const createChart1 = (data) => {
		// json containing x(date read) and y(date published) values
		let readxpublished = []
		let book_list = []

		let max_read_date = 1900
		let min_read_date = 3000
		let max_published_date = -10000
		let min_published_date = 3000

		// Iterate through books
		for (let i=0; i < data.length; i++){
			// If book has been read
			if (data[i]["Exclusive Shelf"] == 'read'){
				let year_read = parseInt(data[i]["Date Read"].split('/')[2])
				let year_published = parseInt(data[i]["Original Publication Year"])

				// If "Original Publication Year" is empty
				if (!year_published){
					year_published = parseInt(data[i]["Year Published"])
				}

				// If "Date Read" is not empty add to list
				if (year_read){
					readxpublished.push({
						x: year_read,
						y: year_published
					})
					book_list.push(data[i]["Title"])

					// Updated chart limits
					if (year_read >= max_read_date){max_read_date = year_read + 1}
					if (year_read <= min_read_date){min_read_date = year_read - 1}
					if (year_published >= max_published_date){max_published_date = year_published + 2}
					if (year_published <= min_published_date){min_published_date = year_published - 1}
				}
			}
		}
		
		setData1({
			datasets: [{
					label: "Books Read",
					data: readxpublished,
					pointRadius: 4,
					pointBackgroundColor: "rgb(102,187,106)",
			}]
		})
		setOptions1({
			aspectRatio: 2,
			scales: {
				x: {
					title: {
						display: true,
						text: 'Date Read'
					},
					min: min_read_date,
					max: max_read_date,
					ticks: {
						// forces step size to be 50 units
						stepSize: 1
					}
				},
				y: {
					title: {
						display: true,
						text: 'Date Published'
					},
					min: min_published_date,
					max: max_published_date,
					ticks: {
						// forces step size to be 50 units
						stepSize: 2
					}
				}
			},
			plugins: {
				title: {
					display: true,
					text: 'Chart Title',
				}
			}
		})
	}

	return (
		<div className={styles.bookCharts}>
			{detailsVisible ?
				<h1>Book Stats</h1> : ""
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

export default BookCharts