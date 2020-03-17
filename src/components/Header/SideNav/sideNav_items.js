import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { firebase } from '../../../firebase';

import FontAwesome from 'react-fontawesome';
import './sideNav.css'

const SideNavItems = (props) => {
    const items = [
        {
            
            icon: 'hom2e',
            text: 'Home',
            link: '/',
            login: ''
        },
        {
            
            icon: 'file2-text-o',
            text: 'News',
            link: '/news',
            login: ''
        },
        {
           
            icon: 'play2',
            text: 'Videos',
            link: '/videos',
            login: ''
        },
        {
           
            icon: 'sign-2in',
            text: 'Dashboard',
            link: '/dashboard',
            login: false
        },
        {
            
            icon: 'sign-i2n',
            text: 'Sign in',
            link: '/sign-in',
            login: true
        },
        {
           
            icon: 'sign-ou2t',
            text: 'Sign out',
            link: '/sign-out',
            login: false
        }
    ]

    const element = (item,i) => (
        <div key={i} className='options'>
            <Link to={item.link}>
                <FontAwesome name={item.icon}/>
                {item.text}
            </Link>
        </div>
    )


    const restricted = (item,i) => {
        let template = null;

        if( props.user === null && item.login ){
            template = element(item,i)
        }

        if(props.user !== null && !item.login){
            if(item.link === '/sign-out'){
                template = (
                    <div key={i} 
                        className='options'
                        onClick={()=>{
                            firebase.auth().signOut()
                            .then(()=>{
                                props.history.push("/")
                            })
                        }}
                        >
                        <FontAwesome name={item.icon}/>
                        {item.text}
                    </div>
                )

            } else {
                template = element(item,i)
            }
        }

        return template;
    }


    const showItems = () => {
        return items.map( (item,i) =>{
            return item.login !== '' ?
                restricted(item,i)
            :
                element(item,i)
        } )
    }


    return(
           <div>
               {showItems()}
           </div> 
    )
}

export default withRouter(SideNavItems);