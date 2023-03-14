import { useState, useEffect } from 'react'

import BookCharts from './BookCharts.js'
import AuthorCharts from './AuthorCharts.js'
import styles from '../../styles/Charts.module.css'

const Charts = () => {
	return (
		<div className={styles.chartsContainer}>
			<BookCharts />
			<AuthorCharts />
		</div>
	)
}

export default Charts