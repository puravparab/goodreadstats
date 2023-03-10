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
				}
			}
		}

		setData1({
			datasets: [{
					data: readxpublished,
					pointRadius: 4,
      		pointBackgroundColor: "rgba(0,0,255,1)",
			}]
		})
		setOptions1({
			scales: {
	      x: {
	        title: {
	          display: true,
	          text: 'Date Read'
	        },
	        min: 2021,
	        max: 2024,
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
	        min: 1980,
	        max: 2023,
	        ticks: {
	          // forces step size to be 50 units
	          stepSize: 1
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
		<div>
			{detailsVisible ?
				<Scatter
					options={options1}
					data={data1}
				/> : ""
			}
		</div>
	)
}

export default BookCharts