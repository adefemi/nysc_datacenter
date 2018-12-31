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

import {Icon} from 'react-icons-kit'
import {ic_edit} from 'react-icons-kit/md/ic_edit'
import {ic_delete_forever} from 'react-icons-kit/md/ic_delete_forever'

const Year = [
    '1970','1971','1972','1973','1974','1975','1976','1977','1978','1979',
    '1980','1981','1982','1983','1984','1985','1986','1987','1988','1989',
    '1990','1991','1992','1993','1994','1995','1996','1997','1998','1999',
    '2000','2001','2002','2003','2004','2005','2006','2007','2008','2009',
    '2010','2011','2012','2013','2014','2015','2016','2017','2018','2019',
    '2020','2021','2022','2023','2024','2025','2026','2027','2028','2029',
    '2030','2031','2032','2033','2034','2035','2036','2037','2038','2039',
    '2040','2041','2042','2043','2044','2045','2046','2047','2048','2049',
];
const Batch = [
    'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','u','v','w','x','y','z'
];

const initialState = {
    year: Year[0], batch: Batch[0], active: false, loading: false, section: null,
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
        if(props.section !== this.state.section){
            this.setState({section: props.section});
            this.state.section = props.section;
        }
    }

    handleSubmit(access = null){
        let contents = { year: this.state.year, batch: this.state.batch, active: this.state.active};
        let sections = [...this.state.section];
        sections = sections.filter(o => o.year === this.state.year && o.batch === this.state.batch);
        if(sections.length > 0){
            this.setState({toastType:"error",toastStatus: false});
            setTimeout(() => {
                this.setState({toastContent: this.state.year+this.state.batch+ " already exist.",
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
        let url = this.props.backEndLinks.section;
        let accessToken = access;
        access === null ? accessToken = JSON.parse(localStorage.getItem(SiteData.name+"-user",)).access: null;
        this.props.authorizeWithData("post", url, payload, accessToken).then(
            (res) =>{
                this.setState({toastType:"success",toastStatus: false});
                setTimeout(() => {
                    this.setState({toastContent: "Section added successfully",
                        loading: false,toastStatus: true});
                }, 500);
                this.props.section.push(res.data);
                this.props.setContent('SET_SECTION_CONTENT', this.props.section);
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
                        <h3>Add New Section</h3>
                        <form className={'member-form'}>
                            <div className={'form-group'}>
                                <label htmlFor="">Year</label>
                                <select value={this.state.year} onChange={(e) => this.setState({year: e.target.value})}>
                                    {
                                        Year.map((o, i) => (
                                            <option key={i} value={o}>{o}</option>
                                        ))
                                    }
                                </select>
                            </div>
                            <div className={'form-group'}>
                                <label htmlFor="">Batch</label>
                                <select value={this.state.batch} onChange={(e) => this.setState({batch: e.target.value})}>
                                    {
                                        Batch.map((o, i) => (
                                            <option key={i} value={o}>{o.toUpperCase()}</option>
                                        ))
                                    }
                                </select>
                            </div>
                            <div className={'form-group'}>
                                <label htmlFor="">Active</label>
                                <select value={this.state.active} onChange={(e) => this.setState({active: e.target.value})}>
                                    <option value={false}>False</option>
                                    <option value={true}>True</option>
                                </select>
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
