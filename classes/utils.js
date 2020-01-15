class Utils{

// Método estático sobre formatação de datas 
    static dateFormat(date){

    return date.getDate() + '/' + (date.getMonth()+1) + '/' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes();


    }



} 
