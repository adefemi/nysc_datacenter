import React from 'react';
import {Link} from 'react-router-dom';
import $ from 'jquery'
import {Icon} from 'react-icons-kit'
import {plus} from 'react-icons-kit/icomoon/plus'
import {basic_magnifier} from 'react-icons-kit/linea/basic_magnifier'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {ic_close} from 'react-icons-kit/md/ic_close'

import {actionWithoutData, actionWithData, authorizeWithData, authorizeWithoutData, setContent} from '../../../redux/actions';
import {verifyauth, processError, resetToken} from '../common/miscellaneous'

import Navbar from '../common/navbar'
import Footer from '../common/footer'
import Subloader from '../loaders/subLoader'

const initialState = {
    cds: null, activeCDS: null, section: null, member: null, max: 6, current: 1, totalpages: 0, Loadmore: false,
    toastType: "error", toastContent: "", toastStatus: false, search: ""
};


class Home extends React.Component{
    constructor(props) {
        super(props);

        this.state = initialState
    }

    getActiveCDS(){
        let _cds = [...this.state.cds];
        let slug = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);
        let activeCDS = _cds.filter(o => o.titleShort === slug);
        this.state.activeCDS = activeCDS;
        this.setState({activeCDS:activeCDS});
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
            this.setState({section: props.section});
            this.state.section = props.section
        }
        if(props.cds !== this.state.cds){
            this.setState({cds: props.cds});
            this.state.cds = props.cds;
            this.getActiveCDS();
        }
        else{
            this.getActiveCDS();
        }
    }

    getMemberList(){
        let members = [...this.state.member];
        let section = [...this.state.section];
        members = members.filter(o => o.cds_group === this.state.activeCDS[0].id);
        let array = [];
        this.state.totalpages= Math.ceil(members.length / this.state.max);
        let ListCount = this.state.current * this.state.max;
        members.length < ListCount ? ListCount = members.length : null;
        for(let i = 0; i<ListCount; i++){
            let ActiveSection = section.filter(o => o.id === members[i].section);
            array.push(
                <ul key={i} onClick={() => this.props.history.push('/member/'+members[i].call_up_no.toUpperCase().replace(/\//g,'-'))}>
                    <li>{i+1}</li>
                    <li>{members[i].surname+" "+members[i].othernames}</li>
                    <li>{members[i].call_up_no}</li>
                    <li>{members[i].statecode}</li>
                    <li>{ActiveSection[0].year+" "+ActiveSection[0].batch.toUpperCase()}</li>
                </ul>
            )
        }
        return array;
    }

    getSearchContent(){
        let _members = [...this.state.member];
        _members = _members.filter(o => o.cds_group === this.state.activeCDS[0].id);
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

    render(){
        return(
            <div className={'wrapper'}>
                <div className={'bg-nysc'}> </div>
                <Navbar history={this.props.history}/>
                <div className={'content'}>
                    {
                        this.state.cds === null ? <Subloader/> :
                            this.state.activeCDS === null ? <h4>The CDS you're looking for do not exist.</h4>:
                                <div>
                                    <div className={'search'}>
                                        <input value={this.state.search} onChange={(e) => this.setState({search: e.target.value})} type="text" placeholder={"Search corp member's name, state code number..."}/>
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
                                        <button><Icon icon={basic_magnifier}/></button>
                                    </div>
                                    <button className={'add-member'} data-toast={'Add new corps member'} onClick={() => this.props.history.push('/member/new')}>+</button>
                                    <div className={'content-main'}>
                                        <h3>{this.state.activeCDS[0].titleShort.toUpperCase()+" CDS"} Corp Members</h3>
                                        {
                                            this.state.member === null ? <Subloader/> :
                                                this.getMemberList().length < 1 ? <h4>No corps member is available for this CDS group!</h4>:
                                                    <div className={'list-table'}>
                                                        <div className={'header'}>
                                                            <li>S/N</li>
                                                            <li>Full Name</li>
                                                            <li>Call Up Number</li>
                                                            <li>State Code Number</li>
                                                            <li>Service Year</li>
                                                        </div>
                                                        <div className={'content-child'}>
                                                            {this.getMemberList()}
                                                        </div>
                                                    </div>
                                        }

                                        {
                                            this.state.current >= this.state.totalpages ? null :
                                                this.state.Loadmore ? <button><Icon className={'rotate'} icon={spinner6}/></button> :
                                                    <button onClick={() => this.loadmore()}>Load More</button>
                                        }

                                    </div>
                                </div>
                    }

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
