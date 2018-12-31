import React from 'react';
import PropTypes from 'prop-types';
import {Icon} from 'react-icons-kit'
import {ic_close} from 'react-icons-kit/md/ic_close'
import $ from 'jquery'

class Toast extends React.Component{
    render(){
        let ToastCon = $('.toast');
        if(this.props.toastStatus){
            ToastCon.hasClass('close') ? ToastCon.removeClass('close') : null;
        }
        else{
            !ToastCon.hasClass('close') ? ToastCon.addClass('close') : null;
        }
        return(
            <div className={"toast close "+this.props.type}>
                <div dangerouslySetInnerHTML={{__html: this.props.content}} />

                <button className={'toast-close'} onClick={() => this.props.closeToast()}>
                    <Icon icon={ic_close}/>
                </button>
            </div>
        )
    }
}

Toast.defaultProps = {
    type : "error",
    content: "An error ocurred!",
    toastStatus: false,
};

Toast.propTypes = {
    type : PropTypes.string,
    content: PropTypes.string,
    toastStatus: PropTypes.bool,
    closeToast: PropTypes.func.isRequired,
};

export default Toast;