const http = require("http");
const https = require("https");

class Client {
    constructor(params){
        this._validateParameters(params);
        this.ready = false;
    }

    _validateParameters(params){
        if(!params.token || typeof params.token !== "string") throw new Error('INVALID_TOKEN');
        this.token = params.token;
        //TODO: Check token with regex.
        if(!params.baseURL || typeof params.baseURL !== "string") throw new Error('INVALID_BASEURL');
        this.baseURL = params.baseURL;
        //TODO: Check url with regex.
    }

    isReady(){
        return this.ready;
    }

    async login(){
        return new Promise((resolve,reject)=>{
            if(this.requestOptions === undefined) this.setOptions(`${this.baseURL}?query={site{config{title}}}`); //Get the title of wiki.js site as a test that token and url are valid.
            const httpModule = this.requestOptions.port === 443 ? https : http; //This is used to account for both http and https.
            const request = httpModule.get(this.requestOptions, res=>{
                if(res.statusCode > 300 && res.statusCode < 400){
                    if(res.headers.location){ //If the request results in a redirect, execute again.
                        this.setOptions(res.headers.location);
                        return this.login();
                    } else {
                        reject(new Error("INVALID_BASEURL"));
                    }
                }
                let data = "";
                res.on("data", chunk=>{
                    data += chunk;
                });
                res.on("end",()=>{
                    data = JSON.parse(data);
                    if(data.errors){
                        data.errors.forEach(err =>{
                            reject(new Error(err.message));
                        });
                    }
                    const title = data.data.site.config.title;
                    if(!title) reject(new Error("INVALID_RESPONSE"));
                    this.ready = true;
                    console.log(`Success! ${title}`);//Remove after resolving works.
                    resolve(title); //Return the title to verify "connection".
                });
            });
            request.end();
            setTimeout(()=>{ //Time out the request in case it hangs.
                reject(new Error("TIMEOUT_EXCEEDED"));
            },20000);
        });
    }

    async setOptions(url = this.baseURL){
        url = url.split("://");
        const port = url.shift() === "https" ? 443 : 80;
        url = url.join("").split("/");
        const host = url[0];
        const path = `/${url[1]}`;
        this.requestOptions = {
            host,
            port,
            path,
            method: "GET",
            headers: {
                "Authorization": `Bearer ${this.token}`,
                "Content-Type": "application/json"
            }
        };
    }
}

module.exports = Client;