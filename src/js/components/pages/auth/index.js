import React from 'react';
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import $ from 'jquery'
import jwt_decode from 'jwt-decode';

import NyscImage from '../../../../assets/image/nysc.png';

import {actionWithoutData, actionWithData, authorizeWithData, authorizeWithoutData, setContent} from '../../../redux/actions';
import ButtonLoader from '../loaders/buttonLoader';
import {processError} from '../common/miscellaneous'
import {SiteData} from '../data/siteMain'
import Toast from '../common/toast'

const initialState = {
    username: "", password:"",  loading: false,
    toastType: "error", toastContent: "", toastStatus: false,
};

class Auth extends React.Component{
    constructor(props) {
        super(props);

        this.state = initialState

    }
    componentWillMount(){
        localStorage.removeItem(SiteData.name+"-user");
    }

    closeToast(){
        this.setState({toastStatus: false})
    }

    handleSubmit(){
        let contents = {username:this.state.username, password:this.state.password};
        let payload = new FormData();
        Object.entries(contents).forEach(
            ([key, value]) => {
                payload.append(key, value)
            }
        );
        let url = this.props.backEndLinks.auth;
        this.props.actionWithData("post", url, payload).then(
            (res) =>{
                localStorage.setItem(SiteData.name+"-user", JSON.stringify(res.data));
                this.props.setContent("SET_ADMIN_ACTIVE", true);
                this.props.history.push('/home');
            },
            (err) =>{
                let errorObj = processError(err, this.props.backEndLinks.refresh);
                this.setState({toastContent: errorObj.content,
                    toastType:"error", loading: false, toastStatus: true});
            }
        )
    };

    render(){
        return(
            <div className={'auth-container'}>
                <div className={'bg-image'}> </div>
                <p className={'title'}>NYSC DATA-CENTER OWO, ONDO STATE</p>
                <Toast closeToast={this.closeToast.bind(this)}
                       content={this.state.toastContent}
                       type={this.state.toastType} toastStatus={this.state.toastStatus}/>
                <div className={'auth-form'}>
                    <img src={NyscImage} className={'image-control'} alt=""/>
                    <div className={'form-group'}>
                        <label htmlFor="">Admin ID</label>
                        <input value={this.state.username} onChange={(e) => this.setState({username: e.target.value})} type="text" />
                    </div>
                    <div className={'form-group'}>
                        <label htmlFor="">Password</label>
                        <input value={this.state.password} onChange={(e) => this.setState({password: e.target.value})} type="password" />
                    </div>
                    {
                        this.state.loading ? <button className={'disabled'} disabled={'true'}><ButtonLoader/></button> :
                            <button onClick={(e) => [e.preventDefault(), this.setState({loading: true}), this.handleSubmit()]}>Log in</button>
                    }

                </div>

                <p className={'foot'}>Developed By ICT-CDS BATCH B 2017</p>
            </div>
        )
    }
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

export default connect(mapStateToProps, mapDispatchToProps)(Auth);