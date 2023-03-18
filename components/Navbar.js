import Link from 'next/link'
import styles from '../styles/Summary.module.css'
const Navbar = () => {
	return (
		<div className={styles.navbarContainer}>
			<Link href='#Data-Table'>Data</Link>
			<Link href='#Book-Stats'>Book Stats</Link>
			<Link href='#Author-Stats'>Author Stats</Link>
		</div>
	)
}

export default Navbar