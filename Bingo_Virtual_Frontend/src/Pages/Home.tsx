import { ContentLayout } from "../Components/ContentLayout"

import '../styles/home.css'
import { Link } from "react-router-dom";
export const Home = () => {

  return (
    <ContentLayout>
      <div className="home-content">
      <Link to={"/lobby"}>Iniciar Juego</Link>       
      </div>
        
    </ContentLayout>  
    )
}
