import styles from '../styles/Layout.module.css'

const Header = () => {
	return (
		<div className={styles.header}>
			<h1>
				GoodreadStats
			</h1>
			<h4>
				Statistics for goodreads
			</h4>
		</div>
	)
}

export default Header