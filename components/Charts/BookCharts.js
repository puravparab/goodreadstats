import { useState, useEffect } from 'react'
import 'chart.js/auto'
import 'chartjs-adapter-moment';
import { Scatter, Bar } from 'react-chartjs-2';

import styles from '../../styles/Charts.module.css'

const BookCharts = () => {
	const [detailsVisible, setDetailsVisible] = useState(false)

	// Date read vs Data published
	const [data1, setData1] = useState({})
	const [options1, setOptions1] = useState({})

	// Date read vs pages read
	const [data2, setData2] = useState({})
	const [options2, setOptions2] = useState({})

	useEffect(() => {
		window.addEventListener('storage', () => {
			const data = JSON.parse(localStorage.getItem('goodreads_data'))
			createChart1(data)
			createChart2(data)
			setDetailsVisible(true)
		})
	}, [])

	// Chart 1: Date read/added vs date published
	const createChart1 = (data) => {
		// json containing x(date read) and y(date published) values
		let readxpublished = []
		// json containing x(date added) and y(date published) values
		let addedxpublished = []

		let max_read_date = 1900
		let min_read_date = 3000
		let max_published_date = -10000
		let min_published_date = 3000

		// Iterate through the list of books
		for (let i=0; i < data.length; i++){
			// Store from "Date Read"
			let year_read = parseInt(data[i]["Date Read"].split('/')[0])
			let month_read = parseInt(data[i]["Date Read"].split('/')[1])

			// Store frm "Date Added"
			let year_added = parseInt(data[i]["Date Added"].split('/')[0])
			let month_added = parseInt(data[i]["Date Added"].split('/')[1])

			// Store year book was published
			let year_published = parseInt(data[i]["Original Publication Year"])

			// If "Original Publication Year" is empty
			if (!year_published){
				year_published = parseInt(data[i]["Year Published"])
			}

			// If book has been read
			if (data[i]["Exclusive Shelf"] == 'read'){
				// If "Date Read" is not empty add to list
				if (year_read){
					// 100 / 13 = 7.692 (eg: 2020.0 = Jan, 2020.92 = Dec)
					let x_date = ((year_read*100) + (month_read-1)*7.692) / 100 

					readxpublished.push({
						x: x_date,
						y: year_published,
						x_year: year_read,
						x_month: month_read,
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
				if (year_added){
					// 100 / 13 = 7.692 (eg: 2020.0 = Jan, 2020.92 = Dec)
					let x_date = ((year_added*100) + (month_added-1)*7.692) / 100 

					addedxpublished.push({
						x: x_date,
						y: year_published,
						x_year: year_added,
						x_month: month_added,
						book: data[i]["Title"]
					})

					// Updated chart limits
					if (year_added >= max_read_date){max_read_date = year_added + 1}
					if (year_added <= min_read_date){min_read_date = year_added - 1}
					if (year_published >= max_published_date){max_published_date = year_published + 2}
					if (year_published <= min_published_date){min_published_date = year_published - 1}
				}
			}
		}
		
		// Figure out step size
		const yRange = max_published_date - min_published_date;
		const yFactor = 1 + Math.exp(-(2023 - max_published_date) / (yRange / 4));
		let y_step_size = Math.ceil((yRange / 100) * yFactor);
		
		setData1({
			datasets: [
				{
					label: "Book Read",
					data: readxpublished,
					pointRadius: 4,
					pointBackgroundColor: "rgb(102,187,106)",
				},
				{
					label: "Book Added",
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
					max: max_published_date + 50,
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
				tooltip: {
					callbacks: {
						label: function(tooltipItem) {
							const dataIndex = tooltipItem.dataIndex
							const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
							const month = months[tooltipItem.dataset.data[dataIndex].x_month - 1]
							return [
								tooltipItem.dataset.data[dataIndex].book,
								"Read/Added : " + month + " " + tooltipItem.dataset.data[dataIndex].x_year,
								"Published : " + tooltipItem.dataset.data[dataIndex].y
							]
						}
					}
				}
			},
		})
	}

	// Chart 2: Number of pages read per month
	const createChart2 = (data) => {
		// JSON containing pages vs date read
		let pagesxread = []
		
		// JSON that takes in the x_date as key and stores total pages
		let date_json = {}

		// Iterate through list of books
		for (let i=0; i < data.length; i++){
			if (data[i]["Exclusive Shelf"] == 'read'){
				// Store from "Date Read"
				let year_read = parseInt(data[i]["Date Read"].split('/')[0])
				let month_read = parseInt(data[i]["Date Read"].split('/')[1])
				let day_read = parseInt(data[i]["Date Read"].split('/')[2])

				// Store in formate ('YYYY-MM-DD')
				let date_read = year_read + "-" + month_read + "-" + day_read

				// If year read is not empty
				if (year_read){
					let num_pages = parseInt(data[i]["Number of Pages"])
					// If number of pages is not empty
					if (num_pages != null){
						// If entry exists add pages
						if (date_json[date_read] != null){
							date_json[date_read] += num_pages
						} 
						// Id entry does not exists create it
						else{
							date_json[date_read] = num_pages
						}
					}
				}
			}
		}

		// Iterate through date_json
		for (var key in date_json){
			pagesxread.push({
				x: new Date(key),
				y: date_json[key]
			})
		}

		setData2({
			datasets: [
				{
					label: "Pages Read",
					data: pagesxread,
					backgroundColor: "rgb(102,187,106)",
				},
			]
		})

		setOptions2({
			aspectRatio: 1,
			scales: {
				x: {
					type: 'time',
					time: {
						displayFormats: {
							month: 'MMM YYYY'
						}
					},
					title: {
						display: true,
						text: 'Date Read'
					}
				},
				y: {
					title: {
						display: true,
						text: 'Number of pages read'
					}
				}
			},
			plugins: {
				title: {
					display: true,
					text: 'Number of pages read per month',
					font: { size: 16 },
				},
				tooltip: {
					callbacks: {
						title: function(tooltipItem) {
							const dataIndex = tooltipItem[0].dataIndex
							const month = tooltipItem[0].dataset.data[dataIndex].x.getMonth()
							const year = tooltipItem[0].dataset.data[dataIndex].x.getFullYear()
							const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
							return months[month] + " " + year
						}
					}
				}
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
					<div className={styles.chart}>
						<Bar options={options2} data={data2}/>
					</div>
				</div>
				: ""
			}
		</div>
	)
}

export default BookCharts