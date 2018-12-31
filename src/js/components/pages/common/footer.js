import React from 'react';
import {Link} from 'react-router-dom';
import $ from 'jquery'
import {Icon} from 'react-icons-kit'
import {basic_magnifier} from 'react-icons-kit/linea/basic_magnifier'
import NyscImage from '../../../../assets/image/nysc.png';


class Footer extends React.Component{
    constructor(props) {
        super(props);
    }

    render(){
        return(
            <div className={'footer noprint'}>
                <p>NYSC ICT-CDS OWO &copy; 2018</p>
            </div>
        )
    }
}

export default Footer