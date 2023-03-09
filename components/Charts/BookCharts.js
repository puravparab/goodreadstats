import { useState, useEffect } from 'react'

const BookCharts = () => {
	useEffect(() => {
		window.addEventListener('storage', () => {
			const data = JSON.parse(localStorage.getItem('goodreads_data'))
		})
	}, [])

	return (
		<div>
			
		</div>
	)
}

export default BookCharts