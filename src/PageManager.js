class PageManager{
    constructor(client) {
        this.client = client;
    }

    get(id){
        return new Promise((resolve, reject)=>{
            const options = this.client.getOptions(`?query={pages{single(id:${id}){id,path,hash,title,description,isPrivate,isPublished,privateNS,publishStartDate,publishEndDate,tags{id,tag,title,createdAt,updatedAt},content,render,contentType,createdAt,updatedAt,editor,locale,scriptCss,scriptJs,authorId,authorName,authorEmail,creatorId,creatorName,creatorEmail}}}`);
            const request = this.client.httpModule.get(options, res=>{
                let data = "";
                res.on("data", chunk=>{
                    data += chunk;
                });
                res.on("end",()=>{
                    data = JSON.parse(data);
                    if(data.errors?.length > 0){
                        reject(new Error(data.errors[0].message));
                    }
                    if(data.data.pages.single.id){
                        resolve(data.data.pages.single);
                    } else {
                        reject("INVALID_RESPONSE");
                    }
                });
            });
            request.end();
        });
    }
}

module.exports = PageManager;