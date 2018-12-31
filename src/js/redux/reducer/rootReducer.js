import React from 'react'
import {combineReducers} from 'redux'

//import reducers
import {backEndLinks} from './extras';
import {setAdminActive, setMemberContent, setCdsContent, setSectionContent} from './contentReducer';


const ReducerAll = combineReducers({
    backEndLinks : backEndLinks,
    adminStatus : setAdminActive,
    memberContent : setMemberContent,
    cdsContent : setCdsContent,
    sectionContent : setSectionContent,
});

export default ReducerAll