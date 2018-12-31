import React from 'react';
import {Link} from 'react-router-dom';
import $ from 'jquery'
import {Icon} from 'react-icons-kit'
import {plus} from 'react-icons-kit/icomoon/plus'
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
    cds: null, section: null, member: null, toastType: "error", toastContent: "", toastStatus: false,
    session: null, cds_group: null, surname: "", othername: "", statecode: "", sex: "male", callup: "",
    marital: "single", stateOrigin: "", lga: "", parentname: "", address: "", parentAddress: "",
    medical: null, nextofkin: "", nextofkinTel: "", nextofkinContact: "", datelga: "", contactTel: "",
    highInstitution: "", courseOfStudy: "", qualification:"", classOfCert: "", ppaName: "", ppaAddress: "",
    cmSig: null, cmSigDate: "", officerSig: null, officerSigDate: "", forOffice: "",passport: null,
    loading: false,
};

class Home extends React.Component{
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
        if(props.member !== this.state.member){
            this.setState({member: props.member});
            this.state.member = props.member
        }
        if(props.section !== this.state.section){
            this.setState({section: props.section, session: props.section[0].id});
            this.state.section = props.section;
            this.state.session = props.section[0].id;
        }
        else{
            this.setState({section: props.section, session: props.section[0].id});
            this.state.section = props.section;
            this.state.session = props.section[0].id;
        }
        if(props.cds !== this.state.cds){
            this.setState({cds: props.cds, cds_group: props.cds[0].id});
            this.state.cds = props.cds;
            this.state.cds_group = props.cds[0].id;
        }
        else {
            this.setState({cds: props.cds, cds_group: props.cds[0].id});
            this.state.cds = props.cds;
            this.state.cds_group = props.cds[0].id;
        }
    }

    getSection(){
        let section = [...this.state.section];
        let array = [];

        section.map((o,i) => {
            array.push(
                <option key={i} value={o.id}>{o.year+" "+o.batch.toUpperCase()}</option>
            )
        });
        return array;
    }

    getCDS(){
        let cds = [...this.state.cds];
        let array = [];

        cds.map((o,i) => {
            array.push(
                <option key={i} value={o.id}>{o.titleShort.toUpperCase()}</option>
            )
        });
        return array;
    }

    handleSubmit(access = null){
        let members = [...this.state.member];
        members = members.filter(o => o.call_up_no.toUpperCase() === this.state.callup.toUpperCase()
            || o.statecode.toUpperCase() === this.state.statecode.toUpperCase());
        if(members.length > 0){
            this.setState({toastType:"error",toastStatus: false});
            setTimeout(() => {
                this.setState({toastContent: "A corps member exist with either the statecode or call up number!",
                    loading: false,toastStatus: true});
            }, 500);
            return;
        }
        let contents = {
            section: this.state.session,cds_group: this.state.cds_group, cover: this.state.passport, surname: this.state.surname,
            othernames: this.state.othername,statecode: this.state.statecode,sex: this.state.sex,call_up_no: this.state.callup,
            marital_status: this.state.marital,state: this.state.state,lga: this.state.lga,
            parent_name: this.state.parentname,address: this.state.address,parent_home_address: this.state.parentAddress,
            medical: this.state.medical,name_next_kin: this.state.nextofkin,tel_next_kin: this.state.nextofkinTel,address_next_kin: this.state.nextofkinContact,
            date_registered_lga: this.state.datelga,self_tel: this.state.contactTel,higher_institution: this.state.highInstitution,course_study: this.state.courseOfStudy,
            qualification: this.state.qualification,class_of_degree: this.state.classOfCert,name_ppa: this.state.ppaName,
            address_ppa: this.state.ppaAddress,cm_signature: this.state.cmSig, cm_signature_date: this.state.cmSigDate,
            field_office_signature_date: this.state.officerSigDate,for_office_only: this.state.forOffice
        };
        this.state.officerSig !== null ? contents.field_office_signature = this.state.officerSig: null;
        let payload = new FormData();
        Object.entries(contents).forEach(
            ([key, value]) => {
                payload.append(key, value)
            }
        );
        let url = this.props.backEndLinks.member;
        let accessToken = access;
        access === null ? accessToken = JSON.parse(localStorage.getItem(SiteData.name+"-user",)).access: null;
        this.props.authorizeWithData("post", url, payload, accessToken).then(
            (res) =>{
                this.setState({toastType:"success",toastStatus: false});
                setTimeout(() => {
                    this.setState({toastContent: "Corps member added successfully",
                        loading: false,toastStatus: true});
                    this.setState(
                        {
                            passport: null,surname: '', othername: '',statecode: '',callup: '',
                            state:'',lga: '', parentname: '',address: '',parentAddress: '',
                            nextofkin: '',nextofkinTel: '',nextofkinContact: '',
                            datelga: '', contactTel: '',highInstitution: '',courseOfStudy: '',
                            qualification: '',classOfCert: '',ppaName: '',
                            ppaAddress: '',cmSig: null,cmSigDate: '',
                            officerSig: null,officerSigDate: '',forOffice: ''
                        }
                    )
                }, 500);
                this.props.member.push(res.data);
                this.props.setContent('SET_MEMBER_CONTENT', this.props.member);
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
                        <h3>Add New Corps Member</h3>
                        <form className={'member-form'}>
                            <div className={'inline-input'}>
                                <div className={'form-group'}>
                                    <label htmlFor="">Section</label>
                                    <select value={this.state.session} onChange={(e) => this.setState({session:e.target.value})}>
                                        {
                                            this.state.section === null ? <option>Loading</option> :
                                                this.state.section.length < 1 ? <option>No section found</option>:
                                                    this.getSection()
                                        }
                                    </select>
                                </div>
                                <div className={'form-group'}>
                                    <label htmlFor="">Cds</label>
                                    <select value={this.state.cds_group} onChange={(e) => this.setState({cds_group:e.target.value})}>
                                        {
                                            this.state.cds === null ? <option>Loading</option> :
                                                this.state.cds.length < 1 ? <option>No Cds found</option>:
                                                    this.getCDS()
                                        }
                                    </select>
                                </div>
                            </div>
                            <div className={'inline-input'}>
                                <div className={'form-group'}>
                                    <label htmlFor="">Surname</label>
                                    <input value={this.state.surname} onChange={(e) => this.setState({surname:e.target.value})} type="text"/>
                                </div>
                                <div className={'form-group'}>
                                    <label htmlFor="">State Code</label>
                                    <input value={this.state.statecode} onChange={(e) => this.setState({statecode:e.target.value})} type="text"/>
                                </div>
                            </div>

                            <div className={'inline-input'}>
                                <div className={'form-group'}>
                                    <label htmlFor="">Other names</label>
                                    <input value={this.state.othername} onChange={(e) => this.setState({othername:e.target.value})} type="text"/>
                                </div>
                                <div className={'form-group'}>
                                    <label htmlFor="">Sex</label>
                                    <select value={this.state.sex} onChange={(e) => this.setState({sex:e.target.value})}>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                    </select>
                                </div>
                            </div>

                            <div className={'inline-input'}>

                                <div className={'form-group'}>
                                    <label htmlFor="">NYSC Call Up No.</label>
                                    <input value={this.state.callup} onChange={(e) => this.setState({callup:e.target.value})} type="text"/>
                                </div>
                                <div className={'form-group'}>
                                    <label htmlFor="">Marital Status</label>
                                    <select value={this.state.marital} onChange={(e) => this.setState({marital:e.target.value})}>
                                        <option value="single">Single</option>
                                        <option value="married">Married</option>
                                    </select>
                                </div>
                            </div>


                            <div className={'inline-input'}>
                                <div className={'form-group'}>
                                    <label htmlFor="">State of Origin</label>
                                    <input value={this.state.stateOrigin} onChange={(e) => this.setState({stateOrigin:e.target.value})} type="text"/>
                                </div>
                                <div className={'form-group'}>
                                    <label htmlFor="">Local Govenment Area</label>
                                    <input value={this.state.lga} onChange={(e) => this.setState({lga:e.target.value})} type="text"/>
                                </div>
                            </div>
                            <div className={'form-group'}>
                                <label htmlFor="">Parent's Name</label>
                                <input value={this.state.parentname} onChange={(e) => this.setState({parentname:e.target.value})} type="text"/>
                            </div>
                            <div className={'form-group'}>
                                <label htmlFor="">Address</label>
                                <textarea value={this.state.address} onChange={(e) => this.setState({address:e.target.value})}  rows="10"> </textarea>
                            </div>
                            <div className={'form-group'}>
                                <label htmlFor="">Parent Home Address</label>
                                <textarea value={this.state.parentAddress} onChange={(e) => this.setState({parentAddress:e.target.value})}  rows="10"> </textarea>
                            </div>
                            <div className={'form-group'}>
                                <label htmlFor="">Medical History</label>
                                <div className={'inline-inner'}>
                                   <div className={'inline-form-group'}>
                                       <label htmlFor="">Yes</label>
                                       <input onClick={() => this.setState({medical:1})} name={'medical'} type="radio"/>
                                   </div>
                                    <div className={'inline-form-group'}>
                                        <label htmlFor="">No</label>
                                        <input onClick={() => this.setState({medical:0})} name={'medical'} type="radio"/>
                                    </div>
                                </div>
                            </div>
                            <h4>IN CASE OF EMERGENCY</h4>
                            <div className={'form-inner'}>
                                <div className={'form-group'}>
                                    <label htmlFor="">Name of Next of Kin</label>
                                    <input value={this.state.nextofkin} onChange={(e) => this.setState({nextofkin:e.target.value})} type="text"/>
                                </div>
                                <div className={'form-group'}>
                                    <label htmlFor="">Contact Tel. No.</label>
                                    <input value={this.state.nextofkinTel} onChange={(e) => this.setState({nextofkinTel:e.target.value})} type="number"/>
                                </div>
                                <div className={'form-group'}>
                                    <label htmlFor="">Contact Address</label>
                                    <textarea value={this.state.nextofkinContact} onChange={(e) => this.setState({nextofkinContact:e.target.value})}  rows="10"> </textarea>
                                </div>
                            </div>
                            <div className={'form-group'}>
                                <label htmlFor="">Date Registered in Local Government</label>
                                <input value={this.state.datelga} onChange={(e) => this.setState({datelga:e.target.value})} type="date"/>
                            </div>
                            <div className={'form-group'}>
                                <label htmlFor="">Contact Tel. Phone No.(Self)</label>
                                <input value={this.state.contactTel} onChange={(e) => this.setState({contactTel:e.target.value})} type="number"/>
                            </div>
                            <div className={'form-group'}>
                                <label htmlFor="">Higher Institution Attended</label>
                                <input value={this.state.highInstitution} onChange={(e) => this.setState({highInstitution:e.target.value})} type="text"/>
                            </div>
                            <div className={'form-group'}>
                                <label htmlFor="">Course of Study</label>
                                <input value={this.state.courseOfStudy} onChange={(e) => this.setState({courseOfStudy:e.target.value})} type="text"/>
                            </div>
                            <div className={'form-group'}>
                                <label htmlFor="">Qualification</label>
                                <input value={this.state.qualification} onChange={(e) => this.setState({qualification:e.target.value})} type="text"/>
                            </div>
                            <div className={'form-group'}>
                                <label htmlFor="">Class of Degree/Diploma</label>
                                <input value={this.state.classOfCert} onChange={(e) => this.setState({classOfCert:e.target.value})} type="text"/>
                            </div>
                            <h4>PLACE OF ASSIGNMENT</h4>
                            <div className={'form-group'}>
                                <label htmlFor="">Name of PPA</label>
                                <input value={this.state.ppaName} onChange={(e) => this.setState({ppaName:e.target.value})} type="text"/>
                            </div>
                            <div className={'form-group'}>
                                <label htmlFor="">Address of PPA</label>
                                <textarea value={this.state.ppaAddress} onChange={(e) => this.setState({ppaAddress:e.target.value})}  rows="10"> </textarea>
                            </div>
                            <div className={'inline-input'}>
                                <div className={'form-group'}>
                                    <label htmlFor="">CM's Signature</label>
                                    <input onChange={(e) => this.setState({cmSig:e.target.files[0]})} type="file"/>
                                    <div className={'info'}>Cannot be more that 512kb...</div>
                                </div>
                                <div className={'form-group'}>
                                    <label htmlFor="">Date</label>
                                    <input value={this.state.cmSigDate} onChange={(e) => this.setState({cmSigDate:e.target.value})} type="date"/>
                                </div>
                            </div>
                            <div className={'inline-input'}>
                                <div className={'form-group'}>
                                    <label htmlFor="">Field Office's Signature</label>
                                    <input onChange={(e) => this.setState({officerSig:e.target.files[0]})} type="file"/>
                                    <div className={'info'}>Cannot be more that 512kb...</div>
                                </div>
                                <div className={'form-group'}>
                                    <label htmlFor="">Date</label>
                                    <input value={this.state.officerSigDate} onChange={(e) => this.setState({officerSigDate:e.target.value})} type="date"/>
                                </div>
                            </div>
                            <div className={'form-group'}>
                                <label htmlFor="">For(Office use only)</label>
                                <textarea value={this.state.forOffice} onChange={(e) => this.setState({forOffice:e.target.value})} rows="10"> </textarea>
                            </div>

                            <div className={'passport'} onClick={() => this.fileinput.click()}>
                                <input style={{'display':'none'}} type="file" onChange={(e) => this.setState({passport:e.target.files[0]})} ref={fileinput => this.fileinput = fileinput} />
                                {
                                    this.state.passport === null ? "Select Passport Photograph":
                                    <img src={URL.createObjectURL(this.state.passport)} alt=""/>
                                }
                                <div className={'info-pass'}>Cannot be more that 1mb...</div>
                            </div>
                        </form>
                        {
                            this.state.loading ? <button className={'disabled'} disabled={'true'}><ButtonLoader/></button> :
                                <button onClick={(e) => [e.preventDefault(), this.setState({loading: true}), this.handleSubmit()]}>Submit</button>
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