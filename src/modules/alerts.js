

function setCookie(cname, cvalue, exdays) {
  
//    console.log("setCookie", cname, cvalue, exdays);
  
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}


function getCookie(cname) {
    
//    console.log("getCookie", cname);

    const name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
        
//            console.log("returned cookie value", c.substring(name.length, c.length));

            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function deleteCookie(name, path = "/") {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path};`;
}

function getKeyName(name) {
    return `wfu-modal_${name}`; 
}

function isSuppressed(name) {
//    console.log("checking suppression", name, getKeyName(name));
    
    const suppressed = getCookie(
        getKeyName(name)
    );
    //  const suppressed = sessionStorage.getItem(
    //      getKeyName(name)  
    //      ); 
//    console.log("is suppressed?", suppressed);
    return suppressed;
}

function suppress(name, val, duration) {
//    console.log("suppressing", name, val);
    
    setCookie(
        getKeyName(name), 
        val, 
        duration // days 
    );
  
//  sessionStorage.setItem(
//    getKeyName(name), val);
  
}

function unSuppress(name) {
//    console.log("unsuppressing", name);
    
    deleteCookie(getKeyName(name)); 
//    sessionStorage.removeItem(getKeyName(name));
}

$(function() {

    $("[wfu-modal-close]").click(function() {
        
        // Get modal
        const $modalClose = $(this);
        const $modal = $(this).closest("[wfu-modal]");
        const modalName = $modal.attr("wfu-modal") || "default";
        const modalCloseVal = $modalClose.attr("wfu-modal-close") || "true";
        const modalCloseType = $modal.attr("wfu-modal-close-type") || "auto";
        const modalSuppressDuration = $modal.attr("wfu-modal-suppress-days") || 9999;
        
  //      console.log("modalName", modalName);
        
        // Set suppression 
        suppress(
            modalName, 
            modalCloseVal, 
            modalSuppressDuration // days
            );
        
        // Close dialog
        // TODO: handle interaction closes, do nothing 
        switch(modalCloseType) {
        case "interaction":
            // do nothing
            break;
        case "auto":
        default:
            // remove now 
            $modal.remove(); 
            break;
        }
        
    }); 
    
    $("[wfu-modal-trigger='load']").each(function() {
        
        const $modal = $(this); // .closest("[wfu-modal]");
        const modalName = $modal.attr("wfu-modal") || "default";

//        console.log("modalName", modalName);

        // Check suppression 
        if(isSuppressed(modalName)) {
//            console.log("suppressed.");
            $modal.remove(); 
            return;
        }
        
        // un-hode
        $(this).removeAttr("wfu-modal-trigger"); 
    }); 
  
});

$("#admin_reset-modals").click(function() {
  
    unSuppress("mobile-about"); 
//  window.location.reload(); 
  
}); 

