import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {ConfigProvider} from '../../providers/config/config';
import { Http, Headers } from '@angular/http';
import {Storage} from '@ionic/storage';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  sunt_logat:boolean=false;

  constructor(public navCtrl: NavController,public config:ConfigProvider,public http: Http,public storage: Storage) {

  }
  ionViewWillEnter(){//am pus aici ca sa faca refresh cand vin aici de oriunde, practic sa refaca calculele mereu cand intru aici
    this.getStorageToken_asinc().then((result)=>{
        let token=result;
        if (token){
          this.sunt_logat=true; 
          this.config.token=token;
          this.config.gl_idclient=this.config.afla_idclient_dintoken(token );
        }else{
          this.sunt_logat=false;
        }
    });
  }

  getStorageToken_asinc(){
    return this.storage.get('token'); 
  }


  login(){
    




              let obj_credentiale = {
                email: "alex@cunoastere.ro",
                password: "parolamea",
                operatiune:"login"
              };

              this.config.promis_Login(obj_credentiale).then((result) => {
                  //this.loading.dismiss();
                  console.log(result);
                  this.sunt_logat=true;
                  //alert(result);

              }, (err) => {
                  //this.loading.dismiss();
                  console.log(err);
              });

  }

  afisare_token(){
    alert("token="+this.config.afla_token());
/*
            this.config.afla_token2().then((result) => {
           
                console.log(result);
                alert("token stocat in storage="+result);
            }, (err) => {
               
                console.log(err);
            });
*/
  }


  /*
  verifica_daca_sunt_logat(){
    //this.config.promise_Vezi_daca_sunt_logat();


              this.config.promise_Vezi_daca_sunt_logat().then((res) => {
                console.log("Already authorized");
                //this.loading.dismiss();
                //this.navCtrl.setRoot(HomePage);
                alert("sunt logat si autirizat");
            }, (err) => {
                console.log("Not already authorized");
                //this.loading.dismiss();
                alert("NU NU NU sunt logat ");
            });
  }
*/
  logout(){
    this.sunt_logat=false;
    this.storage.remove("token");
    this.config.token=null;
  }

  suma(){


    let obj_numere = {
      nr1: 100,
      nr2: 300,
      operatiune:"suma",
      //token:this.config.afla_token()
    };  

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('token-access', this.config.afla_token());
    headers.append('idclient', this.config.get_IDCLIENT().toString());
    

    this.http.post('https://www.net-vision.ro/webservicejwt/2.php', JSON.stringify(obj_numere), {headers: headers})
      .subscribe(res => {

        let data = res.json();
        let err_token=data.err_token;
        if (err_token==""){//daca nu am vreo eroare de acces pe server
            
            //daca primesc noul accessToken derivat din cel vechi expirat, atunci il stochez pe cel nou...merge si fara asincron la set..oricum urmatoarea executie nu va fi imediat
            let NEW_ACCESS_TOKEN=data.NEW_ACCESS_TOKEN;
            if (NEW_ACCESS_TOKEN!=""){
              this.config.token = NEW_ACCESS_TOKEN;
              this.storage.set('token', NEW_ACCESS_TOKEN);
              console.log("noul acces token="+NEW_ACCESS_TOKEN);
            }
            
            let err_functie=data.err_functie;
            if (err_functie==""){//daca nu am vreo eroare normala de functionare a functiei de pe server 
                
                  //aici scriu codul daca totul e ok;
                  alert("suma:"+data.suma);



            }else{//daca am eroare de functionare a functiei de pe server
                alert("Eroare normala functie pe server: "+err_functie);     
            }
        }else{//am eroare de acces pe server
              //alert("Eroare de acces pe server: "+err_token);
              /*
              if (err_token="expired token"){
                  //1. cer un nou accestoken: trimit (refresh_token)
                  {
                    //dupa ce primesc noul acces token , il stochez...si reapelez functia suma.....naspa
                    alert("ar trebui sa primesc un nou accesToken, dupa ce trimit pt verifucare refreshTokenul");

                  }
                
              }else{//orice alta eroare de token, inseamna ca e ceva cu structura tokenului
                  //il arunc delogandu l pe index
                  alert("E grav...token e corupt. trebuie sa te deloghez si so iei de la capa");
              }
              */
              alert("E grav...token e corupt. trebuie sa te deloghez si so iei de la capa");
              
        }
      }, (err) => {
        
      });

  }

}
