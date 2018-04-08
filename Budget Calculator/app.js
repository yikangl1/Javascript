var budgetController = (function(){
    
     var Expense = function(id, description, value){
         this.id = id;
         this.description = description;
         this.value = value;
         this.percentage = -1;
     };
    
    Expense.prototype.calcPercentage = function(totalIncome) {
        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
    };
    
    Expense.prototype.getPercentage = function() {
        return this.percentage;
    };
    
    var Income = function(id, description, value){
         this.id = id;
         this.description = description;
         this.value = value;
     };
    
    var calculateTotal = function(type) {
        var sum;
        sum = 0;
        data.allItems[type].forEach(function(cur) {
            sum = sum + cur.value;
        });
        data.totals[type] = sum;
    };
    
    var allExpenses = [];
    var allIncomes = [];
    var totalExpenses = 0;
    
    var data = {
        allItems:{
            exp:[],
            inc:[]
        },
        totals:{
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    };
    
    return {
        addItem: function(type, des, val){
            var newItem;
            var ID;
            if(data.allItems[type].length > 0){
                ID = data.allItems[type][data.allItems[type].length -1].id + 1;
            }
            else
            {
                ID = 0;
            }
            
            if(type === 'inc'){
                newItem = new Income(ID, des, val);
            }
            else if(type === 'exp')
            {
                newItem = new Expense(ID, des, val);
            }
            data.allItems[type].push(newItem);
            return newItem;
        },
        
        deleteItem: function(type, id) {
            var ids;
            var index;
            ids = data.allItems[type].map(function(current){
                return current.id;
            });
            index = ids.indexOf(id);
            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }
        },
        
        calculateBudget: function() {
            calculateTotal('exp');
            calculateTotal('inc');
            data.budget = data.totals.inc - data.totals.exp;
            if(data.totals.inc > 0) {
                data.percentage = Math.round( data.totals.exp / data.totals.inc * 100);
            } 
            else if (data.totals.inc <= 0) {
                data.percentage = -1;
            }
        },
        
        calculatePercentages: function() {
            data.allItems.exp.forEach(function(current){
                current.calcPercentage(data.totals.inc);
            });
        },
        
        getPercentages: function() {
            var temp;
            temp = data.allItems.exp.map(function(cur) {
                return cur.getPercentage();
            });
            return temp;
        },
        
        getBudget: function() {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            };
        },
        
        testing: function(){
            console.log(data);
        }
    };
    
}) ();


var UIController = (function() {
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue:'.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expenseLabel:    '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercLabel: '.item__percentage',
        dateLabel: '.budget__title--month'
    };
    
    var formatNumber = function(num, type) {
        var numSplit;
        var num;  
        var dec;
        var type;
        var sign;
        var temp;
        num = Math.abs(num);
        num = num.toFixed(2);
        numSplit = num.split('.')
        int = numSplit[0];
        if(int.length > 3) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
        }
        dec = numSplit[1];
        if(type === 'exp'){
            sign = '-';
        }
        else if(type === 'inc')
        {
            sign = '+';
        }
        temp = sign + ' ' + int + '.' +  dec;
        return temp;
    };
    
    var nodeListForEach = function(list, callback) {
        for (var i = 0; i < list.length; i++) 
        {
            callback(list[i], i);
        }
    };
    
    return {
        getInput: function(){
            return{
                type : document.querySelector(DOMstrings.inputType).value,
                description : document.querySelector(DOMstrings.inputDescription).value,
                value : parseFloat(document.querySelector(DOMstrings.inputValue).value)
            };
        },
        
        addListItem: function(obj, type) {
            var html; 
            var newHtml;
            var element;
            if(type === 'inc')
            {
                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            else if(type === 'exp')
            {
                element = DOMstrings.expensesContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            
            newHtml = html.replace('%id%', obj.id);
            newHtml = html.replace('%description%',obj.description);
            newHtml = html.replace('%value%',formatNumber(obj.value, type));
            newHtml = newHtml.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%',obj.description);
            newHtml = newHtml.replace('%value%',formatNumber(obj.value, type));
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },
        
        deleteListItem: function(selectorID) {
            var temp;
            temp = document.getElementById(selectorID);
            temp.parentNode.removeChild(temp);
            
        },
        
        clearFields: function() {
            var fields;
            var fieldsArr;
            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);
            fieldsArr = Array.prototype.slice.call(fields);
            fieldsArr.forEach(function(current, index, array) 
            {
                current.value = "";
            });
            fieldsArr[0].focus();
        },
        
        displayBudget: function(obj) {
            var type;
            if (obj.budget > 0) 
            {
                type = 'inc';
            } 
            else if(obj.budget <= 0)
            {
                type = 'exp';
            }
            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMstrings.expenseLabel).textContent = formatNumber(obj.totalExp, 'exp');      
            if(obj.percentage > 0) 
            {
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
            } 
            else if(obj.percentage <= 0)
            {
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';
            }
        },
        
        displayPercentages: function(percentages) {
            var temp;
            temp = document.querySelectorAll(DOMstrings.expensesPercLabel);
            nodeListForEach(temp, function(current, index) {
                if (percentages[index] > 0) 
                {
                    current.textContent = percentages[index] + '%';
                } 
                else 
                {
                    current.textContent = '---';
                }
            });
        },
        
        displayMonth: function () {
            var now;
            var year;
            var month;
            var months;
            now = new Date();
            year = now.getFullYear();
            month = now.getMonth();
            months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            document.querySelector(DOMstrings.dateLabel).textContent = months[month - 1] + ' ' + '/ ' + year;
        },
        
        changedType: function() {
            var temp;
            temp = document.querySelectorAll(
                DOMstrings.inputType + ',' +
                DOMstrings.inputDescription + ',' +
                DOMstrings.inputValue);
            
            nodeListForEach(temp, function(cur) {
               cur.classList.toggle('red-focus'); 
            });
            document.querySelector(DOMstrings.inputBtn).classList.toggle('red');
        },
        
        getDOMstrings:function(){
            return DOMstrings;
        }
    };
})();

var controller = (function(budgetCtrl, UICtrl) {
    var setupEventListeners = function(){
        var DOM;
        DOM = UICtrl.getDOMstrings();
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
        document.addEventListener('keypress', function(event){
            if (event.keyCode === 13)
            {
                ctrlAddItem();
            }
        });  
        
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);
    };
        
    var updateBudget = function() {
        var budget;
        budgetCtrl.calculateBudget();
        budget = budgetCtrl.getBudget();
        UICtrl.displayBudget(budget);
    };
    
    var updatePercentages = function() {
        var percentages
        budgetCtrl.calculatePercentages();
        percentages = budgetCtrl.getPercentages();
        UICtrl.displayPercentages(percentages);
    }
     
    var ctrlAddItem = function(){
        var input;
        var newItem;
        input = UICtrl.getInput();
        if(input.description !== "" && !isNaN(input.value) && input.value > 0){
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);
            UICtrl.addListItem(newItem, input.type);
            UICtrl.clearFields();
            updateBudget();
            updatePercentages();
        } 
    };
    
    var ctrlDeleteItem = function(event) {
        var itmeID, splitID, type, ID;
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        if(itemID) {
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);
            budgetCtrl.deleteItem(type, ID);
            UICtrl.deleteListItem(itemID);
            updateBudget();
            updatePercentages();
        }
    };
    
    return{
        init: function(){
            UICtrl.displayMonth();
            UICtrl.displayBudget({
                budget:      0,
                totalInc:    0,
                totalExp:    0,
                percentage:  -1
            });
            setupEventListeners();
        }
    };
                                               
})(budgetController, UIController);

controller.init();