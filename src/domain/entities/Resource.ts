export class ResourceId {
    id: number

    constructor(){
        this.id = 1
    }
}

export class Resource {
    id: ResourceId
    name: string

    constructor(name: string){
        this.name = name
        this.id = new ResourceId()
    }
}