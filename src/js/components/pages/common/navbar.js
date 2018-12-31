import React from 'react';
import {Link} from 'react-router-dom';
import NyscImage from '../../../../assets/image/nysc.png';
import {Icon} from 'react-icons-kit'
import {spinner5} from 'react-icons-kit/icomoon/spinner5'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import $ from 'jquery'
import proptype from 'prop-types'

import {actionWithoutData, actionWithData, authorizeWithData, authorizeWithoutData, setContent} from '../../../redux/actions';
import {SiteData} from '../data/siteMain'

const initialState = {
    loggingOut: false, activeLink: "/",
};

class Navbar extends React.Component{
    constructor(props) {
        super(props);

        this.state = initialState;
        $('html').css('overflow-y','auto');

        this.state.activeLink = window.location.pathname;
    }

    logOutFunc(){
        this.setState({loggingOut:true});
        setTimeout(() => {
            localStorage.removeItem(SiteData.name+'-user');
            this.props.setContent("SET_ADMIN_ACTIVE", false);
            this.props.history.push('/');
        }, 1000)
    }

    render(){
        return(

            <div className={'navbar noprint'}>
                <div className={'navbrand'}>
                    <img src={NyscImage} alt=""/>
                </div>
                <div className={'navright'}>
                    <li><Link className={this.state.activeLink === '/home' ? 'active' : ''} to={'/home'}>Home</Link></li>
                    <li><Link className={this.state.activeLink === '/cds' ? 'active' : ''} to={'/cds'}>Cds</Link></li>
                    <li><Link className={this.state.activeLink === '/about' ? 'active' : ''} to={'/about'}>About</Link></li>
                    {
                        this.state.loggingOut ? <button>Logging off&nbsp;<Icon className={'rotate'} icon={spinner5}/></button>:
                            <button onClick={() => this.logOutFunc()}>Logout</button>
                    }

                </div>
            </div>

        )
    }
}

Navbar.propTypes = {
    history: proptype.object.isRequired
}

function mapStateToProps(state) {
    return({
        adminStatus: state.adminStatus, backEndLinks: state.backEndLinks,
    })
}

function mapDispatchToProps(dispatch){
    return bindActionCreators({
        actionWithData: actionWithData, authorizeWithData: authorizeWithData, authorizeWithoutData: authorizeWithoutData,
        actionWithoutData: actionWithoutData, setContent: setContent,
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Navbar)