class User{

    constructor(name, gender, birth, country, email, password, photo, admin){
        this._id;
        this._name = name;
        this._gender = gender;
        this._birth = birth;
        this._country = country;
        this._email = email;
        this._password = password;
        this._photo = photo;
        this._admin = admin;
        this._register = new Date();
    }

    get id(){

        return this._id;
    }

    get name(){

        return this._name;

    }

    get gender(){
        return this._gender;
    }

    get birth(){
        return this._birth;
    }

    get country(){
        return this._country;
    }

    get email(){
        return this._email;
    }

    get password(){
        return this._password;
    }

    get photo(){
        return this._photo;
    }

    get admin(){
        return this._admin
    }

    get register(){
        return this._register;
    }

    set photo(value){
        this._photo = value;
    }

    loadFromJSON(json){

        for(let name in json){

            switch(name){

                case '_register':
                    this[name] = new Date(json[name]);
                break;
                default:
                    this[name] = json[name];
            }


            this[name] = json[name]; 
        }
    }

   static getUsersStorage(){

        let users = [];
    
        //sessionStorage.setItem: Permite gravar dados na sessão. Se caso fechar o navegador as informações deixam de existir
        // A sessionStorage não guarda os dados como se fosse um array de string nem um objeto JSON. Ela guarda sempre chaves e valores
        if(localStorage.getItem("users")){
    
            users = JSON.parse(localStorage.getItem("users"));
        }
    
        return users;
    }    

    getNewId(){

        if(!window.id) window.id = 0;

        id++;

        return this.id;
    }

    save(){

        let users = User.getUsersStorage();

        if(this.id > 0){

            //map é uma função que mapeia todo o array, encontra o id que vc procura 
            users.map(u=>{

                if(u._id == this.id){

                   Object.assign(u, this);
                }

                return u;
            });

        } else{

            this._id = this.getNewId();

             // push adiciona um elemento no array
            users.push(this);
        
         
        }
       
        localStorage.setItem("users", JSON.stringify(users));
    }

    remove(){

        let users = User.getUsersStorage();

        users.forEach((userData, index)=>{

            if(this._id == userData._id){
                
                //Splice vai encontrar o indice desejado e excluir
                users.splice(index, 1);
            }
        });
        localStorage.setItem("users", JSON.stringify(users));
    }
}