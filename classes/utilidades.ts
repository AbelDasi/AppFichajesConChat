


export default class Utiles {

    devolverFecha() {
        const f_sol1 = new Date();
        const dd = f_sol1.getDate();
        const mm = f_sol1.getMonth()+1; //hoy es 0!
        const yyyy = f_sol1.getFullYear();
        let dd1;
        let mm2;
        let fecha;
        if(dd<10) {
           dd1='0'+dd
        }else {
            dd1 = dd;
        }
        if(mm<10) {
           mm2='0'+mm
        } else {
            mm2 = mm;
        }
        fecha = dd1+'/'+mm2+'/'+yyyy;
        return fecha;
    }
    
 }