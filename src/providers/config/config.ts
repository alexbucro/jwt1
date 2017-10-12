import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import {Storage} from '@ionic/storage';
import 'rxjs/add/operator/map';


@Injectable()
export class ConfigProvider {
  public token:string;
  public gl_idclient:number;
  public gl_numeclient:any;
  public gl_suntlogat:boolean;
  public gl_iddrept:boolean;
  public gl_cont_activ:boolean; 

  constructor(public http: Http,public storage: Storage) {
    //constructor(public storage: Storage) {
      
    console.log('Hello ConfigProvider Provider');
  }

  
get_IDCLIENT(){
  return this.gl_idclient;
}

  promise_Vezi_daca_sunt_logat(){
          return new Promise((resolve,reject)=>{
            this.storage.get('token').then((value)=>{
                        this.token=value;
                        let headers=new Headers();
                        headers.append('Authorization',this.token);

                        this.http.get('https://www.net-vision.ro/webservicejwt/2.php', {headers: headers})
                        .subscribe(res => {
                            resolve(res);
                        }, (err) => {
                            reject(err);
                        });
         
                    }

            );     
          }
    );
  }

  promis_Login(credentials){
    return new Promise((resolve, reject) => {
      
             let headers = new Headers();
             headers.append('Content-Type', 'application/json');
      
             this.http.post('https://www.net-vision.ro/webservicejwt/2.php', JSON.stringify(credentials), {headers: headers})
               .subscribe(res => {
      
                 let data = res.json();
                 this.token = data.token;
                 this.storage.set('token', data.token);
                 this.gl_idclient=this.afla_idclient_dintoken(this.token );

                 alert("token primit:"+this.token);

                 resolve(data);
      
                 //resolve(res.json());
                 
               }, (err) => {
                 reject(err);
               });
      
         });
  }

  afla_idclient_dintoken(token:string){
    let v_sir=token.split(".");
    let payload=JSON.parse(atob(v_sir[1]));
    
    //alert(JSON.parse(payload));
    console.log("ID CLIENT:"+payload.idclient);
    
    return payload.idclient;
  }

  afla_token2(){
              //this.storage.get('token').then( (result)=>{
                
              //});
            
            // return this.token;

            return new Promise ((resolve, reject) => {
                    this.storage.get('token').then( (result)=>{
                        resolve(result);      
                    }, (err)=>{
                        reject(err);
                    }
                  );
            });
  }

  afla_token(){
    return this.token;
  }

}
