import React from 'react';
import './sideNav.css';
import FontAwesome from 'react-fontawesome';
import {Link} from 'react-router-dom';

const SideNavItems=()=>{

    const items=[
        {
            icon:'home',
            text:'Home',
            link:'/'
        },
        {
            icon:'file-text-o',
            text:'News',
            link:'/news'
        },
        {
            icon:'play',
            text:'Videos',
            link:'/videos'
        },
        {
            icon:'sign-in',
            text:'Sign In',
            link:'/sign-in'
        },  
        {
            icon:'sign-out',
            text:'Sign Out',
            link:'/sign-out'
        }
    ]

    const showItems=()=>{
        return items.map((item,i)=>{
            return (
                <div key={i} className='options'>
                <Link to={item.link}>
                    <FontAwesome name={item.icon}/>
                    {item.text}
                </Link>
        </div>
            )
        })
    }

    return(
        <div>
            {showItems()}
        </div>
    )
}

export default SideNavItems;



