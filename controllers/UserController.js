
class UserController {


    constructor(formIdCreate, formIdUpdate, tableId){

        this.formEl = document.getElementById(formIdCreate);
        this.formElUpdate = document.getElementById(formIdUpdate);
        this.tableEl = document.getElementById(tableId);
        this.onSubmit();
        this.onEdit(); 
        this.selectAll();
       }

onEdit(){

    document.querySelector("#box-user-update .btn-cancel").addEventListener('click', e=>{

        this.showPanelCreat();
    });

    this.formElUpdate.addEventListener("submit", event=>{
        
         //CANCELAR COMPORTAMENTO PADRÃO DESTE EVENTO
        event.preventDefault();
        
        let btn = this.formElUpdate.querySelector("[type=submit]");

        btn.disabled = true;

        let values = this.getValues(this.formElUpdate);

        let index = this.formElUpdate.dataset.trIndex;
       
        let tr = this.tableEl.rows[index];

        let userOld = JSON.parse(tr.dataset.user);

        //assign é usado para psubstituir os valores de userOld pelos de values
        let result = Object.assign({}, userOld, values);

        this.getphoto(this.formElUpdate).then(
            (content) =>{

            if(!values._photo){result._photo = userOld._photo;
            }
            else{
                result._photo = content;
            }

            let user  = new User();

            user.loadFromJSON(result);
            
            user.save();

            this.getTr(user, tr);
    
            this.updateCount();    
           
            this.formElUpdate.reset();    

            btn.disabled = false;    

            this.showPanelCreat();

            },
            (e) => {

                console.error(e);
            }
            );    
    });
    

}

onSubmit(){

        //Executa uma função após o evento submit ser executado
        this.formEl.addEventListener("submit", (event)=>{
        
        //CANCELAR COMPORTAMENTO PADRÃO DESTE EVENTO
        event.preventDefault();
        
        let btn = this.formEl.querySelector("[type=submit]");

        btn.disabled = true;

        let values = this.getValues(this.formEl);

        if(!values) return false;

        this.getphoto(this.formEl).then(
            (content) =>{

            values.photo = content;
                
           values.save();

            this.addLine(values);

            this.formEl.reset();    

            btn.disabled = false;    

            },
            (e) => {

                console.error(e);
            }
            );    

        });
    }

getphoto(formEl){

    return new Promise((resolve, reject) =>{

          //instanciando a API FileReader
    let fileReader = new FileReader();

    //usa o método filter o objeto formEl para selecionar o item PHOTO
    let elements = [...formEl.elements].filter(item=>{
        if(item.name === 'photo'){
            return item;
        }
    });

    let file = elements[0].files[0];
    
    //onload é quando essa foto terminar de carregar
    fileReader.onload = () =>{

        resolve(fileReader.result);
    }

    fileReader.onerror = (e) =>{

        reject(e);
    };

    if(file){

        fileReader.readAsDataURL(file);
    }else{
        resolve('dist/img/boxed-bg.jpg');
    }
        
    });
  
}    

getValues(formEl){

        let user = {};

        let isValid = true;

        //Pelo formEl ser um objeto com varios elementos precisa se usar o Spread onde através dele  se consegue ler vários elementos
        [...formEl.elements].forEach(function(field, index){

        // Aqui fazemos aparecer um erro nos campos selecionados se caso não forem preenchidos
            if(['name','email','password'].indexOf(field.name) > -1 && !field.value){

                field.parentElement.classList.add('has-error');
                isValid = false;
            }

            if(field.name == "gender"){
        
                if(field.checked){
        
                    user[field.name] = field.value;
            
                }
                
            }
            else if(field.name =="admin"){
                user[field.name] = field.checked;
            }

            else{
                
                user[field.name] = field.value;
            
            }
        
        });

        if(!isValid){
            return false;
        }

    return new User(user.name, user.gender, user.birth, user.country, user.email, user.password, user.photo, user.admin); 

    }

    //Os metódos getUsersStorage, seletAll e insert são usados para aplicar sessionStorage ou localStorage

selectAll(){

    let users = this.getUsersStorage();

    users.forEach(dataUser =>{
        let user = new User();

        user.loadFromJSON(dataUser);

        this.addLine(user);
    });
}

//Método que cria uma nova linha de cadastro
addLine(dataUser){

    let tr = this.getTr(dataUser);

   
    // fecha a tag desejada
    this.tableEl.appendChild(tr);

    this.updateCount();

      
}

getTr(dataUser, tr = null){

    if(tr===null) tr = document.createElement('tr');
    
      //Transforma dados de um objeto  em string
      tr.dataset.user = JSON.stringify(dataUser);

    tr.innerHTML = `
    <td><img src= "${dataUser.photo}" alt="User Image" class="img-circle img-sm"></td>
    <td>${dataUser.name}</td>
    <td>${dataUser.email}</td>
    <td>${(dataUser.admin)? "Sim": "Não"}</td>
    <td>${Utils.dateFormat(dataUser.register)}</td>
    <td>
    <button type="button" class="btn btn-primary btn-edit btn-xs btn-flat">Editar</button>
    <button type="button" class="btn btn-danger btn-delete btn-xs btn-flat">Excluir</button>
    </td>
    `;

    this.addEventsTR(tr);

    return tr;
}

addEventsTR(tr){

    tr.querySelector(".btn-delete").addEventListener("click", e=>{

    //confirm é uma função que mostra uma mensagem no navegador e se a resposta for OK ele retorna true
        if(confirm("Deseja relmente excluir?")){

            let user  = new User();

            user.loadFromJSON(JSON.parse(tr.dataset.user));

            user.remove();

            tr.remove();

            this.updateCount();
        }
    });

    tr.querySelector(".btn-edit").addEventListener("click", e=>{

        //Transformar uma string em um JSON
        let json = JSON.parse(tr.dataset.user);
        

    //este comando então criará uma variável com o nome trIndex através do dataset e pegara o índice de tr através do comando sectionRowIndex
        this.formElUpdate.dataset.trIndex = tr.sectionRowIndex;

        for (let name in json) {

            //replace serve para substituir um elemento pelo outro, nesse caso o anderline está sendo substituido por vazio
            let field = this.formElUpdate.querySelector("[name=" + name.replace("_", "") + "]");

            if(field){

                
                switch(field.type){

                    case 'file':
                        continue;
                    break;
                    case 'radio':
                        field = this.formElUpdate.querySelector("[name=" + name.replace("_", "") + "][value=" + json[name] + "]");
                        field.checked = true;
                    break;

                    case 'checkbox':
                        field.checked = json[name];
                    break;
                    
                    default:
                        field.value = json[name];
                }

            }
            
        }


        this.showPanelUpdate();
        
    });
}

    showPanelCreat(){
        document.querySelector("#box-user-create").style.display = "block";
        document.querySelector("#box-user-update").style.display = "none";
    }

    showPanelUpdate(){
        document.querySelector("#box-user-create").style.display = "none";
        document.querySelector("#box-user-update").style.display = "block";
    }

    updateCount(){

        let numberUsers = 0;
        let numberAdmin = 0;

        [...this.tableEl.children].forEach(tr =>{
            
            numberUsers++;

            let user = JSON.parse(tr.dataset.user);
            if(user._admin) numberAdmin++;

        });

        document.querySelector("#number-users").innerHTML = numberUsers;
        document.querySelector("#number-admin"). innerHTML = numberAdmin;

    }

}