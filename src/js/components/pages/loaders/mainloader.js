import React from 'react';
import {Link} from 'react-router-dom';
import $ from 'jquery'
import {Icon} from 'react-icons-kit'

import NyscImage from '../../../../assets/image/nysc.png';


class Mainloader extends React.Component{
    constructor(props) {
        super(props);
    }

    render(){
        return(
            <div className={'loader-wrapper'}>
                <div className={'loader-content'}>
                    <img src={NyscImage} alt=""/>
                </div>
                <div className={'shadow'}> </div>
                <div className={'loading-test'}>
                    Loading
                </div>
            </div>
        )
    }
}

export default Mainloader