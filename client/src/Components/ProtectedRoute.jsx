import { Navigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import Loader from './Loader';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if(loading) return <div className="h-screen bg-white w-full flex justify-center items-center">
        <Loader />
    </div>

    return user ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;