import React from 'react';
import {Link} from 'react-router-dom';
import $ from 'jquery'
import {Icon} from 'react-icons-kit'
import {plus} from 'react-icons-kit/icomoon/plus'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

import CSS from '../../../../assets/css/style.css'

import {actionWithoutData, actionWithData, authorizeWithData, authorizeWithoutData, setContent} from '../../../redux/actions';
import {verifyauth, processError, resetToken} from '../common/miscellaneous'

import Navbar from '../common/navbar'
import Footer from '../common/footer'
import Subloader from '../loaders/subLoader'

const initialState = {
    member: null, activeMember: null, section: null, cds: null, loading: true
};

class Home extends React.Component{
    constructor(props) {
        super(props);

        this.state = initialState;
        setTimeout(() => {
            this.setState({loading: false})
        }, 100)
    }

    getActiveMember(){
        let _members = [...this.state.member];
        let slug = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);
        slug = slug.replace(/-/g, '/');
        let activeMember = _members.filter(o => o.call_up_no === slug);
        this.state.activeMember = activeMember;
        this.setState({activeMember:activeMember});
    }

    componentWillMount(){
        if(!verifyauth()) this.props.history.push('/');
        this.componentWillReceiveProps(this.props);
    }

    componentWillReceiveProps(props){
        if(props.member !== this.state.member){
            this.setState({member: props.member});
            this.state.member = props.member;
            this.getActiveMember();
        }
        else{
            this.getActiveMember();
        }
        if(props.section !== this.state.section) {
            this.setState({section: props.section});
            this.state.section = props.section;
        }
        if(props.cds !== this.state.cds) {
            this.setState({cds: props.cds});
            this.state.cds = props.cds;
        }
    }

    getSection(){
        let section = [...this.state.section];
        let activeSection = section.filter(o => o.id === this.state.activeMember[0].section);
        return activeSection[0].year+" "+activeSection[0].batch.toUpperCase();
    }

    getCDS(){
        let cds = [...this.state.cds];
        let activeCDS = cds.filter(o => o.id === this.state.activeMember[0].cds_group);
        return activeCDS[0].titleShort.toUpperCase();
    }

    render(){
        return(
            <div className={'wrapper'}>
                <div className={'bg-nysc'}> </div>
                <Navbar history={this.props.history}/>
                <div className={'content'}>
                    <div className={'content-main'}>
                        <h3>Corps Member Profile</h3>

                        {
                            this.state.activeMember === null || this.state.loading ? <Subloader/> :
                                this.state.activeMember.length < 1 ? <h4>No corps member fit the specification provided</h4>:
                                    <div>
                                        <div className={'member-info'} id={'member-info'}>
                                            <div className={'inline-input'}>
                                                <div className={'form-group'}>
                                                    <label htmlFor="">Surname</label>
                                                    <p>{this.state.activeMember[0].surname}</p>
                                                </div>
                                                <div className={'form-group'}>
                                                    <label htmlFor="">Other names</label>
                                                    <p>{this.state.activeMember[0].othernames}</p>
                                                </div>
                                                <div className={'form-group'}>
                                                    <label htmlFor="">Section</label>
                                                    <p>{this.state.section === null ? null : this.getSection()}</p>
                                                </div>
                                            </div>


                                            <div className={'inline-input'}>
                                                <div className={'form-group'}>
                                                    <label htmlFor="">NYSC Call Up No.</label>
                                                    <p>{this.state.activeMember[0].call_up_no.toUpperCase()}</p>
                                                </div>
                                                <div className={'form-group'}>
                                                    <label htmlFor="">State Code</label>
                                                    <p>{this.state.activeMember[0].statecode.toUpperCase()}</p>
                                                </div>
                                                <div className={'form-group'}>
                                                    <label htmlFor="">CDs Group</label>
                                                    <p>{this.state.cds === null ? null : this.getCDS()}</p>
                                                </div>

                                            </div>

                                            <div className={'inline-input'}>
                                                <div className={'form-group'}>
                                                    <label htmlFor="">Sex</label>
                                                    <p>{this.state.activeMember[0].sex}</p>
                                                </div>

                                                <div className={'form-group'}>
                                                    <label htmlFor="">Marital Status</label>
                                                    <p>{this.state.activeMember[0].marital_status}</p>
                                                </div>
                                            </div>

                                            <div className={'inline-input'}>
                                                <div className={'form-group'}>
                                                    <label htmlFor="">State of Origin</label>
                                                    <p>{this.state.activeMember[0].state}</p>
                                                </div>
                                                <div className={'form-group'}>
                                                    <label htmlFor="">Local Govenment Area</label>
                                                    <p>{this.state.activeMember[0].lga}</p>
                                                </div>
                                            </div>
                                            <div className={'form-group'}>
                                                <label htmlFor="">Parent's Name</label>
                                                <p>{this.state.activeMember[0].parent_name}</p>
                                            </div>
                                            <div className={'form-group'}>
                                                <label htmlFor="">Address</label>
                                                <div className={'content-text'}>{this.state.activeMember[0].address}</div>
                                            </div>
                                            <div className={'form-group'}>
                                                <label htmlFor="">Parent Home Address</label>
                                                <div className={'content-text'}>{this.state.activeMember[0].parent_home_address}</div>
                                            </div>
                                            <div className={'form-group'}>
                                                <label htmlFor="">Medical History</label>
                                                <p>{this.state.activeMember[0].medical < 1 ? 'No' : 'Yes'}</p>
                                            </div>
                                            <h4>IN CASE OF EMERGENCY</h4>
                                            <div className={'form-inner'}>
                                                <div className={'form-group'}>
                                                    <label htmlFor="">Name of Next of Kin</label>
                                                    <p>{this.state.activeMember[0].name_next_kin}</p>
                                                </div>
                                                <div className={'form-group'}>
                                                    <label htmlFor="">Contact Tel. No.</label>
                                                    <p>{this.state.activeMember[0].tel_next_kin}</p>
                                                </div>
                                                <div className={'form-group'}>
                                                    <label htmlFor="">Contact Address</label>
                                                    <div className={'content-text'}>{this.state.activeMember[0].address_next_kin}</div>
                                                </div>
                                            </div>
                                            <div className={'form-group'}>
                                                <label htmlFor="">Date Registered in Local Government</label>
                                                <p>{this.state.activeMember[0].date_registered_lga}</p>
                                            </div>
                                            <div className={'form-group'}>
                                                <label htmlFor="">Contact Tel. Phone No.(Self)</label>
                                                <p>{this.state.activeMember[0].self_tel}</p>
                                            </div>
                                            <div className={'form-group'}>
                                                <label htmlFor="">Higher Institution Attended</label>
                                                <p>{this.state.activeMember[0].higher_institution}</p>
                                            </div>
                                            <div className={'form-group'}>
                                                <label htmlFor="">Course of Study</label>
                                                <p>{this.state.activeMember[0].course_study}</p>
                                            </div>
                                            <div className={'form-group'}>
                                                <label htmlFor="">Qualification</label>
                                                <p>{this.state.activeMember[0].qualification}</p>
                                            </div>
                                            <div className={'form-group'}>
                                                <label htmlFor="">Class of Degree/Diploma</label>
                                                <p>{this.state.activeMember[0].class_of_degree}</p>
                                            </div>
                                            <h4>PLACE OF ASSIGNMENT</h4>
                                            <div className={'form-group'}>
                                                <label htmlFor="">Name of PPA</label>
                                                <p>{this.state.activeMember[0].name_ppa}</p>
                                            </div>
                                            <div className={'form-group'}>
                                                <label htmlFor="">Address of PPA</label>
                                                <div className={'content-text'}>{this.state.activeMember[0].address_ppa}</div>
                                            </div>
                                            <div className={'inline-input'}>
                                                <div className={'form-group'}>
                                                    <label htmlFor="">CM's Signature</label>
                                                    <p>{
                                                        this.state.activeMember[0].cm_signature === null ? null :
                                                            <a href={this.state.activeMember[0].cm_signature} target={'_blank'}>
                                                                <img src={this.state.activeMember[0].cm_signature} alt=""/></a>
                                                    }</p>
                                                </div>
                                                <div className={'form-group'}>
                                                    <label htmlFor="">Date</label>
                                                    <p>{this.state.activeMember[0].cm_signature_date}</p>
                                                </div>
                                            </div>
                                            <div className={'inline-input'}>
                                                <div className={'form-group'}>
                                                    <label htmlFor="">Field Office's Signature</label>
                                                    <p>{
                                                        this.state.activeMember[0].field_office_signature === null ? null :
                                                            <a href={this.state.activeMember[0].field_office_signature} target={'_blank'}>
                                                                <img src={this.state.activeMember[0].field_office_signature} alt=""/></a>
                                                    }</p>
                                                </div>
                                                <div className={'form-group'}>
                                                    <label htmlFor="">Date</label>
                                                    <p>{this.state.activeMember[0].field_office_signature_date}</p>
                                                </div>
                                            </div>
                                            <div className={'form-group'}>
                                                <label htmlFor="">For(Office use only)</label>
                                                <div className={'content-text'}>{this.state.activeMember[0].for_office_only}</div>
                                            </div>

                                            <a href={this.state.activeMember[0].cover} target={'_blank'}>
                                                <img className={'passport'} src={this.state.activeMember[0].cover} alt="Passport Affix"/>
                                            </a>
                                        </div>
                                        <div className={'controls noprint'} >
                                            <button onClick={() => this.props.history.push('/member/edit/'+this.state.activeMember[0].call_up_no.toUpperCase().replace(/\//g,'-'))}>Edit</button>
                                            <button className={'print'} onClick={() => window.print()}>Print</button>
                                        </div>
                                    </div>
                        }

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

export default connect(mapStateToProps, mapDispatchToProps)(Home);