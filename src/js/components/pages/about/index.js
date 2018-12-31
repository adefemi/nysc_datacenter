import React from 'react';
import {Link} from 'react-router-dom';
import $ from 'jquery'
import {Icon} from 'react-icons-kit'

import Image1 from '../../../../assets/image/img1.jpg'
import Image2 from '../../../../assets/image/img2.jpg'
import Image3 from '../../../../assets/image/img3.jpg'
import Image4 from '../../../../assets/image/img4.jpg'

import Navbar from '../common/navbar'
import Footer from '../common/footer'

class About extends React.Component{


    render(){
        return(
            <div className={'wrapper'}>
                <div className={'bg-nysc'}> </div>
                <Navbar history={this.props.history}/>
                <div className={'content'}>
                    <div className={'content-main'}>
                        <h3>About System</h3>
                        <p className={'about-main'}>The Local Data Center is a project developed by the 2017 Batch B Stream 1 and 2 Corps members in Owo Local Government
                         under the Leadership of the <span>INFORMATION AND COMMUNICATION TECHNOLOGY-COMMUNITY DEVELOPMENT SERVICE GROUP.</span>
                        </p><br/>

                        <h3>ICT-CDS Executives</h3>
                        <div className={'about-content'}>
                            <ul>
                                <li>Daskyakar Clement </li>
                                <li>President</li>
                            </ul>
                            <ul>
                                <li>Adeniji Oluwagbemiga Daniel</li>
                                <li>Secretary</li>
                            </ul>
                        </div>
                        <br/>

                        <h3>Project Working Committee</h3>
                        <div className={'about-content'}>
                            <ul>
                                <li>Oseni Adefemi Jelili</li>
                                <li>Lead Developer</li>
                            </ul>
                            <ul>
                                <li>Adeniji Oluwagbemiga Daniel</li>
                                <li>Support</li>
                            </ul>
                        </div><br/>
                        <h3>Group Gallery</h3>
                        <div className={'gallery'}>
                            <a href={Image1} target={'_blank'}><img src={Image1} alt=""/></a>
                            <a href={Image2} target={'_blank'}><img src={Image2} alt=""/></a>
                            <a href={Image3} target={'_blank'}><img src={Image3} alt=""/></a>
                            <a href={Image4} target={'_blank'}><img src={Image4} alt=""/></a>
                        </div>
                    </div>
                </div>
                <Footer/>
            </div>
        )
    }
}

export default About;
