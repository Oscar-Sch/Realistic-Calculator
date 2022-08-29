const calculate={
    operation:"",
    memory:undefined,
    number:0,
    resolved: false,
    isOn: false,
    errorMsg: false,
    
    addDigit: function (n) {
        if(this.resolved){
            this.resolved=false;
            this.number=parseFloat("".concat(n));
        }else{
            this.number=parseFloat("".concat(this.number,n));
        }
        console.log(this.number.toString.length)
        if (this.number>999999999){
            this.addFunction("AC");
            error();
        }
    },
    addOperation: function (op){
        const{memory,number,operation}= this;
        if (number==0 && memory==undefined)return false;
        if(operation==""){
            this.operation=op;
            this.memory=parseFloat(number);
            this.number=0;
            if(op=="SqRt") {
                this.resolve()
                this.resolved=true;
            }
        }else{
            this.number=this.resolve();
            this.resolved=true;
        }
        
    },
    addFunction: function (op){
        switch(op.toUpperCase()){
            case ".":
                if(!isFloat(this.number)){
                    this.number+=".";
                }
                break;
            case "=":
                let res=Math.round(this.resolve() * 100) / 100;
                this.addFunction("AC");
                res[res.length-1]=="."?
                    this.number=res.toString().slice(0,res.length-1):
                    this.number=res;
                if(res.toString().length>11){
                    this.addFunction("AC");
                    error();
                }
                    
                break;
            case "AC":
                this.number=0;
                this.operation="";
                this.memory=undefined;
                this.resolved=true;
                break;
            case "+/-":
                this.number= this.number * - 1;
                break;
            case "DEL":
                calculate.delete();
                break;
        }
    },
    delete:function(){
        if(!this.resolved){
            if (this.number>=10){
            let num=this.number.toString();
            this.number= parseFloat(num.slice(0,num.length-1));
            }else this.number=0;
        }
        
    },
    resolve: function(){
        switch(this.operation){
            case "+": return this.plus();
            case "-": return this.minus();
            case "/": return this.divide();
            case "*": return this.multiply();
            case "%": return this.percent();
            case "^": return this.elevate();
            case "SqRt": return this.square();
            default:
                throw new Error("Symbol not matched");
        }

    },
    render: function(element){
        element.textContent=this.number;
    },
    plus: function(){
        return parseFloat(this.number) + parseFloat(this.memory)
    },
    minus: function(){
        return  parseFloat(this.memory) - parseFloat(this.number)
    },
    multiply: function(){
        return parseFloat(this.number) * parseFloat(this.memory)
    },
    divide: function(){
        return  parseFloat(this.memory) / parseFloat(this.number)
    },
    square: function(){
        console.log("square");
        this.number= Math.round(Math.sqrt(this.memory) * 100) / 100;
        this.memory=this.number;
        this.operation="";
        return this.number;
    },
    elevate: function(){
        return  parseFloat(this.memory) ** parseFloat(this.number)
    },
    percent: function(){
        return  100* parseFloat(this.memory) / parseFloat(this.number)
    },
    onOff: function(){
        if(this.isOn){
            displayNumber.style.animation="";
            displayNumber.style.opacity="0";
            this.isOn=false
            calculate.addFunction("AC");
        }else{
            displayNumber.style.animation="blink .2s ease-in 2";
            displayNumber.style.opacity="1";
            this.isOn=true;
            calculate.addFunction("AC");
            calculate.render(displayNumber);
            console.log("se prende");
        } 
        
    }
}



function error(){
    calculate.errorMsg=true;
    let msg="~~~Error~~~";
    const displayInter= setInterval(frame,100);
    function frame(){
        msg=msg[msg.length-1]+msg.slice(0,msg.length-1);
        displayNumber.textContent=msg;
        if (!calculate.errorMsg||calculate.isOn==false){
            stop();
        }
    }
    function stop(){
        clearInterval(displayInter);
        displayNumber.textContent=calculate.number;
    }
    console.log(calculate.errorMsg)
}
function $(selector){
    return document.querySelector(selector);
}
function $$(selector){
    return document.querySelectorAll(selector);
}
function isNumber(n){
   return !isNaN(n);
}
function isFloat(n){
    if(n.toString().indexOf(".")>-1){
        return true;
    }else return false;
}
function isFunction(n){
    const f=[".","=","AC","+/-","DEL"];
    return f.some((func)=> func== n);
}

const display=$("#display");
const displayNumber=$(".display-number");
const buttonCol=$$(".not-on");
const buttonOn=$("#but-on");
const buttonDEL=$("#but-del");


buttonOn.addEventListener("mousedown",()=>{
    calculate.onOff();
    buttonOn.parentNode.classList.add("pressed");
});
buttonOn.addEventListener("mouseup",()=>{
    buttonOn.parentNode.classList.remove("pressed")
});
buttonCol.forEach(function (button){

    button.addEventListener("mousedown", ()=>{
        let butNum=button.textContent;
        if(butNum=="DEL"){
            buttonDEL.parentNode.classList.add("del-pressed");
        }else{
            button.parentNode.classList.add("pressed")
        }
        calculate.errorMsg=false;
        if (isNumber(butNum)&&(calculate.isOn=true)){
            calculate.addDigit(butNum);
        } else if(isFunction(butNum)&&(calculate.isOn=true)){
            calculate.addFunction(butNum);
        } else if(calculate.isOn=true){
            calculate.addOperation(butNum);
        }
        calculate.render(displayNumber);
    })
    button.addEventListener("mouseup", ()=>{
        if(button.textContent=="DEL"){
            buttonDEL.parentNode.classList.remove("del-pressed");
        }
        button.parentNode.classList.remove("pressed")
    })
})

