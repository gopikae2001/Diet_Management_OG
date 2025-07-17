import React from "react";
import '../styles/pageContainer.css';

interface PageContainerProps{
      children?: React.ReactNode;
}
const PageContainer: React.FC<PageContainerProps> = ({children}) => {
    return(
        <>
        <div className="page-container">
            {children}
        </div>
        </>
    );
};
export default PageContainer;