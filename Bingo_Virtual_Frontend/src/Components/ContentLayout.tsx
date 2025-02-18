
import { Header } from './Header'
import { Footer } from './Footer'

export const ContentLayout = ({children}) => {
  return (
    <div>
        <Header/>
        <main>
            {children}
        </main>
        <Footer/>
    </div>
  )
}
