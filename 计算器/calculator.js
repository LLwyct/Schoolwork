var expression = document.getElementById('expression')
var keys = document.getElementsByName('button')

for(var i=0; i<keys.length; i++) {
    keys[i].addEventListener('click', function() {
	if(this.value == '=') {
	    var exp = (expression.value).replace(/√/g,'Math.sqrt')
            exp = exp.replace(/\^/g,'**')
            try {
                expression.value = eval(exp)
            } catch (EvalError){
                expression.value = 'error'
            }
        }
        else if(this.value == 'C') {
	    expression.value = ''
        }
        else if(this.value == 'Del') {
           expression.value = expression.value.substr(0, expression.value.length-1)
        }
        else {
	    expression.value += this.value
        }
        expression.focus()
    }, false)
}
