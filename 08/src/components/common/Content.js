
import styles from '../../styles/Home.module.css'

import Header from './Header'
import Footer from './Footer'

///
/// Content component
///
const Content = (props) => {
  return (
    <div className={styles.container}>
      <Header/>
      <main className={styles.main}>
        { props.children }
      </main>
      <Footer />
    </div>
  )
}

export default Content
