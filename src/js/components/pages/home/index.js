import React from 'react';
import {Link} from 'react-router-dom';
import $ from 'jquery'
import {Icon} from 'react-icons-kit'
import {basic_magnifier} from 'react-icons-kit/linea/basic_magnifier'
import {calendar} from 'react-icons-kit/iconic/calendar'
import {spinner6} from 'react-icons-kit/icomoon/spinner6'
import {ic_close} from 'react-icons-kit/md/ic_close'
import NyscImage from '../../../../assets/image/nysc.png';
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

import {actionWithoutData, actionWithData, authorizeWithData, authorizeWithoutData, setContent} from '../../../redux/actions';
import {verifyauth, processError, resetToken} from '../common/miscellaneous'

import Navbar from '../common/navbar'
import Footer from '../common/footer'
import Subloader from '../loaders/subLoader'

const initialState = {
    member: null, cds: null, section: null, errorState: false, adminStatus: null, max: 6, current: 1, totalpages: 0,
    Loadmore: false, year: "all", search: ""
};

class Home extends React.Component{
    constructor(props) {
        super(props);

        this.state = initialState;
    }

    componentWillMount(){
        if(!verifyauth()) this.props.history.push('/');
        this.componentWillReceiveProps(this.props);
    }

    getYear(){
        let _section = [...this.state.section];
        let array = [];
        array.push(<li key={0} onClick={() => this.setState({year: "all"})}>all</li>);
        for(let i = 0; i < _section.length; i++){
            array.push(
                <li key={i+1} onClick={() => this.setState({year: _section[i].year})}>{_section[i].year}</li>
            )
        }
        return array;
    }

    getSections(){
        let _section = [...this.state.section];
        this.state.year !== "all" ? _section = _section.filter(o => o.year === this.state.year) : null;
        let _members = [...this.state.member];
        this.state.totalpages= Math.ceil(_section.length / this.state.max);
        let ListCount = this.state.current * this.state.max;
        _section.length < ListCount ? ListCount = _section.length : null;
        let array = [];
        for(let i = 0; i < ListCount; i++){
            let activeMember = _members.filter(o => o.section === _section[i].id);
            array.push(
                <Link key={i} to={'/section/'+_section[i].year+"-"+_section[i].batch}>
                    <div  className={_section[i].active ? 'section-card active': 'section-card'}>
                        <div className={'title'}>{_section[i].year+"-"+_section[i].batch.toUpperCase()}</div>
                        <div className={'sub-title'}>
                            Available Corp Members <span>({activeMember.length})</span>
                        </div>
                    </div>
                </Link>
            )
        }
        return array;
    }

    getSearchContent(){
        let _members = [...this.state.member];
        let search = this.state.search;
        _members = _members.filter( o => (o.surname.toLowerCase()+" "+o.othernames.toLowerCase()).match(search.toLowerCase()) ||
            o.call_up_no.toUpperCase().match(search.toUpperCase()) ||
            o.statecode.toUpperCase().match(search.toUpperCase()) );
        let array = [];
        _members.map((o,i) => {
            array.push(
                <ul key={i} onClick={() => this.props.history.push('/member/'+o.call_up_no.toUpperCase().replace(/\//g,'-'))}>
                    <li style={{'textTransform':'capitalize'}}>{o.surname+" "+o.othernames}</li>
                    <li>{o.call_up_no.toUpperCase()}</li>
                    <li>{o.statecode.toUpperCase()}</li>
                </ul>
            )
        });
        return array;
    }

    loadmore(){
        this.setState({Loadmore:true});
        setTimeout(() => {
            this.setState({current:this.state.current + this.state.max, Loadmore: false});
        }, 500);
    }

    componentWillReceiveProps(props){
        if(props.adminStatus !== this.state.adminStatus){
            this.setState({adminStatus: props.adminStatus});
            if(!props.adminStatus){
                this.props.history.push('/')
            }
        }

        if(props.member !== this.state.member){
            this.setState({member: props.member});
            this.state.member = props.member
        }
        if(props.cds !== this.state.cds){
            this.setState({cds: props.cds});
            this.state.cds = props.cds
        }
        if(props.section !== this.state.section){
            this.setState({section: props.section});
            this.state.section = props.section
            console.log(props.section)
        }
    }

    render(){
        return(
            <div className={'wrapper'}>
                <div className={'bg-nysc'}> </div>
                <Navbar history={this.props.history}/>
                <button className={'add-member'} data-toast="Add new section" onClick={() => this.props.history.push('/section/new')}>+</button>
                <div className={'content'}>
                    <div className={'search'}>
                        <button className={'calender'}><Icon icon={calendar}/>
                            <div className={'dropdown'}>
                                {
                                    this.state.section === null ? <li>Loading</li> :
                                        this.state.section.length < 1 ? <li>Not found</li>:
                                            this.getYear()
                                }
                            </div>
                        </button>
                        <input type="text" value={this.state.search} onChange={(e) => this.setState({search: e.target.value})} placeholder={"Search corp member's name, state code number..."}/>
                        {
                            this.state.search === "" ? null :
                                <div className={'search_list'}>
                                    <Icon className={'close'} onClick={() => this.setState({search: ""})} icon={ic_close}/>
                                    {
                                        this.getSearchContent().length < 1 ? <h4>No corps member match the search parameter!</h4> :
                                            this.getSearchContent()
                                    }
                                </div>
                        }
                        <button type={'button'}><Icon icon={basic_magnifier}/></button>
                    </div>

                    <div className={'content-main'}>
                        <h3>Choose Section {
                        this.state.year !== "all" ? <span className={'section-search'}>(Showing all sections of year {this.state.year})</span> : null
                        }</h3>
                        <div className={'section-list'}>
                            {
                                this.state.section === null ? <Subloader/> :
                                    this.state.section.length < 1 ? <h4>No section is added yet!</h4> :
                                        this.getSections()
                            }
                        </div>

                        {
                            this.state.current >= this.state.totalpages ? null :
                                this.state.Loadmore ? <button><Icon className={'rotate'} icon={spinner6}/></button> :
                                    <button onClick={() => this.loadmore()}>Load More</button>
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
