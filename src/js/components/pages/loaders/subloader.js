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
            <div className={'subloader-wrapper'}>
                <div className={'loader'}>
                    <p>CONTENT</p>
                    <p>LOADING</p>
                </div>
            </div>
        )
    }
}

export default ButtonLoader