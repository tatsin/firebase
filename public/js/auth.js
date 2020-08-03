//get data from firestore
/* var citiesRef = db.collection("cities");

citiesRef.doc("SF").set({
    name: "San Francisco", state: "CA", country: "USA",
    capital: false, population: 860000,
    regions: ["west_coast", "norcal"] });
citiesRef.doc("LA").set({
    name: "Los Angeles", state: "CA", country: "USA",
    capital: false, population: 3900000,
    regions: ["west_coast", "socal"] });
citiesRef.doc("DC").set({
    name: "Washington, D.C.", state: null, country: "USA",
    capital: true, population: 680000,
    regions: ["east_coast"] });
citiesRef.doc("TOK").set({
    name: "Tokyo", state: null, country: "Japan",
    capital: true, population: 9000000,
    regions: ["kanto", "honshu"] });
citiesRef.doc("BJ").set({
    name: "Beijing", state: null, country: "China",
    capital: true, population: 21500000,
    regions: ["jingjinji", "hebei"] }); */

/* var docRef = db.collection("cities").doc("SF");

docRef.get().then(function(doc) {
    if (doc.exists) {
        console.log("Document data:", doc.data());
    } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
    }
}).catch(function(error) {
    console.log("Error getting document:", error);
});
 */



let userLogged = false;

const loggedInLinks  =  document.querySelectorAll('.logged-in'); 
const loggedOutLinks =  document.querySelectorAll('.logged-out'); 
const main =  document.querySelector('.main');
const welcomeUser = document.querySelector('#welcome-user')


const showHideLinkMenu = (user) => {
 
    if (user) {
        loggedInLinks.forEach( el =>  { el.classList.remove('hide') } );
        loggedOutLinks.forEach( item => { item.classList.add('hide') } );
        main.classList.remove('hide');
    } else {
        loggedInLinks.forEach( el =>  { el.classList.add('hide') } );
        loggedOutLinks.forEach( item => { item.classList.remove('hide') } );
        main.classList.add('hide');
    }
}







// test if user is logged or not 

auth.onAuthStateChanged((user)=> {
    
    if (user) {

        showHideLinkMenu(user);

        

       // showInfo(user.uid);


        db.collection('users').doc(user.uid).get().then(doc => {
        info=doc.data();
        console.log('data::',doc.data());
        welcomeUser.innerHTML=info.name;    
       // showInfo(data)

       const infoUser= document.querySelector('#infos-user');
          
           const html = `
                       <a href="#!" class="collection-item" id="infos-user-name">${info.name}</a>
                       <a href="#!" class="collection-item" id="infos-user-tel">${info.phone}</a>
                       <a href="#!" class="collection-item" id="infos-user-email">${info.email}</a>
                       <a href="#!" class="collection-item" id="infos-user-password">${info.password}</a>
           
           `;
           
           infoUser.innerHTML=html;
           M.toast({html: `Yo ${info.name} you're logged`});
       })

      


        showUpdatelistUser();
        console.log(user.uid )

    } else {
        
        

        console.log('you\'re not signed');

        showHideLinkMenu();

       // userLogged = false;
    }
    //return userLogged;
    //console.log('inside',userLogged)
  });

console.log('outside',userLogged)
//sign in

const formSignIn = document.querySelector('#form-sign-in');

formSignIn.addEventListener('submit', (e) => {
e.preventDefault();

const name     = formSignIn['name-id-sign-in'].value;
const phone    = formSignIn['phone-id-sign-in'].value;
const email    = formSignIn['email-id-sign-in'].value;
const password = formSignIn['password-id-sign-in'].value;

console.log(name,phone,email,password)

auth.createUserWithEmailAndPassword(email,password)
    .then(Credential => {

       // console.log(Credential.user);

        /* simple methode to add 
        users = db.collection("users");

        users.add({
            name: `${name}`,
            phone: `${phone}`,
            email: `${email}`,
            password: `${password}` 
        }); */

          /*  methode to add with taking avanage of user id for users collection , if not created ( users collection ) it will be created automatically */

       return  db.collection('users').doc(Credential.user.uid).set({
        name: `${name}`,
        phone: `${phone}`,
        email: `${email}`,
        password: `${password}`
       })

        
     

    })
    .then(()=>{

        showUpdatelistUser();
        formSignIn.reset();

        const modal = document.querySelector('#modal-sign-in');
        M.Modal.getInstance(modal).close();
       
    })
    .catch(function(error) {
        //let errorCode = error.code;
        let errorMessage = error.message;
        M.toast({html: `${errorMessage}`});

    }); 

});


//log in

const formLogIn = document.querySelector('#form-log-in');

formLogIn.addEventListener('submit', (e) => {

    e.preventDefault();

    const email    = formLogIn['email-id-log-in'].value;
    const password = formLogIn['password-id-log-in'].value;
    console.log(email,password)

    auth.signInWithEmailAndPassword(email,password)
    .then(cred => {
       // console.log(cred.user);
    
        formLogIn.reset();
        const modal = document.querySelector('#modal-log-in');
            M.Modal.getInstance(modal).close();
        
    })
    .catch(function(error) {
        //let errorCode = error.code;
        let errorMessage = error.message;
        M.toast({html: `${errorMessage}`});

    });

});



//log out

const logout=document.getElementById('logout');

logout.addEventListener('click', (e)=>{
    e.preventDefault();
    auth.signOut().then(() => {
        console.log('user logged out');
        M.toast({html:  'logged out'});
      }).catch(function(error) {
        let errorMessage = error.message;
        M.toast({html: `${errorMessage}`});
      });
      
})




// list users

function showUpdatelistUser(){
    const listUser=document.getElementById('list-users');
    //console.log('userNotLoggued true : ',userNotLoggued)

        let html='';
        db.collection("users").onSnapshot((snapshot) => {
            snapshot.forEach(function(doc) {
            // doc.data() is never undefined for query doc snapshots
            //   console.log(doc.id,'::', doc.data().name);
                
                const li =
                `
                <li>
                    <div class="collapsible-header"><i class="material-icons">filter_drama</i>${doc.data().name}</div>
                    <div class="collapsible-body">
                        <ul>
                    
                            <li>email:    ${doc.data().email}</li>
                            <li>phone :   ${doc.data().phone}</li>
                            <li>password: ${doc.data().password}</li>
        
                        </ul>
                    </div>
                </li>
                `
                html+=li;
                listUser.innerHTML=html;
            });
        });
   

}



// create content  when loggued

const formCreateArticle = document.querySelector('#form-create-article');

formCreateArticle.addEventListener('submit', (e) => {

                    e.preventDefault();
 
                    const title       = formCreateArticle.titleArticle.value;
                    const content     = formCreateArticle.contentArticle.value;


                    articles = db.collection("articles");

                    articles.add({
                        title: `${title}`,
                        contenu: `${content}`

                    })
                    .then( () => {
                        console.log(title,content);
                        //close modal and reset form
                        
                        const modal = document.querySelector('#modal-create-article');
                        M.Modal.getInstance(modal).close(); 
                        formCreateArticle.reset();
     
                    })
                    .catch((error)=> {
                        let errorMessage = error.message;
                        M.toast({html: `${errorMessage}`});
                      });

                    
                         

});



//get data from db and show list articles

const listArticles = document.querySelector('#list-articles');

//function loop list articles 

const showAricles = (data) =>{

    //check if there's data
    if( data.length ){

        let html='';

        data.forEach(item =>{
       
                //const title = item.data().title;
                //const content = item.data().contenu;
                const article = item.data()

                let li = `
                            <li>
                                <div class="collapsible-header"><i class="material-icons">collections_bookmark</i>${article.title}</div>
                                <div class="collapsible-body">
                                <p>
                                    ${article.contenu}
                                </p>
                                </div>
                            </li>
                        `
                html+=li;
        })
        listArticles.innerHTML=html;

    } else{

        listArticles.innerHTML='<p>there is no fuckin articles </p>';
    }

    

}

//get data for aticles in real time, event listener sur la db si ya changement

db.collection('articles').onSnapshot(snapshot => {
    //console.log('aticles',querySnapshot.docs[2]);

    showAricles(snapshot.docs)
    
}, error => {
        let errorMessage = error.message;
        M.toast({html: `${errorMessage}`});
})

//get data from db

/* db.collection('articles').get()
    .then(querySnapshot => {
        //console.log('aticles',querySnapshot.docs[2]);

        showAricles(querySnapshot.docs)
        
    })
    .catch((error)=> {
        let errorMessage = error.message;
        M.toast({html: `${errorMessage}`});
      }); */



// show infos user

// 1- get  modal

const modalInfosCompte = document.querySelector('#modal-infos-compte');

// 2- get db

// 2.1 function to get infos loop

const showInfo = (infos) => {

        const infoUser= document.querySelector('#infos-user');
    

        html=''

        infos.forEach( (item) =>{
            const info = item.data()
            console.log(info)

            const a = `
                        <a href="#!" class="collection-item" id="infos-user-name">${info.name}</a>
                        <a href="#!" class="collection-item" id="infos-user-tel">${info.phone}</a>
                        <a href="#!" class="collection-item" id="infos-user-email">${info.email}</a>
                        <a href="#!" class="collection-item" id="infos-user-password">${info.password}</a>
            
            `
            html+=a;
            
            
        })

        infoUser.innerHTML=html;
        

}
