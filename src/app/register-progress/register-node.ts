export class RegisterNode {
    //public isActive:boolean;
    public isCompleted:boolean;
    public isSkipped:boolean;

    constructor(IsCompleted:boolean,IsSkipped:boolean) { 
        //this.isActive=IsActive;
        this.isCompleted=IsCompleted;
        this.isSkipped=IsSkipped;
    }

    setClasses(){
         return {
            //active: this.isActive,     
            completed: this.isCompleted, 
            skipped: this.isSkipped,     
        }
    }
}
