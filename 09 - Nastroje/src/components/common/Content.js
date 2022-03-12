
import styles from '../../styles/Content.module.css'
import { ToastContainer } from 'react-toastify'

import Header from './Header'
import Footer from './Footer'

///
/// Content component
///
const Content = (props) => {
  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        { props.children }
      </main>
      <ToastContainer />
      <Footer />
    </div>
  )
}

export default Content
