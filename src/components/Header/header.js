import React from 'react';
import {Link} from 'react-router-dom';
import  './header.css';
import FontAwesome from 'react-fontawesome';
import SideNav from './SideNav/sideNav';

const Header=(props)=>{

    const logo=()=>{
        return (
            <Link to='/' className='logo'>
                <img alt='nba logo' src='/images/nba_logo.png'/>
            </Link>
        )
    }

    const navBars=()=>{
        return(
            <div className='bars'>
                <FontAwesome name='bars'
                onClick={props.onOpenNav}
                />
            </div>
        )
    }

    return(
        <header className='header'>
            <SideNav {...props}/>
            <div className='headerOpt'>
                {navBars()}
                {logo()}
            </div>
        </header>
    )
}

export default Header;