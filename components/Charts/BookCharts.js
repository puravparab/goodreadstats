import { useState, useEffect } from 'react'

import 'chart.js/auto'
import { Scatter } from 'react-chartjs-2';

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
		// json containing x(date added) and y(date published) values
		let addedxpublished = []
		let book_list = []

		let max_read_date = 1900
		let min_read_date = 3000
		let max_published_date = -10000
		let min_published_date = 3000

		for (let i=0; i < data.length; i++){
			let year_read = parseInt(data[i]["Date Read"].split('/')[2])
			let date_added = parseInt(data[i]["Date Added"].split('/')[2])
			let year_published = parseInt(data[i]["Original Publication Year"])

			// If "Original Publication Year" is empty
			if (!year_published){
				year_published = parseInt(data[i]["Year Published"])
			}

			// If book has been read
			if (data[i]["Exclusive Shelf"] == 'read'){
				// If "Date Read" is not empty add to list
				if (year_read){
					readxpublished.push({
						x: year_read,
						y: year_published,
						book: data[i]["Title"]
					})
					
					// Updated chart limits
					if (year_read >= max_read_date){max_read_date = year_read + 1}
					if (year_read <= min_read_date){min_read_date = year_read - 1}
					if (year_published >= max_published_date){max_published_date = year_published + 2}
					if (year_published <= min_published_date){min_published_date = year_published - 1}
				}
			} 
			else{
				// If "Date Added" is not empty add to list
				if (date_added){
					addedxpublished.push({
						x: date_added,
						y: year_published,
						book: data[i]["Title"]
					})

					// Updated chart limits
					if (date_added >= max_read_date){max_read_date = date_added + 1}
					if (date_added <= min_read_date){min_read_date = date_added - 1}
					if (year_published >= max_published_date){max_published_date = year_published + 2}
					if (year_published <= min_published_date){min_published_date = year_published - 1}
				}
			}
		}
		
		const yRange = max_published_date - min_published_date;
		const yFactor = 1 + Math.exp(-(2023 - max_published_date) / (yRange / 4));
		let y_step_size = Math.ceil((yRange / 100) * yFactor);
		
		setData1({
			datasets: [
				{
					label: "Books Read",
					data: readxpublished,
					pointRadius: 4,
					pointBackgroundColor: "rgb(102,187,106)",
				},
				{
					label: "Books Added",
					data: addedxpublished,
					pointRadius: 4,
					pointBackgroundColor: "rgb(255,178,0)",
				},
			]
		})
		setOptions1({
			aspectRatio: 1,
			scales: {
				x: {
					title: {
						display: true,
						text: 'Date Read/Added'
					},
					min: min_read_date,
					max: max_read_date,
					ticks: {
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
						stepSize: y_step_size,
						maxTicksLimit: Math.ceil((max_published_date - 2023) / 100) + 10
					}
				}
			},
			plugins: {
				title: {
					display: true,
					text: 'Date read/added vs Date Published',
					font: { size: 16 },
				},
				// tooltip: {
				// 	callbacks: {
				// 		label: function(context) {
				// 			let label = context.dataset.label || '';
				// 			if (label) {
				// 				label += ': ';
				// 			}
				// 			if (context.parsed.y !== null) {
				// 				label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed.y);
				// 			}
				// 			return label;
				// 		}
				// 	}
				// }
			},
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