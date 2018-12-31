import React from 'react';
import {Link} from 'react-router-dom';
import $ from 'jquery'
import {Icon} from 'react-icons-kit'
import {basic_magnifier} from 'react-icons-kit/linea/basic_magnifier'
import {calendar} from 'react-icons-kit/iconic/calendar'
import NyscImage from '../../../../assets/image/nysc.png';
import {spinner6} from 'react-icons-kit/icomoon/spinner6'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

import {actionWithoutData, actionWithData, authorizeWithData, authorizeWithoutData, setContent} from '../../../redux/actions';
import {verifyauth, processError, resetToken} from '../common/miscellaneous'

import Navbar from '../common/navbar'
import Footer from '../common/footer'
import Subloader from '../loaders/subLoader'

const initialState = {
    member: null, cds: null, section: null, errorState: false, adminStatus: null, max: 6, current: 1, totalpages: 0,
    Loadmore: false
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

    getCDS(){
        let _cds = [...this.state.cds];
        let _members = [...this.state.member];
        this.state.totalpages= Math.ceil(_cds.length / this.state.max);
        let ListCount = this.state.current * this.state.max;
        _cds.length < ListCount ? ListCount = _cds.length : null;
        let array = [];
        for(let i = 0; i < ListCount; i++){
            let activeMember = _members.filter(o => o.section === _cds[i].id);
            array.push(
                <Link key={i} to={'/cds/'+_cds[i].titleShort}>
                    <div  className={'section-card'}>
                        <div className={'title'} style={{'fontSize':'40px'}}>{_cds[i].titleShort.toUpperCase()+" CDS"}</div>
                        <div className={'sub-title'}>
                            Available Corp Members <span>({activeMember.length})</span>
                        </div>
                    </div>
                </Link>
            )
        }
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
                <Navbar  history={this.props.history}/>
                <button className={'add-member'} data-toast="Add new cds group" onClick={() => this.props.history.push('/cds/new')}>+</button>
                <div className={'content'}>
                    <div className={'content-main'}>
                        <h3>Choose CDS Group</h3>
                        <div className={'section-list'}>
                            {
                                this.state.cds === null ? <Subloader/> :
                                    this.state.cds.length < 1 ? <h4>No CDS group is found!</h4> :
                                        this.getCDS()
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