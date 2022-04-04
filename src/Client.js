const pageManager = require("./PageManager");

class Client {
    constructor(params){
        this._validateParameters(params);
        this.ready = false;
    }

    _validateParameters(params){
        if(!params.token || typeof params.token !== "string") throw new Error('INVALID_TOKEN');
        this.token = params.token;
        if(!params.baseURL || typeof params.baseURL !== "string") throw new Error('INVALID_BASEURL');
        if(!params.baseURL.match(/^(http:\/\/|https:\/\/)/ig)) throw new Error('INVALID_BASEURL_PROTOCOL');
        this.baseURL = params.baseURL;
    }

    isReady(){
        return this.ready;
    }

    login(){
        return new Promise((resolve,reject)=>{
            if(this.requestOptions === undefined) this.requestOptions = this.getOptions("?query={site{config{title}}}"); //Get the title of wiki.js site as a test that token and url are valid.
            const request = this.httpModule.get(this.requestOptions, res=>{
                if(res.statusCode > 300 && res.statusCode < 400){
                    if(res.headers.location){ //If the request results in a redirect, execute again.
                        this.baseURL = res.headers.location;
                        this.requestOptions = this.getOptions();
                        return resolve(this.login());
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
                    if(data.errors?.length > 0){
                        reject(new Error(data.errors[0].message));
                    }
                    const title = data.data?.site?.config?.title;
                    if(!title) reject(new Error("INVALID_RESPONSE"));
                    this._ready();
                    resolve(title); //Return the title to verify "connection".
                });
            });
            request.end();
            setTimeout(()=>{ //Time out the request in case it hangs.
                reject(new Error("TIMEOUT_EXCEEDED"));
            },20000);
        });
    }

    getOptions(query){
        let url = this.baseURL;
        url = url.split("://");
        const port = url.shift() === "https" ? 443 : 80;
        this.httpModule = port === 443 ? require("https") : require("http");
        url = url.join("").split("/");
        const host = url[0];
        const path = `/${url[1]}${query ?? ""}`;
        return {
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

    _ready(){
        this.ready = true;
        this.pages = new pageManager(this);
    }
}

module.exports = Client;