// Import React for creating components
import React from 'react';
import { Link } from 'react-router-dom';

// FontAwesome icon package (add this to your dependencies if not installed already)
// npm install @fortawesome/react-fontawesome @fortawesome/free-solid-svg-icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';

Header.propTypes = {
  title: PropTypes.string.isRequired,
};

function Header({ title }) {
    return (
        <header style={styles.header}>
            {/* Menu button with link */}
            <Link to="/menu" style={styles.menuButton}>
                ☰
            </Link>
            
            {/* Page title */}
            <h1 style={styles.title}>{title}</h1>
            
            {/* Sign out link with an icon */}
            <Link to="/signout" style={styles.signOut}>
                <FontAwesomeIcon icon={faSignOutAlt} style={styles.signOutIcon} /> {/* Sign Out Icon */}
                Sign Out
            </Link>
        </header>
    );
}

// Styles for the header
const styles = {
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#0A306E', // Header background color
        color: 'white',
        padding: '10px 20px',
        marginBottom: '-160px',
    },
    menuButton: {
        backgroundColor: 'transparent',
        color: 'white',
        fontSize: '20px',
        border: 'none',
        cursor: 'pointer',
        textDecoration: 'none',
    },
    title: {
        margin: 0,
        fontSize: '18px',
    },
    signOut: {
        display: 'flex',
        alignItems: 'center',
        color: 'white',
        textDecoration: 'none',
        padding: '5px 10px',
        borderRadius: '5px',
    },
    signOutIcon: {
        marginRight: '8px', // Adds spacing between the icon and text
        fontSize: '16px',
    },
};

export default Header;
