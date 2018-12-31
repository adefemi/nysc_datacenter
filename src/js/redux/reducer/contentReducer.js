export function setMemberContent(state = null, action) {
    switch(action.type){
        case "SET_MEMBER_CONTENT":
            return action.payload;
            break;
    }
    return state
}

export function setSectionContent(state = [], action) {
    switch(action.type){
        case "SET_SECTION_CONTENT":
            return action.payload;
            break;
    }
    return state
}

export function setCdsContent(state = [], action) {
    switch(action.type){
        case "SET_CDS_CONTENT":
            return action.payload;
            break;
    }
    return state
}


export function setAdminActive(state = null, action) {
    switch(action.type){
        case "SET_ADMIN_ACTIVE":
            return action.payload;
            break;
    }
    return state
}
