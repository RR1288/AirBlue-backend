import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobe, faUser, faList, faPlane } from '@fortawesome/free-solid-svg-icons';
import Header from '../components/Header';


// Main HomePage component
const HomePage = () => {
    return (
        <div style={styles.page}>
            {/* Header component */}
            <Header title="AirBlue System" />

            {/* Main content */}
            <div style={styles.mainContent}>
                {/* Welcome message */}
                <h2 style={styles.welcomeText}>Welcome back, Nick!</h2>

                {/* Cards container */}
                <div style={styles.grid}>
                   
                <div style={styles.card}>
                 <FontAwesomeIcon icon={faGlobe} style={styles.icon} />
                 <p style={styles.cardTitle}>Events</p>
                </div>

                    <div style={styles.card}>
                    <FontAwesomeIcon icon={faUser}  style={styles.icon}/>
                    <p style={styles.cardTitle}>Attendees</p>
                    </div>
                    <div style={styles.card}>
                        <FontAwesomeIcon icon={faList} style={styles.icon}/>
                        <p style={styles.cardTitle}>Event Types</p>
                    </div>
                    <div style={styles.card}>
                    <FontAwesomeIcon icon={faPlane} style={styles.icon}/>
                        <p style={styles.cardTitle}>Flights</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Styles object
const styles = {
    page: {
        // Full-screen layout
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh', // Ensure full vertical height
        width: '100vw', // Ensure full horizontal width
        backgroundColor: '#ffffff',
        boxSizing: 'border-box', // Prevent overflow issues
    },
    mainContent: {
        // Center content and ensure it spans full width/height
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
    },
    welcomeText: {
        // Style for the welcome message
        fontSize: '24px',
        color: '#0B2853',
        marginBottom: '40px',
        fontWeight: '600',
    },
    grid: {
        // Grid layout for the cards
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', // Responsive column sizing
        gap: '20px',
        width: '100%', // Full width
        maxWidth: '1200px', // Limit max width for alignment on large screens
        justifyContent: 'center', // Center grid items
    },
    card: {
        // Style for each card
        backgroundColor: '#0B2853',
        borderRadius: '8px',
        padding: '40px 20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Add a subtle shadow
        cursor: 'pointer',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    
    },
    cardTitle: {
        // Style for card titles
        color: '#FFFFFF',
        marginTop: '10px',
        fontSize: '18px',
        fontWeight: '500',
    },
    icon: {
        fontSize:'36px',
        color: 'white'
    },
};

export default HomePage;
