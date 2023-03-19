import { AnalyticsWrapper } from './Analytics.js';
import styles from '../styles/Layout.module.css'

const Layout = ({ children }) => {
	return (
		<>
			<div className={styles.container}>
				<div className={styles.pageLayout}>
					{ children }
				</div>
			</div>

			<AnalyticsWrapper />
		</>
	)
}

export default Layout