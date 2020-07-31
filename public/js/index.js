
document.addEventListener('DOMContentLoaded', function() {
    //init all
     //M.AutoInit();

    //init nav mobile
    let sidenav = document.querySelectorAll('.sidenav');
    M.Sidenav.init(sidenav);

    //init all modals
    let modals = document.querySelectorAll('.modal');
    M.Modal.init(modals);

    //init accordion
    let collapsible = document.querySelectorAll('.collapsible');
    M.Collapsible.init(collapsible);

     //init counter for textarea
     let textearea = document.querySelectorAll('.materialize-textarea');
     M.CharacterCounter.init(textearea)
    
    //fire toast
    M.toast({html: 'alright !'})
  });
