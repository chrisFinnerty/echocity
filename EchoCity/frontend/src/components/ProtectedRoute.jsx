import { useContext } from "react";
import Context from "./Context";
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element }) => {
    const { currentUser } = useContext(Context);

    return currentUser ? element : <Navigate to="/" replace />;
};

export default ProtectedRoute;