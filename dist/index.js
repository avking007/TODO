var UIctroller = (function(){
    var Domstrings ={
        inputval : document.getElementById('todo-input'),
        incomplete: document.getElementById('incomplete-tasks'),
        complete: document.getElementById('completed-tasks'),
        
    };
           
    return {
        DOM: Domstrings,
        
        getinput : function(){
            var task = Domstrings.inputval.value;
            return task;
            
        },
        
        settask : function(task){
            var markup = `<li>
                <input class="checkbox" type="checkbox">
                <label>${task}</label>
                <input type="text" class="editor">
                <button class="edit">Edit</button>
                <button class="delete" id= "${task}">Delete</button>
                            </li>`;
            

            Domstrings.incomplete.insertAdjacentHTML('beforeend',markup);
        
        },
        clearall: function(){
                Domstrings.incomplete.innerHTML = '';
                Domstrings.complete.innerHTML = '';
        },
        clear_inp:function(){
            Domstrings.inputval.value='';
            Domstrings.inputval.placeholder='What to do?';
        },
        deleteTask :function(target){
          var t = target.parentNode;
            if(t){
                t.parentNode.removeChild(t);
                }
            
        },
        
        set_comp_task: function(task){
            var markup = `<li>
                <input type="checkbox" class = "checkbox" checked>
                <label>${task}</label>
                <input type="text" class="editor">
                <button class="edit">Edit</button>
                <button class="delete" id="${task}">Delete</button>
                        </li>`;
             
            Domstrings.complete.insertAdjacentHTML('beforeend',markup);
        
                    }
        
    };
     
})();
                  
                


var appctroller = (function(uictrl){
    
    var DOM = uictrl.DOM;
    // event listerner for add btn and also enter key
    
    
    var getNrender = function(){
        
        var todo,comp;
        todo = JSON.parse(window.localStorage.getItem('todo'));
        comp = JSON.parse(window.localStorage.getItem('comp'));
        if(todo){
            //for each todo render todo
            todo.forEach(el=>uictrl.settask(el));
            
        }
        if(comp){
            //for each comp  render comp
            comp.forEach(el1=>uictrl.set_comp_task(el1));
        }
        
    };
    
    function addTask(){
        // get task from input field
        var task  = uictrl.getinput();
        
        //console.log(task);
        if(task){
        
        //add task to UI
        uictrl.settask(task);
        uictrl.clear_inp();
        }
        var x = JSON.parse(window.localStorage.getItem('todo'));
        if(!x){
            x=[];
        }
            x.push(task);
            window.localStorage.setItem('todo',JSON.stringify(x));
        
        
    }
    var deleteTask = function(target){
                
        //delete task from UI
        var idx,x;
        if(target.parentNode.parentNode.id === 'incomplete-tasks'){
            x = JSON.parse(window.localStorage.getItem('todo'));
            idx = x.findIndex(el=>el===target.id);
            x.splice(idx,1)
            window.localStorage.setItem('todo',JSON.stringify(x));

        }
        else{
                
            x = JSON.parse(window.localStorage.getItem('comp'));
            idx = x.findIndex(el=>el===target.id)
            x.splice(idx,1);
            window.localStorage.setItem('comp',JSON.stringify(x));
            }
        
        uictrl.deleteTask(target);
        
    };
    
    var edittask = function(target){
        
        var label = target.previousElementSibling.previousElementSibling;
        var inp = target.previousElementSibling;
        //enable hidden input field in place of label
        var new_val,idx,x;
        if(inp.value)
                new_val = inp.value
            else
                new_val = label.innerHTML;
            
        if(target.parentNode.classList.contains('editMode')){
           // already editmode ON so set label to new inp value
           
            if(label.parentNode.parentNode.id ==="incomplete-tasks" ){
                
                x = JSON.parse(window.localStorage.getItem('todo'));
                idx= x.findIndex(el=>el===label.innerHTML);
                x[idx] = new_val;
                window.localStorage.setItem('todo', JSON.stringify(x));

            }
            else
            {
                x = JSON.parse(window.localStorage.getItem('comp'));
                idx= x.findIndex(el=>el===label.innerHTML);
                x[idx] = new_val;
                window.localStorage.setItem('comp', JSON.stringify(x));
                
            
            }
             
            target.parentNode.classList.toggle('editMode');

            label.innerHTML = new_val;
            DOM.inputval.focus();

        }
           
        else{
           // toggle edditmode to ON
          target.parentNode.classList.toggle('editMode');
            inp.value = label.innerHTML;
           }
};

            
    
    var fieldChanger = function(from ,to,event){
        
                var task = event.target.nextElementSibling.innerHTML;
                
                //delte task from UI of TODO
                uictrl.deleteTask(event.target);
                  
                //render UI
                var idx,x,y;
                if(from==='inc'){
                    uictrl.set_comp_task(task);
                    
                    //get prev todo from local stg
                    x = JSON.parse(window.localStorage.getItem('todo'));
                    y = JSON.parse(window.localStorage.getItem('comp'));
                    
                    //find indx of task in prev todos
                    idx = x.findIndex(el=>el===task);
                    //remove task from todos
                    x.splice(idx,1);
                    
                    //add task to completed and comp of local stg
                    if(!y)
                        y=[];
                    y.push(task);
                    
                    //add task to comp local stg
                    window.localStorage.setItem('todo', JSON.stringify(x));
                    window.localStorage.setItem('comp', JSON.stringify(y));                    
                }
                else{
                    uictrl.settask(task);
                    x = JSON.parse(window.localStorage.getItem('todo'));
                    y = JSON.parse(window.localStorage.getItem('comp'));
                    
                    //find indx of task in prev todos
                    idx = y.findIndex(el=>el===task);
                    //remove task from todos
                    y.splice(idx,1);
                    
                    //add task to completed and comp of local stg
                    if(!x)
                        x=[];
                    x.push(task);
                    
                    //add task to comp local stg
                    window.localStorage.setItem('todo', JSON.stringify(x));
                    window.localStorage.setItem('comp', JSON.stringify(y)); 
                    
                    
                    
                }
                
        };
    
    
    function setupEventListeners(){
        
        //event listener for adding task
        document.addEventListener('keypress', function(e){
            if(e.which === 13 || e.keyCode ==13){
                addTask();
            }
        });
        
        
      //event lister for edit and delete in TODO section
        DOM.incomplete.addEventListener('click',function(e){
            
            //for deleting task from TODO 
            if(e.target.matches('.delete')){
                deleteTask(e.target);
            }
            // for editing in TODO
            else if(e.target.matches('.edit')){
                edittask(e.target);
                
            }
            
            //for completed task TODO-> complete
            else if(e.target.matches('.checkbox')){
                // delete task from ds
                fieldChanger('inc', 'com',e);
                
            }
        });
    
    
    // event listener for delete and edit in completed tasks
        
        DOM.complete.addEventListener('click', function(e){
            if(e.target.matches('.delete')){
                deleteTask(e.target);
            }
            else if (e.target.matches('.edit')){
                edittask(e.target);
            }
            else if(e.target.matches('.checkbox')){
                    fieldChanger('com','inc', e);
            }
            });
        window.addEventListener('load',getNrender);
        
        
        
                }
    
        
            return {
                init:function(){
                    setupEventListeners();
                    uictrl.clearall();
                    DOM.inputval.focus();
                },
            };
    
    
})(UIctroller);
                    
appctroller.init();