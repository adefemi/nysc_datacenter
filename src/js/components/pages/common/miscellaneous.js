import React from 'react';
import axios from 'axios';
axios.defaults.timeout = 60000;
import Jwt_decode from 'jwt-decode'
import {SiteData} from '../data/siteMain';

export function FormatMoney(amount){
    return parseFloat(amount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&, ');
}

export function processError(err, refresh){
    if(err.message === "Network Error"){
       return {type: 1, content:"Network Error"};
    }
    else {
        if(err.code === 'ECONNABORTED'){
            return {type: 2, content:"Connection timeout"};
        }
        else if(err.response.statusText === "Unauthorized"){
            let newaccess = resetToken(refresh);
            return {type: 3, content:newaccess};
        }
        else{
            let errorcontent = '';
            Object.entries(err.response.data).forEach(
                ([key, value]) => {
                    errorcontent+=key+" * "+value+"<br>"
                }
            );

            return {type: 4, content:errorcontent};
        }
    }
}

export function resetToken(url) {
    let refreshUrl = url;
    let Token = JSON.parse(localStorage.getItem(SiteData.name+"-user"));
    let payload = new FormData();
    payload.append("refresh",Token.refresh);

    axios({
        method: "post",
        url: refreshUrl,
        data: payload
    }).then(
        (res) => {
            Token.access = res.data.access;
            localStorage.setItem(SiteData.name+"-user", JSON.stringify(Token));
            return res.data.access;
        },
        (err) => console.log(err.response)
    );

}

export function verifyauth() {
    let auth = localStorage.getItem(SiteData.name+"-user");

    if(auth !== null){
        let data = JSON.parse(auth);
        let exp = Jwt_decode(data.refresh).exp;
        let currentTime = Math.floor(Date.now() / 1000);
        if(currentTime > exp){
            localStorage.removeItem(SiteData.name+"-user");
            return false
        }
        else{
            return true
        }

    }
    else{
        return false
    }
}

