import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import jwt_decode from 'jwt-decode'

import Home from './pages/home/index'
import Auth from './pages/auth/index'
import Section from './pages/section/index'
import SectionAdd from './pages/section/sectionnew'
import Addnew from './pages/section/addnew'
import ViewMember from './pages/section/viewmember'
import EditMember from './pages/section/editmember'
import CDSHome from './pages/cds/index'
import CDSMembers from './pages/cds/members'
import CDSAdd from './pages/cds/cdsnew'
import About from './pages/about/index'

import Mainloader from './pages/loaders/mainloader'
import {SiteData} from './pages/data/siteMain'

import {actionWithoutData, actionWithData, authorizeWithData, authorizeWithoutData, setContent} from '../redux/actions';

const initialState = {
    loading: true, member: null, cds: null, section: null, errorStatus: false,
};

class Router extends React.Component{
    constructor(props) {
        super(props);

        this.state = initialState;
        setTimeout(() => {
            this.setState({loading: false})
        }, 1000)
    }

    componentWillMount(){
        this.getContents();
    }
    getContents(){
        this.setState({errorStatus: false});
        this.state.errorStatus = false;

        //Get member Content
        let url = this.props.backEndLinks.member;
        this.props.actionWithoutData('get', url).then(
            (res) => {
                this.props.setContent("SET_MEMBER_CONTENT", res.data);
                this.setState({member: res.data})
            },
            (err) => {
                this.setState({errorStatus:true})
            }
        );

        //Get cds Content
        url = this.props.backEndLinks.cds;
        this.props.actionWithoutData('get', url).then(
            (res) => {
                this.props.setContent("SET_CDS_CONTENT", res.data);
                this.setState({cds: res.data})
            },
            (err) => {
                this.setState({errorStatus:true})
            }
        );

        //Get section Content
        url = this.props.backEndLinks.section;
        this.props.actionWithoutData('get', url).then(
            (res) => {
                this.props.setContent("SET_SECTION_CONTENT", res.data);
                this.setState({section: res.data})
            },
            (err) => {
                this.setState({errorStatus:true})
            }
        );

    }

    render(){
        return(
            this.state.loading || this.state.member === null || this.state.cds === null || this.state.section === null
                ? <Mainloader/> :
                this.state.errorStatus? <h2>Network error</h2> :
            <BrowserRouter>
                <Switch>
                    <Route exact path={'/'} component={Auth}/>
                    <Route exact path={'/home'} component={Home}/>
                    <Route exact path={'/about'} component={About}/>
                    <Route exact path={'/cds'} component={CDSHome}/>
                    <Route exact path={'/cds/new'} component={CDSAdd}/>
                    <Route exact path={'/cds/:type'} component={CDSMembers}/>
                    <Route exact path={'/section/new'} component={SectionAdd}/>
                    <Route exact path={'/section/:year'} component={Section}/>
                    <Route exact path={'/member/new'} component={Addnew}/>
                    <Route exact path={'/member/edit/:callup'} component={EditMember}/>
                    <Route exact path={'/member/:callup'} component={ViewMember}/>
                </Switch>
            </BrowserRouter>
        )
    }
}

function mapStateToProps(state) {
    return({
        member: state.memberContent, backEndLinks: state.backEndLinks, cds: state.cdsContent, section: state.sectionContent,
    })
}

function mapDispatchToProps(dispatch){
    return bindActionCreators({
        actionWithData: actionWithData, authorizeWithData: authorizeWithData, authorizeWithoutData: authorizeWithoutData,
        actionWithoutData: actionWithoutData, setContent: setContent,
    }, dispatch)
}



export default connect(mapStateToProps, mapDispatchToProps)(Router);