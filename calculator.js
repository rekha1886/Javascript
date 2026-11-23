let num1 = 50;
let num2 = 30;
let operator = "%";
switch (operator){
    case "+":
        console.log("Addition =", num1+ num2);
        break;
    
    case"-":
    console.log ("Subtraction=",num1-num2);
    break;
    
    case"*":
    console.log("Multiplication=",num1*num2);
    break;

    case"/":
    console.log("Division =",num1/num2);

    default:
        console.log("Invalid Operator");
}