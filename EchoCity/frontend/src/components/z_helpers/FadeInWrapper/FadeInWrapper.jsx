import './FadeInWrapper.css';

const FadeInWrapper = ({ children }) => {
    return (
        <div className="fadeIn">
            {children}
        </div>
    )
}

export default FadeInWrapper;