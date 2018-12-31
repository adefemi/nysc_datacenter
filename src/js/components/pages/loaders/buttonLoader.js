import React from 'react';
import {Link} from 'react-router-dom';
import $ from 'jquery'
import {Icon} from 'react-icons-kit'

import NyscImage from '../../../../assets/image/nysc.png';


class ButtonLoader extends React.Component{
    constructor(props) {
        super(props);
    }

    render(){
        return(
            <div className={'button-wrapper'}>
                <div></div>
                <div></div>
                <div></div>
            </div>
        )
    }
}

export default ButtonLoader