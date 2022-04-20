class Queries {
    static SinglePageQuery(id) {
        return `?query={pages{single(id:${id}){id,path,hash,title,description,isPrivate,isPublished,privateNS,publishStartDate,publishEndDate,tags{id,tag,title,createdAt,updatedAt},content,render,contentType,createdAt,updatedAt,editor,locale,scriptCss,scriptJs,authorId,authorName,authorEmail,creatorId,creatorName,creatorEmail}}}`;
    }

    static SearchPageQuery(searchQuery, path, locale) {
        return `?query={pages{search(query:"${searchQuery}"${path ? `,path:"${path}"` : ""}${
            locale ? `,locale:"${locale}"` : ""
        }){results{id,title,description,path,locale},suggestions,totalHits}}}`;
    }
}

export default Queries;
