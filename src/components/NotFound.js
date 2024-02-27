import Image from 'react-bootstrap/Image';
import "../styles/NotFound.css";
import * as Components from '../Components';
import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';

function FluidExample() {
  return <Image src={require("../assets/404.jpg")} fluid />;
}


export const NotFound = () => {
    const navigate = useNavigate();
    const handleReturn = useCallback(()=>{
        
        const accessToken = localStorage.getItem('accessToken');
        if(accessToken)
        {
            navigate("/dashboard");
        }
        else
        {
            navigate('/');
        }
    }, [navigate]);

    return (
        <>
        <div id="div-404">
            <div id="image-div">
                <FluidExample/>
            </div>
            <span id="error-body">The page you were looking for was not found...</span>
            <Components.Button onClick={handleReturn}>Return Back</Components.Button>
        </div>
        
        </>
    )
}