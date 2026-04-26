import Sidebar from '../components/Layout/Sidebar';
import Navbar from '../components/Layout/Navbar';
import Dashboard from '../components/Dashboard/Dashboard';

const DashboardPage = () => {
    return (
        <div className="app-container">
            <Sidebar />
            <div className="main-content">
                <Navbar />
                <Dashboard />
            </div>
        </div>
    );
};

export default DashboardPage;
