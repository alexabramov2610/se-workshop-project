export class ExampleClass {
    //also can write private id: numberl
   
    private privateId: number;
    #privateSyntaxId: number;
    public publicId: number;
   
    constructor(id: number){
        this.privateId = id;
        this.#privateSyntaxId = 2;
        this.publicId = 3;
    }
    getMyPrivateId(){
        return this.privateId;
    }
}

const cls : ExampleClass = new ExampleClass(5);
console.log(cls.getMyPrivateId());