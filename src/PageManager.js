class PageManager{
    constructor(client) {
        this.client = client;
    }

    get(id){
        return new Promise((resolve,reject)=> {
            if(!this.client.isReady()) reject(new Error("CLIENT_NOT_READY"));
            this.client.APIRequest.req(`?query={pages{single(id:${id}){id,path,hash,title,description,isPrivate,isPublished,privateNS,publishStartDate,publishEndDate,tags{id,tag,title,createdAt,updatedAt},content,render,contentType,createdAt,updatedAt,editor,locale,scriptCss,scriptJs,authorId,authorName,authorEmail,creatorId,creatorName,creatorEmail}}}`).then(data => {
                if(data.data.pages.single.id){
                    resolve(data.data.pages.single);
                } else {
                    reject(new Error("INVALID_RESPONSE"));
                }
            }).catch(e => {
                reject(new Error(e));
            });
        });
    }

    search(searchQuery, path, locale){
        return new Promise((resolve, reject)=>{
            if(!this.client.isReady()) reject(new Error("CLIENT_NOT_READY"));
            this.client.APIRequest.req(`?query={pages{search(query:"${searchQuery}"${path ? `,path:"${path}"` : ""}${locale ? `,locale:"${locale}"` : ""}){results{id,title,description,path,locale},suggestions,totalHits}}}`).then(data => {
                if(data.data.pages.search){
                    resolve(data.data.pages.search);
                } else {
                    reject(new Error("INVALID_RESPONSE"));
                }
            }).catch(e => {
                reject(new Error(e));
            });
        });
    }
}

module.exports = PageManager;