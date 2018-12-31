import React from 'react';
import {Link} from 'react-router-dom';
import $ from 'jquery'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

import {actionWithoutData, actionWithData, authorizeWithData, authorizeWithoutData, setContent} from '../../../redux/actions';
import {verifyauth, processError, resetToken} from '../common/miscellaneous'

import Navbar from '../common/navbar'
import Footer from '../common/footer'
import ButtonLoader from '../loaders/buttonLoader';
import Toast from '../common/toast'
import {SiteData} from '../data/siteMain'


const initialState = {
    title: "", titleShort:"", loading: false, cds: null,
    toastType: "error", toastContent: "", toastStatus: false,
};

class AddSection extends React.Component{
    constructor(props) {
        super(props);

        this.state = initialState;
    }

    closeToast(){
        this.setState({toastStatus: false})
    }

    componentWillMount(){
        if(!verifyauth()) this.props.history.push('/');
        this.componentWillReceiveProps(this.props);
    }

    componentWillReceiveProps(props){
        if(props.cds !== this.state.cds){
            this.setState({cds: props.cds});
            this.state.cds = props.cds;
        }
    }

    handleSubmit(access = null){
        let contents = { title: this.state.title, titleShort: this.state.titleShort};
        let cds = [...this.state.cds];
        cds = cds.filter(o => o.title === this.state.title || o.titleShort === this.state.titleShort);
        if(cds.length > 0){
            this.setState({toastType:"error",toastStatus: false});
            setTimeout(() => {
                this.setState({toastContent: "CDS group already exist.",
                    loading: false,toastStatus: true});
            }, 500);
            return;
        }
        let payload = new FormData();
        Object.entries(contents).forEach(
            ([key, value]) => {
                payload.append(key, value)
            }
        );
        let url = this.props.backEndLinks.cds;
        let accessToken = access;
        access === null ? accessToken = JSON.parse(localStorage.getItem(SiteData.name+"-user",)).access: null;
        this.props.authorizeWithData("post", url, payload, accessToken).then(
            (res) =>{
                this.setState({toastType:"success",toastStatus: false});
                setTimeout(() => {
                    this.setState({toastContent: "CDS group added successfully",
                        loading: false,toastStatus: true});
                }, 500);
                this.props.cds.push(res.data);
                this.props.setContent('SET_CDS_CONTENT', this.props.cds);
            },
            (err) =>{
                let errorObj = processError(err, this.props.backEndLinks.refresh);
                this.setState({toastType:"error", toastStatus: false});
                errorObj.type === 3 ? this.handleSubmit(errorObj.content) :
                setTimeout(() => {
                    this.setState({toastContent: errorObj.content,
                         loading: false,toastStatus: true});
                }, 500)
            }
        )
    }
    render(){
        return(
            <div className={'wrapper'}>
                <div className={'bg-nysc'}> </div>
                <Navbar history={this.props.history}/>
                <Toast closeToast={this.closeToast.bind(this)}
                       content={this.state.toastContent}
                       type={this.state.toastType} toastStatus={this.state.toastStatus}/>
                <div className={'content'}>
                    <div className={'content-main'}>
                        <h3>Add New CDS GROUP</h3>
                        <form className={'member-form'}>
                            <div className={'form-group'}>
                                <label htmlFor="">Title(full)</label>
                                <input type="text" value={this.state.title} onChange={(e) => this.setState({title: e.target.value})}/>
                            </div>
                            <div className={'form-group'}>
                                <label htmlFor="">Title(Abbrevation) <span>N.B. Not more that 5 letters</span></label>
                                <input type="text" value={this.state.titleShort} onChange={(e) => this.setState({titleShort: e.target.value})}/>
                            </div>

                            {
                                this.state.loading ? <button className={'disabled'} disabled={'true'}><ButtonLoader/></button> :
                                    <button onClick={(e) => [e.preventDefault(), this.setState({loading: true}), this.handleSubmit()]}>Submit</button>
                            }
                        </form>
                    </div>
                </div>
                <Footer/>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return({
        adminStatus: state.adminStatus,
        member: state.memberContent, cds: state.cdsContent, section: state.sectionContent, backEndLinks: state.backEndLinks,
    })
}

function mapDispatchToProps(dispatch){
    return bindActionCreators({
        actionWithData: actionWithData, authorizeWithData: authorizeWithData, authorizeWithoutData: authorizeWithoutData,
        actionWithoutData: actionWithoutData, setContent: setContent,
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(AddSection);
